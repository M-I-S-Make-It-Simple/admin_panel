import QualificationImprovementManager from '@/components/QualificationImprovementManager';

export default function QualificationImprovementAdminPage() {
  return (
    <QualificationImprovementManager
      apiEndpoint="/api/qualification-improvement"
      title="Підвищення кваліфікації"
    />
  );
}


