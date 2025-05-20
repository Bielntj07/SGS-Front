import { useState, useEffect } from "react";
import { getTurmas, TurmaProps } from "@/service/ServiceTurmas";

export function useTurmasReserva() {
  const [turmas, setTurmas] = useState<TurmaProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTurmas() {
      setLoading(true);
      try {
        const turmasList = await getTurmas();
        setTurmas(turmasList);
      } catch {
        setTurmas([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTurmas();
  }, []);

  return { turmas, loading };
}
