import { Platform } from "react-native";

const BASE_URL = Platform.OS === "web"
  ? "http://localhost:3001"
  : "http://192.168.0.2:3001";

export async function loginUser(email: string, senha: string) {
  const response = await fetch(
    `${BASE_URL}/usuarios?email=${encodeURIComponent(email)}`
  );
  const data = await response.json();
  const lista = Array.isArray(data) ? data : [];
  const usuario = lista.find((u: any) => u.senha === senha);
  return usuario ?? null;
}

export async function findUserByEmail(email: string) {
  const response = await fetch(
    `${BASE_URL}/usuarios?email=${encodeURIComponent(email)}`
  );
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function createUser(nome: string, email: string, senha: string) {
  const response = await fetch(`${BASE_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });
  return response.json();
}

export async function getAlunos() {
  const response = await fetch(`${BASE_URL}/alunos`);
  return response.json();
}

export async function adicionarAluno(aluno: {
  nomeAluno: string;
  nomeMae: string;
  idade: string;
  endereco: string;
  dataNascimento: string;
  valor: number;
  pago: boolean;
}) {
  const response = await fetch(`${BASE_URL}/alunos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aluno),
  });
  return response.json();
}

export async function editarAluno(
  id: string,
  aluno: {
    nomeAluno: string;
    nomeMae: string;
    idade: string;
    endereco: string;
    dataNascimento: string;
    valor: number;
    pago: boolean;
  }
) {
  const response = await fetch(`${BASE_URL}/alunos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aluno),
  });
  return response.json();
}

export async function togglePagamento(id: string, pago: boolean) {
  const response = await fetch(`${BASE_URL}/alunos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pago }),
  });
  return response.json();
}

export async function removerAluno(id: string) {
  await fetch(`${BASE_URL}/alunos/${id}`, {
    method: "DELETE",
  });
}
