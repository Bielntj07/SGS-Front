"use client";

import React, { useState, useEffect } from "react";
import IconEdit from "./IconEdit";
import IconDelete from "./IconDelete";
import { reservarSala, getSalas, getReservasSala } from "@/service/ServiceSalas";
import "../../../Styles/Form.css";
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
  laboratorio: boolean;
  andar?: string | number;
}

interface ReservaSalas {
  [key: string]: Reserva[];
}

interface ReservaForm {
  turma: string;
  data: string;
  hora_inicio: string;
  hora_termino: string;
  professor?: string;
}

import { cancelarReservaSala } from "@/service/ServiceSalas";
import { useTurmasReserva } from "./useTurmasReserva";

import IconFilter from "./IconFilter";

function GerenciarSalaReserva() {
  const [selectedFiltro, setSelectedFiltro] = useState<'turma' | 'data' | 'sala' | 'professor' | null>(null);
  const [filtroMenuOpen, setFiltroMenuOpen] = useState(false);
  const [filtro, setFiltro] = useState({ turma: "", data: "", sala: "", professor: "" });
  const [salas, setSalas] = useState<Sala[]>([]);
  const [reservasSalas, setReservasSalas] = useState<ReservaSalas>({});
  const [isMobile, setIsMobile] = useState(false);
const [professores, setProfessores] = useState<any[]>([]);
const [loadingProfessores, setLoadingProfessores] = useState(true);
const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
const [form, setForm] = useState<ReservaForm>({ turma: "", data: "", hora_inicio: "", hora_termino: "" });
const [msg, setMsg] = useState<string | null>(null);
const [showModal, setShowModal] = useState(false);
const [reservas, setReservas] = useState<Reserva[]>([]);
const { turmas, loading: loadingTurmas } = useTurmasReserva();

// Função para atualizar filtro
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  setFiltro({ ...filtro, [e.target.name]: e.target.value });
};

// Buscar professores ao carregar
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

  return (
    <div className="container">
      <h1 className="title">Gerenciar Salas</h1>
      <div style={{
        marginBottom: 24,
        background: '#8ba94b',
        borderRadius: 8,
        padding: '1.2rem 1.3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 6px #0002',
      }}>
        {/* Filtro Ação à esquerda */}
        <div style={{display:'flex', alignItems:'center', gap:16}}>
          {selectedFiltro && (
            selectedFiltro === 'turma' ? (
              <div>
                <label style={{marginRight:8, color:'#111'}}>Turma:</label>
                <select name="turma" value={filtro.turma} onChange={handleChange} className="form-input" style={{minWidth:120, color:'#111'}}>
                  <option value="">Todas</option>
                  {turmas.map(turma => (
                    <option key={turma.id} value={turma.nome}>{turma.nome}</option>
                  ))}
                </select>
              </div>
            ) : selectedFiltro === 'data' ? (
              <div>
                <label style={{marginRight:8, color:'#111'}}>Data:</label>
                <input type="date" name="data" value={filtro.data} onChange={handleChange} className="form-input" style={{color:'#111'}} />
              </div>
            ) : selectedFiltro === 'sala' ? (
              <div>
                <label style={{marginRight:8, color:'#111'}}>Sala:</label>
                <select name="sala" value={filtro.sala} onChange={handleChange} className="form-input" style={{minWidth:120, color:'#111'}}>
                  <option value="">Todas</option>
                  {salas.map(sala => (
                    <option key={sala.id} value={sala.nome}>{sala.nome}</option>
                  ))}
                </select>
              </div>
            ) : selectedFiltro === 'professor' ? (
              <div>
                <label style={{marginRight:8, color:'#111'}}>Professor(a):</label>
                {loadingProfessores ? (
                  <div style={{color:'#666',fontSize:'1rem'}}>Carregando professores...</div>
                ) : professores.length === 0 ? (
                  <div style={{color:'#b91c1c',fontSize:'1rem'}}>Nenhum professor cadastrado</div>
                ) : (
                  <select name="professor" value={filtro.professor} onChange={handleChange} className="form-input" style={{minWidth:120, color:'#111'}}>
                    <option value="">Todos</option>
                    {professores.map((prof: any) => (
                      <option key={prof.id} value={prof.nome}>{prof.nome}</option>
                    ))}
                  </select>
                )}
              </div>
            ) : null
          )}
        </div>
        {/* Icone de filtro à direita */}
        <div
          style={{position:'relative'}}
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
            <div style={{position:'absolute', right:0, top:'110%', background:'#fff', borderRadius:6, boxShadow:'0 2px 8px #0003', zIndex:10, minWidth:150}}>
              <div
                style={{padding:'0.7rem 1rem', cursor:'pointer', borderBottom:'1px solid #eee', color:'#111'}}
                onClick={()=>{setSelectedFiltro('turma');setFiltroMenuOpen(false);}}
              >Turma</div>
              <div
                style={{padding:'0.7rem 1rem', cursor:'pointer', borderBottom:'1px solid #eee', color:'#111'}}
                onClick={()=>{setSelectedFiltro('data');setFiltroMenuOpen(false);}}
              >Data</div>
              <div
                style={{padding:'0.7rem 1rem', cursor:'pointer', borderBottom:'1px solid #eee', color:'#111'}}
                onClick={()=>{setSelectedFiltro('sala');setFiltroMenuOpen(false);}}
              >Sala</div>
              <div
                style={{padding:'0.7rem 1rem', cursor:'pointer', color:'#111'}}
                onClick={()=>{setSelectedFiltro('professor');setFiltroMenuOpen(false);}}
              >Professor(a)</div>
            </div>
          )}
        </div>
      </div>
      <div className="table-container">
        {salas.length === 0 && (
          <div style={{ color: '#b91c1c', marginTop: 24, marginLeft: 8, fontSize: '1rem' }}>
            Nenhuma sala encontrada.
          </div>
        )}
        {salas
          .filter((sala: Sala) => {
            // Filtro por sala
            if (filtro.sala) return sala.nome === filtro.sala;
            // Filtro por turma/professor/data
            const reservas: Reserva[] = reservasSalas[sala.id] || [];
            const hoje = new Date().toISOString().split('T')[0];
            const reservasFuturas = reservas.filter((r) => r.data >= hoje);
            if (filtro.turma && !reservasFuturas.some(r => r.turma === filtro.turma)) return false;
            if (filtro.professor && !reservasFuturas.some(r => r.professor === filtro.professor)) return false;
            if (filtro.data && !reservasFuturas.some(r => r.data === filtro.data)) return false;
            return true;
          })
          .map((sala: Sala) => {
          const reservas: Reserva[] = reservasSalas[sala.id] || [];
          const hoje = new Date().toISOString().split('T')[0];
          const reservasFuturas = reservas.filter((r) => r.data >= hoje);
          reservasFuturas.sort((a, b) => {
            if (a.data === b.data) return a.hora_inicio.localeCompare(b.hora_inicio);
            return a.data.localeCompare(b.data);
          });
          return (
            <div key={sala.id} className="sala-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <table className="sala-table">
                  <thead>
                    <tr>
                      <th>Sala</th>
                      <th>Capacidade</th>
                      <th>Andar</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td data-label="Sala">{sala.nome}</td>
<td data-label="Capacidade">{sala.capacidade}</td>
<td data-label="Andar">{sala.andar ?? '-'}</td>
<td data-label="Ações" style={{ textAlign: 'center' }}>
  <button
    className="action-btn-reservar"
    style={{ display: 'block', margin: '0 auto', minWidth: 120 }}
    onClick={() => {
      window.location.href = `/gerencia/salas/reservar/novo/${sala.id}`;
    }}
  >
    Reservar
  </button>
</td>
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
                      <th>Ações</th>
                    </tr>
                  </thead>
                   <tbody>
                    {(() => {
                      // Filtra as reservas futuras conforme os filtros ativos
                      let reservasFiltradas = reservasFuturas;
                      if (filtro.turma) reservasFiltradas = reservasFiltradas.filter(r => r.turma === filtro.turma);
                      if (filtro.professor) reservasFiltradas = reservasFiltradas.filter(r => r.professor === filtro.professor);
                      if (filtro.data) reservasFiltradas = reservasFiltradas.filter(r => r.data === filtro.data);
                      return reservasFiltradas.length > 0 ? reservasFiltradas.map((r: Reserva, idx) => (
                        <tr key={r.id} >
                          <td data-label="Turma">{r.turma}</td>
                          <td data-label="Professor(a)">{r.professor || '-'}</td>
                          <td data-label="Hora início">{r.hora_inicio}</td>
                          <td data-label="Hora fim">{r.hora_termino}</td>
                          <td data-label="Data">{r.data}</td>
                          <td data-label="Ações">
                            <button
                              className="action-btn-edit"
                              onClick={() => {
                                window.location.href = `/gerencia/salas/reservar/editar/${sala.id}/${r.id}`;
                              }}
                            >
                              <span className="lucide-icon" style={{marginRight: 4}}><IconEdit style={{color: 'currentColor', verticalAlign: 'middle', fontSize: 18}} /> </span>Editar
                            </button>
                            <button
                              className="action-btn-delete"
                              onClick={() => {
                                if (window.confirm(`Deseja realmente excluir a Reserva ${r.turma} para o dia ${r.data}?`)) {
                                  handleExcluirReserva(r.id, sala.id);
                                }
                              }}
                            >
                              <span className="lucide-icon" style={{marginRight: 4}}><IconDelete style={{color: 'currentColor', verticalAlign: 'middle', fontSize: 18}} /> </span>Excluir
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={6}>Nenhuma reserva para esta sala</td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>

      );
    }
export default GerenciarSalaReserva;
