import { expect, test } from "@playwright/test";
import { salvarEvidencia } from "../helpers/evidencia.helper";
import { semearDadosE2E, usuariosTeste } from "../helpers/test-data.helper";
import { campoAtual, loginComoDono } from "../helpers/auth.helper";

test.beforeEach(async ({ request }) => {
  await semearDadosE2E(request);
});

test("login com sucesso navega para home e permite logout", async ({ page }) => {
  await loginComoDono(page);

  await campoAtual(page, "home-sair").click();
  await expect(campoAtual(page, "login-email")).toBeVisible();
  await salvarEvidencia(page, "auth", "logout-sucesso.png");
});

test("login com dados invalidos mostra erro", async ({ page }) => {
  await page.goto("/");
  await campoAtual(page, "botao-entrar").click();
  await campoAtual(page, "login-email").fill(usuariosTeste.dono.email);
  await campoAtual(page, "login-senha").fill("senha-errada");
  await salvarEvidencia(page, "auth", "login-dados-invalidos-form.png");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("E-mail ou senha");
    await dialog.accept();
  });
  await campoAtual(page, "login-submit").click();
  await expect(campoAtual(page, "login-email")).toBeVisible();
  await salvarEvidencia(page, "erros", "login-dados-invalidos.png");
});

test("login com campos vazios mostra validacao obrigatoria", async ({ page }) => {
  await page.goto("/login");
  await salvarEvidencia(page, "auth", "login-campos-vazios-form.png");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Preencha todos os campos");
    await dialog.accept();
  });
  await campoAtual(page, "login-submit").click();
  await expect(campoAtual(page, "login-email")).toBeVisible();
  await salvarEvidencia(page, "erros", "login-campos-vazios.png");
});
