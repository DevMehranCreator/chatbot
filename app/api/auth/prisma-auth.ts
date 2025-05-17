import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export async function createUser({
  name,
  email,
  password,
  avatar,
}: {
  name: string;
  email: string;
  password: string;
  avatar: string;
}) {
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { name, email, password: hashed, avatar },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function verifyPassword(
  user: { password: string },
  password: string
) {
  return bcrypt.compare(password, user.password);
}
