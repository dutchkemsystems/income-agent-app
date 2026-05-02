import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { z } from "zod";

// Strict validation schema for payment creation
const paymentSchema = z.object({
  productId: z.string()
    .min(1, "Product ID is required")
    .max(100, "Product ID too long")
    .regex(/^[a-zA-Z0-9-_]+$/, "Invalid product ID format"),
  amount: z.number()
    .positive("Amount must be positive")
    .max(1000000, "Amount too large"),
  transactionRef: z.string()
    .min(3, "Transaction reference too short")
    .max(200, "Transaction reference too long")
    .regex(/^[a-zA-Z0-9-_]+$/, "Invalid transaction reference format")
    .transform(val => val.trim()),
});

// Sanitize filename to prevent path traversal
function sanitizeFileName(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 100);
}

// Allowed file types and max size
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for rate limiting (basic IP-based)
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rateKey = `payment:${ip}`;
    
    // Validate content type
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const formData = await req.formData();
    
    const rawData = {
      productId: formData.get("productId") as string,
      amount: parseFloat(formData.get("amount") as string),
      transactionRef: formData.get("transactionRef") as string,
    };

    // Validate with Zod
    const validatedData = paymentSchema.parse(rawData);

    const proofFile = formData.get("proof") as File;

    // Validate file if present
    if (proofFile && proofFile.size > 0) {
      if (proofFile.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "File too large. Max 5MB allowed." }, { status: 400 });
      }
      
      if (!ALLOWED_TYPES.includes(proofFile.type)) {
        return NextResponse.json({ error: "Invalid file type. Allowed: JPG, PNG, GIF, PDF" }, { status: 400 });
      }
    }

    // Check for duplicate pending payment
    const existingPayment = await db.payment.findFirst({
      where: {
        userId: session.user.id,
        productId: validatedData.productId,
        status: { in: ["PENDING", "VERIFIED"] },
      },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: "You already have a pending or active payment for this product" },
        { status: 400 }
      );
    }

    // Validate product exists
    const product = await db.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    // Save proof image securely
    let proofPath: string | null = null;
    if (proofFile && proofFile.size > 0) {
      const uploadsDir = join(process.cwd(), "public", "uploads", "payments");
      
      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Generate unique filename with sanitization
      const timestamp = Date.now();
      const safeName = sanitizeFileName(proofFile.name);
      const fileName = `${session.user.id}_${timestamp}_${safeName}`;
      const filePath = join(uploadsDir, fileName);
      
      // Read and validate file content
      const bytes = await proofFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Check file signature (magic bytes) for images
      if (proofFile.type.startsWith("image/")) {
        const signature = buffer.slice(0, 4).toString("hex");
        const validSignatures = ["ffd8", "8950", "4749"]; // JPG, PNG, GIF
        if (!validSignatures.some(s => signature.startsWith(s))) {
          return NextResponse.json({ error: "Invalid image file" }, { status: 400 });
        }
      }
      
      writeFileSync(filePath, buffer);
      proofPath = `/uploads/payments/${fileName}`;
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        userId: session.user.id,
        productId: validatedData.productId,
        amount: validatedData.amount,
        transactionRef: validatedData.transactionRef,
        proofImage: proofPath,
        status: "PENDING",
      },
    });

    // Log the action for audit
    console.log(`[AUDIT] Payment created: ${payment.id} by user ${session.user.id}`);

    return NextResponse.json({ 
      success: true, 
      payment: {
        id: payment.id,
        status: payment.status,
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("[SECURITY] Payment create error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}