import { fetchData } from "./api";

export interface SalaProps {
  id: number;
  nome: string;
  capacidade: number;
}

// GET - buscar todas as salas
export const getSalas = async () => {
  return await fetchData("salas");
};

// GET - buscar sala por id
export const getSalaById = async (id: number) => {
  return await fetchData(`salas/${id}`);
};

// GET - buscar reservas de uma sala
export const getReservasSala = async (sala_id: number) => {
  return await fetchData(`salas/${sala_id}/reservas`);
};

// POST - criar nova sala
export const createSala = async (sala: { nome: string; capacidade: number }) => {
  try {
    const salaCriada = await fetchData("salas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sala),
    });
    return salaCriada;
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    throw new Error("Erro ao criar sala");
  }
};

// PUT - atualizar sala existente
export const updateSala = async (id: number, sala: { nome: string; capacidade: number }) => {
  try {
    const salaAtualizada = await fetchData(`salas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sala),
    });
    return salaAtualizada;
  } catch (error) {
    console.error("Erro ao atualizar sala:", error);
    throw new Error("Erro ao atualizar sala");
  }
};

// DELETE - deletar sala
export const deleteSala = async (id: number) => {
  try {
    const resultado = await fetchData(`salas/${id}`, {
      method: "DELETE",
    });
    return resultado;
  } catch (error) {
    console.error("Erro ao deletar sala:", error);
    throw new Error("Erro ao deletar sala");
  }
};

// POST - reservar sala
export const reservarSala = async (sala_id: number, reserva: { turma: string; data: string; hora_inicio: string; hora_termino: string }) => {
  try {
    const resultado = await fetchData(`salas/${sala_id}/reservar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reserva),
    });
    return resultado;
  } catch (error) {
    console.error("Erro ao reservar sala:", error);
    throw new Error("Erro ao reservar sala");
  }
};

// DELETE - cancelar reserva
export const cancelarReservaSala = async (reserva_id: string | number) => {
  try {
    const resultado = await fetchData(`reservas/${reserva_id}/cancelar`, {
      method: "DELETE"
    });
    return resultado;
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    throw new Error("Erro ao cancelar reserva");
  }
};
