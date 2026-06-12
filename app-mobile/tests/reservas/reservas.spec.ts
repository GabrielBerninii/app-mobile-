import { expect, test } from "@playwright/test";
import { abrirReservasDomBosco, campoAtual, loginComoDono } from "../helpers/auth.helper";
import { salvarEvidencia } from "../helpers/evidencia.helper";
import { idsAtuaisTeste, semearDadosE2E } from "../helpers/test-data.helper";

test.beforeEach(async ({ request }) => {
  await semearDadosE2E(request);
});

test("lista reservas por ginasio e nao mistura reservas de outro ginasio", async ({ page }) => {
  await loginComoDono(page);
  await abrirReservasDomBosco(page);

  await expect(page.getByText("Dono E2E").first()).toBeVisible();
  await expect(page.getByTestId("lista-reservas").getByText("Ginásio Poliesportivo São Domingos")).toHaveCount(0);
  await salvarEvidencia(page, "reservas", "listagem-por-ginasio.png");
});

test("cria reserva com sucesso e calcula valor", async ({ page }) => {
  await loginComoDono(page);
  await abrirReservasDomBosco(page);

  await campoAtual(page, "nova-reserva").click();
  await campoAtual(page, "reserva-responsavel").fill("Reserva Criada E2E");
  await page.locator('input[type="date"]').last().fill("2026-06-21");
  await page.locator('input[type="time"]').last().fill("15:00");
  await page.getByText("1 hora", { exact: true }).last().click();
  await expect(page.getByText("R$ 100.00").last()).toBeVisible();
  await salvarEvidencia(page, "reservas", "reserva-form-preenchido.png");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Reserva criada com sucesso");
    await dialog.accept();
  });
  await campoAtual(page, "reserva-salvar").click();
  await expect(page.getByText("Reserva Criada E2E").last()).toBeVisible();
  await salvarEvidencia(page, "reservas", "reserva-criada-com-sucesso.png");
});

test("bloqueia reserva com mesmo ginasio quadra dia e horario", async ({ page }) => {
  await loginComoDono(page);
  await abrirReservasDomBosco(page);

  await campoAtual(page, "nova-reserva").click();
  await campoAtual(page, "reserva-responsavel").fill("Reserva Conflito E2E");
  await page.locator('input[type="date"]').last().fill("2026-06-20");
  await page.locator('input[type="time"]').last().fill("09:30");
  await salvarEvidencia(page, "reservas", "reserva-conflito-form.png");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Horário Indisponível");
    await dialog.accept();
  });
  await campoAtual(page, "reserva-salvar").click();
  await salvarEvidencia(page, "erros", "reserva-horario-indisponivel.png");
});

test("permite reserva em quadra diferente no mesmo horario", async ({ page }) => {
  await loginComoDono(page);
  await abrirReservasDomBosco(page);

  await campoAtual(page, "nova-reserva").click();
  await page.getByText("Quadra 2", { exact: true }).last().click();
  await campoAtual(page, "reserva-responsavel").fill("Quadra Diferente E2E");
  await page.locator('input[type="date"]').last().fill("2026-06-20");
  await page.locator('input[type="time"]').last().fill("09:30");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Reserva criada com sucesso");
    await dialog.accept();
  });
  await campoAtual(page, "reserva-salvar").click();
  await expect(page.getByText("Quadra Diferente E2E").last()).toBeVisible();
  await salvarEvidencia(page, "reservas", "reserva-quadra-diferente.png");
});
