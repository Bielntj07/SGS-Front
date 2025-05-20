//usar onrender
export const API_URL = "http://127.0.0.1:8000/api";

export const fetchData = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${API_URL}/${endpoint}`, options);

  if (!response.ok) {
    let errorMsg = response.statusText;
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorData.message || errorMsg;
    } catch (e) {
      // Se não for JSON, mantém o statusText
    }
    throw new Error(errorMsg);
  }

  return response.json();
};
