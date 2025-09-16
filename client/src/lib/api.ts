import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --------- TYPES ---------
export interface User {
  email: string;
  role: string;
  createdAt: string; // vem como string ISO do backend
  updatedAt: string;
  nome: string;
  numeroIdentificacao: string;
  categoria: string;
  estado: string;
  departamentoId: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// --------- AUTH ---------
export async function signup(data: {
  nome: string;
  email: string;
  password: string;
  numeroIdentificacao: string;
  categoria: string;
  departamentoId: number;
}): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/signup", data);
  localStorage.setItem("access_token", response.data.token);
  return response.data;
}

export async function login(data: {
  email: string;
  password: string;
  isAdmin: boolean;
}): Promise<AuthResponse> {
    let endpoint: string;
  if (data.isAdmin) {
    endpoint = "/admin/login";
  } else {
    endpoint = "/auth/login";
  }

    const response = await api.post<AuthResponse>(endpoint, {
    email: data.email,
    senha: data.password,
  });

  localStorage.setItem("access_token", response.data.token);

  return response.data;
}

// --------- PERFIL ---------
export async function getFuncionarioPerfil(): Promise<User> {
  const response = await api.get<User>("/funcionario/perfil");
  return response.data;
}

export async function updateFuncionarioPerfil(data: Partial<User>): Promise<User> {
  const response = await api.patch<User>("/funcionario/perfil", data);
  return response.data;
}

export async function getAdminPerfil(): Promise<User> {
  const response = await api.get<User>("/admin/perfil");
  return response.data;
}

export async function updateAdminPerfil(data: Partial<User>): Promise<User> {
  const response = await api.patch<User>("/admin/editarperfil", data);
  return response.data;
}

export default api;
