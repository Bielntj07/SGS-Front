"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAlunoById, updateAluno } from "@/service/ServiceAlunos";
import { getTurmas, TurmaProps } from "@/service/ServiceTurmas";
import "@/Styles/Form.css";

export default function EditarAluno() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const alunoId = searchParams.get("id");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    turma_id: 0,
  });
  const [turmas, setTurmas] = useState<TurmaProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAluno() {
      if (!alunoId) return;
      const aluno = await getAlunoById(Number(alunoId));
      setFormData({
        nome: aluno.nome,
        email: aluno.email,
        turma_id: aluno.turma_id,
      });
      setLoading(false);
    }
    async function fetchTurmas() {
      try {
        const turmasData = await getTurmas();
        setTurmas(turmasData);
      } catch {
        setTurmas([]);
      }
    }
    fetchAluno();
    fetchTurmas();
  }, [alunoId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "nome" || name === "email" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAluno(Number(alunoId), formData);
      router.push("/alunos");
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="form-container">

      <h1 className="form-title">Editar Aluno</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nome</label>
          <input
            className="form-input"
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Turma</label>
          <select
            className="form-input"
            name="turma_id"
            value={formData.turma_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma turma</option>
            {turmas.map((turma) => (
              <option key={turma.id} value={turma.id}>{turma.nome}</option>
            ))}
          </select>
        </div>
        <button className="form-btn" type="submit">Salvar</button>
        <button className="form-btn" type="button" onClick={() => router.push('/alunos')} style={{marginTop: '1rem'}}>Voltar</button>
      </form>
    </div>
  );
}
