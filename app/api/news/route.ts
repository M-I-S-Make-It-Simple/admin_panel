import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📦 Дані для створення новини:", body);

    if (!body.heading || !body.publicationDate || !body.description) {
      return NextResponse.json({ error: "Відсутні обов'язкові поля" }, { status: 400 });
    }

    const date = new Date(`${body.publicationDate}T00:00:00`);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Невалідна дата публікації" }, { status: 400 });
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

    return NextResponse.json(news, { status: 201 });

  } catch (error) {
    console.error("❌ Error creating news:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: (error as Error).message || "Щось пішло не так" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, context: { params: Promise<{ id?: string }> }): Promise<NextResponse<{photoUrl: any; id: number; createdAt: Date | null; updatedAt: Date | null}[]>> {
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

    const response = NextResponse.json(news);

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (error) {
    console.error("message: '❌ Error fetching news:', error instanceof Error ? error.message : error");

    const errorResponse = NextResponse.json(
        { error: "Помилка при отриманні новин" },
        { status: 500 }
    );

    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return errorResponse as any;
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}