import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // CORS для всіх API роутів
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Дозволяємо запити з фронтенду
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      'http://localhost:3000',        // Фронтенд
      'http://localhost:3001',        // Адмін панель
      'http://localhost:3003',        // Додатковий порт (якщо потрібно)
      'https://yourdomain.com',       // Ваш продакшен домен
      'https://www.yourdomain.com'    // www версія
    ];
    
    // Якщо origin дозволений, встановлюємо його та credentials
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else if (origin) {
      // Якщо origin є, але не в списку, все одно дозволяємо (для розробки)
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      // Якщо немає origin (наприклад, прямий запит з браузера), дозволяємо всім
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Обробка preflight запитів (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { 
        status: 200,
        headers: response.headers
      });
    }
    
    return response;
  }

  // Перенаправлення з /admin на /login
  if (request.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Перевірка аутентифікації для адмін панелі
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/(admin)')) {
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',           // API роути
    '/admin',                // Admin маршрут
    '/dashboard',            // Dashboard маршрут
    '/dashboard/:path*',     // Dashboard підмаршрути
    '/(admin)/:path*',       // Admin group маршрути
  ],
};
