import { expect, test } from "@playwright/test";
import { abrirReservasDomBosco, campoAtual, loginComoVisitante } from "../helpers/auth.helper";
import { salvarEvidencia } from "../helpers/evidencia.helper";
import { idsAtuaisTeste, semearDadosE2E, semearSolicitacaoPendente } from "../helpers/test-data.helper";

test.beforeEach(async ({ request }) => {
  await semearDadosE2E(request);
  await semearSolicitacaoPendente(request);
});

test("usuario nao dono nao ve acoes administrativas da reserva", async ({ page }) => {
  await loginComoVisitante(page);
  await abrirReservasDomBosco(page);

  await expect(page.getByTestId(`reserva-editar-${idsAtuaisTeste.reservaPrincipal}`)).toHaveCount(0);
  await expect(page.getByTestId(`reserva-deletar-${idsAtuaisTeste.reservaPrincipal}`)).toHaveCount(0);
  await campoAtual(page, `reserva-card-${idsAtuaisTeste.reservaPrincipal}`).click();

  await expect(page.getByTestId("participante-abrir-modal")).toHaveCount(0);
  await expect(page.getByTestId(`solicitacao-aprovar-${idsAtuaisTeste.solicitacaoPendente}`)).toHaveCount(0);
  await expect(page.getByTestId(`solicitacao-rejeitar-${idsAtuaisTeste.solicitacaoPendente}`)).toHaveCount(0);
  await salvarEvidencia(page, "permissoes", "usuario-sem-permissao.png");
});
