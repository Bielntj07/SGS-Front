// Redireciona para uma rota 404 ou para a página de gerenciamento de salas caso acesse /novo sem id
export default function NotFoundRedirect() {
  if (typeof window !== 'undefined') {
    window.location.href = '/gerencia/salas';
  }
  return null;
}
