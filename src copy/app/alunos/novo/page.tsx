"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createAluno } from "@/service/ServiceAlunos";
import { getTurmas, TurmaProps } from "@/service/ServiceTurmas";
import "@/Styles/Form.css";

export default function NovoAluno() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    turma_id: "",
  });
  const [turmas, setTurmas] = useState<TurmaProps[]>([]);
  const [loadingTurmas, setLoadingTurmas] = useState(true);

  useEffect(() => {
    async function fetchTurmas() {
      setLoadingTurmas(true);
      try {
        const turmasData = await getTurmas();
        setTurmas(turmasData);
      } catch {
        setTurmas([]);
      } finally {
        setLoadingTurmas(false);
      }
    }
    fetchTurmas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAluno({ ...formData, turma_id: Number(formData.turma_id) });
      router.push("/alunos");
    } catch (error) {
      console.error("Erro ao criar aluno:", error);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Adicionar Novo Aluno</h1>
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
            disabled={loadingTurmas || turmas.length === 0}
          >
            <option value="">Selecione uma turma</option>
            {turmas.map((turma) => (
              <option key={turma.id} value={turma.id}>{turma.nome}</option>
            ))}
          </select>
          {(!loadingTurmas && turmas.length === 0) && (
            <div style={{marginTop:8, color:'#b91c1c'}}>Nenhuma turma cadastrada. Crie uma turma antes de adicionar alunos.</div>
          )}
        </div>
        <button className="form-btn" type="submit" disabled={loadingTurmas || turmas.length === 0}>
          Cadastrar
        </button>
        <button className="form-btn" type="button" onClick={() => router.push('/alunos')} style={{marginTop: '1rem'}}>Voltar</button>
      </form>
    </div>
  );
}