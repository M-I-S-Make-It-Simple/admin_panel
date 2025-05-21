import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file: File | null = formData.get('file') as unknown as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Файл не знайдено' }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Перевіряємо, чи існує директорія для завантажень
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    
    return NextResponse.json({ url: `/uploads/${fileName}` }, { status: 200 });
  } catch (error) {
    console.error("Помилка завантаження файлу:", error);
    return NextResponse.json({ error: 'Помилка завантаження файлу' }, { status: 500 });
  }
}