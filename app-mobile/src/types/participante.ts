export type StatusParticipante = "APROVADO" | "PENDENTE";

export interface Participante {
  id?: string;
  reservaId: string;
  usuarioId?: string; // null para cadastro manual
  nome: string;
  email?: string;
  telefone?: string;
  observacao?: string;
  status: StatusParticipante;
  dataCadastro: string;
}

export type StatusSolicitacao = "PENDENTE" | "APROVADO" | "REJEITADO";

export interface Solicitacao {
  id?: string;
  reservaId: string;
  usuarioId: string;
  status: StatusSolicitacao;
  dataSolicitacao: string;
  dataAprovacao?: string;
  usuarioAprovouId?: string;
  dataRejeicao?: string;
  usuarioRejeitouId?: string;
}
