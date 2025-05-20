'use client';

import { useState } from "react";

export default function CreateNewsPage() {
  const [heading, setHeading] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string[]>([]); // правильна назва

  // ✅ Обробник файлів
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      setPhotoUrl((prev) => [...prev, data.url]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heading,
        publicationDate,
        description,
        photoUrl,
      }),
    });

    if (res.ok) {
      alert("✅ Новину створено!");
      setHeading("");
      setPublicationDate("");
      setDescription("");
      setPhotoUrl([]);
    } else {
      alert("❌ Помилка при створенні новини");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-4">Створити новину</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Заголовок</label>
          <input
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Дата публікації</label>
          <input
            type="date"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Опис</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Фото (завантажити з комп'ютера)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Додати новину
        </button>
      </form>
    </div>
  );
}
