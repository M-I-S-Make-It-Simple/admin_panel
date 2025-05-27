import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 🔸 POST - створення співробітника
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.fullName || !body.position || !body.biography) {
      return NextResponse.json({ error: "Відсутні обов'язкові поля" }, { status: 400 });
    }

    const photoUrlArray = Array.isArray(body.photoUrl) ? body.photoUrl : [];

    const staff = await prisma.staff.create({
      data: {
        fullName: body.fullName,
        position: body.position,
        biography: body.biography,
        photoUrl: JSON.stringify(photoUrlArray),
      },
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating staff:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Щось пішло не так" },
      { status: 500 }
    );
  }
}

// 🔸 GET - отримання всього персоналу
export async function GET() {
  try {
    const staffRaw = await prisma.staff.findMany({
      orderBy: { createdAt: "desc" },
    });

    const staff = staffRaw.map((item) => ({
      ...item,
      photoUrl: item.photoUrl ? JSON.parse(item.photoUrl) : [],
    }));

    return NextResponse.json(staff);
  } catch (error) {
    console.error("❌ Error fetching staff:", error);
    return NextResponse.json({ error: "Помилка при отриманні персоналу" }, { status: 500 });
  }
}
