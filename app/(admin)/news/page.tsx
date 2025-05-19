'use client';

import { useEffect, useState } from "react";

type NewsItem = {
  id: number;
  heading: string;
  publicationDate: string;
  description: string;
  photoUrl: string[];
};

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNewsList(data.map((n: any) => ({
        ...n,
        photoUrl: Array.isArray(n.photoUrl) ? n.photoUrl : JSON.parse(n.photoUrl)
      })));
    };

    fetchNews();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Новини</h1>

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
          </div>
        ))}
      </div>
    </div>
  );
}
