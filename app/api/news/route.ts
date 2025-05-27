import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📦 Дані для створення новини:", body);

    // Перевірка обов'язкових полів
    if (!body.heading || !body.publicationDate || !body.description) {
      return NextResponse.json({ error: "Відсутні обов'язкові поля" }, { status: 400 });
    }

    // Обробка дати
    const date = new Date(body.publicationDate);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Невалідна дата публікації" }, { status: 400 });
    }

    // Обробка photoUrl
    const photoUrlArray = Array.isArray(body.photoUrl) ? body.photoUrl : [];

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
    console.error("❌ Error creating news:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Щось пішло не так" },
      { status: 500 }
    );
  }
}


export async function GET(request: Request,
  context: { params: Promise<{ id?: string }> }) {
  try {
    const newsRaw = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    // Перетворюємо JSON-рядки назад у масиви
    const news = newsRaw.map(item => ({
      ...item,
      photoUrl: item.photoUrl ? JSON.parse(item.photoUrl) : []
    }));
    
    return NextResponse.json(news);
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    return NextResponse.json({ error: "Помилка при отриманні новин" }, { status: 500 });
  }
}
