// components/AlunosList.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "./Card";
import { Plus, Pencil, Trash } from "lucide-react";
import "../Styles/AlunosList.css";
import "../Styles/action-buttons.css";
import "../Styles/btn-action-black.css";

import { deleteAluno } from "@/service/ServiceAlunos";
import { AlunoProps } from "@/service/ServiceAlunos";
import { TurmaProps, getTurmas } from "@/service/ServiceTurmas";

interface AlunosListProps {
  alunos: AlunoProps[];
}

import { useState, useEffect } from "react";

export default function AlunosList({ alunos }: AlunosListProps) {
  const [turmas, setTurmas] = useState<TurmaProps[]>([]);

  useEffect(() => {
    async function fetchTurmas() {
      try {
        const turmasData = await getTurmas();
        setTurmas(turmasData);
      } catch (error) {
        setTurmas([]);
      }
    }
    fetchTurmas();
  }, []);
  const router = useRouter();

  const [alunosList, setAlunosList] = useState(alunos);

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este aluno?")) return;
    try {
      await deleteAluno(id);
      setAlunosList(alunosList.filter(a => a.id !== id));
    } catch (error) {
      alert("Erro ao excluir aluno");
    }
  };

  return (
    <div className="alunoslist-container">
      <div className="alunoslist-header">
        <h1 className="alunoslist-title">Lista de Alunos</h1>
        <hr style={{border: 'none', borderTop: '1px solid #444', margin: '0.7rem 0 1rem 0'}} />
        <Link href="/alunos/novo">
          <button className="action-btn-add">
            <span style={{display:'inline-flex',alignItems:'center',gap:'0.5rem'}}>
              <Plus className="action-btn-icon" size={18} />
              <span style={{color:'#fff',fontWeight:'bold'}}>Adicionar Novo Aluno</span>
            </span>
          </button>
        </Link>
      </div>

      <div className="alunoslist-grid">
        {alunosList.map((aluno) => (
          <Card
            key={aluno.id}
            title={aluno.nome}
            content={
              <div className="card-description">
                <span><strong>Nome:</strong> {aluno.nome}</span>
                <span><strong>Email:</strong>&nbsp;<span className="card-value">{aluno.email}</span></span>
                <span><strong>Turma:</strong> {turmas.find(t => t.id === aluno.turma_id)?.nome || "Sem turma"}</span>
<span><strong>ID:</strong> {aluno.id}</span>
              </div>
            }
            actions={
              <div className="alunoslist-actions">
                <Link href={{ pathname: "/alunos/editar", query: { id: aluno.id } }}>
  <button className="action-btn-edit">
    <span style={{display:'inline-flex',alignItems:'center',gap:'0.3rem'}}>
      <Pencil className="action-btn-icon" size={16} />
      <span className="action-btn-text">Editar</span>
    </span>
  </button>
</Link>
                <button
  onClick={() => handleDelete(aluno.id)}
  className="action-btn-delete"
>
  <span style={{display:'inline-flex',alignItems:'center',gap:'0.3rem'}}>
    <Trash className="action-btn-icon" size={16} />
    <span className="action-btn-text">Excluir</span>
  </span>
</button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}
