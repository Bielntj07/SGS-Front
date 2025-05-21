"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSala } from "@/service/ServiceSalas";
import "@/Styles/Form.css";

export default function NovaSala() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nome: "", capacidade: 0, andar: "", laboratorio: ""});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSala({
        ...formData,
        laboratorio: formData.laboratorio === "true"
      });
      
      router.push("/salas");
    } catch (error) {
      console.error("Erro ao criar sala:", error);
    }
  };

  const decisao = [
    { id: 1, nome: "Sim", value: true },
    { id: 2, nome: "Não", value: false }
  ];  

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
        <div className="form-group">
          <label className="form-label">Andar</label>
          <input
            className="form-input"
            type="text"
            name="andar"
            value={formData.andar}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Está sala é um Laboratório?</label>
          <select
            className="form-input"
            name="laboratorio"
            value={formData.laboratorio}
            onChange={handleSelectChange}
            required
            >     
            {decisao.map(decisao => (
              <option key={decisao.id} value={String(decisao.value)}>{decisao.nome}</option>
            ))
            }
          </select>
        </div>
        <button className="form-btn" type="submit">Cadastrar</button>
        <button className="form-btn" type="button" onClick={() => router.push('/salas')} style={{ marginTop: '1rem' }}>Voltar</button>
      </form>
    </div>
  );
}
