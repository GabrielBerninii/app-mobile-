export interface Reserva {
  id?: string;
  ginasioId: number;
  ginasioNome: string;
  quadra: string;
  nomeResponsavel: string;
  dia: string;
  horaInicio: string;
  duracao: number; // em minutos
  horaFim: string;
  valorTotal: number;
  usuarioId?: string; // ID do dono da reserva
}

export interface Ginasio {
  id: number;
  nome: string;
}
