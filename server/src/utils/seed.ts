import { PrismaClient } from '@prisma/client'
import { hashPassword } from './hash'

const prisma = new PrismaClient()

async function main() {
  // ---------- Departamentos ----------
  await prisma.departamento.createMany({
    data: [
      { nome: 'RecursosHumanos', descricao: 'Departamento de Recursos Humanos' },
      { nome: 'Jurídico', descricao: 'Departamento Jurídico' },
      { nome: 'Financeiro', descricao: 'Departamento Financeiro' },
      { nome: 'TI', descricao: 'Departamento de Tecnologia da Informação' },
    ],
    skipDuplicates: true,
  })

  const departamentos = await prisma.departamento.findMany()
  const depJur = departamentos.find(d => d.nome === 'Jurídico')!
  const depRH = departamentos.find(d => d.nome === 'RecursosHumanos')!
  const depTI = departamentos.find(d => d.nome === 'TI')!

  const hashedPassword = await hashPassword('senha123');

  // ---------- Funcionários ----------
  const [ana, carlos, joao, sofia, miguel] = await Promise.all([
    prisma.funcionario.create({
      data: {
        nome: 'Ana Silva',
        numeroIdentificacao: 'BI12345',
        email: 'ana@empresa.com',
        categoria: 'Técnico',
        senha: hashedPassword,
        estado: 'Ativo',
        role: 'Admin',          // TI sempre Admin
        departamentoId: depTI.id,
      },
    }),
    prisma.funcionario.create({
      data: {
        nome: 'Carlos Pereira',
        numeroIdentificacao: 'BI67890',
        email: 'carlos@empresa.com',
        categoria: 'Técnico',
        senha: hashedPassword,
        estado: 'Ativo',
        role: 'Funcionário',    // Jurídico pode ser responsável
        departamentoId: depJur.id,
      },
    }),
    prisma.funcionario.create({
      data: {
        nome: 'João Santos',
        numeroIdentificacao: 'BI54321',
        email: 'joao@empresa.com',
        categoria: 'Técnico',
        senha: hashedPassword,
        estado: 'Ativo',
        role: 'Chefe',
        departamentoId: depRH.id,
      },
    }),
    prisma.funcionario.create({
      data: {
        nome: 'Sofia Almeida',
        numeroIdentificacao: 'BI99887',
        email: 'sofia@empresa.com',
        categoria: 'Técnico',
        senha: hashedPassword,
        estado: 'Ativo',
        role: 'Funcionário',    // Jurídico
        departamentoId: depJur.id,
      },
    }),
    prisma.funcionario.create({
      data: {
        nome: 'Miguel Costa',
        numeroIdentificacao: 'BI44556',
        email: 'miguel@empresa.com',
        categoria: 'Chefe',
        senha: hashedPassword,
        estado: 'Inativo',
        role: 'Chefe',
        departamentoId: depRH.id,
      },
    }),
  ])

  // ---------- Partes Passivas ----------
  const [parte1, parte2, parte3] = await Promise.all([
    prisma.partePassiva.create({ data: { nome: 'Empresa XYZ' } }),
    prisma.partePassiva.create({ data: { nome: 'Funcionário José Almeida' } }),
    prisma.partePassiva.create({ data: { nome: 'Cliente Maria Sousa' } }),
  ])

  // ---------- Queixas ----------
  const [queixa1, queixa2] = await Promise.all([
    prisma.queixa.create({
      data: {
        dataEntrada: new Date('2025-09-10'),
        descricao: 'Assédio moral relatado por funcionário.',
        estado: 'EmAnalise',
        pPassivaId: parte2.id,
        funcionarioId: carlos.id, // Jurídico
        departamentos: { create: { departamentoId: depJur.id } },
      },
    }),
    prisma.queixa.create({
      data: {
        dataEntrada: new Date('2025-09-11'),
        descricao: 'Disputa contratual com cliente.',
        estado: 'Pendente',
        pPassivaId: parte3.id,
        funcionarioId: joao.id, // RH
        departamentos: { create: { departamentoId: depJur.id } },
      },
    }),
  ])

  // ---------- Processos Jurídicos ----------
  const [proc1, proc2] = await Promise.all([
    prisma.processoJuridico.create({
      data: {
        numeroProcesso: 'PROC-2025-001',
        dataAbertura: new Date(),
        assunto: 'Investigação de assédio moral',
        tipoProcesso: 'Disciplinar',
        estado: 'EmAndamento',
        responsavelId: carlos.id, // Jurídico
        queixaId: queixa1.id,
      },
    }),
    prisma.processoJuridico.create({
      data: {
        numeroProcesso: 'PROC-2025-002',
        dataAbertura: new Date(),
        assunto: 'Litígio com cliente',
        tipoProcesso: 'Cível',
        estado: 'Aberto',
        responsavelId: sofia.id, // Jurídico
        queixaId: queixa2.id,
      },
    }),
  ])

  // ---------- Documentos ----------
  await prisma.documento.createMany({
    data: [
      {
        titulo: 'Ata de Abertura',
        descricao: 'Ata da primeira reunião',
        tipoDocumento: 'Ata',
        ficheiro: Buffer.from(''),
        processoId: proc1.id,
      },
      {
        titulo: 'Contrato em Disputa',
        descricao: 'Contrato fornecido pelo cliente',
        tipoDocumento: 'Prova',
        ficheiro: Buffer.from(''),
        processoId: proc2.id,
      },
    ],
  })

  // ---------- Comissão ----------
  const comissao1 = await prisma.comissao.create({
    data: {
      nome: 'Comissão Disciplinar',
      descricao: 'Comissão para analisar casos de assédio',
      estado: 'Aprovada',
      funcionarios: {
        create: [
          { funcionarioId: ana.id, papel: 'Presidente' },
          { funcionarioId: carlos.id, papel: 'Membro' },
        ],
      },
    },
  })

  // ---------- Reuniões ----------
  await prisma.reuniao.createMany({
    data: [
      {
        dataHora: new Date('2025-09-12T10:00:00'),
        local: 'Sala de reuniões A',
        estado: 'Agendada',
        processoId: proc1.id,
        comissaoId: comissao1.id,
      },
      {
        dataHora: new Date('2025-09-15T14:00:00'),
        local: 'Sala de reuniões B',
        estado: 'Agendada',
        processoId: proc2.id,
        comissaoId: comissao1.id,
      },
    ],
  })

  // ---------- Envolvidos externos ----------
  const envolvido1 = await prisma.envolvido.create({
    data: {
      nome: 'Maria Oliveira',
      numeroIdentificacao: 'CC112233',
      interno: false,
    },
  })
  const envolvido2 = await prisma.envolvido.create({
    data: {
      nome: 'Pedro Lima',
      numeroIdentificacao: 'CC445566',
      interno: false,
    },
  })

  await prisma.envolvidoProcessoJuridico.createMany({
    data: [
      { envolvidoId: envolvido1.id, processoJuridicoId: proc1.id, papelNoProcesso: 'Testemunha' },
      { envolvidoId: envolvido2.id, processoJuridicoId: proc2.id, papelNoProcesso: 'Perito' },
    ],
  })

  // ---------- Decisões ----------
  await prisma.decisao.createMany({
    data: [
      {
        descricao: 'Decisão provisória aguardando mais provas.',
        tipoDecisao: 'Neutra',
        dataDecisao: new Date('2025-09-15'),
        processoId: proc1.id,
      },
      {
        descricao: 'Parecer favorável ao cliente.',
        tipoDecisao: 'Favoravel',
        dataDecisao: new Date('2025-09-20'),
        processoId: proc2.id,
      },
    ],
  })

  // ---------- Pareceres ----------
  await prisma.parecer.createMany({
    data: [
      {
        descricao: 'Parecer jurídico preliminar sobre a queixa.',
        dataEmissao: new Date('2025-09-13'),
        processoId: proc1.id,
      },
      {
        descricao: 'Parecer financeiro sobre litígio.',
        dataEmissao: new Date('2025-09-18'),
        processoId: proc2.id,
      },
    ],
  })

  console.log('✅ Seed concluído com ajustes de roles e responsáveis!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
