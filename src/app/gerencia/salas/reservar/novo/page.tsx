"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { reservarSala } from "@/service/ServiceSalas";
import { salasMock } from "@/service/salasMock";
import { useTurmasReserva } from "../../useTurmasReserva";
import "@/Styles/Form.css";

export default function NovaReserva() {
  const router = useRouter();
  const { turmas, loading: loadingTurmas } = useTurmasReserva();
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
      await reservarSala(1, form);
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
      <h1 className="form-title">Nova Reserva {salasMock.find(s => s.id === 1)?.nome && `- ${salasMock.find(s => s.id === 1)?.nome}`}</h1>
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
