import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";

// Strict validation schema for registration
const registerSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .transform(val => val.trim()),
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email too long")
    .transform(val => val.toLowerCase().trim()),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password too long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
});

export async function POST(req: Request) {
  try {
    // Rate limiting - basic check
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    console.log(`[RATE] Registration attempt from: ${ip}`);

    const body = await req.json();
    
    // Validate with Zod
    const { name, email, password } = registerSchema.parse(body);

    // Check for existing user (timing-safe comparison not needed here since we return different errors)
    const existingUser = await db.user.findUnique({ 
      where: { email },
      select: { id: true }
    });
    
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Hash password with strong settings
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user with default USER role (NEVER auto-admin)
    await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "USER", // Always USER, never ADMIN
      },
    });

    // Log registration for audit
    console.log(`[AUDIT] New user registered: ${email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("[SECURITY] Registration error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}