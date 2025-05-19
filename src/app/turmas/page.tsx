import { getTurmas, TurmaProps } from "@/service/ServiceTurmas";
import TurmasList from "@/components/TurmasList";

export default async function TurmasPage() {
  const turmas = (await getTurmas()) as TurmaProps[];
  return <TurmasList turmas={turmas} />;
}
