"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/SidebarContext";
import Link from "next/link";
import "../Styles/Sidebar.css";
import "../Styles/action-buttons.css";
import { Menu, X, Home, GraduationCap, Users, BookOpen, Building2, Sun, Moon, ChevronLeft } from "lucide-react";

export default function Header() {
  const { menuAberto, setMenuAberto } = useSidebar();
  const [lightMode, setLightMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile dinamicamente
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 767);
    }
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      // Estado inicial do menu
      setMenuAberto(window.innerWidth > 767);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [setMenuAberto]);

  // Atualiza o body para modo claro/escuro
  React.useEffect(() => {
    if (lightMode) {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  }, [lightMode]);

  return (
    <>
      {/* Mobile menu button */}
      {/* Overlay só em mobile */}
      {menuAberto && isMobile && (
        <div
          className="sidebar-overlay"
          style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.32)',zIndex:99,display:'block'}}
          onClick={() => setMenuAberto(false)}
          aria-label="Fechar menu lateral"
        />
      )}
      {!menuAberto && isMobile && (
        <button
          className="sidebar-toggle"
          onClick={() => setMenuAberto(true)}
          aria-label="Abrir menu lateral"
        >
          <Menu size={26} />
        </button>
      )}

      {/* Sidebar */}
      <aside className={`sidebar${menuAberto ? " open" : ""}${lightMode ? " light" : ""}`}>
        <div className="sidebar-header">
          {menuAberto && isMobile && (
            <button
              className="header-sidebar-close-btn"
              onClick={() => setMenuAberto(false)}
              style={{ marginLeft: 8 }}
            >
              <ChevronLeft size={22} />
            </button>
          )}
          <span className="sidebar-title">SGS</span>
        </div>
        <nav className="sidebar-nav">
          <Link href="/" className="sidebar-link">
            <Home size={20} /> Home
          </Link>

          <div className="sidebar-group">
            <span className="sidebar-group-title">Cadastrar</span>
            <Link href="/alunos" className="sidebar-link sidebar-sublink">
              <GraduationCap size={18} /> Alunos
            </Link>
            <Link href="/professores" className="sidebar-link sidebar-sublink">
              <Users size={18} /> Professores
            </Link>
            <Link href="/turmas" className="sidebar-link sidebar-sublink">
              <BookOpen size={18} /> Turmas
            </Link>
            <Link href="/salas" className="sidebar-link sidebar-sublink">
              <Building2 size={18} /> Salas
            </Link>
          </div>

          <div className="sidebar-group">
            <span className="sidebar-group-title">Gerenciar</span>
            <Link href="/gerencia/salas" className="sidebar-link sidebar-sublink">
              <Building2 size={18} /> Salas
            </Link>
          </div>

          <div className="sidebar-group">
            <span className="sidebar-group-title">Consulta</span>
            <Link href="/consulta/salas" className="sidebar-link sidebar-sublink">
              <Building2 size={18} /> Salas
            </Link>
          </div>
        </nav>
        <footer className="sidebar-footer">
          <button className="sidebar-toggle" onClick={() => setLightMode((v) => !v)} title="Alternar modo claro/escuro">
            {lightMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <div className="sidebar-footer-text">SGS - Sistema de Gerenciamento de Salas © 2025</div>
        </footer>
      </aside>
    </>
  );
}
