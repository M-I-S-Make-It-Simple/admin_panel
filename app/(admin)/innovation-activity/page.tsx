import ContentWithPhotosManager from "@/components/ContentWithPhotosManager";

export default function InnovationActivityPage() {
  return (
    <ContentWithPhotosManager 
      apiEndpoint="/api/innovation-activity" 
      title="Інноваційна діяльність" 
    />
  );
}

