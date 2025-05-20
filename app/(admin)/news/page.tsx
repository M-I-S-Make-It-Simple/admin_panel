'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type NewsItem = {
  id: number;
  heading: string;
  publicationDate: string;
  description: string;
  photoUrl: string[];
};

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchNews = async () => {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNewsList(
        data.map((n: any) => ({
          ...n,
          photoUrl: Array.isArray(n.photoUrl) ? n.photoUrl : JSON.parse(n.photoUrl),
        }))
      );
    };

    fetchNews();
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Новини</h1>
        <button
          onClick={() => router.push("/news/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Додати новину
        </button>
      </div>

      {newsList.length === 0 && <p>Новини відсутні</p>}

      <div className="space-y-4">
        {newsList.map((news) => (
          <div key={news.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{news.heading}</h2>
            <p className="text-sm text-gray-500">
              {new Date(news.publicationDate).toLocaleDateString()}
            </p>
            <p className="mt-2">{news.description}</p>

            {news.photoUrl.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {news.photoUrl.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Фото ${idx + 1}`}
                    className="w-full object-contain rounded"
                  />
                ))}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => router.push(`/admin/news/edit/${news.id}`)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                🖊️ Редагувати
              </button>
              <button
                onClick={async () => {
                  if (confirm("Ти впевнений, що хочеш видалити цю новину?")) {
                    const res = await fetch(`/api/news/${news.id}`, {
                      method: "DELETE",
                    });
                    if (res.ok) {
                      setNewsList((prev) => prev.filter((n) => n.id !== news.id));
                    } else {
                      alert("❌ Не вдалося видалити новину");
                    }
                  }
                }}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                🗑️ Видалити
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
