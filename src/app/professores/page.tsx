import { getProfessores, ProfessorProps } from "@/service/ServiceProfessores";
import ProfessoresList from "@/components/ProfessoresList";

export default async function ProfessoresPage() {
  const professores = (await getProfessores()) as ProfessorProps[];
  return <ProfessoresList professores={professores} />;
}
