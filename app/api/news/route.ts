import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const news = await prisma.news.create({
      data: {
        heading: body.heading,
        publicationDate: new Date(body.publicationDate),
        description: body.description,
        photoUrl: JSON.stringify(body.photoUrl), // <== масив конвертуємо в JSON
      },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Щось пішло не так' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { publicationDate: "desc" },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    return NextResponse.json({ error: "Помилка при отриманні новин" }, { status: 500 });
  }
}
