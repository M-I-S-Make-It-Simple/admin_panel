'use client';
import { useState } from "react";

export default function CreateNewsPage() {
  const [heading, setHeading] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Покращений обробник файлів з обробкою помилок
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error(`Помилка завантаження: ${res.status}`);
      }
      
      // Безпечна обробка відповіді
      const text = await res.text();
      let data;
      
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("Помилка парсингу JSON:", parseError);
        throw new Error(`Неправильний формат відповіді: ${text.substring(0, 100)}`);
      }
      
      if (data.url) {
        setPhotoUrl((prev) => [...prev, data.url]);
      } else {
        throw new Error("URL не отримано в відповіді");
      }
    } catch (error) {
      console.error("Помилка:", error);
      setError(error instanceof Error ? error.message : "Невідома помилка");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
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
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Помилка сервера: ${res.status}. ${errorText}`);
      }
      
      // Безпечна обробка відповіді
      const text = await res.text();
      if (text) {
        try {
          JSON.parse(text); // Перевіряємо, чи це валідний JSON
        } catch (parseError) {
          console.warn("Відповідь не є валідним JSON:", text);
          // Але продовжуємо, оскільки res.ok = true
        }
      }
      
      alert("✅ Новину створено!");
      setHeading("");
      setPublicationDate("");
      setDescription("");
      setPhotoUrl([]);
    } catch (error) {
      console.error("Помилка при створенні новини:", error);
      setError(error instanceof Error ? error.message : "Невідома помилка");
      alert(`❌ Помилка при створенні новини: ${error instanceof Error ? error.message : "Невідома помилка"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-4">Створити новину</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
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
              onChange={handleFileUpload}
              className="w-full border px-3 py-2 rounded"
              disabled={isLoading}
            />
          </div>
          
          {/* Preview завантажених фото */}
          {photoUrl.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {photoUrl.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`Фото ${idx + 1}`}
                    className="w-full object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(photoUrl.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Обробка..." : "Додати новину"}
        </button>
      </form>
    </div>
  );
}