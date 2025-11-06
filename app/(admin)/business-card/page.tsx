import ContentWithPhotosManager from "@/components/ContentWithPhotosManager";

export default function VisitingCardPage() {
  return (
    <ContentWithPhotosManager 
      apiEndpoint="/api/visiting-card" 
      title="Наша візитка" 
    />
  );
}
