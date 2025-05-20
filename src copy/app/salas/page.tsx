import { getSalas, SalaProps } from "@/service/ServiceSalas";
import SalasList from "@/components/SalasList";

export default async function SalasPage() {
  const salas = (await getSalas()) as SalaProps[];
  return <SalasList salas={salas} />;
}
