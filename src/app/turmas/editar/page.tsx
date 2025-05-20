"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getTurmaById, updateTurma } from "@/service/ServiceTurmas";
import "@/Styles/Form.css";

export default function EditarTurma() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const turmaId = searchParams.get("id");

  const [formData, setFormData] = useState({ nome: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTurma() {
      if (!turmaId) return;
      const turma = await getTurmaById(Number(turmaId));
      setFormData({ nome: turma.nome });
      setLoading(false);
    }
    fetchTurma();
  }, [turmaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ nome: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTurma(Number(turmaId), formData);
      router.push("/turmas");
    } catch (error) {
      console.error("Erro ao atualizar turma:", error);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="form-container">

      <h1 className="form-title">Editar Turma</h1>
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
        <button className="form-btn" type="submit">Salvar</button>
        <button className="form-btn" type="button" onClick={() => router.push('/turmas')} style={{marginTop: '1rem'}}>Voltar</button>
      </form>
    </div>
  );
}
