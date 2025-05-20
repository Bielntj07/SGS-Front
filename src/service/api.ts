//usar onrender
export const API_URL = "http://127.0.0.1:8000/api";

export const fetchData = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${API_URL}/${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`Erro ao buscar ${endpoint}: ${response.statusText}`);
  }

  return response.json();
};
