import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function verifyUser(email, password) {
  if (!email || !password) return null;

  const admin = await prisma.admin.findUnique({
    where: { email: email.toLowerCase().trim() }
  });

  if (!admin) return null;

  const isValid = await bcrypt.compare(password, admin.password_hash);
  if (!isValid) return null;

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name || admin.email,
    role: "admin"
  };
}