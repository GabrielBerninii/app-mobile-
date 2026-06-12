import { Page, expect } from "@playwright/test";
import { salvarEvidencia } from "./evidencia.helper";
import { usuariosTeste } from "./test-data.helper";

export function campoAtual(page: Page, testId: string) {
  return page.getByTestId(testId).last();
}

export async function loginComoDono(page: Page) {
  await login(page, usuariosTeste.dono.email, usuariosTeste.dono.senha, "dono");
}

export async function loginComoVisitante(page: Page) {
  await login(
    page,
    usuariosTeste.visitante.email,
    usuariosTeste.visitante.senha,
    "visitante"
  );
}

export async function login(
  page: Page,
  email: string,
  senha: string,
  nomeEvidencia: string
) {
  await page.goto("/");
  await campoAtual(page, "botao-entrar").click();
  await expect(campoAtual(page, "login-email")).toBeVisible();

  await campoAtual(page, "login-email").fill(email);
  await campoAtual(page, "login-senha").fill(senha);
  await salvarEvidencia(page, "auth", `login-form-${nomeEvidencia}.png`);

  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });
  await campoAtual(page, "login-submit").click();
  await expect(campoAtual(page, "home-ginasios")).toBeVisible();
  await salvarEvidencia(page, "auth", `login-sucesso-${nomeEvidencia}.png`);
}

export async function abrirReservasDomBosco(page: Page) {
  await campoAtual(page, "home-ginasios").click();
  await expect(campoAtual(page, "ginasio-1")).toBeVisible();
  await salvarEvidencia(page, "reservas", "lista-ginasios.png");

  await campoAtual(page, "ginasio-1").click();
  await expect(page.getByRole("heading", { name: "Reservas" })).toBeVisible();
  await salvarEvidencia(page, "reservas", "reservas-dom-bosco.png");
}

export async function abrirDetalhesReservaPrincipal(page: Page) {
  await page.getByText(/Respons.*Dono E2E/).last().click();
  await expect(page.getByRole("heading", { name: "Detalhes da Reserva" })).toBeVisible();
}
