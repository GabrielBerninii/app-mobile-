from __future__ import annotations

from pathlib import Path
from textwrap import wrap

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Image,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "RELATORIO_TESTES_PLAYWRIGHT.pdf"


def listar_imagens() -> list[Path]:
    caminhos = []
    for base in [ROOT / "evidences", ROOT / "test-results"]:
        if base.exists():
            caminhos.extend(base.rglob("*.png"))
            caminhos.extend(base.rglob("*.jpg"))
            caminhos.extend(base.rglob("*.jpeg"))
    return sorted(caminhos)


def paragrafo(texto: str, estilo: ParagraphStyle) -> Paragraph:
    return Paragraph(texto.replace("&", "&amp;"), estilo)


def tabela_dados(dados: list[list[str]], largura: list[float]) -> Table:
    tabela = Table(dados, colWidths=largura, hAlign="LEFT")
    tabela.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0D2A14")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 8.5),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#B7C7B7")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F5FAF5")]),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return tabela


def desenhar_cabecalho(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(colors.HexColor("#071A0B"))
    canvas.rect(0, A4[1] - 1.1 * cm, A4[0], 1.1 * cm, fill=True, stroke=False)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(1.6 * cm, A4[1] - 0.7 * cm, "FutApp - Relatorio de Testes Playwright")
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(A4[0] - 1.6 * cm, A4[1] - 0.7 * cm, f"Pagina {doc.page}")
    canvas.restoreState()


def main() -> None:
    imagens = listar_imagens()

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=1.6 * cm,
        leftMargin=1.6 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.6 * cm,
        title="Relatorio de Testes Playwright - FutApp",
    )

    styles = getSampleStyleSheet()
    titulo = ParagraphStyle(
        "Titulo",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=27,
        textColor=colors.HexColor("#071A0B"),
        spaceAfter=12,
    )
    subtitulo = ParagraphStyle(
        "Subtitulo",
        parent=styles["Normal"],
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#2E5C35"),
        spaceAfter=16,
    )
    h1 = ParagraphStyle(
        "H1",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=19,
        textColor=colors.HexColor("#0D2A14"),
        spaceBefore=12,
        spaceAfter=8,
    )
    h2 = ParagraphStyle(
        "H2",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11.5,
        leading=15,
        textColor=colors.HexColor("#0D2A14"),
        spaceBefore=8,
        spaceAfter=5,
    )
    normal = ParagraphStyle(
        "NormalCustom",
        parent=styles["Normal"],
        fontSize=9.5,
        leading=13.5,
        spaceAfter=6,
    )
    nota = ParagraphStyle(
        "Nota",
        parent=normal,
        backColor=colors.HexColor("#FFF7D6"),
        borderColor=colors.HexColor("#E0B800"),
        borderWidth=0.5,
        borderPadding=6,
        textColor=colors.HexColor("#4A3B00"),
        spaceBefore=6,
        spaceAfter=10,
    )
    mono = ParagraphStyle(
        "Mono",
        parent=normal,
        fontName="Courier",
        fontSize=8.5,
        leading=12,
        backColor=colors.HexColor("#F2F5F2"),
        borderPadding=5,
    )

    story = []
    story.append(paragrafo("Relatorio de Testes Playwright - FutApp", titulo))
    story.append(
        paragrafo(
            "Suite E2E criada para autenticação, cadastro, reservas, participantes, permissões e responsividade.",
            subtitulo,
        )
    )
    story.append(
        tabela_dados(
            [
                ["Item", "Resultado"],
                ["Framework", "Expo + React Native Web + Expo Router"],
                ["Test runner", "Playwright com Chromium"],
                ["Total de testes descobertos", "18 testes em 6 arquivos"],
                ["Validações concluídas", "TypeScript e Expo lint sem erros"],
                ["Execução E2E nesta sessão", "Bloqueada pelo sandbox ao iniciar Chromium (spawn EPERM)"],
                ["Imagens encontradas para anexar", str(len(imagens))],
            ],
            [5.2 * cm, 11.2 * cm],
        )
    )

    story.append(paragrafo("Resumo executivo", h1))
    story.append(
        paragrafo(
            "Foi configurada uma suíte de testes E2E com Playwright para cobrir os principais fluxos reais do FutApp. "
            "A estrutura inclui testes por domínio, helpers de autenticação, dados de teste via json-server, geração de evidências visuais, "
            "trace, vídeo em falha e relatório HTML.",
            normal,
        )
    )
    story.append(
        paragrafo(
            "Observação sobre as prints: nenhuma imagem PNG/JPG foi encontrada em evidences/ ou test-results/ no momento da geração deste PDF. "
            "A execução dos testes foi bloqueada pelo ambiente desta sessão antes do navegador abrir, portanto os screenshots não puderam ser produzidos aqui. "
            "Ao rodar npm run test:e2e em um terminal normal, as imagens serão geradas automaticamente nas pastas de evidências.",
            nota,
        )
    )

    story.append(paragrafo("Funcionalidades cobertas", h1))
    story.append(
        tabela_dados(
            [
                ["Domínio", "Cenários cobertos"],
                ["Autenticação", "Login com sucesso, login inválido, campos vazios e logout."],
                ["Cadastro", "Campos obrigatórios, e-mail duplicado e cadastro com sucesso."],
                ["Reservas", "Seleção de ginásio, listagem por ginásio, criação, cálculo de valor, conflito de horário e quadra diferente."],
                ["Participantes", "Adição manual, solicitação de participação, aprovação e rejeição."],
                ["Permissões", "Usuário não dono sem ações administrativas."],
                ["Responsividade", "Tela inicial em desktop, tablet e mobile."],
            ],
            [4.0 * cm, 12.4 * cm],
        )
    )

    story.append(paragrafo("Arquivos criados", h1))
    arquivos = [
        "playwright.config.ts",
        "tests/auth/login.spec.ts",
        "tests/formularios/cadastro.spec.ts",
        "tests/reservas/reservas.spec.ts",
        "tests/reservas/participantes.spec.ts",
        "tests/permissoes/permissoes.spec.ts",
        "tests/responsividade/responsividade.spec.ts",
        "tests/helpers/auth.helper.ts",
        "tests/helpers/evidencia.helper.ts",
        "tests/helpers/test-data.helper.ts",
        "TESTES_PLAYWRIGHT.md",
    ]
    story.append(tabela_dados([["Arquivo"]] + [[item] for item in arquivos], [16.4 * cm]))

    story.append(paragrafo("Comandos de execução", h1))
    story.append(paragrafo("npm run test:e2e<br/>npm run test:e2e:ui<br/>npm run test:e2e:report", mono))

    story.append(paragrafo("Estrutura de evidências", h1))
    story.append(
        paragrafo(
            "As screenshots geradas pelos testes ficam em evidences/auth, evidences/dashboard, evidences/reservas, "
            "evidences/formularios, evidences/permissoes e evidences/erros. O relatório HTML fica em playwright-report/ "
            "e os artefatos técnicos ficam em test-results/.",
            normal,
        )
    )

    story.append(paragrafo("Status da execução", h1))
    story.append(
        tabela_dados(
            [
                ["Verificação", "Status"],
                ["npx.cmd tsc --noEmit", "Passou"],
                ["npx.cmd expo lint", "Passou"],
                ["npx.cmd playwright test --list", "Passou; 18 testes encontrados"],
                ["npx.cmd playwright test", "Bloqueado por spawn EPERM ao abrir Chromium no sandbox"],
            ],
            [6.2 * cm, 10.2 * cm],
        )
    )

    story.append(paragrafo("Cenários não cobertos", h1))
    story.append(
        tabela_dados(
            [
                ["Cenário", "Motivo"],
                ["Administrador", "Não existe perfil ou tela administrativa no código atual."],
                ["Busca, filtros, paginação e ordenação", "Funcionalidades não implementadas no app."],
                ["Bloqueio por URL direta", "Não há guarda de rota/autenticação persistente."],
                ["Máscaras de CPF/moeda/data", "Campos não existem no fluxo atual."],
                ["Confirmação de senha", "Não existe campo de confirmação de senha."],
            ],
            [5.5 * cm, 10.9 * cm],
        )
    )

    story.append(PageBreak())
    story.append(paragrafo("Anexo de prints", h1))
    if imagens:
        for imagem in imagens:
            story.append(paragrafo(str(imagem.relative_to(ROOT)), h2))
            try:
                story.append(Image(str(imagem), width=15.5 * cm, height=8.8 * cm, kind="proportional"))
            except Exception as exc:
                story.append(paragrafo(f"Não foi possível anexar esta imagem: {exc}", nota))
            story.append(Spacer(1, 0.4 * cm))
    else:
        story.append(
            paragrafo(
                "Nenhuma print foi encontrada para anexar. Rode npm run test:e2e em um terminal normal do Windows; "
                "depois gere novamente este PDF para incluir automaticamente as imagens.",
                nota,
            )
        )
        nomes = [
            "evidences/auth/login-sucesso-dono.png",
            "evidences/erros/login-dados-invalidos.png",
            "evidences/formularios/cadastro-sucesso.png",
            "evidences/reservas/reserva-criada-com-sucesso.png",
            "evidences/reservas/reserva-horario-indisponivel.png",
            "evidences/permissoes/usuario-sem-permissao.png",
            "evidences/reservas/solicitacao-aprovada.png",
            "evidences/dashboard/tela-inicial-mobile.png",
        ]
        story.append(tabela_dados([["Print esperada"]] + [[nome] for nome in nomes], [16.4 * cm]))

    doc.build(story, onFirstPage=desenhar_cabecalho, onLaterPages=desenhar_cabecalho)
    print(OUTPUT)


if __name__ == "__main__":
    main()
