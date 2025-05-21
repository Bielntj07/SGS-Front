import { Reserva } from "./ServiceSalas";

/**
 * Verifica se há conflito de reserva para a mesma sala, data e horário.
 * @param reservas Lista de reservas já existentes na sala
 * @param data Data da nova reserva (yyyy-mm-dd)
 * @param hora_inicio Hora de início (hh:mm)
 * @param hora_termino Hora de término (hh:mm)
 * @returns true se houver conflito, false caso contrário
 */
export function checkReservaConflito(
  reservas: Reserva[],
  data: string,
  hora_inicio: string,
  hora_termino: string
): boolean {
  // Função auxiliar para normalizar horário parcial para 'hh:mm'
  function normalizeHora(hora: string): string {
    if (!hora) return '';
    // Extrai apenas números
    const match = hora.match(/^(\d{2})(?::(\d{0,2}))?/);
    if (!match) return '';
    let h = match[1];
    let m = match[2] || '';
    if (m.length === 0) m = '00';
    else if (m.length === 1) m = m + '0';
    else if (m.length > 2) m = m.slice(0, 2);
    return `${h}:${m}`;
  }
  const hInicio = normalizeHora(hora_inicio);
  const hTermino = normalizeHora(hora_termino);
  if (!hInicio && !hTermino) return false; 
  
  return reservas.some((r) => {
    if (r.data !== data) return false;
    // Normaliza horários da reserva existente
    const rInicio = normalizeHora(r.hora_inicio);
    const rTermino = normalizeHora(r.hora_termino);
    // Checa se intervalos de horário se sobrepõem
    // [A,B] e [C,D] sobrepõem se A < D && C < B
    if (hInicio && rInicio && rTermino && hTermino) {
      return (
        hInicio < rTermino && rInicio < hTermino
      );
    } else if (hInicio) {
      return (
        hInicio < rTermino
      );
    } else if (hTermino) {
      return (
        rInicio < hTermino
      );
    }
  });
}
