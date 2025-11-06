'use client';

import { useEffect, useState } from 'react';

interface InnovationActivityItem {
  id: number;
  title?: string;
  content?: string;
  photoUrls: string[];
  createdAt: string;
}

export default function DynamicInnovationActivity() {
  const [innovationData, setInnovationData] = useState<InnovationActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/innovation-activity');
        if (response.ok) {
          const data = await response.json();
          setInnovationData(data);
        }
      } catch (error) {
        console.error('Error fetching innovation activity data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  if (innovationData.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {innovationData.map((item) => (
        <div key={item.id} style={{
          display: 'flex',
          gap: '65px',
          margin: '0 auto',
          maxWidth: '1338px',
          height: '540px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '40px',
          padding: '29px 65px',
          margin: '0 51px'
        }}>
          {/* Ліва частина - заголовок та текст */}
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
            {item.title && (
              <h2 style={{
                fontFamily: 'Montserrat Alternates, sans-serif',
                fontSize: '37px',
                fontWeight: '700',
                color: '#182BA1',
                marginBottom: '25px',
                lineHeight: '1.2',
                maxWidth: '1178px'
              }}>
                {item.title}
              </h2>
            )}
            
            {item.content && (
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: item.content.replace(/\n/g, '<br>') 
                }} 
                style={{
                  fontFamily: 'Montserrat Alternates, sans-serif',
                  fontSize: '17px',
                  lineHeight: '1.5',
                  color: '#000',
                  flex: '1'
                }}
              />
            )}
          </div>

          {/* Права частина - фото */}
          {item.photoUrls && item.photoUrls.length > 0 && (
            <div style={{ 
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              justifyContent: 'center'
            }}>
              {item.photoUrls.map((url, index) => (
                <div key={index} style={{ 
                  flex: '1',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <img
                    src={`http://localhost:3000${url}`}
                    alt={`Photo ${index + 1}`}
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover', 
                      borderRadius: '20px'
                    }}
                    onError={(e) => {
                      console.error('Помилка завантаження зображення:', url);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
