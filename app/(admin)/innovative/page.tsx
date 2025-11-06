import ContentWithPhotosManager from "@/components/ContentWithPhotosManager";

export default function InnovativePage() {
  return (
    <ContentWithPhotosManager 
      apiEndpoint="/api/innovative" 
      title="Інноваційна діяльність" 
    />
  );
}
