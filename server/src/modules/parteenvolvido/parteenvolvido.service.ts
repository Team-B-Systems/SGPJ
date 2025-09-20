import { Envolvido, Funcionario, PrismaClient } from "@prisma/client";
import { AdicionarDTO } from "./dto/adicionar.dto";
import ApiException from "../../common/Exceptions/api.exception";

const prisma = new PrismaClient();

export const adicionarParteEnvolvida = async (userId: number, dto: AdicionarDTO) => {
    const processo = await prisma.processoJuridico.findUnique({
        where: { id: dto.processoId, responsavelId: userId },
        include: {
            responsavel: true,
        }
    });

    if (!processo) {
        throw new ApiException(404, "Processo não encontrado ou acesso negado");
    }

    if (processo.dataEncerramento) {
        throw new ApiException(400, "Não é possível adicionar partes envolvidas a um processo encerrado");
    }

    if (processo.responsavelId !== userId) {
        throw new ApiException(403, "Acesso negado: você não é o responsável por este processo");
    }

    const alreadyInProcess = await prisma.envolvidoProcessoJuridico.findFirst({
        where: {
            processoJuridicoId: dto.processoId,
            envolvido: { numeroIdentificacao: dto.numeroIdentificacao }
        }
    });

    if (alreadyInProcess) {
        throw new ApiException(400, "Parte envolvida já associada a este processo");
    }

    const funcionario = await prisma.funcionario.findUnique({
    where: { numeroIdentificacao: dto.numeroIdentificacao },
  });

    const result = await prisma.$transaction(async (tx) => {
    let envolvido: Envolvido | null = null;

    if (funcionario) {
      // funcionário
      envolvido = await tx.envolvido.findFirst({
        where: { funcionarioId: funcionario.id },
      });

      if (!envolvido) {
        envolvido = await tx.envolvido.create({
          data: {
            nome: funcionario.nome,
            numeroIdentificacao: funcionario.numeroIdentificacao,
            funcionarioId: funcionario.id,
            interno: true,
          },
        });
      }
    } else {
      // externo
      envolvido = await tx.envolvido.findFirst({
        where: { numeroIdentificacao: dto.numeroIdentificacao },
      });

      if (!envolvido) {
        envolvido = await tx.envolvido.create({
          data: {
            nome: dto.nome,
            numeroIdentificacao: dto.numeroIdentificacao,
          },
        });
      }
    }

    // 5️⃣ Cria o registro de relação com o processo
    const envolvidoProcesso = await tx.envolvidoProcessoJuridico.create({
      data: {
        processoJuridicoId: dto.processoId,
        envolvidoId: envolvido.id,
        papelNoProcesso: dto.papel,
      },
    });

    await tx.eventoSistema.create({
      data: {
        funcionarioId: userId,
        entidade: "EnvolvidoProcessoJuridico",
        entidadeId: envolvidoProcesso.id,
        tipoEvento: "CREATE",
        descricao: `O funcionário ${userId} adicionou o envolvido '${envolvido.nome}' (ID ${envolvido.id}) ao processo '${processo.numeroProcesso}' com papel '${dto.papel}'.`,
      },
    })

    return { envolvido, envolvidoProcesso };
  });

  return {
    message: "Parte envolvida adicionada com sucesso",
    parteEnvolvida: result.envolvido,
    relacionamento: result.envolvidoProcesso,
  };
}

export const listarPartesEnvolvidas = async (userId: number, processoId: number, isChefe: boolean = false) => {
    const processo = await prisma.processoJuridico.findUnique({
        where: { id: processoId },
    });

    if (!processo) {
        throw new ApiException(404, "Processo não encontrado");
    }

    if (!isChefe && processo.responsavelId !== userId) {
        throw new ApiException(403, "Acesso negado: você não é o responsável por este processo");
    }

    const partesEnvolvidas = await prisma.envolvidoProcessoJuridico.findMany({
        where: { processoJuridicoId: processoId },
        include: { envolvido: true },
    });

    return partesEnvolvidas.map(pe => pe.envolvido);
}

export const removerParteEnvolvida = async (userId: number, processoId: number, parteEnvolvidaId: number) => {
    const processo = await prisma.processoJuridico.findUnique({
        where: { id: processoId, responsavelId: userId },
    });

    if (!processo) {
        throw new ApiException(404, "Processo não encontrado ou acesso negado");
    }

    const parteEnvolvida = await prisma.envolvidoProcessoJuridico.findFirst({
        where: {
            processoJuridicoId: processoId,
            envolvidoId: parteEnvolvidaId,
        },
    });

    if (!parteEnvolvida) {
        throw new ApiException(404, "Parte envolvida não encontrada neste processo");
    }

    await prisma.envolvidoProcessoJuridico.delete({
        where: { id: parteEnvolvida.id },
    });

    return { message: "Parte envolvida removida com sucesso" };
}
