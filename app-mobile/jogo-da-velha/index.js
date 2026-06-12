// ========== CONSTANTES ==========
const TAMANHO_TABULEIRO = 9;
const SIMBOLO_X = 'X';
const SIMBOLO_O = 'O';

const LINHAS_VITORIA = [
  // Linhas horizontais
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Colunas
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonais
  [0, 4, 8],
  [2, 4, 6],
];

const MENSAGENS = {
  x_vez: 'Vez de X',
  o_vez: 'Vez de O',
  x_venceu: 'X venceu! 🎉',
  o_venceu: 'O venceu! 🎉',
  empate: 'Empate! 🤝',
};

// ========== ESTADO GLOBAL ==========
let tabuleiro = [null, null, null, null, null, null, null, null, null];
let jogadorAtual = SIMBOLO_X;
let jogoTerminou = false;
let vencedor = null;
let celulasVencedoras = [];
let jogadorEscolha = null;

// ========== REFERÊNCIAS DO DOM ==========
let elApp = null;
let elTabuleiro = null;
let elStatus = null;

// ========== FUNÇÕES DE INICIALIZAÇÃO ==========

/**
 * InicializarJogo: Inicializa o jogo e exibe tela de seleção.
 */
function InicializarJogo() {
  ResetarEstadoInterno();
  PreencherReferenciasDOM();
  RenderizarTelaInicial();
}

/**
 * ResetarEstadoInterno: Reseta todas as variáveis de estado.
 */
function ResetarEstadoInterno() {
  tabuleiro = [null, null, null, null, null, null, null, null, null];
  jogadorAtual = SIMBOLO_X;
  jogoTerminou = false;
  vencedor = null;
  celulasVencedoras = [];
  jogadorEscolha = null;
}

/**
 * PreencherReferenciasDOM: Armazena referências a elementos do DOM.
 */
function PreencherReferenciasDOM() {
  elApp = document.getElementById('app');
  if (!elApp) {
    LogarErro('Elemento #app não encontrado');
  }
}

// ========== FUNÇÕES DE RENDERIZAÇÃO ==========

/**
 * RenderizarTelaInicial: Exibe tela com 2 botões de seleção.
 */
function RenderizarTelaInicial() {
  if (!elApp) return;

  elApp.innerHTML = `
    <div class="flex flex-col items-center gap-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Jogo da Velha</h1>
      <p class="text-center text-gray-600 mb-6">Escolha seu símbolo:</p>
      <div class="flex gap-4">
        <button
          class="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          data-simbolo="X"
          aria-label="Jogar como X"
        >
          Jogar como X
        </button>
        <button
          class="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 active:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          data-simbolo="O"
          aria-label="Jogar como O"
        >
          Jogar como O
        </button>
      </div>
    </div>
  `;

  AnexarListenersSeleção();
}

/**
 * AnexarListenersSeleção: Anexa listeners aos botões de seleção.
 */
function AnexarListenersSeleção() {
  const botoesSimbolo = elApp.querySelectorAll('[data-simbolo]');
  botoesSimbolo.forEach(botao => {
    botao.addEventListener('click', LidarComSelecionarSimbolo);
  });
}

/**
 * RenderizarTabuleiro: Renderiza grid 3x3 com células.
 */
function RenderizarTabuleiro() {
  if (!elApp) return;

  const tabuleiro_html = tabuleiro
    .map((simbolo, indice) => {
      const éVencedora = celulasVencedoras.includes(indice);
      const classesVencedora = éVencedora ? 'bg-green-300 ring-2 ring-green-600 ring-offset-2' : '';
      const disabled = jogoTerminou || tabuleiro[indice] !== null;

      return `
        <button
          class="cell-button aspect-square text-2xl font-bold border-2 border-gray-300 rounded-lg bg-white 
                 hover:bg-gray-100 active:bg-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed 
                 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${classesVencedora}"
          data-index="${indice}"
          aria-label="Célula ${indice + 1}"
          ${disabled ? 'disabled' : ''}
        >
          ${simbolo || ''}
        </button>
      `;
    })
    .join('');

  const html = `
    <div class="flex flex-col items-center gap-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Jogo da Velha</h1>
      
      <div id="status" class="text-center text-lg font-semibold mb-4 min-h-8 text-gray-800" 
           aria-live="polite" role="status">
        ${MontarMensagemStatus()}
      </div>

      <div class="grid grid-cols-3 gap-2 w-full max-w-xs aspect-square" role="grid">
        ${tabuleiro_html}
      </div>

      <button
        class="reset-button mt-4 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg 
               hover:bg-blue-600 active:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
               transition-colors duration-200"
        aria-label="Reiniciar Partida"
      >
        Reiniciar Partida
      </button>
    </div>
  `;

  elApp.innerHTML = html;
  AnexarListenersTabuleiro();
}

/**
 * MontarMensagemStatus: Monta mensagem de status conforme estado do jogo.
 */
function MontarMensagemStatus() {
  if (jogoTerminou) {
    if (vencedor === SIMBOLO_X) return MENSAGENS.x_venceu;
    if (vencedor === SIMBOLO_O) return MENSAGENS.o_venceu;
    return MENSAGENS.empate;
  }

  return jogadorAtual === SIMBOLO_X ? MENSAGENS.x_vez : MENSAGENS.o_vez;
}

/**
 * RenderizarStatus: Atualiza texto de status no DOM.
 */
function RenderizarStatus() {
  const elStatus = document.getElementById('status');
  if (elStatus) {
    elStatus.textContent = MontarMensagemStatus();
  }
}

/**
 * AnexarListenersTabuleiro: Anexa listeners aos botões do tabuleiro e reset.
 */
function AnexarListenersTabuleiro() {
  // Listeners para células
  const botoescélulas = document.querySelectorAll('.cell-button');
  botoesélulas.forEach(botao => {
    botao.addEventListener('click', LidarComClickCelula);
    botao.addEventListener('keydown', LidarComKeyDownCelula);
  });

  // Listener para botão reset
  const botaoReset = document.querySelector('.reset-button');
  if (botaoReset) {
    botaoReset.addEventListener('click', LidarComClickResetar);
  }
}

// ========== FUNÇÕES DE VALIDAÇÃO E LÓGICA ==========

/**
 * ValidarJogadaValida: Valida se uma jogada é permitida.
 */
function ValidarJogadaValida(indice) {
  if (indice < 0 || indice >= TAMANHO_TABULEIRO) {
    return false;
  }

  if (tabuleiro[indice] !== null) {
    return false;
  }

  if (jogoTerminou) {
    return false;
  }

  return true;
}

/**
 * ExtrarIndice: Extrai índice de célula do evento.
 */
function ExtrarIndice(evento) {
  try {
    const indiceStr = evento.target.dataset.index;
    const indice = Number(indiceStr);

    if (isNaN(indice) || indice < 0 || indice >= TAMANHO_TABULEIRO) {
      return null;
    }

    return indice;
  } catch (erro) {
    LogarErro(`Erro ao extrair índice: ${erro.message}`);
    return null;
  }
}

/**
 * VerificarCombinaçãoVencedora: Verifica se 3 células têm o mesmo símbolo.
 */
function VerificarCombinaçãoVencedora(linha) {
  const [a, b, c] = linha;
  const val1 = tabuleiro[a];
  const val2 = tabuleiro[b];
  const val3 = tabuleiro[c];

  return val1 !== null && val1 === val2 && val2 === val3;
}

/**
 * TemEspacosLivres: Verifica se há células vazias.
 */
function TemEspacosLivres() {
  return tabuleiro.some(celula => celula === null);
}

/**
 * DetectarVitoria: Verifica 8 combinações de vitória e empate.
 */
function DetectarVitoria() {
  for (const linha of LINHAS_VITORIA) {
    if (VerificarCombinaçãoVencedora(linha)) {
      vencedor = jogadorAtual;
      celulasVencedoras = linha;
      jogoTerminou = true;
      return;
    }
  }

  if (!TemEspacosLivres()) {
    vencedor = null;
    jogoTerminou = true;
    return;
  }

  vencedor = null;
  jogoTerminou = false;
}

/**
 * ProximoJogador: Calcula o próximo jogador.
 */
function ProximoJogador(atual) {
  return atual === SIMBOLO_X ? SIMBOLO_O : SIMBOLO_X;
}

/**
 * AlternarJogador: Alterna para o próximo jogador.
 */
function AlternarJogador() {
  jogadorAtual = ProximoJogador(jogadorAtual);
}

// ========== FUNÇÕES DE PROCESSAMENTO ==========

/**
 * ProcessarJogada: Executa sequência completa de uma jogada.
 */
function ProcessarJogada(indice) {
  try {
    if (!ValidarJogadaValida(indice)) {
      LogarWarning(`Jogada inválida em índice ${indice}`);
      return false;
    }

    tabuleiro[indice] = jogadorAtual;
    DetectarVitoria();

    if (!jogoTerminou) {
      AlternarJogador();
    }

    RenderizarTabuleiro();
    RenderizarStatus();

    return true;
  } catch (erro) {
    LogarErro(`Erro ao processar jogada: ${erro.message}`);
    return false;
  }
}

/**
 * ResetarJogo: Retorna ao estado inicial (tela de seleção).
 */
function ResetarJogo() {
  ResetarEstadoInterno();
  RenderizarTelaInicial();
  TransferirFocoAposReset();
}

/**
 * TransferirFocoAposReset: Move foco para elemento focável após reset.
 */
function TransferirFocoAposReset() {
  const primeiroElemento = document.querySelector('button[data-simbolo]');
  if (primeiroElemento) {
    setTimeout(() => primeiroElemento.focus(), 0);
  }
}

// ========== HANDLERS DE EVENTOS ==========

/**
 * LidarComSelecionarSimbolo: Handler para seleção inicial de X ou O.
 */
function LidarComSelecionarSimbolo(evento) {
  try {
    const simbolo = evento.target.dataset.simbolo;

    if (!simbolo || (simbolo !== SIMBOLO_X && simbolo !== SIMBOLO_O)) {
      LogarWarning('Símbolo inválido selecionado');
      return;
    }

    jogadorEscolha = simbolo;
    jogadorAtual = SIMBOLO_X; // X sempre começa
    RenderizarTabuleiro();
    RenderizarStatus();
  } catch (erro) {
    LogarErro(`Erro ao selecionar símbolo: ${erro.message}`);
  }
}

/**
 * LidarComClickCelula: Handler para clique em célula.
 */
function LidarComClickCelula(evento) {
  try {
    const indice = ExtrarIndice(evento);

    if (indice === null) {
      return;
    }

    ProcessarJogada(indice);
  } catch (erro) {
    LogarErro(`Erro ao lidar com clique em célula: ${erro.message}`);
  }
}

/**
 * LidarComKeyDownCelula: Handler para keydown em célula (Enter e Espaço).
 */
function LidarComKeyDownCelula(evento) {
  try {
    if (evento.key !== 'Enter' && evento.key !== ' ') {
      return;
    }

    evento.preventDefault();

    const indice = ExtrarIndice(evento);

    if (indice === null) {
      return;
    }

    ProcessarJogada(indice);
  } catch (erro) {
    LogarErro(`Erro ao lidar com keydown em célula: ${erro.message}`);
  }
}

/**
 * LidarComClickResetar: Handler para clique em botão "Reiniciar Partida".
 */
function LidarComClickResetar(evento) {
  try {
    evento.preventDefault();
    ResetarJogo();
  } catch (erro) {
    LogarErro(`Erro ao reiniciar jogo: ${erro.message}`);
  }
}

// ========== FUNÇÕES AUXILIARES ==========

/**
 * LogarWarning: Loga um aviso.
 */
function LogarWarning(mensagem) {
  console.warn('⚠️', mensagem);
}

/**
 * LogarErro: Loga um erro.
 */
function LogarErro(mensagem) {
  console.error('❌', mensagem);
}

// ========== INICIALIZAÇÃO ==========

document.addEventListener('DOMContentLoaded', InicializarJogo);
