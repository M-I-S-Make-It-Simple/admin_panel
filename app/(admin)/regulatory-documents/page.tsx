import RegulatoryDocumentsManager from "@/components/RegulatoryDocumentsManager";

export default function RegulatoryDocumentsPage() {
  return (
    <RegulatoryDocumentsManager 
      apiEndpoint="/api/regulatory-documents" 
      title="Нормативні документи" 
    />
  );
}


