import { EstadoProcesso, PrismaClient, Reuniao, TipoEvento } from "@prisma/client";
import ApiException from "../../common/Exceptions/api.exception";
import { RegisterDTO } from "./dto/register.dto";
import { EditDTO } from "./dto/edit.dto";
import { ArchiveDTO } from "./dto/archive.dto";
import { logEvent } from "../events/events.service";

const prisma = new PrismaClient();

// Register a juridic process

export const registerProcess = async (userId: number, dto: RegisterDTO) => {
    // Generate a process number. Eg.: 2025/{ProcessType}/{Count + 123456}}
    const currentYear = new Date().getFullYear();

    const count = await prisma.processoJuridico.count({
        where: {
            dataAbertura: {
                gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
            },
        },
    });


    const processNumber = `2025-${dto.tipo}-${count.toString().padStart(9, "0")}`;

    const newProcess = await prisma.processoJuridico.create({
        data: {
            numeroProcesso: processNumber,
            assunto: dto.assunto,
            tipoProcesso: dto.tipo,
            responsavelId: userId,
            estado: EstadoProcesso.Aberto,
            dataAbertura: new Date(),
        },
    });

    logEvent({
        tipoEvento: TipoEvento.CREATE,
        descricao: `Processo criado com ID ${newProcess.id}`,
        entidadeId: newProcess.id,
        entidade: "Processo",
        funcionarioId: userId,
    })

    return {
        process: newProcess,
        message: "Processo registrado com sucesso",
    };
}

export const editProcess = async (userId: number, processId: number, dto: EditDTO) => {
    const existingProcess = await prisma.processoJuridico.findUnique({
        where: { id: processId, responsavelId: userId },
    });

    if (!existingProcess) {
        throw new ApiException(404, "Processo não encontrado ou você não tem permissão para editá-lo");
    }

    const updatedProcess = await prisma.processoJuridico.update({
        where: { id: processId },
        data: {
            assunto: dto.assunto ?? existingProcess.assunto,
            tipoProcesso: dto.tipoProcesso ?? existingProcess.tipoProcesso,
            estado: dto.estado ?? existingProcess.estado,
            dataEncerramento: dto.estado === EstadoProcesso.Arquivado ? new Date() : existingProcess.dataEncerramento,
        },
    });

    logEvent({
        tipoEvento: TipoEvento.UPDATE,
        descricao: `Processo com ID ${processId} editado`,
        entidadeId: processId,
        entidade: "Processo",
        funcionarioId: userId,
    })

    return {
        process: updatedProcess,
        message: "Processo atualizado com sucesso",
    };
}

export const getProcessById = async (processId: number) => {
    const process = await prisma.processoJuridico.findUnique({
        where: { id: processId },
    });

    if (!process) {
        throw new ApiException(404, "Processo não encontrado");
    }

    return process;
}

export const getProcessByNumber = async (userId: number, processNumber: string) => {
    const process = await prisma.processoJuridico.findFirst({
        where: { numeroProcesso: processNumber, responsavelId: userId },
    });

    if (!process) {
        throw new ApiException(404, "Processo não encontrado ou você não tem permissão para visualizá-lo");
    }

    return process;
}

export const listProcesses = async (userId: number, isChefe: boolean, page: number = 1, pageSize: number = 10, filter?: { estado?: EstadoProcesso, tipoProcesso?: string }) => {
    const skip = (page - 1) * pageSize;
    const whereClause: any = isChefe ? {} : { responsavelId: userId };

    if (filter) {
        if (filter.estado) {
            whereClause.estado = filter.estado;
        }
        if (filter.tipoProcesso) {
            whereClause.tipoProcesso = filter.tipoProcesso;
        }
    }

    const [processes, total] = await Promise.all([
        prisma.processoJuridico.findMany({
            where: whereClause,
            skip,
            take: pageSize,
            orderBy: { dataAbertura: 'desc' },
            select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                numeroProcesso: true,
                dataAbertura: true,
                assunto: true,
                tipoProcesso: true,
                estado: true,
                dataEncerramento: true,
                responsavel: true,
                documentos: {
                    select: {
                        id: true,
                        createdAt: true,
                        updatedAt: true,
                        titulo: true,
                        descricao: true,
                        ficheiro: true,
                        tipoDocumento: true,
                    }
                },
                parecer: true,
                envolvidos: {
                    include: {
                        envolvido: true
                    }
                },
                reunioes: {
                    select: {
                        id: true,
                        createdAt: true,
                        updatedAt: true,
                        local: true,
                        estado: true,
                        documento: true,
                        dataHora: true,
                        processoId: true,
                        comissao: {
                            select: {
                                id: true,
                                createdAt: true,
                                updatedAt: true,
                                nome: true,
                                dataCriacao: true,
                                descricao: true,
                                estado: true,
                                dataEncerramento: true,
                                funcionarios: {
                                    include: {
                                        funcionario: true,
                                    }
                                },
                            }
                        },
                    },
                },
            },
        }),
        prisma.processoJuridico.count({ where: whereClause }),
    ]);

    const response = processes.map(processo => ({
        ...processo,
        documentos: processo.documentos.map(({ ficheiro, ...doc }) => ({
            ...doc,
            tamanho: ficheiro?.length ?? 0,
        })),
    }));

    return {
        processes: response,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}

export const archiveProcess = async (userId: number, processId: number, dto: ArchiveDTO) => {
    const existingProcess = await prisma.processoJuridico.findUnique({
        where: { id: processId, responsavelId: userId },
    });

    if (!existingProcess) {
        throw new ApiException(404, "Processo não encontrado ou você não tem permissão para arquivá-lo");
    }

    if (existingProcess.estado === EstadoProcesso.Arquivado) {
        throw new ApiException(400, "Processo já está arquivado");
    }

    const currentDate = new Date();

    const parecer = await prisma.parecer.create({
        data: {
            descricao: dto.parecer,
            dataEmissao: currentDate,
            processoId: processId,
        }
    });

    logEvent({
        tipoEvento: TipoEvento.CREATE,
        descricao: `Parecer criado com ID ${parecer.id} para o processo ID ${processId}`,
        entidadeId: parecer.id,
        entidade: "Parecer",
        funcionarioId: userId,
    })

    const archivedProcess = await prisma.processoJuridico.update({
        where: { id: processId },
        data: {
            estado: EstadoProcesso.Arquivado,
            dataEncerramento: currentDate,
            parecer: {
                connect: { id: parecer.id }
            },
        },
    });

    logEvent({
        tipoEvento: TipoEvento.UPDATE,
        descricao: `Processo com ID ${processId} arquivado`,
        entidadeId: processId,
        entidade: "Processo",
        funcionarioId: userId,
    })

    return {
        process: archivedProcess,
        message: "Processo arquivado com sucesso",
    };
}
