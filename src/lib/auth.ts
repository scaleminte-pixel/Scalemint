import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from './prisma';

if (!process.env.JWT_SECRET) {
  throw new Error(
    '[FATAL] JWT_SECRET environment variable is not set. ' +
    'Please set a strong, random JWT_SECRET in your .env file. ' +
    'The application cannot start without it.'
  );
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export const COOKIE_NAME = 'scalemint_admin_token';

export interface AdminJwtPayload {
  adminId: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function signToken(payload: AdminJwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AdminJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminJwtPayload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminJwtPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAdmin(): Promise<AdminJwtPayload> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

/**
 * Require admin with a specific role or higher.
 * Role hierarchy: SUPER_ADMIN > ADMIN > EDITOR
 */
const ROLE_HIERARCHY: Record<string, number> = {
  EDITOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

export async function requireRole(minimumRole: string): Promise<AdminJwtPayload> {
  const session = await requireAdmin();
  const userLevel = ROLE_HIERARCHY[session.role] || 0;
  const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;
  if (userLevel < requiredLevel) {
    throw new Error('Forbidden');
  }
  return session;
}

