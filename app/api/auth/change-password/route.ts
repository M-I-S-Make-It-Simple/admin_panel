import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, hashPassword, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 API: Отримано запит на зміну пароля');
    
    // Отримуємо токен з cookies
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      console.log('❌ API: Токен не знайдено');
      return NextResponse.json(
        { error: 'Необхідна авторизація' },
        { status: 401 }
      );
    }

    // Перевіряємо токен
    const payload = verifyToken(token);
    if (!payload) {
      console.log('❌ API: Недійсний токен');
      return NextResponse.json(
        { error: 'Недійсний токен' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword, newUsername } = await request.json();
    console.log('👤 API: Зміна пароля для користувача:', payload.username);

    // Валідація вхідних даних
    if (!currentPassword || !newPassword) {
      console.log('❌ API: Відсутні обов\'язкові поля');
      return NextResponse.json(
        { error: 'Поточний пароль та новий пароль обов\'язкові' },
        { status: 400 }
      );
    }

    // Валідація нового логіну (якщо вказано)
    if (newUsername && newUsername.length < 3) {
      console.log('❌ API: Логін занадто короткий');
      return NextResponse.json(
        { error: 'Логін повинен містити мінімум 3 символи' },
        { status: 400 }
      );
    }


    if (newPassword.length < 8) {
      console.log('❌ API: Пароль занадто короткий');
      return NextResponse.json(
        { error: 'Новий пароль повинен містити мінімум 8 символів' },
        { status: 400 }
      );
    }

    // Отримуємо користувача з бази даних
    const user = await prisma.adminUser.findUnique({
      where: { id: payload.userId }
    });

    if (!user) {
      console.log('❌ API: Користувач не знайдений');
      return NextResponse.json(
        { error: 'Користувач не знайдений' },
        { status: 404 }
      );
    }

    // Перевіряємо поточний пароль
    console.log('🔐 API: Перевірка поточного пароля...');
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      console.log('❌ API: Неправильний поточний пароль');
      return NextResponse.json(
        { error: 'Неправильний поточний пароль' },
        { status: 400 }
      );
    }

    // Перевіряємо, чи новий логін не зайнятий (якщо вказано)
    if (newUsername && newUsername !== user.username) {
      console.log('🔍 API: Перевірка доступності нового логіну...');
      const existingUser = await prisma.adminUser.findUnique({
        where: { username: newUsername }
      });
      
      if (existingUser) {
        console.log('❌ API: Логін вже зайнятий');
        return NextResponse.json(
          { error: 'Цей логін вже використовується' },
          { status: 400 }
        );
      }
    }

    // Хешуємо новий пароль
    console.log('🔐 API: Хешування нового пароля...');
    const hashedNewPassword = await hashPassword(newPassword);

    // Підготовляємо дані для оновлення
    const updateData: any = {
      password: hashedNewPassword,
      updatedAt: new Date()
    };

    // Додаємо новий логін, якщо вказано
    if (newUsername && newUsername !== user.username) {
      updateData.username = newUsername;
      console.log('👤 API: Оновлення логіну на:', newUsername);
    }

    // Оновлюємо дані в базі даних
    console.log('💾 API: Оновлення даних в базі даних...');
    await prisma.adminUser.update({
      where: { id: user.id },
      data: updateData
    });

    console.log('✅ API: Дані успішно оновлено');
    return NextResponse.json({
      success: true,
      message: newUsername && newUsername !== user.username 
        ? 'Логін та пароль успішно змінено' 
        : 'Пароль успішно змінено'
    });

  } catch (error) {
    console.error('❌ API: Помилка при зміні пароля:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
