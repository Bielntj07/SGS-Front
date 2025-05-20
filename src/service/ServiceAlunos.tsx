import { fetchData } from "./api";

export interface AlunoProps {
  id: number;
  nome: string;
  email: string;
  turma_id: number;
}

// GET - buscar todos os alunos
export const getAlunos = async () => {
  return await fetchData("alunos");
};

// GET - buscar aluno por id
export const getAlunoById = async (id: number) => {
  return await fetchData(`alunos/${id}`);
};

// POST - criar um novo aluno
// Omit<Tipo, "campo"> é uma utilidade do TypeScript que cria um novo tipo baseado em outro, mas removendo um ou mais campos.
export const createAluno = async (
  aluno: Omit<AlunoProps, "id" | "idade" | "media_final">
) => {
  try {
    // Usando fetchData para realizar a requisição
    const alunoCriado = await fetchData("alunos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(aluno),
    });

    console.log("Aluno criado com sucesso:", alunoCriado);
    return alunoCriado;
  } catch (error) {
    console.error("Erro ao criar aluno:", error);
    throw new Error("Erro ao criar aluno");
  }
};

// PUT - atualizar um aluno existente
export const updateAluno = async (id: number, aluno: Partial<AlunoProps>) => {
  try {
    // Usando fetchData para realizar a requisição
    const alunoAtualizado = await fetchData(`alunos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(aluno),
    });

    return alunoAtualizado;
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
    throw new Error("Erro ao atualizar aluno");
  }
};

// DELETE - deletar um aluno
export const deleteAluno = async (id: number) => {
  try {
    // Usando fetchData para realizar a requisição
    const resultado = await fetchData(`alunos/${id}`, {
      method: "DELETE",
    });

    return resultado;
  } catch (error) {
    console.error("Erro ao deletar aluno:", error);
    throw new Error("Erro ao deletar aluno");
  }
};
