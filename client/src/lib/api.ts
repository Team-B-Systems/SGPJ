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

export interface Processo {
  id: number;
  createdAt: string;
  updatedAt: string;
  numeroProcesso: string;
  dataAbertura: string;
  assunto: string;
  tipoProcesso: string;
  estado: string;
  dataEncerramento: string | null;
  responsavel: User;
  documentos: Documento[];
  parecer: Documento | null;
  envolvidos: Envolvido[];
  reunioes: Reuniao[];
}

export interface Documento {
  id: number;
  createdAt: string;
  updatedAt: string;
  titulo: string;
  descricao: string;
  tamanho: string;
  tipoDocumento: string;
}

export interface Envolvido {
  id: number;
  createdAt: string;
  updatedAt: string;
  envolvidoId: number;
  processoJuridicoId: number;
  envolvido: {
    id: number;
    createdAt: string;
    updatedAt: string;
    nome: string;
    numeroIdentificacao: string;
    papelNoProcesso: string;
  }
}

interface Comissao {
  id: number;
  createdAt: string;
  updatedAt: string;
  nome: string;
  descricao: string;
  estado: string;
  dataEncerramento: string;
  funcionarios: {
    id: number;
    createdAt: string;
    updatedAt: string;
    comissaoId: number;
    funcionarioId: number;
    papel: string;
    funcionario: User;
  }[];
}

export interface Reuniao {
  id: number;
  createdAt: string;
  updatedAt: string;
  local: string;
  estado: string;
  documento?: Documento;
  comissao: Comissao;
  dataHora: string;
  processoId: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ProcessoListResponse {
  processes: Processo[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
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

export const getProcessos = async (
  page: number = 1,
  pageSize: number = 10
): Promise<ProcessoListResponse> => {
  const response = await api.get<ProcessoListResponse>(
    `/process/list?page=${page}&pageSize=${pageSize}`
  );
  return response.data;
};

export async function registerProcess(data: {
  assunto: string;
  tipo: string;
}): Promise<{
  process: Processo;
  message: string;
}> {
  const response = await api.post("/process/register", data);

  return response.data;
}

export async function editProcess(
  processId: number,
  data: {
    assunto?: string;
    tipoProcesso?: string;
    estado?: string;
  }
): Promise<{
  process: Processo;
  message: string;
}> {
  const response = await api.patch(`/process/edit/${processId}`, data);
  return response.data;
}

export default api;
