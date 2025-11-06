import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 API: Отримано запит на аутентифікацію');
    
    const { username, password } = await request.json();
    console.log('👤 API: Логін:', username);
    console.log('🔑 API: Пароль:', password ? '***' : 'пустий');

    // Валідація вхідних даних
    if (!username || !password) {
      console.log('❌ API: Відсутні логін або пароль');
      return NextResponse.json(
        { error: 'Логін та пароль обов\'язкові' },
        { status: 400 }
      );
    }

    console.log('🔍 API: Початок аутентифікації користувача...');
    
    // Аутентифікація користувача
    const user = await authenticateUser(username, password);

    if (!user) {
      console.log('❌ API: Неправильний логін або пароль');
      return NextResponse.json(
        { error: 'Неправильний логін або пароль' },
        { status: 401 }
      );
    }

    console.log('🎫 API: Створення JWT токена...');
    
    // Створення JWT токена
    const token = createToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });

    console.log('🍪 API: Встановлення токена в cookies...');

    // Створення відповіді з токеном
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

    // Встановлення JWT токена в cookies
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 години
    });

    console.log('✅ API: Аутентифікація завершена успішно');
    return response;

  } catch (error) {
    console.error('Помилка аутентифікації:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
