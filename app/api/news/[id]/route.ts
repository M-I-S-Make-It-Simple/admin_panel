import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Видалення новини за ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Новину видалено' }, { status: 200 });
  } catch (error) {
    console.error("❌ DELETE error:", error);
    return NextResponse.json({ message: 'Помилка сервера' }, { status: 500 });
  }
}
