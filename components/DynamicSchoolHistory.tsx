'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { SchoolHistoryItem } from '@/lib/schoolHistoryData';

export default function DynamicSchoolHistory() {
  const [schoolHistoryData, setSchoolHistoryData] = useState<SchoolHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/school-history');
        if (response.ok) {
          const data = await response.json();
          setSchoolHistoryData(data);
        }
      } catch (error) {
        console.error('Error fetching school history data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Завантаження...</div>;
  }

  if (schoolHistoryData.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {schoolHistoryData.map((item) => (
        <section key={item.id} className="historySection">
          {item.title && (
            <h2 className="sectionTitle">{item.title}</h2>
          )}
          <div className="historyBlock">
            <div className="historyText">
              {item.content && (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: item.content.replace(/\n/g, '<br>') 
                  }} 
                />
              )}
              {item.photoUrls.length > 0 && (
                <div className="mt-6">
                  <div className="flex gap-4 flex-wrap">
                    {item.photoUrls.map((url, index) => (
                      <div key={index} className="historyImage" style={{ width: '45%', borderRadius: '15px' }}>
                        <Image
                          src={`http://localhost:3000/api/images/${encodeURIComponent(url)}`}
                          alt={`Photo ${index + 1}`}
                          width={450}
                          height={300}
                          style={{ objectFit: 'cover', borderRadius: '15px' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
