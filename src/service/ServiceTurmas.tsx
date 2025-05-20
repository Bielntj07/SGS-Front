import { fetchData } from "./api";

export interface TurmaProps {
  id: number;
  nome: string;
  ano?: string;
}

// GET - buscar todas as turmas
export const getTurmas = async () => {
  return await fetchData("turmas");
};

// GET - buscar turma por id
export const getTurmaById = async (id: number) => {
  return await fetchData(`turmas/${id}`);
};

// POST - criar nova turma
export const createTurma = async (turma: { nome: string }) => {
  try {
    const turmaCriada = await fetchData("turmas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(turma),
    });
    return turmaCriada;
  } catch (error) {
    console.error("Erro ao criar turma:", error);
    throw new Error("Erro ao criar turma");
  }
};

// PUT - atualizar turma existente
export const updateTurma = async (id: number, turma: { nome: string }) => {
  try {
    const turmaAtualizada = await fetchData(`turmas/${id}` , {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(turma),
    });
    return turmaAtualizada;
  } catch (error) {
    console.error("Erro ao atualizar turma:", error);
    throw new Error("Erro ao atualizar turma");
  }
};

// DELETE - deletar turma
export const deleteTurma = async (id: number) => {
  try {
    const resultado = await fetchData(`turmas/${id}`, {
      method: "DELETE",
    });
    return resultado;
  } catch (error) {
    console.error("Erro ao deletar turma:", error);
    throw new Error("Erro ao deletar turma");
  }
};
