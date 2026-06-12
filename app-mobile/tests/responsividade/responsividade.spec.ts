import { expect, test } from "@playwright/test";
import { salvarEvidencia } from "../helpers/evidencia.helper";

const viewports = [
  { nome: "desktop", width: 1366, height: 768 },
  { nome: "tablet", width: 768, height: 1024 },
  { nome: "mobile", width: 390, height: 844 },
];

for (const viewport of viewports) {
  test(`tela inicial carrega em viewport ${viewport.nome}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await expect(page.getByText("FUTAPP")).toBeVisible();
    await expect(page.getByTestId("botao-entrar")).toBeVisible();
    await salvarEvidencia(
      page,
      "dashboard",
      `tela-inicial-${viewport.nome}.png`
    );
  });
}
