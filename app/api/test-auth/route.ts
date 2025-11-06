import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 TEST: Тестовий API endpoint');
    
    // Перевіряємо чи є адміністратори в БД
    const adminCount = await prisma.adminUser.count();
    console.log('👥 TEST: Кількість адміністраторів в БД:', adminCount);
    
    // Отримуємо всіх адміністраторів
    const admins = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true,
        createdAt: true
      }
    });
    
    console.log('👤 TEST: Адміністратори:', admins);
    
    return NextResponse.json({
      success: true,
      adminCount,
      admins
    });
    
  } catch (error) {
    console.error('❌ TEST: Помилка:', error);
    return NextResponse.json(
      { error: 'Помилка тестування' },
      { status: 500 }
    );
  }
}
