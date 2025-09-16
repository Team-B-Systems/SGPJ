// Mock data for the SGPJ system

export interface Processo {
  id: string;
  numeroProcesso: string;
  titulo: string;
  descricao: string;
  status: 'ativo' | 'arquivado' | 'pendente';
  dataAbertura: string;
  dataUltimaAtualizacao: string;
  responsavel: string;
  categoria: string;
  prioridade: 'baixa' | 'media' | 'alta';
}

export interface Documento {
  id: string;
  titulo: string;
  descricao: string;
  tipoDocumento: string;
  processoId: string;
  nomeArquivo: string;
  tamanho: string;
  dataUpload: string;
  uploadedBy: string;
}

export interface Reuniao {
  id: string;
  processoId: string;
  titulo: string;
  data: string;
  hora: string;
  local: string;
  pauta: string;
  ataAnexada: boolean;
  participantes: string[];
  status: 'agendada' | 'realizada' | 'cancelada';
}

export interface Envolvido {
  id: string;
  processoId: string;
  nome: string;
  tipo: 'interno' | 'externo';
  parte: 'ativa' | 'passiva';
  cargo?: string;
  contato: string;
  email: string;
}

export interface Queixa {
  id: string;
  titulo: string;
  descricao: string;
  requerente: string;
  dataAbertura: string;
  status: 'aberta' | 'em_analise' | 'resolvida';
  prioridade: 'baixa' | 'media' | 'alta';
}

export interface Comissao {
  id: string;
  nome: string;
  descricao: string;
  dataFormacao: string;
  status: 'ativa' | 'inativa';
  membros: string[];
  responsavel: string;
}

export interface Funcionario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  status: 'ativo' | 'inativo';
  perfil: 'funcionario' | 'chefe' | 'administrador';
}

// Mock data
export const mockProcessos: Processo[] = [
  {
    id: '1',
    numeroProcesso: '2024-001-JUR',
    titulo: 'Ação Trabalhista - Silva vs Empresa XYZ',
    descricao: 'Processo relativo a reclamatória trabalhista por horas extras não pagas',
    status: 'ativo',
    dataAbertura: '2024-01-15',
    dataUltimaAtualizacao: '2024-01-20',
    responsavel: 'João Silva',
    categoria: 'Trabalhista',
    prioridade: 'alta'
  },
  {
    id: '2',
    numeroProcesso: '2024-002-JUR',
    titulo: 'Contrato de Prestação de Serviços',
    descricao: 'Análise e elaboração de contrato de prestação de serviços',
    status: 'pendente',
    dataAbertura: '2024-01-10',
    dataUltimaAtualizacao: '2024-01-18',
    responsavel: 'Maria Santos',
    categoria: 'Contratual',
    prioridade: 'media'
  },
  {
    id: '3',
    numeroProcesso: '2024-003-JUR',
    titulo: 'Consultoria Jurídica - Compliance',
    descricao: 'Consultoria sobre adequação às normas de compliance',
    status: 'arquivado',
    dataAbertura: '2023-12-05',
    dataUltimaAtualizacao: '2024-01-05',
    responsavel: 'Carlos Admin',
    categoria: 'Consultoria',
    prioridade: 'baixa'
  }
];

export const mockDocumentos: Documento[] = [
  {
    id: '1',
    titulo: 'Petição Inicial',
    descricao: 'Petição inicial da ação trabalhista',
    tipoDocumento: 'Petição',
    processoId: '1',
    nomeArquivo: 'peticao_inicial_silva.pdf',
    tamanho: '2.5 MB',
    dataUpload: '2024-01-15',
    uploadedBy: 'João Silva'
  },
  {
    id: '2',
    titulo: 'Contrato Original',
    descricao: 'Contrato de trabalho original do requerente',
    tipoDocumento: 'Contrato',
    processoId: '1',
    nomeArquivo: 'contrato_silva.pdf',
    tamanho: '1.2 MB',
    dataUpload: '2024-01-16',
    uploadedBy: 'João Silva'
  },
  {
    id: '3',
    titulo: 'Minuta do Contrato',
    descricao: 'Primeira versão da minuta do contrato',
    tipoDocumento: 'Minuta',
    processoId: '2',
    nomeArquivo: 'minuta_contrato_v1.pdf',
    tamanho: '1.8 MB',
    dataUpload: '2024-01-12',
    uploadedBy: 'Maria Santos'
  }
];

export const mockReunioes: Reuniao[] = [
  {
    id: '1',
    processoId: '1',
    titulo: 'Reunião de Estratégia - Caso Silva',
    data: '2024-01-25',
    hora: '14:00',
    local: 'Sala de Reuniões A',
    pauta: 'Discussão sobre estratégia de defesa e próximos passos',
    ataAnexada: true,
    participantes: ['João Silva', 'Maria Santos'],
    status: 'agendada'
  },
  {
    id: '2',
    processoId: '2',
    titulo: 'Revisão do Contrato',
    data: '2024-01-22',
    hora: '10:00',
    local: 'Sala de Reuniões B',
    pauta: 'Revisão das cláusulas do contrato de prestação de serviços',
    ataAnexada: false,
    participantes: ['Maria Santos', 'Carlos Admin'],
    status: 'realizada'
  }
];

export const mockEnvolvidos: Envolvido[] = [
  {
    id: '1',
    processoId: '1',
    nome: 'Pedro Silva',
    tipo: 'externo',
    parte: 'ativa',
    contato: '(11) 99999-9999',
    email: 'pedro.silva@email.com'
  },
  {
    id: '2',
    processoId: '1',
    nome: 'Empresa XYZ Ltda',
    tipo: 'externo',
    parte: 'passiva',
    contato: '(11) 88888-8888',
    email: 'contato@empresaxyz.com'
  },
  {
    id: '3',
    processoId: '1',
    nome: 'João Silva',
    tipo: 'interno',
    parte: 'ativa',
    cargo: 'Advogado Sênior',
    contato: '(11) 91234-5678',
    email: 'joao@sgpj.com'
  },
  {
    id: '4',
    processoId: '2',
    nome: 'Cliente ABC',
    tipo: 'externo',
    parte: 'ativa',
    contato: '(11) 77777-7777',
    email: 'contato@clienteabc.com'
  },
  {
    id: '5',
    processoId: '2',
    nome: 'Maria Santos',
    tipo: 'interno',
    parte: 'ativa',
    cargo: 'Chefe de Departamento',
    contato: '(11) 91234-9876',
    email: 'maria@sgpj.com'
  },
  {
    id: '6',
    processoId: '3',
    nome: 'Consultoria Legal Ltda',
    tipo: 'externo',
    parte: 'ativa',
    contato: '(11) 66666-6666',
    email: 'contato@consultorialegal.com'
  },
  {
    id: '7',
    processoId: '3',
    nome: 'Carlos Admin',
    tipo: 'interno',
    parte: 'ativa',
    cargo: 'Administrador do Sistema',
    contato: '(11) 91234-4321',
    email: 'admin@sgpj.com'
  }
];

export const mockQueixas: Queixa[] = [
  {
    id: '1',
    titulo: 'Demora no atendimento',
    descricao: 'Cliente reclama de demora excessiva no atendimento de solicitação',
    requerente: 'Ana Paula Costa',
    dataAbertura: '2024-01-20',
    status: 'em_analise',
    prioridade: 'media'
  },
  {
    id: '2',
    titulo: 'Erro na documentação',
    descricao: 'Identificado erro na elaboração de documento legal',
    requerente: 'Roberto Lima',
    dataAbertura: '2024-01-18',
    status: 'resolvida',
    prioridade: 'alta'
  }
];

export const mockComissoes: Comissao[] = [
  {
    id: '1',
    nome: 'Comissão de Ética',
    descricao: 'Comissão responsável pela análise de questões éticas',
    dataFormacao: '2024-01-01',
    status: 'ativa',
    membros: ['Maria Santos', 'Carlos Admin', 'João Silva'],
    responsavel: 'Maria Santos'
  },
  {
    id: '2',
    nome: 'Comissão de Compliance',
    descricao: 'Comissão para adequação às normas de compliance',
    dataFormacao: '2023-12-01',
    status: 'ativa',
    membros: ['Carlos Admin', 'Maria Santos'],
    responsavel: 'Carlos Admin'
  }
];

export const mockFuncionarios: Funcionario[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@sgpj.com',
    cargo: 'Advogado Sênior',
    departamento: 'Jurídico',
    dataAdmissao: '2023-03-15',
    status: 'ativo',
    perfil: 'funcionario'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria@sgpj.com',
    cargo: 'Chefe de Departamento',
    departamento: 'Jurídico',
    dataAdmissao: '2022-01-10',
    status: 'ativo',
    perfil: 'chefe'
  },
  {
    id: '3',
    nome: 'Carlos Admin',
    email: 'admin@sgpj.com',
    cargo: 'Administrador do Sistema',
    departamento: 'TI',
    dataAdmissao: '2021-05-20',
    status: 'ativo',
    perfil: 'administrador'
  }
];