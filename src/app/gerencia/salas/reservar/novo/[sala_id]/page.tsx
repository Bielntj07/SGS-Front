"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { reservarSala } from "@/service/ServiceSalas";

import { useTurmasReserva } from "@/app/gerencia/salas/useTurmasReserva";
import "@/Styles/Form.css";

export default function NovaReserva() {
  const router = useRouter();
  const params = useParams();
  const salaId = Number(params.sala_id);
  const [sala, setSala] = React.useState<{ nome: string } | null>(null);
  const [loadingSala, setLoadingSala] = React.useState(true);
  const { turmas, loading: loadingTurmas } = useTurmasReserva();

  React.useEffect(() => {
    async function fetchSala() {
      setLoadingSala(true);
      try {
        const data = await (await import("@/service/ServiceSalas")).getSalaById(salaId);
        setSala(data.sala);
      } catch {
        setSala(null);
      } finally {
        setLoadingSala(false);
      }
    }
    fetchSala();
  }, [salaId]);
  const [form, setForm] = useState({ turma: "", data: "", hora_inicio: "", hora_termino: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await reservarSala(salaId, form);
      setMsg("Reserva realizada com sucesso!");
      setTimeout(() => router.push("/gerencia/salas"), 1200);
    } catch {
      setMsg("Erro ao reservar sala.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{margin: '2.5rem auto', maxWidth: 420}}>
      <h1 className="form-title">
  Nova Reserva
  {loadingSala
    ? '...'
    : sala
      ? ` - ${Array.isArray(sala) ? sala[0]?.nome : sala.nome || 'Sem nome'}`
      : ' - Sala não encontrada'}
</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Turma</label>
          {loadingTurmas ? (
            <div style={{color:'#666',fontSize:'1rem'}}>Carregando turmas...</div>
          ) : turmas.length === 0 ? (
            <div style={{color:'#b91c1c',fontSize:'1rem'}}>Nenhuma turma cadastrada</div>
          ) : (
            <select
              className="form-input"
              name="turma"
              value={form.turma}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Selecione uma turma</option>
              {turmas.map(turma => (
                <option key={turma.id} value={turma.nome}>{turma.nome}</option>
              ))}
            </select>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Data</label>
          <input className="form-input" type="date" name="data" value={form.data} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Hora Início</label>
          <input className="form-input" type="time" name="hora_inicio" value={form.hora_inicio} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Hora Término</label>
          <input className="form-input" type="time" name="hora_termino" value={form.hora_termino} onChange={handleChange} required />
        </div>
        <button
          className="form-btn"
          type="submit"
          disabled={loading || turmas.length === 0}
          style={{background: '#ffa500', color: '#fff', marginTop: '0.5rem'}}
        >{loading ? 'Reservando...' : 'Reservar'}</button>
        <button
          className="form-btn"
          type="button"
          onClick={() => router.push("/gerencia/salas")}
          style={{background:'#e53935', color:'#fff', marginTop:'0.5rem'}}
        >Cancelar</button>
        {msg && <div style={{marginTop:12, color: msg.includes('sucesso') ? '#3b7a57' : '#b91c1c'}}>{msg}</div>}
      </form>
    </div>
  );
}
