'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const { id: newsId } = useParams() as { id: string };


  const [heading, setHeading] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string[]>([]);

  // 🧠 Завантаження існуючої новини
  useEffect(() => {
    const fetchNews = async () => {
      const res = await fetch(`/api/news/${newsId}`);
      const data = await res.json();

      setHeading(data.heading);
      setPublicationDate(data.publicationDate.split("T")[0]); // ISO формат
      setDescription(data.description);
      setPhotoUrl(Array.isArray(data.photoUrl) ? data.photoUrl : JSON.parse(data.photoUrl));
    };

    if (newsId) {
      fetchNews();
    }
  }, [newsId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/news/${newsId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heading,
        publicationDate,
        description,
        photoUrl,
      }),
    });

    if (res.ok) {
      alert("✅ Новину оновлено!");
      router.push("/news");
    } else {
      alert("❌ Помилка при оновленні новини");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-4">Редагувати новину</h1>
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
          <div>
            <label className="block text-sm font-medium">Додати фото</label>
            <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
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
                }}
            />
            </div>

            {/* Preview завантажених фото */}
            {photoUrl.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-2">
                {photoUrl.map((url, idx) => (
                <img
                    key={idx}
                    src={url}
                    alt={`Фото ${idx + 1}`}
                    className="w-full object-contain rounded"
                />
                ))}
            </div>
            )}
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          💾 Зберегти зміни
        </button>
      </form>
    </div>
  );
}
