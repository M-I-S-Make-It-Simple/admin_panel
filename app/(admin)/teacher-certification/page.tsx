import TeacherCertificationManager from "@/components/TeacherCertificationManager";

export default function TeacherCertificationPage() {
  return (
    <TeacherCertificationManager 
      apiEndpoint="/api/teacher-certification" 
      title="Атестація педпрацівників" 
    />
  );
}
