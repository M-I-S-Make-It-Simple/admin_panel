import NewsManager from "@/components/NewsManager";

export default function NewsManagementPage() {
  return (
    <NewsManager 
      apiEndpoint="/api/news" 
      title="Управління новинами" 
    />
  );
}
