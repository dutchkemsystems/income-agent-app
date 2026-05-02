import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardLayout } from "@/components/dashboard/layout";

export default async function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  // Get user role for admin access
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, email: true },
  });

  // Add role to session for client-side access
  if (user) {
    (session.user as { role: string }).role = user.role;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}