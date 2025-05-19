"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSalaById, updateSala } from "@/service/ServiceSalas";
import "@/Styles/Form.css";

export default function EditarSala() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const salaId = searchParams.get("id");

  const [formData, setFormData] = useState({ nome: "", capacidade: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSala() {
      if (!salaId) return;
      const sala = await getSalaById(Number(salaId));
      setFormData({ nome: sala.nome, capacidade: sala.capacidade });
      setLoading(false);
    }
    fetchSala();
  }, [salaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSala(Number(salaId), formData);
      router.push("/salas");
    } catch (error) {
      console.error("Erro ao atualizar sala:", error);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="form-container">

      <h1 className="form-title">Editar Sala</h1>
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
        <button className="form-btn" type="submit">Salvar</button>
        <button className="form-btn" type="button" onClick={() => router.push('/salas')} style={{marginTop: '1rem'}}>Voltar</button>
      </form>
    </div>
  );
}
