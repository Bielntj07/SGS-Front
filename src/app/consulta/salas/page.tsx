"use client";

import React, { useEffect, useState } from "react";
import { getSalas, getReservasSala } from "@/service/ServiceSalas";
import { getTurmas, TurmaProps } from "@/service/ServiceTurmas";
import "@/Styles/Form.css";
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

export default function ConsultaSalas() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [reservasSalas, setReservasSalas] = useState<ReservaSalas>({});
  const [turmas, setTurmas] = useState<TurmaProps[]>([]);
  const [filtro, setFiltro] = useState({ turma: "", data: "", sala: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const salasList = await getSalas();
      setSalas(salasList);
      const turmasList = await getTurmas();
      setTurmas(turmasList);
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
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  // Filtro das reservas
  const filtrarReservas = (reservas: Reserva[]) => {
    return reservas.filter(r => {
      const turmaOk = !filtro.turma || r.turma === filtro.turma;
      const dataOk = !filtro.data || r.data === filtro.data;
      return turmaOk && dataOk;
    });
  };

  // Filtro das salas
  const salasFiltradas = salas.filter(sala => {
    if (!filtro.sala) return true;
    return sala.nome.toLowerCase().includes(filtro.sala.toLowerCase());
  });

  return (
    <div className="container">
      <h1 className="title">Consulta de Salas</h1>
      <div style={{marginBottom:24, background:'#23281f', borderRadius:8, padding:'1.2rem 1.3rem', boxShadow:'0 1px 6px #0002', color:'#fff', display:'flex', gap:16, flexWrap:'wrap', alignItems:'center'}}>
        <div>
          <label style={{marginRight:8}}>Turma:</label>
          <select name="turma" value={filtro.turma} onChange={handleFiltroChange} className="form-input" style={{minWidth:120}}>
            <option value="">Todas</option>
            {turmas.map(turma => (
              <option key={turma.id} value={turma.nome}>{turma.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{marginRight:8}}>Data:</label>
          <input type="date" name="data" value={filtro.data} onChange={handleFiltroChange} className="form-input" />
        </div>
        <div>
          <label style={{marginRight:8}}>Sala:</label>
          <input type="text" name="sala" value={filtro.sala} onChange={handleFiltroChange} className="form-input" placeholder="Nome da sala..." />
        </div>
      </div>
      {loading ? (
        <div className="loading-message">Carregando...</div>
      ) : salasFiltradas.length === 0 ? (
        <div className="error-message">Nenhuma sala encontrada.</div>
      ) : (
        <div className="table-container">
          {salasFiltradas.map((sala: Sala) => {
            const reservas: Reserva[] = reservasSalas[sala.id] || [];
            const reservasFuturas = filtrarReservas(reservas);
            return (
              <div key={sala.id} className="sala-card">
                <table className="sala-table">
                  <thead>
                    <tr>
                      <th>Sala</th>
                      <th>Capacidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{sala.nome}</td>
                      <td>{sala.capacidade}</td>
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
                      <tr key={r.id}>
                        <td>{r.turma}</td>
                        <td>{r.hora_inicio}</td>
                        <td>{r.hora_termino}</td>
                        <td>{r.data}</td>
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
        </div>
      )}
    </div>
  );
}
