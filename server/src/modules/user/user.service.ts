import { PrismaClient } from "@prisma/client";
import { EditDTO } from "./dto/edit.dto";
import ApiException from "../../common/Exceptions/api.exception";

const prisma = new PrismaClient();

export const getProfile = async (id: number) => {
    const user = await prisma.funcionario.findUnique({ where: { id } });

    if (!user) {
        throw new ApiException(404, "Utilizador não encontrado");
    }

    const { senha, ...sanitizedUser } = user;

    return {
        ...sanitizedUser,
        twoFactorSecret: user.twoFactorSecret ? true : false,
    };
}

export const editProfile = async (id: number, dto: EditDTO) => {
    // Lógica para editar o perfil do usuário
    const findUser = await prisma.funcionario.findUnique({ where: { id } });

    if (!findUser) {
        throw new ApiException(404, "Utilizador não encontrado");
    }

    const updatedUser = await prisma.funcionario.update({
        where: { id },
        data: {
            nome: dto.nome ?? findUser.nome,
        }
    });

    const { senha, ...sanitizedUser } = updatedUser;

    return updatedUser;
}