"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProfessor } from "@/service/ServiceProfessores";
import "@/Styles/Form.css";

export default function NovoProfessor() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nome: "", email: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProfessor(formData);
      router.push("/professores");
    } catch (error) {
      console.error("Erro ao criar professor:", error);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Adicionar Novo Professor</h1>
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
        <button className="form-btn" type="submit">Cadastrar</button>
        <button className="form-btn" type="button" onClick={() => router.push('/professores')} style={{marginTop: '1rem'}}>Voltar</button>
      </form>
    </div>
  );
}
