# Plan Tecnico - FutApp

## Entrada usada

- `.specify/memory/constitution.md`
- `.specify/memory/requirements.md`
- `.specify/memory/spec.md`
- Pre-analise do codebase atual do FutApp
- Exclusao total da pasta `jogo-da-velha/` como fonte de requisito, arquitetura ou codigo

## Caminhos encontrados antes do plan

### Memoria Specify

- `.specify/memory/constitution.md`
- `.specify/memory/requirements.md`
- `.specify/memory/spec.md`
- `.specify/memory/plan.md`

### Configuracao e dependencias

- `package.json`
- `package-lock.json`
- `app.json`
- `tsconfig.json`
- `eslint.config.js`

### Rotas e telas principais

- `src/app/_layout.tsx`
- `src/app/index.tsx`
- `src/app/login.tsx`
- `src/app/cadastro.tsx`
- `src/app/home.tsx`
- `src/app/ginasios.tsx`
- `src/app/lista.tsx`
- `src/app/detalhar.tsx`

### Servicos, tipos e tema

- `src/apiService/api.ts`
- `src/types/usuario.ts`
- `src/types/reserva.ts`
- `src/types/participante.ts`
- `constants/theme.ts`

### Backend local e scripts

- `json-server/db.json`
- `scripts/reset-project.js`
- `scripts/populate-reservas.sh`

### Componentes existentes que podem ser mantidos sem alteracao inicial

- `components/themed-text.tsx`
- `components/themed-view.tsx`
- `components/external-link.tsx`
- `components/haptic-tab.tsx`
- `components/hello-wave.tsx`
- `components/parallax-scroll-view.tsx`
- `components/ui/icon-symbol.tsx`
- `components/ui/icon-symbol.ios.tsx`
- `components/ui/collapsible.tsx`

### Assets existentes que podem ser mantidos sem alteracao inicial

- `assets/images/icon.png`
- `assets/images/favicon.png`
- `assets/images/splash-icon.png`
- `assets/images/android-icon-background.png`
- `assets/images/android-icon-foreground.png`
- `assets/images/android-icon-monochrome.png`
- `assets/images/react-logo.png`
- `assets/images/react-logo@2x.png`
- `assets/images/react-logo@3x.png`
- `assets/images/partial-react-logo.png`

### Fora do escopo

- `jogo-da-velha/`

## Arquivos afetados automaticamente

### Afetados diretamente pelo plan

- `.specify/memory/plan.md`

### Afetados por implementacao futura dos requisitos

- `src/apiService/api.ts`
- `src/app/login.tsx`
- `src/app/cadastro.tsx`
- `src/app/home.tsx`
- `src/app/ginasios.tsx`
- `src/app/lista.tsx`
- `src/app/detalhar.tsx`
- `src/app/_layout.tsx`
- `src/types/usuario.ts`
- `src/types/reserva.ts`
- `src/types/participante.ts`
- `constants/theme.ts`
- `json-server/db.json`
- `package.json`
- `package-lock.json`

### Afetados apenas se houver refatoracao de componentes compartilhados

- `components/themed-text.tsx`
- `components/themed-view.tsx`
- `components/ui/icon-symbol.tsx`

## Objetivo tecnico

Consolidar o FutApp como aplicativo Expo/React Native com Expo Router, API local em `json-server`, dominio de reservas de quadras e padroes de codigo em portugues. O plano prioriza alinhar o codigo atual aos outcomes EARS, reduzir duplicacao, corrigir riscos que impedem funcionamento real e preparar a base para testes manuais verificaveis.

## Principios de implementacao

- Preservar a stack definida na constitution.
- Nao usar a pasta `jogo-da-velha/`.
- Manter rotas em `src/app`.
- Centralizar chamadas HTTP em `src/apiService/api.ts`.
- Usar tipos compartilhados em `src/types`.
- Manter nomes de dominio em portugues.
- Usar PascalCase para componentes, telas, interfaces e types exportados.
- Usar camelCase para funcoes, estados e variaveis.
- Aplicar tratamento de erro padrao com `try/catch`, alerta amigavel e `console.log(error)`.
- Executar validacao viavel ao final de cada etapa de codigo.

## Riscos nao descritos na spec

### R-001 - `usuarioId` nao e propagado entre telas

O login navega para `/home` sem parametros, `home` navega para `/ginasios` sem `usuarioId`, e `ginasios` navega para `/lista` sem `usuarioId`. Como `lista` espera `usuarioId`, reservas podem ser criadas com dono vazio e as regras de dono podem falhar.

Mitigacao: definir uma estrategia unica para usuario logado. Opcao conservadora: passar `usuarioId` via parametros desde login ate detalhes. Opcao melhor: usar storage/helper de sessao e carregar o usuario nas telas protegidas.

### R-002 - `AsyncStorage` importado de `react-native`

O arquivo `src/app/login.tsx` importa `AsyncStorage` de `react-native`, comportamento que nao e confiavel em versoes modernas do React Native. Isso pode causar erro de runtime ou build dependendo da plataforma.

Mitigacao: instalar e usar `@react-native-async-storage/async-storage`, ou remover persistencia temporariamente e usar parametros ate haver dependencia aprovada.

### R-003 - Textos com caracteres corrompidos

Varios arquivos exibem mojibake, por exemplo `GinÃ¡sio`, `AtenÃ§Ã£o`, `HorÃ¡rio`, setas e emojis corrompidos. Isso prejudica UX e pode dificultar verificacao manual.

Mitigacao: normalizar os arquivos para UTF-8 e revisar textos visiveis em todas as telas principais.

### R-004 - Alertas diretos quebram compatibilidade web

Alguns fluxos usam `Alert.alert` diretamente, como confirmacao de deletar/remover, enquanto a spec exige compatibilidade web/mobile por helper.

Mitigacao: criar helper compartilhado `mostrarAlerta` e `confirmarAcao`, ou manter helpers locais padronizados em cada tela.

### R-005 - `JSON.parse` sem protecao em detalhes

`src/app/detalhar.tsx` faz parse direto do parametro `reserva`. Um parametro invalido pode derrubar a tela antes do estado `Reserva nao encontrada`.

Mitigacao: criar funcao `parseReserva` com `try/catch` e retorno `null`.

### R-006 - Tipos duplicados entre `api.ts` e `src/types`

`Reserva`, `Participante` e `Solicitacao` existem dentro de `api.ts`, enquanto tambem ha tipos em `src/types`. Isso viola a regra de tipos compartilhados e pode causar divergencia.

Mitigacao: mover contratos para `src/types` e importar no service.

### R-007 - Uso de `any`

Existem usos de `any` em `api.ts`, `ginasios.tsx` e handlers de data/hora. A constitution proibe `any` novo e recomenda tipos de dominio.

Mitigacao: tipar respostas de API, `Ginasio`, eventos de web e DateTimePicker quando alterados.

### R-008 - Entidade `alunos` parece legado fora do dominio atual

`api.ts` contem funcoes de `alunos` e `json-server/db.json` contem colecao `alunos`, mas a spec do FutApp cobre usuarios, ginasios, reservas, participantes e solicitacoes.

Mitigacao: confirmar se `alunos` e legado. Se nao houver uso real, remover em etapa controlada ou marcar como legado sem tocar no fluxo atual.

### R-009 - Aprovacao de solicitacao nao busca nome real do usuario

`handleAprovarSolicitacao` chama `findUserByEmail("")`, nao usa o resultado e cria nome como `Usuario {id}`.

Mitigacao: criar `findUserById` no service ou salvar nome do solicitante na solicitacao.

### R-010 - Edicao nao verifica conflito de horario

A spec atual exige conflito para criacao, mas uma edicao pode mover a reserva para um horario ja ocupado.

Mitigacao: estender regra de conflito para edicao ignorando a propria reserva por `id`.

### R-011 - Horarios podem passar de 24 horas

`calcularHoraFim` permite valores acima de `23:59`, por exemplo `24:30`, se inicio e duracao passarem do dia.

Mitigacao: definir regra de negocio para bloquear reservas que terminem no dia seguinte ou formatar de forma explicita.

### R-012 - `keyExtractor` usa `Math.random`

Listas usam `Math.random()` quando `id` esta ausente, causando remounts e instabilidade visual.

Mitigacao: exigir `id` para registros persistidos ou usar chave deterministica composta.

### R-013 - Senhas em texto puro no `json-server`

A spec descreve senha simples, mas ha risco de seguranca e dados sensiveis em `db.json`.

Mitigacao: manter apenas para ambiente didatico/local e documentar que nao e producao. Nao adicionar senhas reais.

## Fases do plan

### Fase 0 - Baseline e verificacao inicial

1. Executar lint com `npx.cmd expo lint`.
2. Registrar avisos existentes sem corrigir fora do escopo.
3. Confirmar que o projeto ignora `jogo-da-velha/` em analises do FutApp.
4. Confirmar que `.specify/memory` contem `constitution.md`, `requirements.md`, `spec.md` e `plan.md`.

Entregavel: baseline de qualidade conhecido.

### Fase 1 - Contratos de dominio e API

1. Consolidar tipos compartilhados:
   - `src/types/usuario.ts`
   - `src/types/reserva.ts`
   - `src/types/participante.ts`
2. Remover duplicacao de interfaces de `src/apiService/api.ts`.
3. Tipar `loginUser`, `findUserByEmail`, `createUser`, reservas, participantes e solicitacoes.
4. Substituir `any` em buscas de usuario e ginasio.
5. Avaliar remocao ou isolamento das funcoes `alunos`.
6. Adicionar funcao `findUserById` se o fluxo de aprovacao depender do nome real do usuario.

Entregavel: service tipado e alinhado ao dominio do FutApp.

### Fase 2 - Sessao e propagacao de usuario

1. Corrigir fluxo de `usuarioId` entre `login`, `home`, `ginasios`, `lista` e `detalhar`.
2. Escolher implementacao:
   - Parametros de rota para menor mudanca.
   - Storage com dependencia propria para solucao mais robusta.
3. Se usar storage, adicionar dependencia aprovada e atualizar `package.json`.
4. Garantir que novas reservas recebam `usuarioId` do usuario autenticado.
5. Garantir que a regra de dono funcione na lista e nos detalhes.

Entregavel: dono da reserva identificado corretamente.

### Fase 3 - Padronizacao de alertas e confirmacoes

1. Criar helper compartilhado ou helpers locais consistentes para alerta web/mobile.
2. Substituir `Alert.alert` direto em confirmacoes de deletar reserva e remover participante.
3. Padronizar mensagens de erro em portugues legivel.
4. Garantir que falhas preservem modais e formularios.

Entregavel: comportamento de erro e confirmacao compativel com web/mobile.

### Fase 4 - Reservas

1. Validar responsavel com `trim`.
2. Manter calculo de hora final e valor em funcoes fora do JSX.
3. Expandir conflito para edicao, se a regra de negocio for aceita.
4. Validar fim da reserva quando passar de `23:59`.
5. Trocar chaves aleatorias de listas por chaves deterministicas.
6. Garantir recarregamento apos criar, editar e deletar.

Entregavel: fluxo de reservas estavel e testavel.

### Fase 5 - Detalhes, participantes e solicitacoes

1. Proteger parse de `reserva` com `try/catch`.
2. Corrigir `loading` inutilizado ou exibir estado de carregamento.
3. Remover `findUserByEmail("")` e buscar usuario por id ou usar dado disponivel.
4. Garantir que solicitacao pendente bloqueie novo pedido.
5. Garantir que aprovacao crie participante com nome correto.
6. Garantir que rejeicao e aprovacao recarreguem dados.

Entregavel: tela de detalhes sem crashes previsiveis e com fluxo de solicitacao consistente.

### Fase 6 - Textos, encoding e UI

1. Normalizar arquivos principais para UTF-8.
2. Corrigir textos corrompidos visiveis.
3. Manter tema escuro/verde definido em `constants/theme.ts`.
4. Evitar novas cores soltas quando ja existir cor no tema.
5. Revisar labels e mensagens conforme portugues do Brasil.

Entregavel: interface legivel e consistente.

### Fase 7 - Dados locais

1. Preservar colecoes `usuarios`, `reservas`, `participantes`, `solicitacoes`.
2. Verificar se dados existentes permitem testar dono, nao dono, participante e solicitacao pendente.
3. Remover apenas dados claramente temporarios se houver pedido explicito.
4. Nao gravar senhas reais.

Entregavel: `json-server/db.json` adequado para teste manual.

### Fase 8 - Validacao

1. Rodar `npx.cmd expo lint`.
2. Subir `npm run server`.
3. Rodar `npx.cmd expo start`.
4. Testar manualmente:
   - Cadastro com campos vazios.
   - Cadastro com email duplicado.
   - Login valido.
   - Login invalido.
   - Selecao de ginasio.
   - Criacao de reserva sem conflito.
   - Criacao de reserva com conflito.
   - Edicao de reserva pelo dono.
   - Ocultacao de edicao para nao dono.
   - Detalhes de reserva.
   - Adicao e remocao de participante.
   - Solicitacao de participacao por nao dono.
   - Aprovacao e rejeicao pelo dono.
5. Conferir mudancas persistidas em `json-server/db.json`.

Entregavel: evidencias de validacao por lint e teste manual.

## Ordem recomendada de implementacao

1. Corrigir sessao/`usuarioId`, porque isso afeta dono, reserva e solicitacao.
2. Corrigir tipos/API, porque reduz erros antes de mexer nas telas.
3. Corrigir alertas e parse seguro, porque evita crashes e quebra web.
4. Corrigir reservas.
5. Corrigir detalhes/participantes/solicitacoes.
6. Corrigir encoding/textos.
7. Validar ponta a ponta.

## Matriz requisito -> arquivos principais

| Requisitos | Arquivos |
| --- | --- |
| RF-001 a RF-003, SP-001 a SP-003 | `src/app/index.tsx`, `src/app/_layout.tsx` |
| RF-004 a RF-010, SP-004 a SP-015 | `src/app/login.tsx`, `src/app/cadastro.tsx`, `src/apiService/api.ts`, `src/types/usuario.ts` |
| RF-011 a RF-013, SP-016 a SP-020 | `src/app/home.tsx`, `src/app/ginasios.tsx`, `src/types/reserva.ts` |
| RF-014 a RF-026, SP-021 a SP-041 | `src/app/lista.tsx`, `src/apiService/api.ts`, `src/types/reserva.ts`, `json-server/db.json` |
| RF-027 a RF-037, SP-042 a SP-063 | `src/app/detalhar.tsx`, `src/apiService/api.ts`, `src/types/participante.ts`, `src/types/usuario.ts`, `json-server/db.json` |
| RF-038 a RF-041, SP-064 a SP-068 | `src/apiService/api.ts`, telas com alertas |
| RNF-001 a RNF-010, SP-074 a SP-083 | `package.json`, `tsconfig.json`, `eslint.config.js`, `constants/theme.ts`, `.specify/memory/*` |

## Checklist de pronto

- [ ] `jogo-da-velha/` nao foi usado.
- [ ] `usuarioId` chega ate criacao, lista e detalhes de reserva.
- [ ] Dono visualiza acoes de dono.
- [ ] Nao dono nao visualiza acoes de dono.
- [ ] API esta centralizada em `src/apiService/api.ts`.
- [ ] Tipos compartilhados estao em `src/types`.
- [ ] Textos visiveis estao legiveis em portugues.
- [ ] Alertas funcionam em web e mobile.
- [ ] Conflito de reserva e validado.
- [ ] Participantes e solicitacoes persistem no `json-server`.
- [ ] `npx.cmd expo lint` executa sem erros.

## Decisoes pendentes

1. Definir se a sessao sera por parametros de rota ou storage persistente.
2. Definir se `alunos` sera removido como legado ou mantido fora do fluxo.
3. Definir se edicao de reserva tambem deve bloquear conflito.
4. Definir regra para reserva que ultrapassa meia-noite.
5. Definir se sera adicionada dependencia oficial de AsyncStorage.
