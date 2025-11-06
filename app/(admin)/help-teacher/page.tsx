import HelpTeacherManager from "@/components/HelpTeacherManager";

export default function HelpTeacherPage() {
  return (
    <HelpTeacherManager 
      apiEndpoint="/api/help-teacher" 
      title="На допомогу вчителю" 
    />
  );
}


