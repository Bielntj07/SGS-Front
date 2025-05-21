"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "./Card";
import { Plus, Pencil, Trash } from "lucide-react";
import "../Styles/AlunosList.css";
import "../Styles/action-buttons.css";
import "../Styles/btn-action-black.css";
import { deleteSala } from "@/service/ServiceSalas";
import { SalaProps } from "@/service/ServiceSalas";
import { useState } from "react";

interface SalasListProps {
  salas: SalaProps[];
}

export default function SalasList({ salas }: SalasListProps) {
  const router = useRouter();
  const [salasList, setSalasList] = useState(salas);

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta sala?")) return;
    try {
      await deleteSala(id);
      setSalasList(salasList.filter(s => s.id !== id));
    } catch (error) {
      alert("Erro ao excluir sala");
    }
  };

  return (
    <div className="alunoslist-container">
      <div className="alunoslist-header">
        <h1 className="alunoslist-title">Lista de Salas</h1>
        <hr style={{border: 'none', borderTop: '1px solid #444', margin: '0.7rem 0 1rem 0'}} />
        <Link href="/salas/novo">
          <button className="action-btn-add">
            <span style={{display:'inline-flex',alignItems:'center',gap:'0.5rem'}}>
              <Plus className="action-btn-icon" size={18} />
              <span style={{color:'#fff',fontWeight:'bold'}}>Adicionar Nova Sala</span>
            </span>
          </button>
        </Link>
      </div>

      <div className="alunoslist-grid">
        {salasList.map((sala) => (
          <Card
            key={sala.id}
            title={sala.nome}
            content={
              <>
                <p>Nome: {sala.nome}</p>
                <p>Capacidade: {sala.capacidade}</p>
                <p>Andar: {sala.andar}</p>
                <p>É Laboratório: {sala.laboratorio ? 'Sim' : 'Não'}</p>
                <p><strong>ID:</strong> {sala.id}</p>
              </>
            }
            actions={
              <div className="alunoslist-actions">
                <Link href={{ pathname: "/salas/editar", query: { id: sala.id } }}>
                  <button className="action-btn-edit">
                    <span style={{display:'inline-flex',alignItems:'center',gap:'0.3rem'}}>
                      <Pencil className="action-btn-icon" size={16} />
                      <span className="action-btn-text">Editar</span>
                    </span>
                  </button>
                </Link>
                <button
  onClick={() => handleDelete(sala.id)}
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
