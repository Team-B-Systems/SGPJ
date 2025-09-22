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
  id?: string;
  email: string;
  role: string;
  createdAt: string; // vem como string ISO do backend
  updatedAt: string;
  nome: string;
  numeroIdentificacao: string;
  categoria: string;
  estado: string;
  departamento: string;
  senha: string;
  twoFactorSecret: boolean; // true se 2FA está ativo
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
  tamanho: number;
  tipoDocumento: string;
}

export interface Envolvido {
  id: number;
  createdAt: string;
  updatedAt: string;
  envolvidoId: number;           // referência ao envolvido
  processoJuridicoId: number;   // id do processo associado
  papelNoProcesso: string;
  envolvido: {
    id: number;
    createdAt: string;
    updatedAt: string;
    nome: string;
    numeroIdentificacao: string;
    funcionarioId?: number;     // se for um funcionário interno
    interno: boolean;           // true se for funcionário interno
  };
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
  id?: number;
  createdAt: string;
  updatedAt: string;
  local: string;
  estado: string;
  documento?: Documento;
  comissao: Comissao;
  dataHora: string;
  processoId: number;
}

export interface Queixa {
  id?: number;
  descricao: string;
  estado: string;
  dataEntrada: string;
  ficheiro: File | null;
  processoId?: number;
  pPassivaId: number;
  funcionarioId: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TwoFAResponse {
  requires2FA: true;
  tempToken: string;
  user: User;
}

export interface GetFuncionariosResponse {
  funcionarios: User[];
}

export interface ProcessoListResponse {
  processes: Processo[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface EventoSistema {
  id: number;
  createdAt: Date;
  funcionarioId: number | null;
  entidade: string;
  entidadeId: number | null;
  tipoEvento: string;
  descricao: string;
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

export type LoginResponse = AuthResponse | TwoFAResponse;

export async function login(data: {
  email: string;
  password: string;
  isAdmin: boolean;
}): Promise<LoginResponse> {
  let endpoint: string;
  if (data.isAdmin) {
    endpoint = "/admin/login";
  } else {
    endpoint = "/auth/login";
  }

  const response = await api.post(endpoint, {
    email: data.email,
    senha: data.password,
  });

  // Se o backend avisar que precisa de 2FA
  if (response.data.requires2FA) {
    const result: TwoFAResponse = {
      requires2FA: true,
      tempToken: response.data.tempToken,
      user: response.data.user,
    };
    return result;
  }

  // Caso contrário → login normal
  localStorage.setItem("access_token", response.data.token);

  const result: AuthResponse = {
    token: response.data.token,
    user: response.data.user,
  };

  return result;
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>("/auth/change-password", {
    oldPassword,
    newPassword,
  });

  return response.data;
}

export const generate2FASecret = async (): Promise<{ qrCodeUrl: string; secret: string }> => {
  const response = await api.post<{ qrCodeUrl: string; secret: string }>("/auth/2fa/generate");

  return response.data;
}

export const verify2FA = async (tempToken: string, code: string): Promise<{ token: string }> => {
  const response = await api.post<{ token: string }>("/auth/2fa/verify", { tempToken, code });

  localStorage.setItem("access_token", response.data.token);

  return response.data;
}

// --------- PERFIL ---------
export async function getFuncionarioPerfil(): Promise<User> {
  const response = await api.get<User>("/funcionario/perfil");
  return response.data;
}

export async function updateFuncionarioPerfil(data: Partial<User>): Promise<User> {
  const response = await api.patch("/funcionario/perfil", data);
  return response.data.user;
}

export async function getAdminPerfil(): Promise<User> {
  const response = await api.get<User>("/admin/perfil");
  return response.data;
}

export async function updateAdminPerfil(data: Partial<User>): Promise<User> {
  const response = await api.patch<User>("/admin/editarperfil", data);
  return response.data;
}

// --------- FUNCIONARIOS (ADMIN) ---------
export async function createFuncionario(data: User): Promise<User> {
  try {
    const response = await api.post("/admin/cadastrarfuncionario", data);
    return response.data;
  } catch (err: any) {
    throw err;
  }
}

export async function updateFuncionario(id: string, data: Partial<User>): Promise<User> {
  try {
    const response = await api.patch<User>(`/admin/editarperfil`, data);
    return response.data;
  } catch (err: any) {
    throw err;
  }

}

export async function getFuncionario(): Promise<User[]> {
  const response = await api.get<User[]>("/admin/visualizarfuncionarios");
  return response.data;
}

export async function searchFuncionario(email: string): Promise<User> {
  const response = await api.patch<User>("/admin/pesquisarfuncionario", { email });
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

// ======= Queixas =======
export async function getQueixas(): Promise<Queixa[]> {
  const response = await api.get<Queixa[]>("/queixa/visualizar");
  return response.data;
}

export async function createQueixa(data: Queixa): Promise<Queixa> {

  const response = await api.post<Queixa>("/queixa/cadastrar", data);
  return response.data;
}

export async function editQueixa(id: number, data: Partial<Queixa | any>): Promise<Queixa> {
  const fd = new FormData();
  if (data.descricao) fd.append("descricao", data.descricao);
  if (data.estado) fd.append("estado", data.estado);
  if (data.dataEntrada) fd.append("dataEntrada", data.dataEntrada);
  if (data.ficheiro) fd.append("ficheiro", data.ficheiro);
  if (data.pPassivaId !== undefined) fd.append("pPassivaId", data.pPassivaId.toString());
  if (data.assuntoProcesso !== undefined) fd.append("assuntoProcesso", data.assuntoProcesso);
  if (data.funcionarioId !== undefined) fd.append("funcionarioId", data.funcionarioId.toString());

  const response = await api.patch<Queixa>(`/queixa/editar/${id}`, fd, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}

export async function downloadQueixaFile(id: number): Promise<Blob> {
  const response = await api.get<Blob>(`/queixa/downloadDocumento/${id}`, {
    responseType: 'blob',
  });
  return response.data;
}

// --------- PARTES ENVOLVIDAS ---------

// Interface equivalente ao DTO do backend
export interface AdicionarParteDTO {
  processoId: number;
  nome: string;
  numeroIdentificacao: string;
  papel: string; // ou enum se quiseres tipar igual ao backend
}

// Função para adicionar parte envolvida
export async function addParteEnvolvida(
  dto: AdicionarParteDTO
): Promise<{ message: string; parteEnvolvida: any }> {
  const response = await api.post<{ message: string; parteEnvolvida: any }>(
    "/parteenvolvido/add",
    dto
  );
  return response.data;
}

export const removeParteEnvolvida = async (
  processoId: number,
  parteEnvolvidaId: number
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/parteenvolvido/remove/${processoId}/${parteEnvolvidaId}`
  );
  return response.data;
};

export async function attachDocument(data: {
  processoId: number;
  titulo: string;
  descricao?: string;
  tipoDocumento: string;
  ficheiro: File;
}): Promise<{ message: string; documento: Documento }> {
  const formData = new FormData();

  formData.append("processoId", data.processoId.toString());
  formData.append("titulo", data.titulo);
  if (data.descricao) formData.append("descricao", data.descricao);
  formData.append("tipoDocumento", data.tipoDocumento);
  formData.append("ficheiro", data.ficheiro);

  const response = await api.post<{ message: string; documento: Documento }>(
    "/documents/attach",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function downloadDocument(id: number): Promise<Blob> {
  const response = await api.get(`/documents/download/${id}`, {
    responseType: "blob", // 👈 garante que vem como ficheiro binário
  });

  return response.data;
}

export default api;

// --------- EVENTOS SISTEMA ---------
export const getAllEventosSistema = async (page: number = 1, pageSize: number = 10): Promise<EventoSistema[]> => {
  const response = await api.get<EventoSistema[]>(`/events/list`);

  console.log("Eventos do sistema:", response.data);

  return response.data;
}
