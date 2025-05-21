"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/SidebarContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../Styles/Sidebar.css";
import "../Styles/action-buttons.css";
import { Menu, X, Home, GraduationCap, Users, BookOpen, Building2, Sun, Moon, ChevronLeft } from "lucide-react";

export default function Header() {
  const { menuAberto, setMenuAberto } = useSidebar();
  const router = useRouter();
  const handleCloseSidebar = (href: string) => {
    if (isMobile) setMenuAberto(false);
    router.push(href);
  }
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
          style={{ marginTop: 18 }}
          onClick={() => setMenuAberto(true)}
          aria-label="Abrir menu lateral"
        >
          <Menu size={36} />
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
          <button className="sidebar-link sidebar-main-link" onClick={() => handleCloseSidebar("/")}>
            <Home size={18} /> Home
          </button>

          <div className="sidebar-group">
            <span className="sidebar-group-title">Cadastrar</span>
            <button className="sidebar-link sidebar-sublink" onClick={() => handleCloseSidebar("/alunos")}> 
              <GraduationCap size={18} /> Alunos
            </button>
            <button className="sidebar-link sidebar-sublink" onClick={() => handleCloseSidebar("/professores")}> 
              <Users size={18} /> Professores
            </button>
            <button className="sidebar-link sidebar-sublink" onClick={() => handleCloseSidebar("/turmas")}> 
              <BookOpen size={18} /> Turmas
            </button>
            <Link href="/salas" className="sidebar-link sidebar-sublink">
              <Building2 size={18} /> Salas
            </Link>
          </div>

          <div className="sidebar-group">
            <span className="sidebar-group-title">Gerenciar</span>
            <button className="sidebar-link sidebar-sublink" onClick={() => handleCloseSidebar("/gerencia/salas")}> 
              <Building2 size={18} /> Salas
            </button>
          </div>

          <div className="sidebar-group">
            <span className="sidebar-group-title">Consulta</span>
            <button className="sidebar-link sidebar-sublink" onClick={() => handleCloseSidebar("/consulta/salas")}> 
              <Building2 size={18} /> Salas
            </button>
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
