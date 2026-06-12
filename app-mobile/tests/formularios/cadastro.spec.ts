import { expect, test } from "@playwright/test";
import { salvarEvidencia } from "../helpers/evidencia.helper";
import { API_URL, semearDadosE2E, usuariosTeste } from "../helpers/test-data.helper";
import { campoAtual } from "../helpers/auth.helper";

test.beforeEach(async ({ request }) => {
  await semearDadosE2E(request);
});

test("cadastro com campos vazios mostra validacao", async ({ page }) => {
  await page.goto("/cadastro");
  await salvarEvidencia(page, "formularios", "cadastro-campos-vazios-form.png");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Preencha todos os campos");
    await dialog.accept();
  });
  await campoAtual(page, "cadastro-submit").click();
  await expect(campoAtual(page, "cadastro-nome")).toBeVisible();
  await salvarEvidencia(page, "erros", "cadastro-campos-vazios.png");
});

test("cadastro bloqueia email duplicado", async ({ page }) => {
  await page.goto("/cadastro");
  await campoAtual(page, "cadastro-nome").fill("Usuario Duplicado");
  await campoAtual(page, "cadastro-email").fill(usuariosTeste.dono.email);
  await campoAtual(page, "cadastro-senha").fill("12345678");
  await salvarEvidencia(page, "formularios", "cadastro-email-duplicado-form.png");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Já existe");
    await dialog.accept();
  });
  await campoAtual(page, "cadastro-submit").click();
  await salvarEvidencia(page, "erros", "cadastro-email-duplicado.png");
});

test("cadastro com sucesso cria usuario e navega para login", async ({ page, request }) => {
  await page.goto("/cadastro");
  await campoAtual(page, "cadastro-nome").fill("Novo Usuario E2E");
  await campoAtual(page, "cadastro-email").fill("novo.e2e@example.com");
  await campoAtual(page, "cadastro-senha").fill("Teste123!");
  await salvarEvidencia(page, "formularios", "cadastro-sucesso-form.png");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Cadastro realizado com sucesso");
    await dialog.accept();
  });
  await campoAtual(page, "cadastro-submit").click();
  await expect(campoAtual(page, "login-email")).toBeVisible();

  const response = await request.get(`${API_URL}/usuarios?email=novo.e2e%40example.com`);
  expect(await response.json()).toHaveLength(1);
  await salvarEvidencia(page, "formularios", "cadastro-sucesso.png");
});
