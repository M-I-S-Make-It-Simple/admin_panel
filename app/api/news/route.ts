import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper функция для CORS заголовков
function getCorsHeaders(request: Request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'http://localhost:3000',     // Next.js dev сервер
    'http://localhost:8081',     // React Native Metro bundler
    'http://localhost:19006',    // Expo dev сервер
    'https://admin-panel-git-new-branch-slava-v-ukrainis-projects.vercel.app',
    "https://ornate-elf-8f361c.netlify.app"
  ];

  const corsOrigin = allowedOrigins.includes(origin || '') ? origin : null;

  return {
    'Access-Control-Allow-Origin': corsOrigin || '',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📦 Дані для створення новини:", body);

    if (!body.heading || !body.publicationDate || !body.description) {
      return NextResponse.json(
          { error: "Відсутні обов'язкові поля" },
          {
            status: 400,
            headers: getCorsHeaders(req),
          }
      );
    }

    const date = new Date(`${body.publicationDate}T00:00:00`);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
          { error: "Невалідна дата публікації" },
          {
            status: 400,
            headers: getCorsHeaders(req),
          }
      );
    }

    const photoUrlArray =
        Array.isArray(body.photoUrl) && body.photoUrl.every((url: any) => typeof url === 'string')
            ? body.photoUrl
            : [];

    const news = await prisma.news.create({
      data: {
        heading: body.heading,
        publicationDate: date,
        description: body.description,
        photoUrl: JSON.stringify(photoUrlArray),
      },
    });

    return NextResponse.json(news, {
      status: 201,
      headers: getCorsHeaders(req),
    });

  } catch (error) {
    console.error("❌ Error creating news:", error instanceof Error ? error.message : error);
    return NextResponse.json(
        { error: (error as Error).message || "Щось пішло не так" },
        {
          status: 500,
          headers: getCorsHeaders(req),
        }
    );
  }
}

export async function GET(request: Request) {
  try {
    const newsRaw = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const news = newsRaw.map((item) => ({
      ...item,
      photoUrl: (() => {
        try {
          return item.photoUrl ? JSON.parse(item.photoUrl) : [];
        } catch {
          return [];
        }
      })(),
    }));

    return NextResponse.json(news, {
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    console.error("❌ Error fetching news:", error instanceof Error ? error.message : error);

    return NextResponse.json(
        { error: "Помилка при отриманні новин" },
        {
          status: 500,
          headers: getCorsHeaders(request),
        }
    );
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  });
}