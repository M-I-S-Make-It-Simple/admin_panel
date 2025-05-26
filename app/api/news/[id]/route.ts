import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 🔹 Отримання ID з URL
function getIdFromRequest(req: NextRequest): number | null {
  const idStr = req.nextUrl.pathname.split("/").pop();
  const id = idStr ? Number(idStr) : NaN;
  return isNaN(id) ? null : id;
}

// 🔸 GET - отримання новини
export async function GET(req: NextRequest) {
  const id = getIdFromRequest(req);
  if (id === null) {
    return NextResponse.json({ message: "Некоректний ID" }, { status: 400 });
  }

  try {
    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) {
      return NextResponse.json({ message: "Новину не знайдено" }, { status: 404 });
    }

    return NextResponse.json({
      ...news,
      photoUrl: news.photoUrl ? JSON.parse(news.photoUrl) : [],
    });
  } catch (error) {
    console.error("❌ GET error:", error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}

// 🔸 DELETE - видалення новини
export async function DELETE(req: NextRequest) {
  const id = getIdFromRequest(req);
  if (id === null) {
    return NextResponse.json({ message: "Некоректний ID" }, { status: 400 });
  }

  try {
    const existingNews = await prisma.news.findUnique({ where: { id } });
    if (!existingNews) {
      return NextResponse.json({ message: "Новину не знайдено" }, { status: 404 });
    }

    await prisma.news.delete({ where: { id } });

    return NextResponse.json({ message: "Новину видалено" });
  } catch (error) {
    console.error("❌ DELETE error:", error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}

// 🔸 PATCH - редагування новини
export async function PATCH(req: NextRequest) {
  const id = getIdFromRequest(req);
  if (id === null) {
    return NextResponse.json({ message: "Некоректний ID" }, { status: 400 });
  }

  try {
    const body = await req.json();

    if (!body.heading || !body.publicationDate || !body.description) {
      return NextResponse.json({ message: "Відсутні обов'язкові поля" }, { status: 400 });
    }

    if (body.photoUrl && !Array.isArray(body.photoUrl)) {
      return NextResponse.json({ message: "photoUrl повинен бути масивом" }, { status: 400 });
    }

    const updated = await prisma.news.update({
      where: { id },
      data: {
        heading: body.heading,
        publicationDate: new Date(body.publicationDate),
        description: body.description,
        photoUrl: body.photoUrl ? JSON.stringify(body.photoUrl) : undefined,
      },
    });

    return NextResponse.json({
      ...updated,
      photoUrl: updated.photoUrl ? JSON.parse(updated.photoUrl) : [],
    });
  } catch (error) {
    console.error("❌ PATCH error:", error);
    return NextResponse.json({ message: "Помилка при оновленні" }, { status: 500 });
  }
}
