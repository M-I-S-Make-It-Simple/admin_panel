import NewsManager from "@/components/NewsManager";

export default function StudentGovernmentPage() {
  return (
    <NewsManager 
      apiEndpoint="/api/student-government" 
      title="Учнівське самоврядування" 
    />
  );
}
