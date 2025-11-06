import EvaluationCriteriaManager from "@/components/EvaluationCriteriaManager";

export default function EvaluationCriteriaPage() {
  return (
    <EvaluationCriteriaManager 
      apiEndpoint="/api/evaluation-criteria" 
      title="Критерії оцінювання" 
    />
  );
}
