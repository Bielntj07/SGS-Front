"use client";

import React, { useEffect, useState } from "react";
import IconFilter from "./IconFilter";
import styles from "@/Styles/FiltroSalas.module.css";
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
  professor?: string;
}

interface Sala {
  id: string;
  nome: string;
  capacidade: number;
  andar?: string | number;
}

interface ReservaSalas {
  [key: string]: Reserva[];
}

interface Filtro {
  turma: string;
  data: string;
  sala: string;
  professor: string;
}

export default function ConsultaSalas() {
  const [selectedFiltro, setSelectedFiltro] = useState<'turma' | 'data' | 'sala' | 'professor' | null>(null);
  const [filtroMenuOpen, setFiltroMenuOpen] = useState(false);
  const [professores, setProfessores] = useState<any[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [reservasSalas, setReservasSalas] = useState<ReservaSalas>({});
  const [turmas, setTurmas] = useState<TurmaProps[]>([]);
  const [filtro, setFiltro] = useState<Filtro>({ turma: "", data: "", sala: "", professor: "" });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
      // Buscar professores se necessário
      try {
        const profList = await (await import("@/service/ServiceProfessores")).getProfessores();
        setProfessores(profList);
      } catch {
        setProfessores([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  // Filtro das reservas
  const filtrarReservas = (reservas: Reserva[]) => {
    let reservasFuturas = reservas.filter(r => {
      const hoje = new Date().toISOString().split('T')[0];
      return r.data >= hoje;
    });
    if (filtro.turma) reservasFuturas = reservasFuturas.filter(r => r.turma === filtro.turma);
    if (filtro.professor) reservasFuturas = reservasFuturas.filter(r => r.professor === filtro.professor);
    if (filtro.data) reservasFuturas = reservasFuturas.filter(r => r.data === filtro.data);
    return reservasFuturas;
  };

  // Filtro das salas
  const salasFiltradas = salas.filter(sala => {
    // Filtro por sala
    if (filtro.sala) return sala.nome === filtro.sala;
    // Filtro por turma/professor/data
    const reservas: Reserva[] = reservasSalas[sala.id] || [];
    const hoje = new Date().toISOString().split('T')[0];
    const reservasFuturas = reservas.filter(r => r.data >= hoje);
    if (filtro.turma && !reservasFuturas.some(r => r.turma === filtro.turma)) return false;
    if (filtro.professor && !reservasFuturas.some(r => r.professor === filtro.professor)) return false;
    if (filtro.data && !reservasFuturas.some(r => r.data === filtro.data)) return false;
    return true;
  });

  return (
    <div className="container">
      <h1 className="title">Consulta de Salas</h1>
      <div className={styles.filtroContainer}>
        <div className={styles.filtroAcoes}>
          {selectedFiltro && (
            selectedFiltro === 'turma' ? (
              <div>
                <label className={styles.filtroLabel}>Turma:</label>
                <select name="turma" value={filtro.turma} onChange={handleFiltroChange} className={`form-input ${styles.filtroSelect}`}>
                  <option value="">Todas</option>
                  {turmas.map(turma => (
                    <option key={turma.id} value={turma.nome}>{turma.nome}</option>
                  ))}
                </select>
              </div>
            ) : selectedFiltro === 'data' ? (
              <div>
                <label className={styles.filtroLabel}>Data:</label>
                <input type="date" name="data" value={filtro.data} onChange={handleFiltroChange} className={`form-input ${styles.filtroInput}`} />
              </div>
            ) : selectedFiltro === 'sala' ? (
              <div>
                <label className={styles.filtroLabel}>Sala:</label>
                <select name="sala" value={filtro.sala} onChange={handleFiltroChange} className={`form-input ${styles.filtroSelect}`}>
                  <option value="">Todas</option>
                  {salas.map(sala => (
                    <option key={sala.id} value={sala.nome}>{sala.nome}</option>
                  ))}
                </select>
              </div>
            ) : selectedFiltro === 'professor' ? (
              <div>
                <label className={styles.filtroLabel}>Professor(a):</label>
                <select name="professor" value={filtro.professor} onChange={handleFiltroChange} className={`form-input ${styles.filtroSelect}`}>
                  <option value="">Todos</option>
                  {professores.map((prof: any) => (
                    <option key={prof.id} value={prof.nome}>{prof.nome}</option>
                  ))}
                </select>
              </div>
            ) : null
          )}
        </div>
        <div
          className={styles.menuFiltro}
          onMouseEnter={!isMobile ? () => setFiltroMenuOpen(true) : undefined}
          onMouseLeave={!isMobile ? () => setFiltroMenuOpen(false) : undefined}
        >
          <button
            style={{background:'none', border:'none', cursor:'pointer', padding:8}}
            onClick={isMobile ? () => setFiltroMenuOpen(open => !open) : undefined}
            aria-label="Abrir menu de filtros"
          >
            <IconFilter size={28} color="#111" />
          </button>
          {filtroMenuOpen && (
            <div className={styles.menuDropdown}>
              <div
                className={styles.menuItem}
                onClick={()=>{setSelectedFiltro('turma');setFiltroMenuOpen(false);}}
              >Turma</div>
              <div
                className={styles.menuItem}
                onClick={()=>{setSelectedFiltro('data');setFiltroMenuOpen(false);}}
              >Data</div>
              <div
                className={styles.menuItem}
                onClick={()=>{setSelectedFiltro('sala');setFiltroMenuOpen(false);}}
              >Sala</div>
              <div
                className={styles.menuItem}
                onClick={()=>{setSelectedFiltro('professor');setFiltroMenuOpen(false);}}
              >Professor(a)</div>
            </div>
          )}
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
                      <th>Andar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td data-label="Sala">{sala.nome}</td>
<td data-label="Capacidade">{sala.capacidade}</td>
<td data-label="Andar">{sala.andar ?? '-'}</td>
                    </tr>
                  </tbody>
                </table>
                <table className="mini-reservas-table">
  <thead>
    <tr>
      <th>Turma</th>
      <th>Professor(a)</th>
      <th>Hora início</th>
      <th>Hora fim</th>
      <th>Data</th>
    </tr>
  </thead>
  <tbody>
    {reservasFuturas.length > 0 ? reservasFuturas.map((r: Reserva, idx) => (
      <tr key={r.id}>
        <td data-label="Turma">{r.turma}</td>
<td data-label="Professor(a)">{r.professor || '-'}</td>
<td data-label="Hora início">{r.hora_inicio}</td>
<td data-label="Hora fim">{r.hora_termino}</td>
<td data-label="Data">{r.data}</td>
      </tr>
    )) : (
      <tr>
        <td colSpan={5}>Nenhuma reserva para esta sala</td>
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
