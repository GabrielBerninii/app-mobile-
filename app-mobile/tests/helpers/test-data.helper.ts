import { APIRequestContext, expect } from "@playwright/test";

export const API_URL = process.env.PLAYWRIGHT_API_URL || "http://localhost:3000";

export const usuariosTeste = {
  dono: {
    id: "e2e-owner",
    nome: "Dono E2E",
    email: "dono.e2e@example.com",
    senha: "12345678",
  },
  visitante: {
    id: "e2e-visitor",
    nome: "Visitante E2E",
    email: "visitante.e2e@example.com",
    senha: "12345678",
  },
};

export const reservasTeste = {
  principal: {
    id: "e2e-reserva-principal",
    ginasioId: 1,
    ginasioNome: "Ginásio Poliesportivo Dom Bosco",
    quadra: "Quadra 1",
    nomeResponsavel: "Dono E2E",
    dia: "20/06/2026",
    horaInicio: "09:00",
    duracao: 60,
    horaFim: "10:00",
    valorTotal: 100,
    usuarioId: usuariosTeste.dono.id,
  },
  outroGinasio: {
    id: "e2e-reserva-outro-ginasio",
    ginasioId: 2,
    ginasioNome: "Ginásio Poliesportivo São Domingos",
    quadra: "Quadra 1",
    nomeResponsavel: "Dono E2E",
    dia: "20/06/2026",
    horaInicio: "09:00",
    duracao: 60,
    horaFim: "10:00",
    valorTotal: 100,
    usuarioId: usuariosTeste.dono.id,
  },
};

export const participanteTeste = {
  id: "e2e-participante-aprovado",
  reservaId: reservasTeste.principal.id,
  nome: "Participante Seed",
  email: "participante.seed@example.com",
  status: "APROVADO",
  dataCadastro: "2026-06-11T12:00:00.000Z",
};

export const solicitacaoPendenteTeste = {
  id: "e2e-solicitacao-pendente",
  reservaId: reservasTeste.principal.id,
  usuarioId: usuariosTeste.visitante.id,
  status: "PENDENTE",
  dataSolicitacao: "2026-06-11T12:30:00.000Z",
};

const recursos = ["solicitacoes", "participantes", "reservas", "usuarios"];
const idsTeste = [
  usuariosTeste.dono.id,
  usuariosTeste.visitante.id,
  reservasTeste.principal.id,
  reservasTeste.outroGinasio.id,
  participanteTeste.id,
  solicitacaoPendenteTeste.id,
  "e2e-reserva-criada",
  "e2e-participante-manual",
  "e2e-solicitacao-criada",
  "e2e-cadastro-novo",
];

type RegistroJson = {
  id?: string | number;
  email?: string;
  nome?: string;
  nomeResponsavel?: string;
  ginasioNome?: string;
  reservaId?: string;
  usuarioId?: string;
};

export const idsAtuaisTeste = {
  dono: usuariosTeste.dono.id,
  visitante: usuariosTeste.visitante.id,
  reservaPrincipal: reservasTeste.principal.id,
  reservaOutroGinasio: reservasTeste.outroGinasio.id,
  participante: participanteTeste.id,
  solicitacaoPendente: solicitacaoPendenteTeste.id,
};

async function deleteSeExistir(request: APIRequestContext, recurso: string, id: string) {
  const response = await request.delete(`${API_URL}/${recurso}/${id}`);

  expect([200, 204, 404]).toContain(response.status());
}

async function listarRegistros(
  request: APIRequestContext,
  recurso: string
): Promise<RegistroJson[]> {
  const response = await request.get(`${API_URL}/${recurso}`);

  expect(response.ok()).toBeTruthy();

  return (await response.json()) as RegistroJson[];
}

async function deletarRegistros(
  request: APIRequestContext,
  recurso: string,
  deveDeletar: (registro: RegistroJson) => boolean
) {
  const registros = await listarRegistros(request, recurso);
  const registrosTeste = registros.filter((registro) => registro.id && deveDeletar(registro));

  for (const registro of registrosTeste) {
    await deleteSeExistir(request, recurso, String(registro.id));
  }
}

async function criarRegistro(
  request: APIRequestContext,
  recurso: string,
  payload: Record<string, unknown>
): Promise<RegistroJson> {
  const response = await request.post(`${API_URL}/${recurso}`, { data: payload });

  expect([200, 201]).toContain(response.status());

  return (await response.json()) as RegistroJson;
}

export async function limparDadosE2E(request: APIRequestContext) {
  for (const recurso of recursos) {
    for (const id of idsTeste) {
      await deleteSeExistir(request, recurso, id);
    }
  }

  await deletarRegistros(request, "solicitacoes", (registro) => {
    return (
      registro.reservaId === reservasTeste.principal.id ||
      registro.usuarioId === usuariosTeste.visitante.id
    );
  });

  await deletarRegistros(request, "participantes", (registro) => {
    return (
      registro.reservaId === reservasTeste.principal.id ||
      registro.email === participanteTeste.email ||
      registro.email === "manual.e2e@example.com"
    );
  });

  await deletarRegistros(request, "reservas", (registro) => {
    return (
      registro.nomeResponsavel === reservasTeste.principal.nomeResponsavel ||
      registro.nomeResponsavel === reservasTeste.outroGinasio.nomeResponsavel ||
      registro.nomeResponsavel === "Reserva Criada E2E" ||
      registro.nomeResponsavel === "Reserva Conflito E2E" ||
      registro.nomeResponsavel === "Quadra Diferente E2E"
    );
  });

  await deletarRegistros(request, "usuarios", (registro) => {
    return (
      registro.email === usuariosTeste.dono.email ||
      registro.email === usuariosTeste.visitante.email ||
      registro.email === "novo.e2e@example.com" ||
      registro.nome === "Novo Usuario E2E"
    );
  });
}

export async function semearDadosE2E(request: APIRequestContext) {
  await limparDadosE2E(request);

  const dono = await criarRegistro(request, "usuarios", usuariosTeste.dono);
  const visitante = await criarRegistro(request, "usuarios", usuariosTeste.visitante);

  idsAtuaisTeste.dono = String(dono.id);
  idsAtuaisTeste.visitante = String(visitante.id);

  const reservaPrincipal = await criarRegistro(request, "reservas", {
    ...reservasTeste.principal,
    usuarioId: idsAtuaisTeste.dono,
  });
  const reservaOutroGinasio = await criarRegistro(request, "reservas", {
    ...reservasTeste.outroGinasio,
    usuarioId: idsAtuaisTeste.dono,
  });

  idsAtuaisTeste.reservaPrincipal = String(reservaPrincipal.id);
  idsAtuaisTeste.reservaOutroGinasio = String(reservaOutroGinasio.id);

  const participante = await criarRegistro(request, "participantes", {
    ...participanteTeste,
    reservaId: idsAtuaisTeste.reservaPrincipal,
  });

  idsAtuaisTeste.participante = String(participante.id);
}

export async function semearSolicitacaoPendente(request: APIRequestContext) {
  const solicitacao = await criarRegistro(request, "solicitacoes", {
    ...solicitacaoPendenteTeste,
    reservaId: idsAtuaisTeste.reservaPrincipal,
    usuarioId: idsAtuaisTeste.visitante,
  });

  idsAtuaisTeste.solicitacaoPendente = String(solicitacao.id);
}
