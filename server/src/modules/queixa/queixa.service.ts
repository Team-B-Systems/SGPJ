import { EstadoQueixa, PrismaClient } from "@prisma/client";
import { QueixaDto } from "./dto/registar.dto";
import ApiException from "../../common/Exceptions/api.exception";
import { cadastrar } from "../partepassiva/partepassiva.service";
import { EditarQueixaDto } from "./dto/editar.dto";

const prisma = new PrismaClient()

export const cadastrarQueixa = async (dto: QueixaDto) => {
    const funcionario = await prisma.funcionario.findUnique({
        where: { id: dto.pPassivaId }
    });

    if (!funcionario) {
        throw new ApiException(404, "Funcionário não encontrado");
    }
    const partePassiva_ = await cadastrar({ nome: funcionario.nome, funcionario: dto.funcionarioId });


    const newQueixa = await prisma.queixa.create({
        data: {
            dataEntrada: dto.dataEntrada,
            descricao: dto.descricao,
            estado: dto.estado,
            ficheiro: dto.ficheiro?.buffer ?? undefined,
            processoId: dto.processoId ?? undefined,
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

    const { id, ...sanitizedQueixa } = newQueixa
    return sanitizedQueixa
};

export const editar = async (queixaId: number, dto: EditarQueixaDto) => {
    console.log("Editando queixa: ",dto);
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

    const updateQueixa = await prisma.queixa.update({
        where: { id: queixaId },
        data: {
            estado: dto.estado,
            descricao: dto.descricao,
            ficheiro: dto.ficheiro?.buffer ?? undefined,
        },
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