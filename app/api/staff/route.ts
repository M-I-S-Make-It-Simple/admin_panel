// app/api/staff/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  // Наприклад: отримати список співробітників
  const staff = [
    { id: 1, name: 'Ivan', position: 'Manager' },
    { id: 2, name: 'Oksana', position: 'Developer' },
  ];
  return NextResponse.json(staff);
}

export async function POST(request: Request) {
  const body = await request.json();

  // тут можна зберегти нового співробітника у базу
  console.log('New staff:', body);

  return NextResponse.json({ message: 'Staff created', data: body });
}
