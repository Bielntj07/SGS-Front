"use client";
import React from "react";
import { useSidebar } from "@/SidebarContext";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { menuAberto } = useSidebar();
  return <main className={`main-layout${!menuAberto ? ' main-layout-centered' : ''}`}>{children}</main>;
}
