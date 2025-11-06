import NewsManager from "@/components/NewsManager";

export default function ClubsStudiosPage() {
  return (
    <NewsManager 
      apiEndpoint="/api/clubs-studios" 
      title="Клуби та студії" 
    />
  );
}
