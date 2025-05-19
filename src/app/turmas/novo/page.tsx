"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTurma } from "@/service/ServiceTurmas";
import "@/Styles/Form.css";

export default function NovaTurma() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nome: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ nome: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTurma(formData);
      router.push("/turmas");
    } catch (error) {
      console.error("Erro ao criar turma:", error);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Adicionar Nova Turma</h1>
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
        <button className="form-btn" type="submit">Cadastrar</button>
        <button className="form-btn" type="button" onClick={() => router.push('/turmas')} style={{marginTop: '1rem'}}>Voltar</button>
      </form>
    </div>
  );
}
