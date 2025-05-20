import "./globals.css";
import "../Styles/Layout.css";
import "../Styles/page-transitions.css";
import Header from "@/components/Header";
import { SidebarProvider } from "@/SidebarContext";
import MainLayoutWrapper from "@/components/MainLayoutWrapper";

export const metadata = {
  title: "SGS",
  description: "Gerenciamento de salas, professores e turmas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <SidebarProvider>
          <Header />
          <div className="page-transition-enter page-transition-enter-active">
  <MainLayoutWrapper>{children}</MainLayoutWrapper>
</div>
        </SidebarProvider>
      </body>
    </html>
  );
}


