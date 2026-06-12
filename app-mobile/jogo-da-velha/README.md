# 🎮 Jogo da Velha — Humano vs Humano

Jogo da velha (Tic-Tac-Toe) interativo com suporte a teclado, mobile-first responsivo e acessibilidade.

## 📋 Como Rodar

1. Abra o arquivo `index.html` em um navegador moderno.
2. Nenhuma instalação ou build necessário — projeto é 100% estático.

```bash
# Opção 1: Abrir direto no navegador
open jogo-da-velha/index.html

# Opção 2: Usando servidor local (Python 3)
python3 -m http.server 8000
# Depois acesse: http://localhost:8000/jogo-da-velha/
```

## ⚙️ Requisitos

- **Navegador moderno:** Chrome, Firefox, Safari, Edge (últimas versões)
- **JavaScript:** ES6+ habilitado
- **Tailwind CSS:** Via CDN (sem build necessário)
- Nenhuma dependência externa ou build tools

## 🎯 Como Jogar

1. **Seleção inicial:** Escolha jogar como X ou O
2. **X sempre começa:** Independente de quem você escolheu
3. **Turnos:** Clique em uma célula vazia para fazer sua jogada
4. **Vitória:** Complete 3 símbolos iguais em linha, coluna ou diagonal
5. **Empate:** Se o tabuleiro preencher sem vitória
6. **Reset:** Clique "Reiniciar Partida" para novo jogo

## ♿ Acessibilidade

### Navegação por Teclado
- **Tab:** Navega entre elementos focáveis
- **Shift+Tab:** Navega ao contrário
- **Enter:** Faz jogada na célula focada
- **Espaço:** Faz jogada na célula focada
- **Focus Ring:** Botões destacam com anel azul quando focados

### Screen Reader
- Todos os elementos têm `aria-label` descritivo
- Status da partida é anunciado em tempo real (`aria-live="polite"`)
- Grid e células têm roles semânticas apropriadas

## 📱 Responsividade

Otimizado para todos os tamanhos de tela:

- **Mobile** (< 640px): Tabuleiro compacto, células 44x44px+ (acessível ao toque)
- **Tablet** (640-1024px): Layout médio, espaçamento maior
- **Desktop** (> 1024px): Máximo size, centralizado na tela

## 🏛️ Arquitetura

```
index.html        Skeleton HTML5 semântico
index.js          Lógica completa do jogo (estado, validação, handlers)
styles.css        Fallbacks CSS e animações
```

**Padrão:** Event → Validação → Estado → Renderização

**Zero dependências externas:** Tailwind via CDN, puro vanilla JS.

## 📊 Técnicos

- **Stack:** HTML5 + CSS3 (Tailwind) + Vanilla JavaScript ES6+
- **Acessibilidade:** WCAG 2.1 AA (Tab order, ARIA labels, focus management)
- **Responsividade:** Mobile-first com breakpoints Tailwind
- **Padrões:** Clean Code, separação de responsabilidades, sem estado mutável não-sincronizado

## 🐛 Reportar Problemas

Abra DevTools (F12) e verifique a aba Console para erros detalhados.

---

**Desenvolvido:** Maio 2026  
**Linguagem:** Português (PT-BR)  
**Licença:** MIT
