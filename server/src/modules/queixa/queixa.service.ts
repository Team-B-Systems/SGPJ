import { EstadoProcesso, EstadoQueixa, PrismaClient, TipoDeProcesso, TipoEvento } from "@prisma/client";
import { QueixaDto } from "./dto/registar.dto";
import ApiException from "../../common/Exceptions/api.exception";
import { cadastrar } from "../partepassiva/partepassiva.service";
import { EditarQueixaDto } from "./dto/editar.dto";
import { registerProcess } from "../process/process.service";
import { logEvent } from "../events/events.service";

const prisma = new PrismaClient()

export const cadastrarQueixa = async (dto: QueixaDto) => {
    const funcionario = await prisma.funcionario.findUnique({
        where: { id: dto.pPassivaId }
    });

    if (!funcionario) {
        throw new ApiException(404, "Funcionário não encontrado");
    }
    const partePassiva_ = await cadastrar({ nome: funcionario.nome, funcionario: dto.funcionarioId });

    const currentDate = new Date();

    const newQueixa = await prisma.queixa.create({
        data: {
            dataEntrada: currentDate.toISOString(),
            descricao: dto.descricao,
            estado: dto.estado,
            ficheiro: dto.ficheiro?.buffer ?? undefined,
            pPassivaId: partePassiva_.id,
            funcionarioId: dto.funcionarioId,
            departamentos: {
                create: [
                    {
                        departamento: {
                            connect: { id: funcionario.departamentoId }
                        }
                    }
                ]
            }
        }
    });

    logEvent({
        tipoEvento: TipoEvento.CREATE,
        descricao: `Queixa criada com ID ${newQueixa.id}`,
        entidadeId: newQueixa.id,
        entidade: "Queixa",
        funcionarioId: dto.funcionarioId,
    })

    const { id, ...sanitizedQueixa } = newQueixa
    return sanitizedQueixa
};

export const editar = async (queixaId: number, dto: EditarQueixaDto, userId: number) => {
    console.log("Editando queixa: ", dto);
    const queixa = await prisma.queixa.findUnique({
        where: { id: queixaId }
    });

    if (!queixa) {
        throw new ApiException(404, "Queixa não encontrada");
    }

    if (queixa.estado === EstadoQueixa.EmAnalise && dto.estado === EstadoQueixa.EmAnalise) {
        throw new ApiException(400, "Já se encontra em analise");
    }

    if (queixa.estado === EstadoQueixa.Aceite && dto.estado !== EstadoQueixa.Aceite) {
        throw new ApiException(400, "A queixa já foi aceite e não pode ser editada");
    }
    if (queixa.estado === EstadoQueixa.Rejeitada) {
        throw new ApiException(400, "A queixa já foi rejeitada e não pode ser editada");
    }

    let updateQueixa;

    if (dto.assuntoProcesso && dto.estado === EstadoQueixa.Aceite) {
        const process = await registerProcess(userId, {
            assunto: dto.assuntoProcesso,
            tipo: TipoDeProcesso.Disciplinar,
        });

        updateQueixa = await prisma.queixa.update({
            where: { id: queixaId },
            data: {
                estado: EstadoQueixa.Aceite,
                descricao: dto.descricao,
                ficheiro: dto.ficheiro?.buffer ?? undefined,
                processoId: process.process.id,
            },
        });
    } else {
        updateQueixa = await prisma.queixa.update({
            where: { id: queixaId },
            data: {
                estado: dto.estado,
                descricao: dto.descricao,
                ficheiro: dto.ficheiro?.buffer ?? undefined,
            },
        });
    }

    logEvent({
        tipoEvento: TipoEvento.UPDATE,
        descricao: `Queixa com ID ${queixaId} editada`,
        entidadeId: queixaId,
        entidade: "Queixa",
        funcionarioId: userId,
    });

    const { id, ...sanitizedQueixa } = updateQueixa
    return sanitizedQueixa;

};

export const visualizar = async () => {
    const queixas = await prisma.queixa.findMany({});

    if (!queixas) {
        throw new ApiException(404, "Queixas não encontradas");
    }
    return queixas;
};

export const pesquisarPorId = async (queixaId: number) => {
    const queixa = await prisma.queixa.findUnique({
        where: { id: queixaId }
    });

    if (!queixa) {
        throw new ApiException(404, "Queixa não encontrada");
    }
    const { id, ...sanitizedQueixa } = queixa
    return sanitizedQueixa;
};

export const baixarDocumento = async (queixaId: number) => {
    const queixa = await prisma.queixa.findUnique({
        where: { id: queixaId },
    });

    if (!queixa) {
        throw new ApiException(404, "Documento da queixa não encontrado");
    }

    return queixa;
}