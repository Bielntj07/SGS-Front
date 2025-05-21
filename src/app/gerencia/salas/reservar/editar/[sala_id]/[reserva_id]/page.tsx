"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateReservaSala } from "@/service/ServiceSalas";
import { fetchData } from "@/service/api";
import { useTurmasReserva } from "@/app/gerencia/salas/useTurmasReserva";
import "@/Styles/Form.css";

export default function EditarReserva() {
  const router = useRouter();
  const params = useParams();
  const salaId = params.sala_id;
  const reservaId = params.reserva_id;
  const [form, setForm] = useState({ turma: "", data: "", hora_inicio: "", hora_termino: "", professor: "" });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const { turmas, loading: loadingTurmas } = useTurmasReserva();
  const [professores, setProfessores] = useState<any[]>([]);
  const [loadingProfessores, setLoadingProfessores] = useState(true);

  useEffect(() => {
    async function fetchReserva() {
      setLoading(true);
      try {
        console.log('salaId:', salaId, 'reservaId:', reservaId);
        if (!reservaId || Array.isArray(reservaId)) throw new Error('ID de reserva inválido');
        if (!salaId || Array.isArray(salaId)) throw new Error('ID de sala inválido');
        const reservas = await fetchData(`salas/${String(salaId)}/reservas`);
        const reserva = reservas.find((r: any) => String(r.id) === String(reservaId));
        if (!reserva) throw new Error('Reserva não encontrada');
        setForm({
          ...form,
          ...reserva
        });
      } catch {
        setMsg("Erro ao carregar reserva.");
      } finally {
        setLoading(false);
      }
    }
    fetchReserva();
  }, [reservaId, salaId]);

  useEffect(() => {
    async function fetchProfessores() {
      setLoadingProfessores(true);
      try {
        const data = await (await import("@/service/ServiceProfessores")).getProfessores();
        setProfessores(data);
      } catch {
        setProfessores([]);
      } finally {
        setLoadingProfessores(false);
      }
    }
    fetchProfessores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      if (!reservaId || Array.isArray(reservaId)) throw new Error('ID de reserva inválido');
      await updateReservaSala(String(reservaId), form);
      setMsg("Reserva atualizada com sucesso!");
      setTimeout(() => router.push("/gerencia/salas"), 1200);
    } catch {
      setMsg("Erro ao atualizar reserva.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  return (
    <div className="form-container" style={{margin: '2.5rem auto', maxWidth: 420}}>
      <h1 className="form-title">Editar Reserva</h1>
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
          <label className="form-label">Professor responsável</label>
          {loadingProfessores ? (
            <div style={{color:'#666',fontSize:'1rem'}}>Carregando professores...</div>
          ) : professores.length === 0 ? (
            <div style={{color:'#b91c1c',fontSize:'1rem'}}>Nenhum professor cadastrado</div>
          ) : (
            <select
              className="form-input"
              name="professor"
              value={form.professor}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Selecione um professor</option>
              {professores.map((prof: any) => (
                <option key={prof.id} value={prof.nome}>{prof.nome}</option>
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
          style={{background: '#ffa500', color: '#fff', marginTop: '0.5rem'}}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          className="form-btn"
          type="button"
          onClick={() => router.push("/gerencia/salas")}
          style={{background:'#e53935', color:'#fff', marginTop:'0.5rem'}}>
          Cancelar
        </button>
        {msg && <div style={{marginTop:12, color: msg.includes('sucesso') ? '#3b7a57' : '#b91c1c'}}>{msg}</div>}
      </form>
    </div>
  );
}
