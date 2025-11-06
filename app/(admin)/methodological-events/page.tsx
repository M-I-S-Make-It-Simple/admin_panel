import NewsManager from "@/components/NewsManager";

export default function MethodologicalEventsManagementPage() {
  return (
    <NewsManager 
      apiEndpoint="/api/methodological-events" 
      title="Управління методичними заходами" 
    />
  );
}
