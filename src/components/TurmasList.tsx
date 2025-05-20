"use client";

import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import Card from "./Card";
import "../Styles/AlunosList.css";
import "../Styles/action-buttons.css";
import "../Styles/btn-action-black.css";
import { deleteTurma } from "@/service/ServiceTurmas";
import { TurmaProps } from "@/service/ServiceTurmas";
import { useState } from "react";

interface TurmasListProps {
  turmas: TurmaProps[];
}

export default function TurmasList({ turmas }: TurmasListProps) {
  const router = useRouter();
  const [turmasList, setTurmasList] = useState(turmas);

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta turma?")) return;
    try {
      await deleteTurma(id);
      setTurmasList(turmasList.filter(t => t.id !== id));
    } catch (error) {
      alert("Erro ao excluir turma");
    }
  };

  return (
    <div className="alunoslist-container">
      <div className="alunoslist-header">
        <h1 className="alunoslist-title">Lista de Turmas</h1>
        <Link href="/turmas/novo">
          <button className="action-btn-add">
            <span style={{display:'inline-flex',alignItems:'center',gap:'0.5rem'}}>
              <Plus className="action-btn-icon" size={18} />
              <span style={{color:'#fff',fontWeight:'bold'}}>Adicionar Nova Turma</span>
            </span>
          </button>
        </Link>
      </div>

      <div className="alunoslist-grid">
        {turmasList.map((turma) => (
          <Card
            key={turma.id}
            title={turma.nome}
            content={
              <>
                <p>Nome: {turma.nome}</p>
                <span><strong>ID:</strong> {turma.id}</span>
              </>
            }
            actions={
              <div className="alunoslist-actions">
                <Link href={{ pathname: "/turmas/editar", query: { id: turma.id } }}>
                  <button className="action-btn-edit">
                    <span style={{display:'inline-flex',alignItems:'center',gap:'0.3rem'}}>
                      <Pencil className="action-btn-icon" size={16} />
                      <span className="action-btn-text">Editar</span>
                    </span>
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(turma.id)}
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
