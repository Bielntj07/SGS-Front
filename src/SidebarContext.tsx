"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

interface SidebarContextType {
  menuAberto: boolean;
  setMenuAberto: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  menuAberto: true,
  setMenuAberto: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [menuAberto, setMenuAberto] = useState(true);
  return (
    <SidebarContext.Provider value={{ menuAberto, setMenuAberto }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
