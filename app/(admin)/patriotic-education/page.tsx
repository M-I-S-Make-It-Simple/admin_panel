import NewsManager from "@/components/NewsManager";

export default function PatrioticEducationPage() {
  return (
    <NewsManager 
      apiEndpoint="/api/patriotic-education" 
      title="Національно-патріотичне виховання" 
    />
  );
}
