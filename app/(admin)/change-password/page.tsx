'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 - підтвердження поточних даних, 2 - введення нових
  const [formData, setFormData] = useState({
    currentUsername: '',
    currentPassword: '',
    newPassword: '',
    newUsername: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаємо повідомлення при зміні полів
    setMessage('');
    setError('');
  };

  const handleVerifyCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/verify-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.currentUsername,
          password: formData.currentPassword
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('Поточні дані підтверджені! Тепер ви можете ввести нові дані.');
        setStep(2);
      } else {
        setError(data.error || 'Неправильний логін або пароль');
      }
    } catch (error) {
      console.error('Помилка при перевірці даних:', error);
      setError('Помилка з\'єднання з сервером');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeData = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          newUsername: formData.newUsername
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('Дані успішно змінено!');
        setFormData({
          currentUsername: '',
          currentPassword: '',
          newPassword: '',
          newUsername: ''
        });
        setStep(1);
      } else {
        setError(data.error || 'Помилка при зміні даних');
      }
    } catch (error) {
      console.error('Помилка при зміні даних:', error);
      setError('Помилка з\'єднання з сервером');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Зміна даних входу</h1>
          <p className="text-gray-600 mt-2">
            {step === 1 
              ? 'Спочатку підтвердіть поточні дані для входу' 
              : 'Тепер введіть нові дані для входу'
            }
          </p>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
            </div>
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleVerifyCredentials} className="space-y-4">
          {/* Повідомлення про успіх */}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {/* Повідомлення про помилку */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Поточний логін */}
          <div>
            <label htmlFor="currentUsername" className="block text-sm font-medium text-gray-700 mb-1">
              Поточний логін
            </label>
            <input
              type="text"
              id="currentUsername"
              name="currentUsername"
              value={formData.currentUsername}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Поточний пароль */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Поточний пароль
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>


          {/* Кнопки для кроку 1 */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Назад
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Перевірка...' : 'Підтвердити'}
            </button>
          </div>
        </form>
        ) : (
          <form onSubmit={handleChangeData} className="space-y-4">
            {/* Повідомлення про успіх */}
            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {message}
              </div>
            )}

            {/* Повідомлення про помилку */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Новий логін */}
            <div>
              <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700 mb-1">
                Новий логін (за бажанням)
              </label>
              <input
                type="text"
                id="newUsername"
                name="newUsername"
                value={formData.newUsername}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                minLength={3}
                placeholder="Залиште пустим, щоб не змінювати"
              />
              <p className="text-xs text-gray-500 mt-1">Мінімум 3 символи</p>
            </div>

            {/* Новий пароль */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Новий пароль
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">Мінімум 8 символів</p>
            </div>


            {/* Кнопки для кроку 2 */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Назад
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Зміна...' : 'Змінити дані'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
