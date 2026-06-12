import { Platform } from "react-native";
import { Participante, Solicitacao } from "../types/participante";
import { Reserva } from "../types/reserva";
import { Usuario } from "../types/usuario";

const BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:3000"
    : Platform.OS === "android"
      ? "http://10.0.2.2:3000"
      : "http://localhost:3000";

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Cache-Control": "no-store",
      "Pragma": "no-cache",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    if (__DEV__) {
      const text = await response.text();
      throw new Error(`API error ${response.status}: ${text}`);
    }
    throw new Error(`Erro na requisição (${response.status})`);
  }

  return response.json() as Promise<T>;
}

function garantirArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

export async function loginUser(
  email: string,
  senha: string
): Promise<Usuario | null> {
  const data = await fetchJson<unknown>(
    `/usuarios?email=${encodeURIComponent(email)}`
  );
  const usuarios = garantirArray<Usuario>(data);
  const usuario = usuarios.find((item) => item.senha === senha);

  return usuario ?? null;
}

export async function findUserByEmail(email: string): Promise<Usuario[]> {
  const data = await fetchJson<unknown>(
    `/usuarios?email=${encodeURIComponent(email)}`
  );

  return garantirArray<Usuario>(data);
}

export async function findUserById(usuarioId: string): Promise<Usuario | null> {
  const data = await fetchJson<unknown>(`/usuarios/${usuarioId}`);

  if (!data || Array.isArray(data)) {
    return null;
  }

  return data as Usuario;
}

export async function createUser(
  nome: string,
  email: string,
  senha: string
): Promise<Usuario> {
  return fetchJson<Usuario>("/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });
}

export async function getReservaPorId(id: string): Promise<Reserva | null> {
  try {
    const data = await fetchJson<unknown>(`/reservas/${id}`);
    if (!data || Array.isArray(data)) return null;
    return data as Reserva;
  } catch {
    return null;
  }
}

export async function getReservasPorGinasio(
  ginasioId: number
): Promise<Reserva[]> {
  const data = await fetchJson<unknown>(`/reservas?ginasioId=${ginasioId}`);

  return garantirArray<Reserva>(data);
}

export async function verificarConflito(
  ginasioId: number,
  quadra: string,
  dia: string,
  horaInicio: string,
  duracao: number,
  reservaIgnoradaId?: string
): Promise<boolean> {
  const reservas = await getReservasPorGinasio(ginasioId);
  const novaReservaInicio = converterHoraParaMinutos(horaInicio);
  const novaReservaFim = novaReservaInicio + duracao;

  return reservas.some((reserva) => {
    const mesmaReserva = reservaIgnoradaId && reserva.id === reservaIgnoradaId;
    const mesmoGinasio = reserva.ginasioId === ginasioId;
    const mesmaQuadra = reserva.quadra === quadra;
    const mesmoDia = reserva.dia === dia;

    if (mesmaReserva || !mesmoGinasio || !mesmaQuadra || !mesmoDia) {
      return false;
    }

    const reservaInicio = converterHoraParaMinutos(reserva.horaInicio);
    const reservaFim = converterHoraParaMinutos(reserva.horaFim);

    return novaReservaInicio < reservaFim && novaReservaFim > reservaInicio;
  });
}

export function converterHoraParaMinutos(hora: string): number {
  const [horas, minutos] = hora.split(":").map(Number);

  return horas * 60 + minutos;
}

export function converterMinutosParaHora(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;

  return `${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function calcularHoraFim(horaInicio: string, duracao: number): string {
  const minutosInicio = converterHoraParaMinutos(horaInicio);
  const minutosFim = minutosInicio + duracao;

  return converterMinutosParaHora(minutosFim);
}

export function calcularValor(duracao: number): number {
  return (duracao / 30) * 50;
}

export function horarioUltrapassaDia(
  horaInicio: string,
  duracao: number
): boolean {
  return converterHoraParaMinutos(horaInicio) + duracao > 23 * 60 + 59;
}

export async function adicionarReserva(reserva: Reserva): Promise<Reserva> {
  return fetchJson<Reserva>("/reservas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reserva),
  });
}

export async function removerReserva(id: string): Promise<void> {
  await fetchJson<void>(`/reservas/${id}`, {
    method: "DELETE",
  });
}

export async function editarReserva(
  id: string,
  reserva: Reserva
): Promise<Reserva> {
  return fetchJson<Reserva>(`/reservas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reserva),
  });
}

export async function getParticipantesPorReserva(
  reservaId: string
): Promise<Participante[]> {
  const data = await fetchJson<unknown>(`/participantes?reservaId=${reservaId}`);

  return garantirArray<Participante>(data);
}

export async function adicionarParticipante(
  participante: Participante
): Promise<Participante> {
  return fetchJson<Participante>("/participantes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(participante),
  });
}

export async function removerParticipante(id: string): Promise<void> {
  await fetchJson<void>(`/participantes/${id}`, {
    method: "DELETE",
  });
}

export async function getSolicitacoesPorReserva(
  reservaId: string
): Promise<Solicitacao[]> {
  const data = await fetchJson<unknown>(`/solicitacoes?reservaId=${reservaId}`);

  return garantirArray<Solicitacao>(data);
}

export async function getSolicitacoesPorUsuario(
  usuarioId: string
): Promise<Solicitacao[]> {
  const data = await fetchJson<unknown>(`/solicitacoes?usuarioId=${usuarioId}`);

  return garantirArray<Solicitacao>(data);
}

export async function temSolicitacaoPendente(
  reservaId: string,
  usuarioId: string
): Promise<boolean> {
  const solicitacoes = await getSolicitacoesPorReserva(reservaId);

  return solicitacoes.some(
    (solicitacao) =>
      solicitacao.usuarioId === usuarioId && solicitacao.status === "PENDENTE"
  );
}

export async function criarSolicitacao(
  reservaId: string,
  usuarioId: string
): Promise<Solicitacao> {
  const solicitacao: Solicitacao = {
    reservaId,
    usuarioId,
    status: "PENDENTE",
    dataSolicitacao: new Date().toISOString(),
  };

  return fetchJson<Solicitacao>("/solicitacoes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(solicitacao),
  });
}

export async function aprovarSolicitacao(
  solicitacaoId: string,
  usuarioAprovouId: string,
  reservaId: string,
  usuarioId: string,
  nomeParticipante: string,
  emailParticipante?: string
): Promise<Participante> {
  await fetchJson<Solicitacao>(`/solicitacoes/${solicitacaoId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "APROVADO",
      dataAprovacao: new Date().toISOString(),
      usuarioAprovouId,
    }),
  });

  const participante: Participante = {
    reservaId,
    usuarioId,
    nome: nomeParticipante,
    email: emailParticipante,
    status: "APROVADO",
    dataCadastro: new Date().toISOString(),
  };

  return fetchJson<Participante>("/participantes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(participante),
  });
}

export async function rejeitarSolicitacao(
  solicitacaoId: string,
  usuarioRejeitouId: string
): Promise<Solicitacao> {
  return fetchJson<Solicitacao>(`/solicitacoes/${solicitacaoId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "REJEITADO",
      dataRejeicao: new Date().toISOString(),
      usuarioRejeitouId,
    }),
  });
}
