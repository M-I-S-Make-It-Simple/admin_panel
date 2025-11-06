import NewsManager from "@/components/NewsManager";

export default function SportLifePage() {
  return (
    <NewsManager 
      apiEndpoint="/api/sport-life" 
      title="СпортLife" 
    />
  );
}
