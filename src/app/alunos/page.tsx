// app/alunos/page.tsx
import { getAlunos, AlunoProps } from "@/service/ServiceAlunos";
import AlunosList from "@/components/AlunosList";

export default async function AlunosPage() {
  const alunos = (await getAlunos()) as AlunoProps[];
  return <AlunosList alunos={alunos} />;
}
