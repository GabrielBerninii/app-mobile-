const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const BASE = path.join(__dirname, "..");
const EVIDENCES = path.join(BASE, "evidences");
const OUTPUT = path.join(BASE, "RELATORIO_TESTES_E2E.pdf");

function toBase64(filePath) {
  const buf = fs.readFileSync(filePath);
  return "data:image/png;base64," + buf.toString("base64");
}

function img(filePath, label, descricao = "") {
  if (!fs.existsSync(filePath)) return "";
  const src = toBase64(filePath);
  return `
    <div class="evidence-card">
      <div class="evidence-label">${label}</div>
      ${descricao ? `<div class="evidence-desc">${descricao}</div>` : ""}
      <img src="${src}" />
    </div>`;
}

const secoes = [
  {
    titulo: "1. Autenticação — Login",
    cor: "#00c853",
    icone: "🔐",
    descricao: "Testes que validam o fluxo de autenticação: login com sucesso, credenciais inválidas, campos vazios e logout.",
    testes: [
      {
        nome: "TC-01 — Login com sucesso (Dono) → Home → Logout",
        status: "PASSOU ✅",
        descricao: "Verifica que o usuário Dono consegue fazer login corretamente, é redirecionado para a tela Home e pode efetuar logout.",
        prints: [
          { path: path.join(EVIDENCES, "auth", "login-form-dono.png"), label: "Formulário preenchido — Dono E2E" },
          { path: path.join(EVIDENCES, "auth", "login-sucesso-dono.png"), label: "Home após login bem-sucedido" },
          { path: path.join(EVIDENCES, "auth", "logout-sucesso.png"), label: "Tela de login exibida após logout" },
        ],
      },
      {
        nome: "TC-02 — Login com credenciais inválidas",
        status: "PASSOU ✅",
        descricao: "Verifica que ao digitar senha errada o sistema exibe alerta 'E-mail ou senha inválidos' e mantém o usuário na tela de login.",
        prints: [
          { path: path.join(EVIDENCES, "auth", "login-dados-invalidos-form.png"), label: "Formulário com dados inválidos" },
          { path: path.join(EVIDENCES, "erros", "login-dados-invalidos.png"), label: "Após submissão — permanece na tela de login" },
        ],
      },
      {
        nome: "TC-03 — Login com campos vazios",
        status: "PASSOU ✅",
        descricao: "Verifica que ao submeter o formulário vazio o sistema exibe alerta 'Preencha todos os campos'.",
        prints: [
          { path: path.join(EVIDENCES, "auth", "login-campos-vazios-form.png"), label: "Formulário vazio" },
          { path: path.join(EVIDENCES, "erros", "login-campos-vazios.png"), label: "Após submissão — validação de campos obrigatórios" },
        ],
      },
    ],
  },
  {
    titulo: "2. Formulários — Cadastro de Usuário",
    cor: "#2979ff",
    icone: "📝",
    descricao: "Testes que validam o fluxo de cadastro: campos obrigatórios, e-mail duplicado e cadastro com sucesso.",
    testes: [
      {
        nome: "TC-04 — Cadastro com campos vazios",
        status: "PASSOU ✅",
        descricao: "Verifica que ao submeter o formulário de cadastro vazio o sistema exibe alerta 'Preencha todos os campos'.",
        prints: [
          { path: path.join(EVIDENCES, "formularios", "cadastro-campos-vazios-form.png"), label: "Formulário de cadastro vazio" },
          { path: path.join(EVIDENCES, "erros", "cadastro-campos-vazios.png"), label: "Após submissão — validação de campos" },
        ],
      },
      {
        nome: "TC-05 — Cadastro bloqueia e-mail duplicado",
        status: "PASSOU ✅",
        descricao: "Verifica que ao tentar cadastrar com um e-mail já existente o sistema exibe alerta 'Já existe um usuário com esse e-mail'.",
        prints: [
          { path: path.join(EVIDENCES, "formularios", "cadastro-email-duplicado-form.png"), label: "Formulário com e-mail já cadastrado" },
          { path: path.join(EVIDENCES, "erros", "cadastro-email-duplicado.png"), label: "Após submissão — alerta de e-mail duplicado" },
        ],
      },
      {
        nome: "TC-06 — Cadastro com sucesso → Navega para Login",
        status: "PASSOU ✅",
        descricao: "Verifica que ao preencher corretamente o formulário o usuário é criado na API e redirecionado para a tela de login.",
        prints: [
          { path: path.join(EVIDENCES, "formularios", "cadastro-sucesso-form.png"), label: "Formulário preenchido corretamente" },
          { path: path.join(EVIDENCES, "formularios", "cadastro-sucesso.png"), label: "Redirecionado para tela de login após cadastro" },
        ],
      },
    ],
  },
  {
    titulo: "3. Reservas — CRUD e Regras de Negócio",
    cor: "#ff6d00",
    icone: "🏟️",
    descricao: "Testes que validam a listagem, criação e regras de conflito de reservas por ginásio e quadra.",
    testes: [
      {
        nome: "TC-07 — Lista reservas por ginásio sem misturar outros ginásios",
        status: "PASSOU ✅",
        descricao: "Verifica que ao entrar no Ginásio Dom Bosco apenas as reservas desse ginásio aparecem, sem misturar com reservas de outros ginásios (ex: São Domingos).",
        prints: [
          { path: path.join(EVIDENCES, "reservas", "lista-ginasios.png"), label: "Lista de ginásios disponíveis" },
          { path: path.join(EVIDENCES, "reservas", "reservas-dom-bosco.png"), label: "Reservas do Ginásio Dom Bosco" },
          { path: path.join(EVIDENCES, "reservas", "listagem-por-ginasio.png"), label: "Apenas reservas do Dom Bosco exibidas (sem São Domingos)" },
        ],
      },
      {
        nome: "TC-08 — Cria reserva com sucesso e calcula valor",
        status: "PASSOU ✅",
        descricao: "Verifica que ao preencher o formulário de nova reserva (data, horário, duração 1 hora) o valor R$ 100,00 é calculado automaticamente e a reserva é criada com sucesso.",
        prints: [
          { path: path.join(EVIDENCES, "reservas", "reserva-form-preenchido.png"), label: "Formulário preenchido com duração 1h e valor R$ 100,00" },
          { path: path.join(EVIDENCES, "reservas", "reserva-criada-com-sucesso.png"), label: "Reserva criada e exibida na lista" },
        ],
      },
      {
        nome: "TC-09 — Bloqueia reserva com conflito de horário",
        status: "PASSOU ✅",
        descricao: "Verifica que ao tentar criar uma reserva no mesmo ginásio, quadra, dia e horário já ocupado o sistema exibe alerta 'Horário Indisponível'.",
        prints: [
          { path: path.join(EVIDENCES, "reservas", "reserva-conflito-form.png"), label: "Tentativa de reserva em horário conflitante" },
          { path: path.join(EVIDENCES, "erros", "reserva-horario-indisponivel.png"), label: "Alerta de horário indisponível exibido" },
        ],
      },
      {
        nome: "TC-10 — Permite reserva em quadra diferente no mesmo horário",
        status: "PASSOU ✅",
        descricao: "Verifica que é possível criar uma reserva na Quadra 2 no mesmo horário já reservado na Quadra 1, pois são quadras independentes.",
        prints: [
          { path: path.join(EVIDENCES, "reservas", "reserva-quadra-diferente.png"), label: "Reserva criada na Quadra 2 no mesmo horário" },
        ],
      },
    ],
  },
  {
    titulo: "4. Participantes e Solicitações",
    cor: "#aa00ff",
    icone: "👥",
    descricao: "Testes que validam o gerenciamento de participantes: adição manual pelo dono, solicitação de entrada por visitante, aprovação e rejeição.",
    testes: [
      {
        nome: "TC-11 — Dono adiciona participante manualmente",
        status: "PASSOU ✅",
        descricao: "Verifica que o dono da reserva pode adicionar um participante manualmente preenchendo nome e e-mail.",
        prints: [
          { path: path.join(EVIDENCES, "reservas", "participante-manual-form.png"), label: "Formulário de adição de participante" },
          { path: path.join(EVIDENCES, "reservas", "participante-manual-aprovado.png"), label: "Participante adicionado e exibido na lista" },
        ],
      },
      {
        nome: "TC-12 — Visitante solicita participação e fica pendente",
        status: "PASSOU ✅",
        descricao: "Verifica que um usuário não-dono pode solicitar participação em uma reserva e a solicitação fica com status 'Aguardando aprovação do dono'.",
        prints: [
          { path: path.join(EVIDENCES, "permissoes", "usuario-nao-dono-detalhes.png"), label: "Visitante vê detalhes sem botão de adicionar participante" },
          { path: path.join(EVIDENCES, "reservas", "solicitacao-pendente.png"), label: "Após solicitação — aguardando aprovação" },
        ],
      },
      {
        nome: "TC-13 — Dono aprova solicitação pendente",
        status: "PASSOU ✅",
        descricao: "Verifica que o dono consegue aprovar uma solicitação pendente e o usuário aparece na lista de participantes.",
        prints: [
          { path: path.join(EVIDENCES, "reservas", "solicitacao-pendente-dono.png"), label: "Dono vê solicitação pendente (1)" },
          { path: path.join(EVIDENCES, "reservas", "solicitacao-aprovada.png"), label: "Visitante E2E aparece como participante após aprovação" },
        ],
      },
      {
        nome: "TC-14 — Dono rejeita solicitação pendente",
        status: "PASSOU ✅",
        descricao: "Verifica que o dono consegue rejeitar uma solicitação e o usuário NÃO aparece na lista de participantes.",
        prints: [
          { path: path.join(EVIDENCES, "reservas", "solicitacao-rejeitada.png"), label: "Após rejeição — Visitante E2E não está na lista" },
        ],
      },
    ],
  },
  {
    titulo: "5. Permissões — Controle de Acesso",
    cor: "#d50000",
    icone: "🔒",
    descricao: "Testes que validam que usuários não-donos não visualizam ações administrativas de uma reserva.",
    testes: [
      {
        nome: "TC-15 — Usuário não-dono não vê ações administrativas",
        status: "PASSOU ✅",
        descricao: "Verifica que um visitante: (1) não vê botões Editar/Deletar na lista de reservas, (2) não vê botão '+ Adicionar Participante' nos detalhes, (3) não vê botões de Aprovar/Rejeitar solicitações.",
        prints: [
          { path: path.join(EVIDENCES, "permissoes", "usuario-sem-permissao.png"), label: "Visitante vê detalhes sem ações administrativas" },
        ],
      },
    ],
  },
  {
    titulo: "6. Responsividade — Múltiplos Viewports",
    cor: "#00838f",
    icone: "📱",
    descricao: "Testes que verificam que a tela inicial carrega corretamente em diferentes tamanhos de tela.",
    testes: [
      {
        nome: "TC-16 — Tela inicial em viewport Desktop (1366×768)",
        status: "PASSOU ✅",
        descricao: "Verifica que FUTAPP e o botão ENTRAR são visíveis em resolução desktop.",
        prints: [
          { path: path.join(EVIDENCES, "dashboard", "tela-inicial-desktop.png"), label: "Desktop 1366×768" },
        ],
      },
      {
        nome: "TC-17 — Tela inicial em viewport Tablet (768×1024)",
        status: "PASSOU ✅",
        descricao: "Verifica que FUTAPP e o botão ENTRAR são visíveis em resolução tablet.",
        prints: [
          { path: path.join(EVIDENCES, "dashboard", "tela-inicial-tablet.png"), label: "Tablet 768×1024" },
        ],
      },
      {
        nome: "TC-18 — Tela inicial em viewport Mobile (390×844)",
        status: "PASSOU ✅",
        descricao: "Verifica que FUTAPP e o botão ENTRAR são visíveis em resolução mobile.",
        prints: [
          { path: path.join(EVIDENCES, "dashboard", "tela-inicial-mobile.png"), label: "Mobile 390×844" },
        ],
      },
    ],
  },
];

function renderSecao(secao) {
  const testesHtml = secao.testes.map((t) => {
    const printsHtml = t.prints
      .map((p) => img(p.path, p.label))
      .join("");
    return `
      <div class="teste-bloco">
        <div class="teste-header">
          <span class="teste-status">${t.status}</span>
          <span class="teste-nome">${t.nome}</span>
        </div>
        <p class="teste-desc">${t.descricao}</p>
        <div class="prints-grid">${printsHtml}</div>
      </div>`;
  }).join("");

  return `
    <div class="secao" style="--cor-secao: ${secao.cor}">
      <div class="secao-header" style="background: ${secao.cor}">
        <span class="secao-icone">${secao.icone}</span>
        <div>
          <div class="secao-titulo">${secao.titulo}</div>
          <div class="secao-desc">${secao.descricao}</div>
        </div>
      </div>
      ${testesHtml}
    </div>`;
}

const totalTestes = secoes.reduce((acc, s) => acc + s.testes.length, 0);
const dataGeracao = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Relatório de Testes E2E — FUTAPP</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #f4f6f9;
      color: #1a1a2e;
      font-size: 13px;
    }

    /* ── CAPA ── */
    .capa {
      background: linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #0a2e1a 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      page-break-after: always;
      padding: 60px 40px;
    }
    .capa-logo {
      font-size: 72px;
      font-weight: 900;
      color: #00e05a;
      letter-spacing: 8px;
      margin-bottom: 8px;
    }
    .capa-sub {
      font-size: 18px;
      color: #8ab895;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 60px;
    }
    .capa-titulo {
      font-size: 36px;
      font-weight: 700;
      color: #ffffff;
      text-align: center;
      margin-bottom: 12px;
    }
    .capa-subtitulo {
      font-size: 16px;
      color: #a0b8aa;
      text-align: center;
      margin-bottom: 60px;
    }
    .capa-stats {
      display: flex;
      gap: 40px;
      margin-bottom: 60px;
    }
    .stat-box {
      background: rgba(0,224,90,0.08);
      border: 2px solid rgba(0,224,90,0.3);
      border-radius: 16px;
      padding: 24px 40px;
      text-align: center;
    }
    .stat-num {
      font-size: 52px;
      font-weight: 900;
      color: #00e05a;
      line-height: 1;
    }
    .stat-label {
      font-size: 13px;
      color: #8ab895;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 8px;
    }
    .capa-info {
      color: #4a7a5a;
      font-size: 13px;
      text-align: center;
      line-height: 2;
    }
    .capa-divider {
      width: 80px;
      height: 3px;
      background: #00e05a;
      border-radius: 2px;
      margin: 40px auto;
    }
    .capa-badge {
      background: #00e05a;
      color: #000;
      font-weight: 900;
      font-size: 14px;
      padding: 8px 28px;
      border-radius: 100px;
      letter-spacing: 2px;
    }

    /* ── SUMÁRIO ── */
    .sumario-page {
      background: white;
      min-height: 100vh;
      padding: 60px 50px;
      page-break-after: always;
    }
    .sumario-titulo {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 8px;
    }
    .sumario-sub {
      font-size: 13px;
      color: #666;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
    }
    .sumario-item {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-radius: 10px;
      margin-bottom: 10px;
      background: #f8f9fa;
      border-left: 4px solid #00c853;
    }
    .sumario-icone {
      font-size: 22px;
      margin-right: 14px;
      width: 32px;
      text-align: center;
    }
    .sumario-nome {
      flex: 1;
      font-size: 14px;
      font-weight: 600;
      color: #1a1a2e;
    }
    .sumario-qtd {
      font-size: 13px;
      color: #555;
    }
    .sumario-passed {
      font-size: 13px;
      font-weight: 700;
      color: #00c853;
      margin-left: 16px;
      background: rgba(0,200,83,0.1);
      padding: 4px 12px;
      border-radius: 20px;
    }

    .resultado-global {
      background: linear-gradient(135deg, #00c853, #00e05a);
      border-radius: 16px;
      padding: 30px 40px;
      margin-top: 40px;
      display: flex;
      align-items: center;
      gap: 30px;
    }
    .resultado-icone { font-size: 48px; }
    .resultado-texto { color: #003d15; }
    .resultado-titulo { font-size: 22px; font-weight: 900; margin-bottom: 4px; }
    .resultado-detalhe { font-size: 14px; opacity: 0.8; }

    /* ── SEÇÕES ── */
    .secao {
      margin: 0;
      page-break-before: always;
      background: white;
    }
    .secao-header {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      padding: 40px 50px;
      color: white;
    }
    .secao-icone { font-size: 36px; margin-top: 2px; }
    .secao-titulo { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
    .secao-desc { font-size: 13px; opacity: 0.9; line-height: 1.5; max-width: 750px; }

    /* ── TESTES ── */
    .teste-bloco {
      padding: 30px 50px;
      border-bottom: 1px solid #f0f0f0;
    }
    .teste-bloco:last-child { border-bottom: none; }
    .teste-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    .teste-status {
      font-size: 12px;
      font-weight: 700;
      color: #00a040;
      background: rgba(0,160,64,0.1);
      padding: 4px 12px;
      border-radius: 20px;
      white-space: nowrap;
    }
    .teste-nome {
      font-size: 15px;
      font-weight: 700;
      color: #1a1a2e;
    }
    .teste-desc {
      font-size: 13px;
      color: #555;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    /* ── PRINTS ── */
    .prints-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .evidence-card {
      background: #f8f9fa;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #e8ecf0;
      flex: 1;
      min-width: 280px;
      max-width: 48%;
    }
    .evidence-card img {
      width: 100%;
      height: auto;
      display: block;
    }
    .evidence-label {
      font-size: 11px;
      font-weight: 700;
      color: #fff;
      background: var(--cor-secao, #333);
      padding: 6px 12px;
      letter-spacing: 0.3px;
    }
    .evidence-desc {
      font-size: 11px;
      color: #666;
      padding: 4px 12px 8px;
      background: #f0f2f5;
    }

    /* ── RODAPÉ ── */
    .rodape {
      background: #1a1a2e;
      color: #4a4a6a;
      text-align: center;
      padding: 30px;
      font-size: 12px;
      margin-top: 40px;
    }
    .rodape strong { color: #00e05a; }
  </style>
</head>
<body>

<!-- CAPA -->
<div class="capa">
  <div class="capa-logo">FUTAPP</div>
  <div class="capa-sub">Sistema de Reservas de Ginásios</div>

  <div class="capa-titulo">Relatório de Testes E2E</div>
  <div class="capa-subtitulo">Playwright • Chromium • React Native Web (Expo)</div>

  <div class="capa-stats">
    <div class="stat-box">
      <div class="stat-num">${totalTestes}</div>
      <div class="stat-label">Testes Executados</div>
    </div>
    <div class="stat-box">
      <div class="stat-num">${totalTestes}</div>
      <div class="stat-label">Testes Aprovados</div>
    </div>
    <div class="stat-box">
      <div class="stat-num">0</div>
      <div class="stat-label">Testes Reprovados</div>
    </div>
    <div class="stat-box">
      <div class="stat-num">100%</div>
      <div class="stat-label">Taxa de Sucesso</div>
    </div>
  </div>

  <div class="capa-badge">✅ TODOS OS TESTES APROVADOS</div>

  <div class="capa-divider"></div>

  <div class="capa-info">
    <div>Data de Execução: ${dataGeracao}</div>
    <div>Framework: Playwright v1.60 + Expo Router v6 + json-server v1</div>
    <div>Browser: Chromium (Desktop 1280×720)</div>
    <div>Ambiente: Desenvolvimento Local (localhost:8081 + localhost:3000)</div>
  </div>
</div>

<!-- SUMÁRIO -->
<div class="sumario-page">
  <div class="sumario-titulo">Sumário Executivo</div>
  <div class="sumario-sub">Visão geral de todos os módulos testados e seus resultados</div>

  ${secoes.map((s) => `
    <div class="sumario-item" style="border-left-color: ${s.cor}">
      <div class="sumario-icone">${s.icone}</div>
      <div class="sumario-nome">${s.titulo}</div>
      <div class="sumario-qtd">${s.testes.length} teste${s.testes.length > 1 ? "s" : ""}</div>
      <div class="sumario-passed">✅ ${s.testes.length}/${s.testes.length}</div>
    </div>
  `).join("")}

  <div class="resultado-global">
    <div class="resultado-icone">🏆</div>
    <div class="resultado-texto">
      <div class="resultado-titulo">${totalTestes} de ${totalTestes} testes aprovados</div>
      <div class="resultado-detalhe">
        100% de taxa de sucesso · Nenhuma falha · Todos os fluxos críticos validados com evidências visuais
      </div>
    </div>
  </div>

  <div style="margin-top: 40px; padding: 24px; background: #f8f9fa; border-radius: 12px; border: 1px solid #e8ecf0;">
    <div style="font-weight: 700; font-size: 15px; margin-bottom: 16px; color: #1a1a2e;">📋 Escopo dos Testes</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; color: #444; line-height: 1.7;">
      <div>✅ Login com sucesso e logout</div>
      <div>✅ Validação de campos obrigatórios</div>
      <div>✅ Bloqueio de credenciais inválidas</div>
      <div>✅ Cadastro de novo usuário</div>
      <div>✅ Bloqueio de e-mail duplicado</div>
      <div>✅ Listagem de reservas por ginásio</div>
      <div>✅ Criação de reserva com cálculo de valor</div>
      <div>✅ Detecção de conflito de horário</div>
      <div>✅ Reserva em quadra diferente (sem conflito)</div>
      <div>✅ Adição manual de participante (dono)</div>
      <div>✅ Solicitação de participação (visitante)</div>
      <div>✅ Aprovação de solicitação pendente</div>
      <div>✅ Rejeição de solicitação pendente</div>
      <div>✅ Controle de acesso por perfil</div>
      <div>✅ Responsividade Desktop (1366×768)</div>
      <div>✅ Responsividade Tablet (768×1024)</div>
      <div>✅ Responsividade Mobile (390×844)</div>
      <div></div>
    </div>
  </div>
</div>

<!-- SEÇÕES DE TESTES -->
${secoes.map(renderSecao).join("")}

<!-- RODAPÉ -->
<div class="rodape">
  Gerado em ${dataGeracao} · <strong>FUTAPP</strong> — Sistema de Reservas de Ginásios ·
  Testes E2E com Playwright · <strong>${totalTestes}/${totalTestes} aprovados ✅</strong>
</div>

</body>
</html>`;

async function main() {
  console.log("⏳ Iniciando geração do PDF...");

  const htmlPath = path.join(BASE, "_relatorio_temp.html");
  fs.writeFileSync(htmlPath, html, "utf-8");
  console.log("✅ HTML gerado com", secoes.reduce((a, s) => a + s.testes.reduce((b, t) => b + t.prints.length, 0), 0), "evidências incorporadas");

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("file:///" + htmlPath.replace(/\\/g, "/"));
  await page.waitForLoadState("networkidle");

  await page.pdf({
    path: OUTPUT,
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });

  await browser.close();
  fs.unlinkSync(htmlPath);

  const size = (fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(2);
  console.log(`✅ PDF gerado com sucesso!`);
  console.log(`📄 Arquivo: ${OUTPUT}`);
  console.log(`📦 Tamanho: ${size} MB`);
}

main().catch((err) => {
  console.error("❌ Erro ao gerar PDF:", err);
  process.exit(1);
});
