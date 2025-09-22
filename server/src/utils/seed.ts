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
  const depFin = departamentos.find(d => d.nome === 'Financeiro')!

  const hashedPassword = await hashPassword('senha123')

  // ---------- Funcionários ----------
  const [ana, carlos, joao, sofia, miguel, beatriz] = await Promise.all([
    prisma.funcionario.create({
      data: {
        nome: 'Ana Silva',
        numeroIdentificacao: 'BI12345',
        email: 'ana@empresa.com',
        categoria: 'Técnico',
        senha: hashedPassword,
        estado: 'Ativo',
        role: 'Admin', // TI Admin
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
        role: 'Funcionário', // Jurídico
        departamentoId: depJur.id,
      },
    }),
    prisma.funcionario.create({
      data: {
        nome: 'João Santos',
        numeroIdentificacao: 'BI54321',
        email: 'joao@empresa.com',
        categoria: 'Chefe',
        senha: hashedPassword,
        estado: 'Ativo',
        role: 'Chefe', // RH
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
        role: 'Funcionário', // Jurídico
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
        role: 'Chefe', // RH
        departamentoId: depRH.id,
      },
    }),
    prisma.funcionario.create({
      data: {
        nome: 'Beatriz Nunes',
        numeroIdentificacao: 'BI11223',
        email: 'beatriz@empresa.com',
        categoria: 'Técnico',
        senha: hashedPassword,
        estado: 'Ativo',
        role: 'Funcionário', // Financeiro
        departamentoId: depFin.id,
      },
    }),
  ])

  // ---------- Partes Passivas ----------
  const [parte1, parte2, parte3, parte4, parte5] = await Promise.all([
    prisma.partePassiva.create({ data: { nome: 'Empresa XYZ' } }),
    prisma.partePassiva.create({ data: { nome: 'Funcionário José Almeida' } }),
    prisma.partePassiva.create({ data: { nome: 'Cliente Maria Sousa' } }),
    prisma.partePassiva.create({ data: { nome: 'Fornecedor ABC Lda' } }),
    prisma.partePassiva.create({ data: { nome: 'Sindicato dos Trabalhadores' } }),
  ])

  // ---------- Queixas ----------
  const [queixa1, queixa2, queixa3, queixa4, queixa5] = await Promise.all([
    prisma.queixa.create({
      data: {
        dataEntrada: new Date('2025-09-10'),
        descricao: 'Assédio moral relatado por funcionário.',
        estado: 'EmAnalise',
        pPassivaId: parte2.id,
        funcionarioId: carlos.id,
        departamentos: { create: { departamentoId: depJur.id } },
      },
    }),
    prisma.queixa.create({
      data: {
        dataEntrada: new Date('2025-09-11'),
        descricao: 'Disputa contratual com cliente.',
        estado: 'Pendente',
        pPassivaId: parte3.id,
        funcionarioId: joao.id,
        departamentos: { create: { departamentoId: depJur.id } },
      },
    }),
    prisma.queixa.create({
      data: {
        dataEntrada: new Date('2025-09-12'),
        descricao: 'Suspeita de fraude contábil.',
        estado: 'Aceite',
        pPassivaId: parte1.id,
        funcionarioId: beatriz.id,
        departamentos: { create: { departamentoId: depFin.id } },
      },
    }),
    prisma.queixa.create({
      data: {
        dataEntrada: new Date('2025-09-13'),
        descricao: 'Processo trabalhista movido pelo sindicato.',
        estado: 'EmAnalise',
        pPassivaId: parte5.id,
        funcionarioId: joao.id,
        departamentos: { create: { departamentoId: depRH.id } },
      },
    }),
    prisma.queixa.create({
      data: {
        dataEntrada: new Date('2025-09-14'),
        descricao: 'Problema administrativo interno.',
        estado: 'Pendente',
        pPassivaId: parte4.id,
        funcionarioId: ana.id,
        departamentos: { create: { departamentoId: depTI.id } },
      },
    }),
  ])

  // ---------- Processos Jurídicos ----------
  const [proc1, proc2, proc3, proc4, proc5] = await Promise.all([
    prisma.processoJuridico.create({
      data: {
        numeroProcesso: 'PROC-2025-001',
        dataAbertura: new Date(),
        assunto: 'Investigação de assédio moral',
        tipoProcesso: 'Disciplinar',
        estado: 'EmAndamento',
        responsavelId: carlos.id,
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
        responsavelId: sofia.id,
        queixaId: queixa2.id,
      },
    }),
    prisma.processoJuridico.create({
      data: {
        numeroProcesso: 'PROC-2025-003',
        dataAbertura: new Date(),
        assunto: 'Fraude contábil detectada',
        tipoProcesso: 'Criminal',
        estado: 'Aberto',
        responsavelId: beatriz.id,
        queixaId: queixa3.id,
      },
    }),
    prisma.processoJuridico.create({
      data: {
        numeroProcesso: 'PROC-2025-004',
        dataAbertura: new Date(),
        assunto: 'Ação trabalhista coletiva',
        tipoProcesso: 'Laboral',
        estado: 'EmAndamento',
        responsavelId: joao.id,
        queixaId: queixa4.id,
      },
    }),
    prisma.processoJuridico.create({
      data: {
        numeroProcesso: 'PROC-2025-005',
        dataAbertura: new Date(),
        assunto: 'Irregularidades administrativas',
        tipoProcesso: 'Administrativo',
        estado: 'Aberto',
        responsavelId: ana.id,
        queixaId: queixa5.id,
      },
    }),
  ])

  // ---------- Documentos ----------
  await prisma.documento.createMany({
    data: [
      { titulo: 'Ata de Abertura', descricao: 'Ata da primeira reunião', tipoDocumento: 'Ata', ficheiro: Buffer.from(''), processoId: proc1.id },
      { titulo: 'Contrato em Disputa', descricao: 'Contrato fornecido pelo cliente', tipoDocumento: 'Prova', ficheiro: Buffer.from(''), processoId: proc2.id },
      { titulo: 'Relatório Financeiro', descricao: 'Análise das contas da empresa', tipoDocumento: 'Relatório', ficheiro: Buffer.from(''), processoId: proc3.id },
      { titulo: 'Ata de Reunião Trabalhista', descricao: 'Discussão com sindicato', tipoDocumento: 'Ata', ficheiro: Buffer.from(''), processoId: proc4.id },
      { titulo: 'Relatório Administrativo', descricao: 'Falhas internas reportadas', tipoDocumento: 'Relatório', ficheiro: Buffer.from(''), processoId: proc5.id },
    ],
  })

  // ---------- Comissões ----------
  const comissao1 = await prisma.comissao.create({
    data: {
      nome: 'Comissão Disciplinar',
      descricao: 'Análise de casos de assédio',
      estado: 'Aprovada',
      funcionarios: {
        create: [
          { funcionarioId: ana.id, papel: 'Presidente' },
          { funcionarioId: carlos.id, papel: 'Membro' },
        ],
      },
    },
  })

  const comissao2 = await prisma.comissao.create({
    data: {
      nome: 'Comissão de Auditoria',
      descricao: 'Apuração de fraudes contábeis',
      estado: 'Aprovada',
      funcionarios: {
        create: [
          { funcionarioId: beatriz.id, papel: 'Membro' },
          { funcionarioId: sofia.id, papel: 'Membro' },
        ],
      },
    },
  })

  // ---------- Reuniões ----------
  await prisma.reuniao.createMany({
    data: [
      { dataHora: new Date('2025-09-12T10:00:00'), local: 'Sala A', estado: 'Agendada', processoId: proc1.id, comissaoId: comissao1.id },
      { dataHora: new Date('2025-09-15T14:00:00'), local: 'Sala B', estado: 'Agendada', processoId: proc2.id, comissaoId: comissao1.id },
      { dataHora: new Date('2025-09-18T09:00:00'), local: 'Sala C', estado: 'Agendada', processoId: proc3.id, comissaoId: comissao2.id },
    ],
  })

  // ---------- Envolvidos externos ----------
  const [envolvido1, envolvido2, envolvido3] = await Promise.all([
    prisma.envolvido.create({ data: { nome: 'Maria Oliveira', numeroIdentificacao: 'CC112233', interno: false } }),
    prisma.envolvido.create({ data: { nome: 'Pedro Lima', numeroIdentificacao: 'CC445566', interno: false } }),
    prisma.envolvido.create({ data: { nome: 'Ricardo Lopes', numeroIdentificacao: 'CC778899', interno: false } }),
  ])

  await prisma.envolvidoProcessoJuridico.createMany({
    data: [
      { envolvidoId: envolvido1.id, processoJuridicoId: proc1.id, papelNoProcesso: 'Testemunha' },
      { envolvidoId: envolvido2.id, processoJuridicoId: proc2.id, papelNoProcesso: 'Perito' },
      { envolvidoId: envolvido3.id, processoJuridicoId: proc3.id, papelNoProcesso: 'Réu' },
    ],
  })

  // ---------- Decisões ----------
  await prisma.decisao.createMany({
    data: [
      { descricao: 'Decisão provisória aguardando mais provas.', tipoDecisao: 'Neutra', dataDecisao: new Date('2025-09-15'), processoId: proc1.id },
      { descricao: 'Parecer favorável ao cliente.', tipoDecisao: 'Favoravel', dataDecisao: new Date('2025-09-20'), processoId: proc2.id },
      { descricao: 'Decisão desfavorável por falta de provas.', tipoDecisao: 'Desfavoravel', dataDecisao: new Date('2025-09-22'), processoId: proc3.id },
    ],
  })

  // ---------- Pareceres ----------
  await prisma.parecer.createMany({
    data: [
      { descricao: 'Parecer jurídico preliminar sobre a queixa.', dataEmissao: new Date('2025-09-13'), processoId: proc1.id },
      { descricao: 'Parecer financeiro sobre litígio.', dataEmissao: new Date('2025-09-18'), processoId: proc2.id },
      { descricao: 'Parecer contábil sobre fraude.', dataEmissao: new Date('2025-09-21'), processoId: proc3.id },
    ],
  })

  console.log('✅ Seed concluído com 5 processos e dados completos!')
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
  