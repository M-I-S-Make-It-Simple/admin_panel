import RegulatoryDocumentsManager from '@/components/RegulatoryDocumentsManager';

export default function RegulatoryDocumentsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Управління нормативними документами</h1>
      <RegulatoryDocumentsManager
        apiEndpoint="/api/regulatory-documents"
        title="Нормативні документи"
      />
    </div>
  );
}
