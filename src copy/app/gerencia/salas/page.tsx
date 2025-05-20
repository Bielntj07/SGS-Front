"use client";

import React, { useState, useEffect } from "react";
import { reservarSala, getSalas, getReservasSala } from "@/service/ServiceSalas";
import "../../../Styles/Form.css";
import "@/Styles/SalasGerencia.css";

interface Reserva {
  id: string;
  turma: string;
  data: string;
  hora_inicio: string;
  hora_termino: string;
}

interface Sala {
  id: string;
  nome: string;
  capacidade: number;
}

interface ReservaSalas {
  [key: string]: Reserva[];
}

interface ReservaForm {
  turma: string;
  data: string;
  hora_inicio: string;
  hora_termino: string;
}

import { cancelarReservaSala } from "@/service/ServiceSalas";
import { useTurmasReserva } from "./useTurmasReserva";

export default function GerenciarSalaReserva() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [reservasSalas, setReservasSalas] = useState<ReservaSalas>({});
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
  const [form, setForm] = useState<ReservaForm>({ turma: "", data: "", hora_inicio: "", hora_termino: "" });
  const { turmas, loading: loadingTurmas } = useTurmasReserva();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reservas, setReservas] = useState<any[]>([]);
  const [conflito, setConflito] = useState<boolean>(false);

  useEffect(() => {
    async function fetchSalasEReservas() {
      const salasList = await getSalas();
      setSalas(salasList);
      // Buscar reservas de todas as salas
      const reservasObj: { [salaId: number]: any[] } = {};
      await Promise.all(
        salasList.map(async (sala: any) => {
          try {
            const reservas = await getReservasSala(sala.id);
            reservasObj[sala.id] = reservas;
          } catch {
            reservasObj[sala.id] = [];
          }
        })
      );
      setReservasSalas(reservasObj);
    }
    fetchSalasEReservas();
  }, []);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 600);
    }
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const openModal = async (sala: any) => {
    setSelectedSala(sala);
    setForm({ turma: "", data: "", hora_inicio: "", hora_termino: "" });
    setMsg(null);
    setShowModal(true);
    // Carrega reservas da sala ao abrir o modal
    try {
      const reservasSala = await getReservasSala(sala.id);
      setReservas(reservasSala);
    } catch (e) {
      setReservas([]);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSala(null);
    setMsg(null);
    setShowForm(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    // Verifica conflito ao alterar algum campo do formulário
    if (reservas && newForm.data && newForm.hora_inicio && newForm.hora_termino) {
      const inicio = newForm.hora_inicio;
      const termino = newForm.hora_termino;
      const conflitoEncontrado = reservas.some((r: any) =>
        r.data === newForm.data &&
        ((inicio >= r.hora_inicio && inicio < r.hora_termino) ||
         (termino > r.hora_inicio && termino <= r.hora_termino) ||
         (inicio <= r.hora_inicio && termino >= r.hora_termino))
      );
      setConflito(conflitoEncontrado);
      if (conflitoEncontrado) {
        setMsg("Horário indisponível para reserva. Escolha outro horário.");
      } else {
        setMsg(null);
      }
    } else {
      setConflito(false);
      setMsg(null);
    }
  };


  const handleExcluirReserva = async (reservaId: string, salaId: string) => {
    try {
      // Encontra a reserva pelo id
      const reserva = (reservasSalas[salaId] || []).find((r: Reserva) => r.id === reservaId);
      if (!reserva) return;
      // Chama o serviço para cancelar a reserva
      await cancelarReservaSala(reservaId);
      setReservasSalas(prev => ({
        ...prev,
        [salaId]: prev[salaId].filter((r: Reserva) => r.id !== reservaId)
      }));
      setMsg("Reserva excluída com sucesso!");
    } catch (error) {
      setMsg("Erro ao excluir reserva.");
    }
  };

  const handleReservar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSala) return;
    setLoading(true);
    setMsg("");
    try {
      await reservarSala(Number(selectedSala.id), form);
      setMsg("Reserva realizada com sucesso!");
      setLoading(false);
      setShowForm(false);
      setTimeout(() => {
        setShowModal(false);
        setShowForm(true);
        setMsg("");
      }, 1500);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMsg(error.message || "Erro ao reservar sala");
      } else {
        setMsg("Erro ao reservar sala");
      }
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Gerenciar Salas</h1>
      <div className="table-container">
        {salas.map((sala: Sala) => {
  const reservas: Reserva[] = reservasSalas[sala.id] || [];
  const hoje = new Date().toISOString().split('T')[0];
  const reservasFuturas = reservas.filter((r) => r.data >= hoje);
  reservasFuturas.sort((a, b) => {
    if (a.data === b.data) return a.hora_inicio.localeCompare(b.hora_inicio);
    return a.data.localeCompare(b.data);
  });
  return (
    <div key={sala.id} className="sala-card">
      <table className="sala-table">
        <thead>
          <tr>
            <th>Sala</th>
            <th>Capacidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{sala.nome}</td>
            <td>{sala.capacidade}</td>
            <td>
              <button className="sala-reservar-btn" onClick={()=>window.location.href=`/gerencia/salas/reservar/novo/${sala.id}`}>Reservar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <table className="mini-reservas-table">
        <thead>
          <tr>
            <th>Turma</th>
            <th>Hora início</th>
            <th>Hora fim</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {reservasFuturas.length > 0 ? reservasFuturas.map((r: Reserva, idx) => (
            <tr key={r.id} >
              <td>{r.turma}</td>
              <td>{r.hora_inicio}</td>
              <td>{r.hora_termino}</td>
              <td>
                {r.data}
                <button
                  className="sala-excluir-btn"
                  onClick={()=>handleExcluirReserva(r.id, sala.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={4}>Nenhuma reserva para esta sala</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
})}


        {showModal && (
  <div className="modal-container">
    <div className="form-container">
      <h1 className="form-title">Reservar {selectedSala?.nome}</h1>
      {showForm ? (
        <form onSubmit={handleReservar}>
          <div className="form-group">
            <label className="form-label">Turma</label>
            {loadingTurmas ? (
              <div className="loading-message">Carregando turmas...</div>
            ) : turmas.length === 0 ? (
              <div className="error-message">Nenhuma turma cadastrada</div>
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
            disabled={loading || conflito || turmas.length === 0}
          >{loading ? 'Reservando...' : 'Reservar'}</button>
          <button
            className="form-btn"
            type="button"
            onClick={closeModal}
          >
            Cancelar
          </button>
          {msg && <div className="message">{msg}</div>}
        </form>
      ) : (
        msg && <div className="message">{msg}</div>
      )}
    </div>
  </div>
)}
      </div>
    </div>
  );
}
