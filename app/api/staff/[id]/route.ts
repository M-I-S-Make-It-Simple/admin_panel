import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 🔹 Отримання ID з URL
function getIdFromRequest(req: NextRequest): number | null {
  const idStr = req.nextUrl.pathname.split("/").pop();
  const id = idStr ? Number(idStr) : NaN;
  return isNaN(id) ? null : id;
}

// 🔸 GET - отримання одного співробітника
export async function GET(req: NextRequest) {
  const id = getIdFromRequest(req);
  if (id === null) {
    return NextResponse.json({ message: "Некоректний ID" }, { status: 400 });
  }

  try {
    const staff = await prisma.staff.findUnique({ where: { id } });
    if (!staff) {
      return NextResponse.json({ message: "Співробітника не знайдено" }, { status: 404 });
    }

    return NextResponse.json({
      ...staff,
      photoUrl: staff.photoUrl ? JSON.parse(staff.photoUrl) : [],
    });
  } catch (error) {
    console.error("❌ GET error:", error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}

// 🔸 DELETE - видалення співробітника
export async function DELETE(req: NextRequest) {
  const id = getIdFromRequest(req);
  if (id === null) {
    return NextResponse.json({ message: "Некоректний ID" }, { status: 400 });
  }

  try {
    const existingStaff = await prisma.staff.findUnique({ where: { id } });
    if (!existingStaff) {
      return NextResponse.json({ message: "Співробітника не знайдено" }, { status: 404 });
    }

    await prisma.staff.delete({ where: { id } });

    return NextResponse.json({ message: "Співробітника видалено" });
  } catch (error) {
    console.error("❌ DELETE error:", error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}

// 🔸 PATCH - редагування співробітника
export async function PATCH(req: NextRequest) {
  const id = getIdFromRequest(req);
  if (id === null) {
    return NextResponse.json({ message: "Некоректний ID" }, { status: 400 });
  }

  try {
    const body = await req.json();

    if (!body.fullName || !body.position || !body.biography) {
      return NextResponse.json({ message: "Відсутні обов'язкові поля" }, { status: 400 });
    }

    if (body.photoUrl && !Array.isArray(body.photoUrl)) {
      return NextResponse.json({ message: "photoUrl повинен бути масивом" }, { status: 400 });
    }

    const updated = await prisma.staff.update({
      where: { id },
      data: {
        fullName: body.fullName,
        position: body.position,
        biography: body.biography,
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
