import { PrismaClient } from "@prisma/client";
import { EditDTO } from "./dto/edit.dto";
import ApiException from "src/common/Exceptions/api.exception";

const prisma = new PrismaClient();

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

    return sanitizedUser;
}