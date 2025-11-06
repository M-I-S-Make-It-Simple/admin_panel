import NewsManager from "@/components/NewsManager";

export default function ProjectResearchPage() {
  return (
    <NewsManager 
      apiEndpoint="/api/project-research" 
      title="Проєктно-дослідницька робота" 
    />
  );
}
