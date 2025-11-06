"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugUploads() {
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const checkUploads = async () => {
    setIsLoading(true);
    setDebugInfo("Перевірка завантажених файлів...");
    
    try {
      const response = await fetch('/api/debug-uploads');
      const data = await response.json();
      
      if (response.ok) {
        setDebugInfo(`
🔍 Debug інформація про uploads:

📁 Папка: ${data.uploadsDir}
✅ Існує: ${data.exists}
📊 Всього файлів: ${data.totalFiles}

📋 Файли:
${data.files.map((file: any) => 
  `- ${file.name} (${file.size} байт)
   Шлях: ${file.path}
   URL: ${file.url}
   Прямий URL: ${file.directUrl}
   Створено: ${new Date(file.created).toLocaleString('uk-UA')}
   Змінено: ${new Date(file.modified).toLocaleString('uk-UA')}
`
).join('\n')}

📅 Час перевірки: ${new Date().toLocaleString('uk-UA')}
        `);
      } else {
        setDebugInfo(`❌ Помилка: ${data.error || 'Невідома помилка'}`);
      }
    } catch (error) {
      setDebugInfo(`❌ Помилка перевірки: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testImages = async () => {
    setIsLoading(true);
    setDebugInfo("Тестування зображень...");
    
    try {
      const response = await fetch('/api/test-image');
      const data = await response.json();
      
      if (response.ok) {
        setDebugInfo(`
🧪 Тест зображень:

✅ ${data.message}
📁 Тестовий файл: ${data.testFile}
📊 Розмір файлу: ${data.fileSize} байт
📖 Розмір буфера: ${data.bufferSize} байт
📁 Папка: ${data.uploadsDir}

📋 Всі файли в папці:
${data.allFiles.join('\n')}

📅 Час тестування: ${new Date().toLocaleString('uk-UA')}
        `);
      } else {
        setDebugInfo(`❌ Помилка тестування: ${data.error || 'Невідома помилка'}`);
      }
    } catch (error) {
      setDebugInfo(`❌ Помилка тестування: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testSingleImage = async () => {
    setIsLoading(true);
    setDebugInfo("Тестування одного зображення...");
    
    try {
      const response = await fetch('/api/test-single-image');
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        
        setDebugInfo(`
🧪 Тест одного зображення:

✅ Зображення успішно завантажено!
📊 Тип контенту: ${contentType}
📏 Розмір: ${contentLength} байт
📅 Час тестування: ${new Date().toLocaleString('uk-UA')}

💡 Якщо ви бачите це повідомлення, то API endpoint працює правильно.
Тепер спробуйте завантажити фото в SchoolHistoryManager.
        `);
      } else {
        // Перевіряємо, чи це JSON відповідь
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          setDebugInfo(`❌ Помилка тестування: ${errorData.error || 'Невідома помилка'}`);
        } else {
          setDebugInfo(`❌ Помилка тестування: HTTP ${response.status} - ${response.statusText}`);
        }
      }
    } catch (error) {
      setDebugInfo(`❌ Помилка тестування: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔍 Debug завантажених файлів</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={checkUploads} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Перевірка...' : 'Перевірити завантажені файли'}
          </Button>
          
          <Button 
            onClick={testImages} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Тестування...' : 'Тестувати зображення'}
          </Button>
          
          <Button 
            onClick={testSingleImage} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Тестування...' : 'Тестувати одне зображення'}
          </Button>
        </div>
        
        {debugInfo && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <pre className="text-sm whitespace-pre-wrap">{debugInfo}</pre>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          <p>Цей компонент допомагає перевірити, чи правильно зберігаються завантажені файли та які URL вони мають.</p>
        </div>
      </CardContent>
    </Card>
  );
}
