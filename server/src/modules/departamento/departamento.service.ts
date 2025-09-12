import { PrismaClient } from "@prisma/client";
import {DepartamentoDto } from "./dto/registar.dto";

const prisma = new PrismaClient()

export const cadastrarDepartamento = async (dto: DepartamentoDto) => {
    const newDepartamento = await prisma.departamento.create({
        data: {
            nome: dto.nome,
            descricao: dto.descricao,
        }
    });
    return newDepartamento
};
