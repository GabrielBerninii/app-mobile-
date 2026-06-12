import { expect, test } from "@playwright/test";
import {
  abrirReservasDomBosco,
  campoAtual,
  loginComoDono,
  loginComoVisitante,
} from "../helpers/auth.helper";
import { salvarEvidencia } from "../helpers/evidencia.helper";
import {
  idsAtuaisTeste,
  semearDadosE2E,
  semearSolicitacaoPendente,
} from "../helpers/test-data.helper";

test.beforeEach(async ({ request }) => {
  await semearDadosE2E(request);
});

test("dono adiciona participante manualmente na reserva", async ({ page }) => {
  await loginComoDono(page);
  await abrirReservasDomBosco(page);
  await campoAtual(page, `reserva-card-${idsAtuaisTeste.reservaPrincipal}`).click();

  await campoAtual(page, "participante-abrir-modal").click();
  await campoAtual(page, "participante-nome").fill("Participante Manual E2E");
  await campoAtual(page, "participante-email").fill("manual.e2e@example.com");
  await salvarEvidencia(page, "reservas", "participante-manual-form.png");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Participante adicionado com sucesso");
    await dialog.accept();
  });
  await campoAtual(page, "participante-salvar").click();
  await expect(page.getByText("Participante Manual E2E").last()).toBeVisible();
  await salvarEvidencia(page, "reservas", "participante-manual-aprovado.png");
});

test("usuario de outra conta solicita participacao e fica pendente", async ({ page }) => {
  await loginComoVisitante(page);
  await abrirReservasDomBosco(page);
  await campoAtual(page, `reserva-card-${idsAtuaisTeste.reservaPrincipal}`).click();

  await expect(page.getByTestId("participante-abrir-modal")).toHaveCount(0);
  await salvarEvidencia(page, "permissoes", "usuario-nao-dono-detalhes.png");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Sua solicitação foi enviada");
    await dialog.accept();
  });
  await campoAtual(page, "solicitar-participacao").click();
  await expect(page.getByText("Aguardando aprovação do dono")).toBeVisible();
  await salvarEvidencia(page, "reservas", "solicitacao-pendente.png");
});

test("dono aprova solicitacao pendente e usuario aparece como participante", async ({
  page,
  request,
}) => {
  await semearSolicitacaoPendente(request);
  await loginComoDono(page);
  await abrirReservasDomBosco(page);
  await campoAtual(page, `reserva-card-${idsAtuaisTeste.reservaPrincipal}`).click();
  await expect(page.getByText("Solicitações Pendentes (1)")).toBeVisible();
  await salvarEvidencia(page, "reservas", "solicitacao-pendente-dono.png");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Solicitação aprovada");
    await dialog.accept();
  });
  await campoAtual(page, `solicitacao-aprovar-${idsAtuaisTeste.solicitacaoPendente}`).click();
  await expect(page.getByText("Visitante E2E")).toBeVisible();
  await salvarEvidencia(page, "reservas", "solicitacao-aprovada.png");
});

test("dono rejeita solicitacao pendente e usuario nao entra como participante", async ({
  page,
  request,
}) => {
  await semearSolicitacaoPendente(request);
  await loginComoDono(page);
  await abrirReservasDomBosco(page);
  await campoAtual(page, `reserva-card-${idsAtuaisTeste.reservaPrincipal}`).click();

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Solicitação rejeitada");
    await dialog.accept();
  });
  await campoAtual(page, `solicitacao-rejeitar-${idsAtuaisTeste.solicitacaoPendente}`).click();
  await expect(page.getByText("Visitante E2E")).toHaveCount(0);
  await salvarEvidencia(page, "reservas", "solicitacao-rejeitada.png");
});
