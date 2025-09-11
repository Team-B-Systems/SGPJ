import { EstadoProcesso, PrismaClient } from "@prisma/client";
import ApiException from "../../common/Exceptions/api.exception";
import { RegisterDTO } from "./dto/register.dto";
import { EditDTO } from "./dto/edit.dto";
import { ArchiveDTO } from "./dto/archive.dto";

const prisma = new PrismaClient();

// Register a juridic process

export const registerProcess = async (userId: number, dto: RegisterDTO) => {
    // Generate a process number. Eg.: 2025/{ProcessType}/{UUID}}
    const processNumber = `2025-${dto.tipo}-${crypto.randomUUID()}`;

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

export const listProcesses = async (userId: number, page: number = 1, pageSize: number = 10, filter?: { estado?: EstadoProcesso, tipoProcesso?: string }) => {
    const skip = (page - 1) * pageSize;
    const whereClause: any = { responsavelId: userId };

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
        }),
        prisma.processoJuridico.count({ where: whereClause }),
    ]);

    return {
        processes,
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

    return {
        process: archivedProcess,
        message: "Processo arquivado com sucesso",
    };
}
