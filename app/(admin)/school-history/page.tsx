import ContentWithPhotosManager from "@/components/ContentWithPhotosManager";

export default function SchoolHistoryPage() {
  return (
    <ContentWithPhotosManager 
      apiEndpoint="/api/school-history" 
      title="Історія закладу" 
    />
  );
}

