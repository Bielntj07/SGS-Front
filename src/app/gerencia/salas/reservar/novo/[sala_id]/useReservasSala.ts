import { useEffect, useState } from "react";
import { Reserva } from "@/service/ServiceSalas";

export function useReservasSala(salaId: number) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReservas() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/salas/${salaId}/reservas`);
        if (!res.ok) throw new Error("Erro ao buscar reservas");
        const data = await res.json();
        setReservas(data);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
        setReservas([]);
      } finally {
        setLoading(false);
      }
    }
    if (salaId) fetchReservas();
  }, [salaId]);

  return { reservas, loading, error };
}
