# Tasks - FutApp

## Objetivo

Lista executavel de tarefas para alinhar o FutApp a `constitution.md`, `requirements.md`, `spec.md` e `plan.md`.

Escopo: aplicativo FutApp de autenticacao, ginasios, reservas, participantes e solicitacoes.

Fora do escopo: `jogo-da-velha/`.

## Convencoes

- Status inicial de todas as tarefas: pendente.
- Cada tarefa deve preservar a stack definida na constitution.
- Cada alteracao de codigo deve ser validada com `npx.cmd expo lint` quando viavel.
- Nenhuma tarefa deve usar arquivos da pasta `jogo-da-velha/`.

## Arquivos principais afetados

- `src/apiService/api.ts`
- `src/app/_layout.tsx`
- `src/app/index.tsx`
- `src/app/login.tsx`
- `src/app/cadastro.tsx`
- `src/app/home.tsx`
- `src/app/ginasios.tsx`
- `src/app/lista.tsx`
- `src/app/detalhar.tsx`
- `src/types/usuario.ts`
- `src/types/reserva.ts`
- `src/types/participante.ts`
- `constants/theme.ts`
- `json-server/db.json`
- `package.json`
- `package-lock.json`
- `.specify/memory/tasks.md`

## Fase 0 - Baseline

### T001 - Validar memoria vigente

- Arquivos: `.specify/memory/constitution.md`, `.specify/memory/requirements.md`, `.specify/memory/spec.md`, `.specify/memory/plan.md`, `.specify/memory/tasks.md`
- Dependencias: nenhuma
- Acoes:
  - Confirmar que os cinco artefatos existem na pasta `.specify/memory`.
  - Confirmar que `jogo-da-velha/` aparece apenas como exclusao de escopo.
- Aceite:
  - A pasta `.specify/memory` contem `constitution.md`, `requirements.md`, `spec.md`, `plan.md` e `tasks.md`.
  - Nenhum requisito funcional de jogo da velha aparece nos artefatos.

### T002 - Rodar lint baseline

- Arquivos: projeto inteiro
- Dependencias: T001
- Acoes:
  - Executar `npx.cmd expo lint`.
  - Registrar erros e avisos existentes.
- Aceite:
  - Resultado do lint conhecido antes das alteracoes funcionais.

## Fase 1 - Tipos e API

### T003 - Consolidar tipos de usuario

- Arquivos: `src/types/usuario.ts`, `src/apiService/api.ts`
- Dependencias: T002
- Acoes:
  - Garantir interface `Usuario` com `id`, `nome`, `email`, `senha`.
  - Ajustar `api.ts` para importar `Usuario` de `src/types/usuario.ts`.
- Aceite:
  - `api.ts` nao declara interface duplicada de usuario.
  - Funcoes de usuario retornam `Usuario`, `Usuario[]` ou `null` de forma tipada.

### T004 - Consolidar tipos de reserva

- Arquivos: `src/types/reserva.ts`, `src/apiService/api.ts`, `src/app/lista.tsx`, `src/app/detalhar.tsx`
- Dependencias: T003
- Acoes:
  - Garantir `Reserva` e `Ginasio` em `src/types/reserva.ts`.
  - Remover interface `Reserva` duplicada de `api.ts`.
  - Importar `Reserva` das telas e service pelo arquivo de tipos.
- Aceite:
  - Existe uma unica fonte de verdade para `Reserva`.
  - `usuarioId` existe no tipo `Reserva`.

### T005 - Consolidar tipos de participante e solicitacao

- Arquivos: `src/types/participante.ts`, `src/apiService/api.ts`, `src/app/detalhar.tsx`
- Dependencias: T004
- Acoes:
  - Garantir `Participante`, `Solicitacao`, `StatusParticipante` e `StatusSolicitacao` em `src/types/participante.ts`.
  - Remover interfaces duplicadas de `api.ts`.
  - Ajustar imports em `detalhar.tsx`.
- Aceite:
  - Existe uma unica fonte de verdade para participantes e solicitacoes.
  - Status aceitos sao tipados e restritos aos valores da spec.

### T006 - Remover `any` evitavel do service

- Arquivos: `src/apiService/api.ts`
- Dependencias: T003, T004, T005
- Acoes:
  - Tipar resposta de `loginUser`.
  - Trocar `.find((u: any) => ...)` por uso de `Usuario`.
  - Tipar funcoes de reservas, participantes e solicitacoes.
- Aceite:
  - `api.ts` nao usa `any` em codigo de dominio novo ou alterado.

### T007 - Criar busca de usuario por id

- Arquivos: `src/apiService/api.ts`, `src/types/usuario.ts`
- Dependencias: T003
- Acoes:
  - Criar `findUserById(usuarioId: string)`.
  - Consultar `/usuarios/{usuarioId}` ou endpoint equivalente do json-server.
  - Retornar `Usuario | null`.
- Aceite:
  - Aprovacao de solicitacao pode obter nome real do usuario sem `findUserByEmail("")`.

### T008 - Isolar legado de alunos

- Arquivos: `src/apiService/api.ts`, `json-server/db.json`
- Dependencias: T006
- Acoes:
  - Verificar se alguma tela usa funcoes de `alunos`.
  - Se nao houver uso, marcar funcoes como legado ou remover em alteracao controlada.
  - Nao remover colecao de dados sem necessidade.
- Aceite:
  - O dominio principal do FutApp fica claro no service.
  - Nenhum fluxo de reservas depende de `alunos`.

## Fase 2 - Sessao e usuario logado

### T009 - Definir estrategia de sessao conservadora

- Arquivos: `src/app/login.tsx`, `src/app/home.tsx`, `src/app/ginasios.tsx`, `src/app/lista.tsx`, `src/app/detalhar.tsx`
- Dependencias: T003
- Acoes:
  - Usar parametros de rota para propagar `usuarioId` e, se necessario, `usuarioNome`.
  - Evitar adicionar dependencia nova de storage nesta etapa.
- Aceite:
  - Apos login valido, `usuarioId` chega ate `/lista` e `/detalhar`.

### T010 - Corrigir navegacao do login para home

- Arquivos: `src/app/login.tsx`
- Dependencias: T009
- Acoes:
  - Remover ou evitar uso de `AsyncStorage` vindo de `react-native`.
  - Navegar para `/home` passando `usuarioId` e `usuarioNome`.
- Aceite:
  - Login valido navega com parametros do usuario autenticado.
  - Nao ha import quebrado de `AsyncStorage` em `login.tsx`.

### T011 - Propagar usuario de home para ginasios

- Arquivos: `src/app/home.tsx`
- Dependencias: T010
- Acoes:
  - Ler parametros com `useLocalSearchParams`.
  - Enviar `usuarioId` e `usuarioNome` ao navegar para `/ginasios`.
- Aceite:
  - `/ginasios` recebe o usuario autenticado.

### T012 - Propagar usuario de ginasios para lista

- Arquivos: `src/app/ginasios.tsx`, `src/types/reserva.ts`
- Dependencias: T011
- Acoes:
  - Tipar item `ginasio` com `Ginasio`.
  - Enviar `usuarioId`, `usuarioNome`, `ginasio` e `ginasioId` para `/lista`.
- Aceite:
  - `/lista` recebe o usuario autenticado e o ginasio selecionado.

### T013 - Garantir dono na criacao de reserva

- Arquivos: `src/app/lista.tsx`, `src/types/reserva.ts`
- Dependencias: T012
- Acoes:
  - Usar `usuarioLogadoStr` vindo dos parametros.
  - Persistir `usuarioId` em novas reservas.
  - Impedir criacao se `usuarioId` estiver ausente, com mensagem amigavel.
- Aceite:
  - Nova reserva salva `usuarioId`.
  - Dono ve badge e acoes de dono apos recarregar.

## Fase 3 - Alertas, confirmacoes e erros

### T014 - Padronizar alerta em cadastro

- Arquivos: `src/app/cadastro.tsx`
- Dependencias: T002
- Acoes:
  - Usar `mostrarAlerta` em todos os caminhos de sucesso e erro.
  - Remover `Alert.alert` direto onde houver helper.
- Aceite:
  - Cadastro usa alerta compativel com web/mobile.

### T015 - Criar confirmacao compativel na lista

- Arquivos: `src/app/lista.tsx`
- Dependencias: T013
- Acoes:
  - Substituir confirmacao direta por helper compativel com web/mobile.
  - Em web, usar `window.confirm`.
  - Em mobile, usar `Alert.alert`.
- Aceite:
  - Exclusao de reserva pede confirmacao em web e mobile.

### T016 - Criar confirmacao compativel nos detalhes

- Arquivos: `src/app/detalhar.tsx`
- Dependencias: T015
- Acoes:
  - Substituir confirmacao direta de remover participante por helper compativel.
- Aceite:
  - Remocao de participante pede confirmacao em web e mobile.

### T017 - Padronizar fallbacks de erro

- Arquivos: `src/app/login.tsx`, `src/app/cadastro.tsx`, `src/app/lista.tsx`, `src/app/detalhar.tsx`
- Dependencias: T014, T015, T016
- Acoes:
  - Garantir mensagens em portugues legivel.
  - Garantir `console.log(error)` nos catches.
  - Garantir que modal nao feche em falha.
- Aceite:
  - Todos os handlers assincronos alterados seguem o formato da constitution.

## Fase 4 - Reservas

### T018 - Proteger parametros da lista

- Arquivos: `src/app/lista.tsx`
- Dependencias: T013
- Acoes:
  - Validar `ginasioId`.
  - Exibir alerta ou estado amigavel se parametro estiver invalido.
- Aceite:
  - Lista nao tenta carregar reservas com `NaN`.

### T019 - Validar reserva que passa de meia-noite

- Arquivos: `src/apiService/api.ts`, `src/app/lista.tsx`
- Dependencias: T018
- Acoes:
  - Criar regra para impedir `horaFim` acima de `23:59`.
  - Exibir alerta amigavel quando horario ultrapassar o dia.
- Aceite:
  - Reserva com fim em `24:00` ou maior nao e persistida.

### T020 - Estender conflito para edicao

- Arquivos: `src/apiService/api.ts`, `src/app/lista.tsx`
- Dependencias: T019
- Acoes:
  - Permitir que `verificarConflito` ignore a propria reserva por `id`.
  - Aplicar verificacao tambem em edicao.
- Aceite:
  - Edicao nao permite sobrepor horario de outra reserva.

### T021 - Remover chaves aleatorias da lista de reservas

- Arquivos: `src/app/lista.tsx`
- Dependencias: T018
- Acoes:
  - Trocar `Math.random()` por chave deterministica.
  - Preferir `item.id`.
  - Criar fallback composto apenas se inevitavel.
- Aceite:
  - `FlatList` de reservas nao usa `Math.random()`.

### T022 - Revisar fluxo de criar/editar/deletar reserva

- Arquivos: `src/app/lista.tsx`, `src/apiService/api.ts`, `json-server/db.json`
- Dependencias: T020, T021
- Acoes:
  - Confirmar reset de formulario em nova reserva.
  - Confirmar preenchimento em edicao.
  - Confirmar recarregamento apos mutacoes.
- Aceite:
  - Criacao, edicao e exclusao atendem RF-016 a RF-024.

## Fase 5 - Detalhes, participantes e solicitacoes

### T023 - Proteger parse de reserva

- Arquivos: `src/app/detalhar.tsx`
- Dependencias: T005
- Acoes:
  - Criar funcao `parseReserva`.
  - Retornar `null` em JSON invalido.
- Aceite:
  - Parametro `reserva` invalido exibe `Reserva nao encontrada` sem crash.

### T024 - Corrigir loading nos detalhes

- Arquivos: `src/app/detalhar.tsx`
- Dependencias: T023
- Acoes:
  - Exibir estado de carregamento ou remover estado se desnecessario.
  - Garantir finalizacao de loading em sucesso, erro e reserva ausente.
- Aceite:
  - Nao ha warning de `loading` nao usado.

### T025 - Corrigir aprovacao de solicitacao

- Arquivos: `src/app/detalhar.tsx`, `src/apiService/api.ts`, `src/types/usuario.ts`
- Dependencias: T007, T024
- Acoes:
  - Remover `findUserByEmail("")`.
  - Usar `findUserById` para obter nome/email do solicitante.
  - Criar participante aprovado com nome real quando encontrado.
- Aceite:
  - Aprovacao nao usa chamada vazia por email.
  - Participante aprovado recebe nome verificavel.

### T026 - Remover chaves aleatorias dos detalhes

- Arquivos: `src/app/detalhar.tsx`
- Dependencias: T023
- Acoes:
  - Remover `Math.random()` dos `keyExtractor`.
  - Usar `id` ou chave deterministica.
- Aceite:
  - Listas de participantes e solicitacoes nao usam `Math.random()`.

### T027 - Validar solicitacao unica

- Arquivos: `src/app/detalhar.tsx`, `src/apiService/api.ts`
- Dependencias: T025
- Acoes:
  - Confirmar `temSolicitacaoPendente` antes de criar solicitacao.
  - Bloquear duplo toque ou chamada repetida quando ja houver pendente.
- Aceite:
  - Usuario nao dono nao cria duas solicitacoes pendentes para a mesma reserva.

### T028 - Revisar autorizacao visual nos detalhes

- Arquivos: `src/app/detalhar.tsx`
- Dependencias: T025
- Acoes:
  - Garantir que somente dono veja adicionar/remover participante e aprovar/rejeitar.
  - Garantir que nao dono veja solicitar participacao ou aguardando aprovacao.
- Aceite:
  - Tela atende RF-030 a RF-037.

## Fase 6 - Textos, encoding e UI

### T029 - Corrigir textos corrompidos em rotas principais

- Arquivos: `src/app/index.tsx`, `src/app/login.tsx`, `src/app/cadastro.tsx`, `src/app/home.tsx`, `src/app/ginasios.tsx`, `src/app/lista.tsx`, `src/app/detalhar.tsx`
- Dependencias: T017
- Acoes:
  - Corrigir acentos, setas e textos visiveis quebrados.
  - Manter portugues do Brasil.
  - Evitar alterar layout sem necessidade.
- Aceite:
  - Textos principais aparecem legiveis.

### T030 - Revisar textos de alerta

- Arquivos: `src/app/login.tsx`, `src/app/cadastro.tsx`, `src/app/lista.tsx`, `src/app/detalhar.tsx`
- Dependencias: T029
- Acoes:
  - Padronizar titulos `Atenção`, `Erro`, `Sucesso`.
  - Padronizar mensagens da spec.
- Aceite:
  - Alertas atendem RF-004 a RF-039 e SP-069 a SP-073.

### T031 - Revisar uso do tema

- Arquivos: `constants/theme.ts`, `src/app/*.tsx`
- Dependencias: T029
- Acoes:
  - Manter cores principais em `theme.colors`.
  - Avaliar hexadecimais soltos e mover para tema se forem reutilizados.
- Aceite:
  - Novas cores ou cores repetidas ficam centralizadas quando fizer sentido.

## Fase 7 - Dados locais

### T032 - Preparar dados de teste

- Arquivos: `json-server/db.json`
- Dependencias: T022, T028
- Acoes:
  - Garantir pelo menos dois usuarios.
  - Garantir uma reserva de dono A.
  - Garantir uma reserva de dono B.
  - Garantir participante aprovado.
  - Garantir solicitacao pendente.
- Aceite:
  - Dados permitem testar dono, nao dono, participante e solicitacao.

### T033 - Remover dados sensiveis reais

- Arquivos: `json-server/db.json`
- Dependencias: T032
- Acoes:
  - Verificar se ha senhas reais, tokens ou dados sensiveis.
  - Substituir por dados didaticos se necessario.
- Aceite:
  - `db.json` nao contem credenciais reais conhecidas.

## Fase 8 - Validacao final

### T034 - Rodar lint final

- Arquivos: projeto inteiro
- Dependencias: T003 a T033
- Acoes:
  - Executar `npx.cmd expo lint`.
  - Corrigir erros no escopo da implementacao.
- Aceite:
  - Lint final executa sem erros.
  - Avisos residuais sao documentados se nao forem corrigidos.

### T035 - Validar server local

- Arquivos: `package.json`, `json-server/db.json`
- Dependencias: T034
- Acoes:
  - Executar `npm run server`.
  - Confirmar API na porta `3000`.
- Aceite:
  - Endpoints de `usuarios`, `reservas`, `participantes` e `solicitacoes` respondem.

### T036 - Validar Expo

- Arquivos: projeto inteiro
- Dependencias: T034
- Acoes:
  - Executar `npx.cmd expo start`.
  - Confirmar bundling sem erro.
- Aceite:
  - Expo inicia sem erro de sintaxe ou bundling.

### T037 - Testar fluxo de autenticacao

- Arquivos: `src/app/index.tsx`, `src/app/login.tsx`, `src/app/cadastro.tsx`, `src/apiService/api.ts`, `json-server/db.json`
- Dependencias: T035, T036
- Acoes:
  - Testar cadastro vazio.
  - Testar email duplicado.
  - Testar cadastro valido.
  - Testar login invalido.
  - Testar login valido.
- Aceite:
  - RF-001 a RF-010 passam manualmente.

### T038 - Testar fluxo de ginasios e reservas

- Arquivos: `src/app/home.tsx`, `src/app/ginasios.tsx`, `src/app/lista.tsx`, `src/apiService/api.ts`, `json-server/db.json`
- Dependencias: T037
- Acoes:
  - Selecionar ginasio.
  - Criar reserva sem conflito.
  - Tentar criar reserva com conflito.
  - Editar reserva do dono.
  - Confirmar ocultacao de editar/deletar para nao dono.
  - Deletar reserva do dono.
- Aceite:
  - RF-011 a RF-026 passam manualmente.

### T039 - Testar fluxo de detalhes

- Arquivos: `src/app/detalhar.tsx`, `src/apiService/api.ts`, `json-server/db.json`
- Dependencias: T038
- Acoes:
  - Abrir detalhes de reserva.
  - Adicionar participante como dono.
  - Remover participante como dono.
  - Solicitar participacao como nao dono.
  - Aprovar solicitacao como dono.
  - Rejeitar solicitacao como dono.
- Aceite:
  - RF-027 a RF-037 passam manualmente.

### T040 - Validar compatibilidade web/mobile definida

- Arquivos: `src/apiService/api.ts`, `src/app/login.tsx`, `src/app/cadastro.tsx`, `src/app/lista.tsx`, `src/app/detalhar.tsx`
- Dependencias: T039
- Acoes:
  - Confirmar `BASE_URL` por plataforma.
  - Confirmar alertas web/mobile.
  - Confirmar inputs de data/hora web/mobile.
- Aceite:
  - RF-038 a RF-041 passam por leitura de codigo e teste manual viavel.

## Tarefas opcionais pos-MVP

### T041 - Adotar AsyncStorage oficial

- Arquivos: `package.json`, `package-lock.json`, `src/app/login.tsx`, possivel helper de sessao
- Dependencias: T040
- Acoes:
  - Instalar `@react-native-async-storage/async-storage`, se aprovado.
  - Criar helper de sessao.
  - Substituir parametros de rota por sessao persistente.
- Aceite:
  - Usuario permanece identificavel apos recarregar app.

### T042 - Criar helper compartilhado de UI

- Arquivos: possivel `src/utils/alertas.ts`, telas principais
- Dependencias: T040
- Acoes:
  - Extrair `mostrarAlerta` e `confirmarAcao`.
  - Remover duplicacao entre telas.
- Aceite:
  - Alertas e confirmacoes usam um unico helper compartilhado.

### T043 - Criar testes automatizados de regras puras

- Arquivos: `src/apiService/api.ts` ou novo modulo de dominio
- Dependencias: T040
- Acoes:
  - Separar calculo de hora, valor e conflito em modulo testavel.
  - Adicionar testes se infraestrutura for aprovada.
- Aceite:
  - Regras criticas de reserva ficam cobertas por teste automatizado.

## Ordem recomendada para execucao

1. T001-T002
2. T003-T008
3. T009-T013
4. T014-T017
5. T018-T022
6. T023-T028
7. T029-T033
8. T034-T040
9. T041-T043, somente se aprovado

## Criterio final de pronto

- O app inicia com `npx.cmd expo start`.
- O backend local responde com `npm run server`.
- O lint nao possui erros.
- Fluxos principais de login, cadastro, ginasios, reservas, detalhes, participantes e solicitacoes funcionam.
- `usuarioId` e regras de dono funcionam ponta a ponta.
- Nenhum comportamento do jogo da velha foi usado, importado ou especificado.
