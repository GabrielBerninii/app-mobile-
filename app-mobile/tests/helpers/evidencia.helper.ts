import { Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

export async function salvarEvidencia(
  page: Page,
  pasta: string,
  nomeArquivo: string
) {
  const diretorio = path.join("evidences", pasta);
  fs.mkdirSync(diretorio, { recursive: true });

  await page.screenshot({
    path: path.join(diretorio, nomeArquivo),
    fullPage: true,
  });
}
