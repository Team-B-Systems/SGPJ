export enum TipoDeProcesso {
  Disciplinar = "Disciplinar",
  Laboral = "Laboral",
  Administrativo = "Administrativo",
  Cível = "Cível",
  Criminal = "Criminal",
}

export enum EnvolvidoPapelNoProcesso {
  Autor = "Autor",
  Testemunha = "Testemunha",
  Perito = "Perito",
  Outro = "Outro",
  Réu = "Réu",
}

// mapa de papéis por tipo de processo
export const papeisPorTipo: Record<TipoDeProcesso, EnvolvidoPapelNoProcesso[]> = {
  [TipoDeProcesso.Disciplinar]: [EnvolvidoPapelNoProcesso.Autor, EnvolvidoPapelNoProcesso.Réu, EnvolvidoPapelNoProcesso.Testemunha, EnvolvidoPapelNoProcesso.Perito, EnvolvidoPapelNoProcesso.Outro],
  [TipoDeProcesso.Laboral]: [EnvolvidoPapelNoProcesso.Autor, EnvolvidoPapelNoProcesso.Réu, EnvolvidoPapelNoProcesso.Testemunha, EnvolvidoPapelNoProcesso.Perito, EnvolvidoPapelNoProcesso.Outro],
  [TipoDeProcesso.Administrativo]: [EnvolvidoPapelNoProcesso.Autor, EnvolvidoPapelNoProcesso.Testemunha, EnvolvidoPapelNoProcesso.Perito, EnvolvidoPapelNoProcesso.Outro],
  [TipoDeProcesso.Cível]: [EnvolvidoPapelNoProcesso.Autor, EnvolvidoPapelNoProcesso.Réu, EnvolvidoPapelNoProcesso.Testemunha, EnvolvidoPapelNoProcesso.Perito, EnvolvidoPapelNoProcesso.Outro],
  [TipoDeProcesso.Criminal]: [EnvolvidoPapelNoProcesso.Autor, EnvolvidoPapelNoProcesso.Réu, EnvolvidoPapelNoProcesso.Testemunha, EnvolvidoPapelNoProcesso.Perito, EnvolvidoPapelNoProcesso.Outro],
};
