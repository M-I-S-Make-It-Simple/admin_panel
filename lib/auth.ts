import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-2024-european-school';

export interface JWTPayload {
  userId: number;
  username: string;
  role: string;
}

// Хешування пароля
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Перевірка пароля
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Створення JWT токена
export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

// Перевірка JWT токена
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// Аутентифікація користувача
export async function authenticateUser(username: string, password: string) {
  console.log('🔍 AUTH: Пошук користувача в БД...');
  
  const user = await prisma.adminUser.findUnique({
    where: { username }
  });

  console.log('👤 AUTH: Користувач знайдений:', user ? 'так' : 'ні');

  if (!user || !user.isActive) {
    console.log('❌ AUTH: Користувач не знайдений або неактивний');
    return null;
  }

  console.log('🔐 AUTH: Перевірка пароля...');
  const isValidPassword = await verifyPassword(password, user.password);
  console.log('✅ AUTH: Пароль вірний:', isValidPassword);
  
  if (!isValidPassword) {
    console.log('❌ AUTH: Неправильний пароль');
    return null;
  }

  console.log('⏰ AUTH: Оновлення часу останнього входу...');
  
  // Оновлюємо час останнього входу
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });

  console.log('✅ AUTH: Аутентифікація успішна');

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
}

// Створення першого адміністратора
export async function createInitialAdmin() {
  const existingAdmin = await prisma.adminUser.findFirst();
  
  if (existingAdmin) {
    console.log('Адміністратор вже існує');
    return;
  }

  const hashedPassword = await hashPassword('EuropeanSchool2024!');
  
  await prisma.adminUser.create({
    data: {
      username: 'european_admin',
      password: hashedPassword,
      email: 'admin@european-school.com',
      role: 'admin',
      isActive: true
    }
  });

  console.log('Перший адміністратор створений');
  console.log('Логін: european_admin');
  console.log('Пароль: EuropeanSchool2024!');
}
