'use client';

import { useEffect, useState } from 'react';

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/staff')
      .then(res => res.json())
      .then(data => setStaff(data));
  }, []);

  const deleteStaff = async (id: number) => {
    await fetch(`/api/staff/${id}`, { method: 'DELETE' });
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Персонал</h1>
      <ul>
        {staff.map(person => (
          <li key={person.id} className="mb-2 flex justify-between items-center">
            <div>
              <strong>{person.fullname}</strong> — {person.position}
            </div>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => deleteStaff(person.id)}
            >
              Видалити
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
