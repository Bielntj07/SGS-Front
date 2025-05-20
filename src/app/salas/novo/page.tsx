"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSala } from "@/service/ServiceSalas";
import "@/Styles/Form.css";

export default function NovaSala() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nome: "", capacidade: 0 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSala(formData);
      router.push("/salas");
    } catch (error) {
      console.error("Erro ao criar sala:", error);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Adicionar Nova Sala</h1>
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
          <label className="form-label">Capacidade</label>
          <input
            className="form-input"
            type="number"
            name="capacidade"
            value={formData.capacidade}
            onChange={handleChange}
            required
            min={0}
          />
        </div>
        <button className="form-btn" type="submit">Cadastrar</button>
        <button className="form-btn" type="button" onClick={() => router.push('/salas')} style={{marginTop: '1rem'}}>Voltar</button>
      </form>
    </div>
  );
}
