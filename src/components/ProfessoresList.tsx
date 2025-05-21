"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "./Card";
import { Plus, Pencil, Trash } from "lucide-react";
import "../Styles/AlunosList.css";
import "../Styles/action-buttons.css";
import "../Styles/btn-action-black.css";
import { deleteProfessor } from "@/service/ServiceProfessores";
import { ProfessorProps } from "@/service/ServiceProfessores";
import { useState } from "react";

interface ProfessoresListProps {
  professores: ProfessorProps[];
}

export default function ProfessoresList({ professores }: ProfessoresListProps) {
  const router = useRouter();
  const [professoresList, setProfessoresList] = useState(professores);

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este professor?")) return;
    try {
      await deleteProfessor(id);
      setProfessoresList(professoresList.filter(p => p.id !== id));
    } catch (error) {
      alert("Erro ao excluir professor");
    }
  };

  return (
    <div className="alunoslist-container">
      <div className="alunoslist-header">
        <h1 className="alunoslist-title">Lista de Professores</h1>
        <hr style={{border: 'none', borderTop: '1px solid #444', margin: '0.7rem 0 1rem 0'}} />
        <Link href="/professores/novo">
          <button className="action-btn-add">
            <span style={{display:'inline-flex',alignItems:'center',gap:'0.5rem'}}>
              <Plus className="action-btn-icon" size={18} />
              <span style={{color:'#fff',fontWeight:'bold'}}>Adicionar Novo Professor</span>
            </span>
          </button>
        </Link>
      </div>

      <div className="alunoslist-grid">
        {professoresList.map((professor) => (
          <Card
            key={professor.id}
            title={professor.nome}
            content={
              <>
                <p>Nome: {professor.nome}</p>
                <p>Email: {professor.email}</p>
                
                <p><strong>ID:</strong> {professor.id}</p>
              </>
            }
            actions={
              <div className="alunoslist-actions">
                <Link href={{ pathname: "/professores/editar", query: { id: professor.id } }}>
                  <button className="action-btn-edit">
                    <span style={{display:'inline-flex',alignItems:'center',gap:'0.3rem'}}>
                      <Pencil className="action-btn-icon" size={16} />
                      <span className="action-btn-text">Editar</span>
                    </span>
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(professor.id)}
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
