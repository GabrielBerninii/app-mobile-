# Constitution do Projeto

Projeto: FutApp, aplicativo mobile/web para autenticacao de usuarios, escolha de ginasios, criacao de reservas de quadras, gerenciamento de participantes e solicitacoes de entrada em reservas.

Esta constitution substitui toda memoria antiga do Specify. Qualquer conteudo anterior deve ser considerado obsoleto.

## Stack e versoes (nao negociaveis)

- Runtime principal: Expo com `expo-router`.
- Linguagem: TypeScript em arquivos `.tsx` e `.ts`.
- UI: React `19.1.0`, React Native `0.81.5` e React Native Web `0.21.0`.
- Expo: `~54.0.35`.
- Navegacao: `expo-router ~6.0.24` com rotas em `src/app`.
- Navegacao nativa: `@react-navigation/native ^7.1.8`, `@react-navigation/bottom-tabs ^7.4.0` e `@react-navigation/elements ^2.6.3`.
- Componentes nativos auxiliares:
  - `@react-native-community/datetimepicker 8.4.4` para datas e horarios no mobile.
  - `react-native-gesture-handler ~2.28.0`.
  - `react-native-reanimated ~4.1.1`.
  - `react-native-safe-area-context ~5.6.0`.
  - `react-native-screens ~4.16.0`.
- Backend local de desenvolvimento: `json-server ^1.0.0-beta.15`.
- Banco local simulado: `json-server/db.json`.
- Qualidade: `eslint ^9.25.0`, `eslint-config-expo ~10.0.0`, TypeScript `~5.9.2`.
- Scripts oficiais:
  - `npm start` ou `npx.cmd expo start` para iniciar o Expo no Windows.
  - `npm run android`, `npm run ios`, `npm run web` para plataformas.
  - `npm run lint` para validacao.
  - `npm run server` para subir o json-server na porta `3000`.
- O app consome API em:
  - Web/iOS: `http://localhost:3000`.
  - Android emulator: `http://10.0.2.2:3000`.
- Nao atualizar versoes, trocar stack, adicionar framework de estado global, trocar backend ou mover o roteamento para outra biblioteca sem aprovacao explicita.

## Estrutura de pastas (onde cada tipo de arquivo vai)

- `src/app/`
  - Telas e rotas do Expo Router.
  - Cada arquivo representa uma tela navegavel.
  - Rotas atuais do app principal:
    - `_layout.tsx`: configuracao do Stack.
    - `index.tsx`: tela inicial.
    - `login.tsx`: login.
    - `cadastro.tsx`: criacao de conta.
    - `home.tsx`: menu principal.
    - `ginasios.tsx`: selecao de ginasio.
    - `lista.tsx`: lista/criacao/edicao/remocao de reservas.
    - `detalhar.tsx`: detalhes da reserva, participantes e solicitacoes.
- `src/apiService/`
  - Funcoes de acesso ao backend local.
  - Toda chamada `fetch` deve ficar centralizada aqui, nao espalhada nas telas.
  - `api.ts` contem `fetchJson`, funcoes de usuario, reservas, participantes e solicitacoes.
- `src/types/`
  - Tipos e interfaces compartilhados.
  - Usar para entidades de dominio como `Usuario`, `Reserva`, `Ginasio`, `Participante`, `Solicitacao` e status relacionados.
- `constants/`
  - Constantes globais de UI e configuracao.
  - `theme.ts` guarda cores oficiais e deve ser usado nas telas em vez de cores novas soltas.
- `components/`
  - Componentes reutilizaveis vindos do template ou componentes compartilhados.
  - Componentes especificos de uma tela podem ficar no proprio arquivo da tela enquanto forem pequenos.
- `assets/`
  - Imagens e icones estaticos do app.
- `json-server/`
  - Dados locais do backend simulado.
  - `db.json` deve preservar colecoes usadas pelo app: `usuarios`, `reservas`, `participantes`, `solicitacoes`.
- `scripts/`
  - Scripts auxiliares do projeto.
- `.specify/memory/`
  - Memoria oficial do Specify.
  - Deve conter esta `constitution.md`.
  - Arquivos antigos de plano, resumo, tarefas ou especificacoes devem ser recriados somente quando houver uma nova necessidade real.
- `jogo-da-velha/`
  - Pasta fora do escopo do FutApp.
  - Nunca usar como referencia arquitetural, funcional, visual ou de padrao de codigo.
  - Nunca misturar dependencias, telas, assets, regras ou nomes dessa pasta com o app principal.

## Padroes de codigo (naming, imports, exports)

- Idioma:
  - Usar portugues do Brasil para nomes de variaveis, funcoes, estados, mensagens de UI e comentarios uteis.
  - Exemplos bons: `carregarReservas`, `mostrarAlerta`, `abrirModalNovaReserva`, `nomeResponsavel`, `usuarioLogadoStr`.
- PascalCase:
  - Obrigatorio para componentes React, telas, interfaces e types exportados.
  - Exemplos: `Login`, `Cadastro`, `Lista`, `DetalhesReserva`, `Reserva`, `Participante`, `Solicitacao`, `StatusParticipante`.
- camelCase:
  - Obrigatorio para variaveis, funcoes, constantes locais de objeto e estados.
  - Mesmo em camelCase, os nomes devem continuar em portugues.
  - Exemplos: `setReservas`, `temSolicitacao`, `handleSalvarReserva`, `formatarData`.
- Constantes:
  - Usar `UPPER_SNAKE_CASE` apenas para listas fixas e valores globais imutaveis dentro do modulo.
  - Exemplos: `QUADRAS`, `DURACOES`.
- Arquivos:
  - Rotas/telas em `src/app` devem usar nomes minusculos e descritivos, alinhados ao Expo Router.
  - Tipos devem ficar em arquivos `.ts`.
  - Telas com JSX devem ficar em `.tsx`.
- Imports:
  - Ordem recomendada:
    1. Bibliotecas externas (`react`, `expo-router`, `react-native`, pacotes Expo).
    2. Tema/constantes (`../../constants/theme`).
    3. Servicos e tipos internos (`../apiService/api`, `../types/...`).
  - Evitar imports nao usados. Rodar lint apos alteracoes relevantes.
- Exports:
  - Telas em `src/app` devem exportar `default function NomeDaTela()`.
  - Funcoes de API em `src/apiService/api.ts` devem ser `export async function nomeDaFuncao(...)`.
  - Tipos compartilhados devem ser exportados explicitamente.
- Estado e hooks:
  - Usar `useState` para estado local da tela.
  - Usar `useEffect` para carregamento inicial e efeitos relacionados a parametros.
  - Quando uma funcao usada no `useEffect` crescer, avaliar `useCallback` ou ajustar dependencias em vez de ignorar avisos.
- UI:
  - Usar `StyleSheet.create`.
  - Usar `theme.colors` para cores do app.
  - Manter visual consistente com o tema escuro/verde do FutApp.
  - Evitar estilos inline, exceto adaptacoes inevitaveis para web como `input type="date"` e `input type="time"`.
- Clean Code:
  - Funcoes devem ter uma responsabilidade clara.
  - Validacoes devem acontecer antes das chamadas de API.
  - Regras de dominio reutilizaveis, como calculo de horario, valor e conflito, devem ficar fora do JSX.
  - Evitar duplicacao: se o mesmo alerta, parse, validacao ou chamada de API se repetir, extrair funcao pequena.
- SOLID:
  - Separar UI, regras de dominio e acesso a dados.
  - Telas coordenam estado e interacao; `apiService` conversa com backend; tipos descrevem contratos.
  - Nao fazer uma tela depender de detalhes internos do `json-server` alem dos dados que recebe por funcoes de API.
  - Preferir funcoes pequenas e composaveis a blocos grandes dentro de handlers.

## Tratamento de erros (formato padrao)

- Chamadas assincronas devem usar `try/catch`.
- Erros de API devem ser convertidos em `Error` com mensagem clara.
- Formato atual de erro em `fetchJson`:

```ts
throw new Error(`API error ${response.status}: ${text}`);
```

- Handlers de tela devem seguir o formato:

```ts
try {
  // validar entrada
  // executar acao
  // mostrar sucesso
} catch (error) {
  const mensagem =
    error instanceof Error ? error.message : "Mensagem amigavel de fallback.";
  mostrarAlerta("Erro", mensagem);
  console.log(error);
}
```

- Alertas:
  - Usar helper `mostrarAlerta(titulo, mensagem)` quando a tela precisar funcionar em web e mobile.
  - No web, usar `window.alert`.
  - No mobile, usar `Alert.alert`.
- Validacoes:
  - Campos obrigatorios devem ser validados antes da chamada de API.
  - Mensagens devem ser claras e em portugues.
  - Conflitos de reserva devem ser verificados antes de criar nova reserva.
- Falhas silenciosas:
  - Nao engolir erro sem registro.
  - Se a UI nao exibir alerta por decisao consciente, ao menos registrar com `console.log(error)` e manter estado consistente.
- Estado apos erro:
  - Sempre finalizar loading quando existir estado de carregamento.
  - Nao fechar modal nem limpar formulario se a operacao falhar.
  - Depois de sucesso, recarregar dados com a funcao de carregamento da tela.

## Regras que o agente NUNCA deve violar

- Nunca usar, importar, copiar, adaptar ou citar codigo da pasta `jogo-da-velha/` para o FutApp.
- Nunca recriar memoria antiga do Specify sem pedido explicito.
- Nunca misturar funcionalidades de jogo da velha com reservas, ginasios, participantes, usuarios ou solicitacoes.
- Nunca trocar Expo Router por outro roteador sem aprovacao explicita.
- Nunca espalhar `fetch` diretamente pelas telas; chamadas ao backend pertencem a `src/apiService/api.ts`.
- Nunca alterar versoes principais da stack sem justificar e receber aprovacao.
- Nunca remover `json-server/db.json` nem suas colecoes principais sem criar migracao/alternativa clara.
- Nunca quebrar compatibilidade web/mobile: qualquer alerta, input de data/hora ou URL de API precisa considerar `Platform.OS`.
- Nunca usar nomes genericos em ingles para dominio novo quando houver equivalente claro em portugues.
- Nunca criar componentes, funcoes ou tipos sem nomes descritivos.
- Nunca deixar erro de usuario sem mensagem amigavel.
- Nunca commitar ou gravar senhas reais, tokens, chaves privadas ou dados sensiveis.
- Nunca ignorar lint ou erros de TypeScript quando a alteracao puder corrigi-los no escopo da tarefa.
- Nunca fazer refatoracoes grandes junto com uma correcao pequena sem necessidade real.
- Nunca alterar arquivos fora do escopo solicitado quando o problema puder ser resolvido localmente.
- Nunca remover alteracoes existentes do usuario sem autorizacao explicita.
- Nunca usar `any` em novos codigos quando o tipo puder ser declarado com as interfaces do dominio.
- Nunca criar novas cores soltas sem avaliar primeiro `constants/theme.ts`.
- Nunca duplicar interfaces entre `apiService` e `src/types` em novas funcionalidades; preferir tipos compartilhados.
- Nunca encerrar uma tarefa de codigo sem, no minimo, uma verificacao viavel como lint, typecheck ou leitura do trecho alterado.
