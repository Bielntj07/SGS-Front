import { fetchData } from "./api";

export interface ProfessorProps {
  id: number;
  nome: string;
  email: string;
}

// GET - buscar todos os professores
export const getProfessores = async () => {
  return await fetchData("professores");
};

// GET - buscar professor por id
export const getProfessorById = async (id: number) => {
  return await fetchData(`professores/${id}`);
};

// POST - criar novo professor
export const createProfessor = async (professor: { nome: string; email: string }) => {
  try {
    const professorCriado = await fetchData("professores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(professor),
    });
    return professorCriado;
  } catch (error) {
    console.error("Erro ao criar professor:", error);
    throw new Error("Erro ao criar professor");
  }
};

// PUT - atualizar professor existente
export const updateProfessor = async (id: number, professor: { nome: string; email: string }) => {
  try {
    const professorAtualizado = await fetchData(`professores/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(professor),
    });
    return professorAtualizado;
  } catch (error) {
    console.error("Erro ao atualizar professor:", error);
    throw new Error("Erro ao atualizar professor");
  }
};

// DELETE - deletar professor
export const deleteProfessor = async (id: number) => {
  try {
    const resultado = await fetchData(`professores/${id}`, {
      method: "DELETE",
    });
    return resultado;
  } catch (error) {
    console.error("Erro ao deletar professor:", error);
    throw new Error("Erro ao deletar professor");
  }
};
