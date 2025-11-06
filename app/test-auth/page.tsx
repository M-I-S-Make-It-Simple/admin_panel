'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TestAuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Завантаження...</div>;
  }

  if (!session) {
    return <div>Перенаправлення на логін...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Тест автентифікації</h1>
      <div className="bg-green-100 p-4 rounded">
        <p><strong>Статус:</strong> Авторизований</p>
        <p><strong>Користувач:</strong> {session.user?.name}</p>
        <p><strong>ID:</strong> {session.user?.id}</p>
      </div>
      <div className="mt-4">
        <button 
          onClick={() => router.push('/dashboard')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Перейти на Dashboard
        </button>
      </div>
    </div>
  );
}
