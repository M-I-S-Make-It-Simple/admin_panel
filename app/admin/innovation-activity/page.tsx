import ContentWithPhotosManager from '@/components/ContentWithPhotosManager';

export default function InnovationActivityPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Управління інноваційною діяльністю</h1>
      <ContentWithPhotosManager 
        apiEndpoint="/api/innovation-activity"
        title="Інноваційна діяльність"
      />
    </div>
  );
}
