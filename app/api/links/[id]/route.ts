import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE - видалення посилання
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Некоректний ID" }, { status: 400 });
  }

  try {
    await prisma.link.delete({ where: { id } });
    return NextResponse.json({ message: "Посилання видалено" });
  } catch (error) {
    console.error("❌ DELETE error:", error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}

// PATCH - редагування посилання
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Некоректний ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updated = await prisma.link.update({
      where: { id },
      data: {
        title: body.title,
        url: body.url,
        content: body.content,
        year: body.year,
        subject: body.subject,
        category: body.category,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ PATCH error:", error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}
