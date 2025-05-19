"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProfessorById, updateProfessor } from "@/service/ServiceProfessores";
import "@/Styles/Form.css";

export default function EditarProfessor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const professorId = searchParams.get("id");

  const [formData, setFormData] = useState({ nome: "", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfessor() {
      if (!professorId) return;
      const professor = await getProfessorById(Number(professorId));
      setFormData({ nome: professor.nome, email: professor.email });
      setLoading(false);
    }
    fetchProfessor();
  }, [professorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfessor(Number(professorId), formData);
      router.push("/professores");
    } catch (error) {
      console.error("Erro ao atualizar professor:", error);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="form-container">

      <h1 className="form-title">Editar Professor</h1>
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
        <button className="form-btn" type="submit">Salvar</button>
        <button className="form-btn" type="button" onClick={() => router.push('/professores')} style={{marginTop: '1rem'}}>Voltar</button>
      </form>
    </div>
  );
}
