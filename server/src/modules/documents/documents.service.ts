import { EstadoProcesso, PrismaClient, Role, TipoDocumento } from "@prisma/client";
import ApiException from "../../common/Exceptions/api.exception";
import { AttachDocumentDTO } from "./dto/attach.dto";

const prisma = new PrismaClient();

export const anexarDocumento = async (userId: number, dto: AttachDocumentDTO) => {
    // Find the process by ID

    const processo = await prisma.processoJuridico.findUnique({
        where: { id: parseInt(dto.processoId.toString()), responsavelId: userId },
    });

    if (!processo) {
        throw new ApiException(404, "Processo não encontrado ou acesso negado");
    }

    if (processo.estado === EstadoProcesso.Arquivado) {
        throw new ApiException(400, "Não é possível anexar documentos a um processo arquivado");
    }

    // Store the BLOB file in the database
    const documento = await prisma.documento.create({
        data: {
            titulo: `${dto.titulo}-${dto.ficheiro.originalname}`,
            descricao: dto.descricao,
            tipoDocumento: dto.tipoDocumento,
            ficheiro: dto.ficheiro.buffer,
            processoId: processo.id,
        },
    });

    if (dto.tipoDocumento === TipoDocumento.Decisão) {
        await prisma.processoJuridico.update({
            where: { id: processo.id },
            data: { estado: EstadoProcesso.Arquivado },
        });
    }

    const { ficheiro, ...documentoSemFicheiro } = documento

    return {
        documento: documentoSemFicheiro,
        message: "Documento anexado com sucesso",
    }
}

export const listarDocumentosPorProcesso = async (processoId: number, userId: number) => {
    const processo = await prisma.processoJuridico.findUnique({
        where: { id: processoId, responsavelId: userId },
    });

    if (!processo) {
        throw new ApiException(404, "Processo não encontrado ou acesso negado");
    }

    const documentos = await prisma.documento.findMany({
        where: { processoId: processo.id },
    });

    return documentos.map((doc) => {
        const { ficheiro, ...docSemFicheiro } = doc;

        return {
            ...docSemFicheiro,
            tamanho: `${(ficheiro.length / 1024).toFixed(2)} KB`,
        }
    });
}

export const baixarDocumento = async (documentoId: number, userId: number) => {
    const documento = await prisma.documento.findUnique({
        where: { id: documentoId },
        include: {
            processo: true,
        },
    });

    if (!documento) {
        throw new ApiException(404, "Documento não encontrado");
    }

    if (documento.processo.responsavelId !== userId) {
        throw new ApiException(403, "Acesso negado ao documento");
    }

    return documento;
}
