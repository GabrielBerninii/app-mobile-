# Spec - FutApp

## Objetivo

Especificar o comportamento esperado do FutApp usando outcomes EARS verificaveis. Esta spec deve guiar implementacoes futuras sem depender de memoria antiga ou de qualquer conteudo da pasta `jogo-da-velha/`.

## Contexto do produto

O FutApp permite que usuarios criem conta, acessem o app, escolham um ginasio, criem reservas de quadras, vejam detalhes de reservas, adicionem participantes manualmente e gerenciem solicitacoes de entrada.

## Arquitetura esperada

- Rotas e telas ficam em `src/app`.
- Chamadas HTTP ficam em `src/apiService/api.ts`.
- Tipos de dominio ficam em `src/types`.
- Tema visual fica em `constants/theme.ts`.
- Dados locais de desenvolvimento ficam em `json-server/db.json`.
- A API local roda com `npm run server` na porta `3000`.
- O app roda com Expo Router usando `npm start` ou `npx.cmd expo start`.

## Fluxo 1 - Entrada, login e cadastro

### SP-001 - Tela inicial

WHEN o aplicativo iniciar na rota `/`, THE SYSTEM SHALL renderizar a tela inicial com as acoes `ENTRAR` e `CRIAR CONTA`.

### SP-002 - Acao de entrada

WHEN o usuario pressionar `ENTRAR` na tela inicial, THE SYSTEM SHALL executar `router.push("/login")`.

### SP-003 - Acao de cadastro

WHEN o usuario pressionar `CRIAR CONTA` na tela inicial, THE SYSTEM SHALL executar `router.push("/cadastro")`.

### SP-004 - Login sem dados

WHEN o usuario pressionar o botao de login com `email === ""` OR `senha === ""`, THE SYSTEM SHALL interromper a autenticacao e exibir alerta `Atencao: Preencha todos os campos.`.

### SP-005 - Consulta de usuario por email

WHEN o usuario tentar login com email preenchido, THE SYSTEM SHALL consultar `/usuarios?email={emailCodificado}` por meio de `loginUser`.

### SP-006 - Validacao de senha

WHEN a API retornar lista de usuarios para o email informado, THE SYSTEM SHALL considerar login valido somente se algum registro possuir `senha` igual a senha informada.

### SP-007 - Persistencia de sessao local

WHEN o login for valido e `AsyncStorage` estiver disponivel, THE SYSTEM SHALL salvar `usuarioId` com o id do usuario e `usuarioNome` com o nome do usuario.

### SP-008 - Login bem-sucedido

WHEN o login for valido, THE SYSTEM SHALL exibir alerta `Sucesso: Login realizado com sucesso!` e navegar para `/home`.

### SP-009 - Login recusado

WHEN o login nao encontrar usuario com senha correspondente, THE SYSTEM SHALL exibir alerta `Erro: E-mail ou senha invalidos.` e permanecer na tela de login.

### SP-010 - Cadastro sem dados

WHEN o usuario pressionar cadastrar com `nome === ""` OR `email === ""` OR `senha === ""`, THE SYSTEM SHALL interromper o cadastro e exibir alerta `Atencao: Preencha todos os campos.`.

### SP-011 - Consulta de email existente

WHEN o usuario tentar cadastrar com email preenchido, THE SYSTEM SHALL consultar `/usuarios?email={emailCodificado}` por meio de `findUserByEmail`.

### SP-012 - Cadastro com email repetido

WHEN `findUserByEmail` retornar lista com tamanho maior que `0`, THE SYSTEM SHALL exibir alerta `Erro: Ja existe um usuario com esse e-mail.` e nao criar usuario.

### SP-013 - Cadastro bem-sucedido

WHEN `nome`, `email` e `senha` estiverem preenchidos e o email nao existir, THE SYSTEM SHALL enviar `POST /usuarios` com `{ nome, email, senha }`, exibir alerta `Sucesso: Cadastro realizado com sucesso!` e navegar para `/login`.

### SP-014 - Exibicao de senha

WHEN o usuario acionar o controle de visibilidade de senha, THE SYSTEM SHALL alternar `secureTextEntry` entre verdadeiro e falso.

### SP-015 - Forca de senha

WHEN o valor da senha mudar no cadastro, THE SYSTEM SHALL calcular pontuacao de `0` a `4` usando tamanho, maiuscula com numero e caractere especial.

## Fluxo 2 - Ginasios

### SP-016 - Home autenticada

WHEN o usuario acessar `/home`, THE SYSTEM SHALL mostrar opcao para navegar para lista de ginasios.

### SP-017 - Ir para ginasios

WHEN o usuario pressionar o card `Lista dos ginasios`, THE SYSTEM SHALL navegar para `/ginasios`.

### SP-018 - Lista fixa de ginasios

WHEN `/ginasios` renderizar, THE SYSTEM SHALL exibir os cinco ginasios definidos localmente: Dom Bosco, Sao Domingos, Jacy Teixeira, Arena Filomena Society e Campo Urciano Lemos.

### SP-019 - Parametros de ginasio

WHEN o usuario selecionar um ginasio, THE SYSTEM SHALL navegar para `/lista` com `params.ginasio` igual ao nome e `params.ginasioId` igual ao id do ginasio.

### SP-020 - Voltar de ginasios

WHEN o usuario pressionar `Voltar` em `/ginasios`, THE SYSTEM SHALL executar `router.back()`.

## Fluxo 3 - Reservas

### SP-021 - Carregamento inicial de reservas

WHEN `/lista` montar com `ginasioId`, THE SYSTEM SHALL chamar `getReservasPorGinasio(Number(ginasioId))`.

### SP-022 - Filtro por ginasio

WHEN `getReservasPorGinasio` executar, THE SYSTEM SHALL solicitar `/reservas?ginasioId={ginasioId}` e retornar array vazio se a resposta nao for array.

### SP-023 - Renderizacao de reserva

WHEN existir reserva carregada, THE SYSTEM SHALL exibir quadra, dia, responsavel, horario inicial, horario final, duracao e valor total.

### SP-024 - Identificacao de dono na lista

WHILE `reserva.usuarioId === usuarioLogadoStr`, THE SYSTEM SHALL exibir `Sua reserva` no card da reserva.

### SP-025 - Ocultacao de acoes para nao dono

WHILE `reserva.usuarioId !== usuarioLogadoStr`, THE SYSTEM SHALL ocultar as acoes `Editar` e `Deletar` do card da reserva.

### SP-026 - Abrir nova reserva

WHEN o usuario pressionar `+ Nova Reserva`, THE SYSTEM SHALL definir `editando` como `null`, resetar campos do formulario e abrir `modalNovaReserva`.

### SP-027 - Data em formato brasileiro

WHEN o sistema salvar uma reserva, THE SYSTEM SHALL formatar a data como `DD/MM/AAAA`.

### SP-028 - Hora final

WHEN o sistema calcular hora final, THE SYSTEM SHALL converter `horaInicio` para minutos, somar `duracao` e converter o resultado para `HH:mm`.

### SP-029 - Valor total

WHEN o sistema calcular valor total, THE SYSTEM SHALL aplicar `(duracao / 30) * 50`.

### SP-030 - Responsavel obrigatorio

WHEN `nomeResponsavel.trim()` resultar em string vazia durante salvamento, THE SYSTEM SHALL exibir alerta `Erro: Preencha o nome do responsavel.` e nao chamar API de criacao ou edicao.

### SP-031 - Verificacao de conflito em nova reserva

WHEN `editando` for `null` e o usuario tentar salvar reserva, THE SYSTEM SHALL chamar `verificarConflito` antes de `adicionarReserva`.

### SP-032 - Regra de conflito

WHEN uma reserva existente tiver mesmo `ginasioId`, mesma `quadra`, mesmo `dia` e intervalo com `novaReservaInicio < reservaFim` AND `novaReservaFim > reservaInicio`, THE SYSTEM SHALL retornar conflito verdadeiro.

### SP-033 - Reserva com conflito

WHEN `verificarConflito` retornar verdadeiro, THE SYSTEM SHALL exibir alerta `Horario Indisponivel` e nao persistir nova reserva.

### SP-034 - Criacao sem conflito

WHEN uma nova reserva estiver valida e sem conflito, THE SYSTEM SHALL enviar `POST /reservas` com os dados calculados e `usuarioId` do usuario logado.

### SP-035 - Pos-criacao

WHEN `POST /reservas` concluir com sucesso, THE SYSTEM SHALL fechar o modal, exibir alerta `Sucesso: Reserva criada com sucesso!` e recarregar reservas.

### SP-036 - Abrir edicao

WHEN o dono pressionar `Editar`, THE SYSTEM SHALL preencher formulario com `quadra`, `duracao`, `nomeResponsavel`, `horaInicio` e `dia` da reserva selecionada.

### SP-037 - Atualizacao de reserva

WHEN `editando.id` existir e formulario estiver valido, THE SYSTEM SHALL enviar `PUT /reservas/{id}` com dados atualizados.

### SP-038 - Pos-edicao

WHEN `PUT /reservas/{id}` concluir com sucesso, THE SYSTEM SHALL fechar modal, exibir alerta `Sucesso: Reserva atualizada com sucesso!` e recarregar reservas.

### SP-039 - Confirmacao de exclusao

WHEN o dono pressionar `Deletar`, THE SYSTEM SHALL solicitar confirmacao antes de remover a reserva.

### SP-040 - Exclusao confirmada

WHEN o dono confirmar exclusao, THE SYSTEM SHALL enviar `DELETE /reservas/{id}`, exibir alerta `Sucesso: Reserva removida com sucesso!` e recarregar reservas.

### SP-041 - Abrir detalhes

WHEN o usuario pressionar um card de reserva, THE SYSTEM SHALL navegar para `/detalhar` com `reservaId`, `reserva` serializada em JSON e `usuarioId`.

## Fluxo 4 - Detalhes, participantes e solicitacoes

### SP-042 - Parse da reserva

WHEN `/detalhar` receber parametro `reserva`, THE SYSTEM SHALL converter o valor de JSON string para objeto `Reserva`.

### SP-043 - Reserva ausente

WHEN o parametro `reserva` estiver ausente ou invalido, THE SYSTEM SHALL exibir `Reserva nao encontrada`.

### SP-044 - Definicao de dono

WHEN `reserva.usuarioId === usuarioLogadoStr`, THE SYSTEM SHALL definir o usuario como dono da reserva.

### SP-045 - Carregar participantes

WHEN a reserva possuir `id`, THE SYSTEM SHALL chamar `getParticipantesPorReserva(reserva.id)` e armazenar participantes retornados.

### SP-046 - Carregar solicitacoes

WHEN a reserva possuir `id`, THE SYSTEM SHALL chamar `getSolicitacoesPorReserva(reserva.id)` e armazenar solicitacoes retornadas.

### SP-047 - Verificar solicitacao pendente

WHILE o usuario nao for dono, WHEN dados da reserva forem carregados, THE SYSTEM SHALL verificar se existe solicitacao `PENDENTE` para `reservaId` e `usuarioId`.

### SP-048 - Participantes aprovados

WHEN participantes forem renderizados, THE SYSTEM SHALL listar somente participantes com `status === "APROVADO"` na secao de participantes.

### SP-049 - Estado vazio de participantes

WHEN nao houver participantes aprovados, THE SYSTEM SHALL exibir `Nenhum participante ainda`.

### SP-050 - Acoes de dono nos detalhes

WHILE o usuario for dono, THE SYSTEM SHALL exibir botao `+ Adicionar Participante` e lista de solicitacoes pendentes quando existirem.

### SP-051 - Bloqueio de acoes de dono nos detalhes

WHILE o usuario nao for dono, THE SYSTEM SHALL ocultar botao de adicionar participante, remover participante, aprovar solicitacao e rejeitar solicitacao.

### SP-052 - Abrir modal de participante

WHEN o dono pressionar `+ Adicionar Participante`, THE SYSTEM SHALL abrir modal de participante.

### SP-053 - Nome obrigatorio do participante

WHEN o dono tentar adicionar participante com `nomeParticipante.trim()` vazio, THE SYSTEM SHALL exibir alerta `Erro: Preencha o nome do participante.` e nao chamar API.

### SP-054 - Criar participante manual

WHEN o dono adicionar participante com nome preenchido, THE SYSTEM SHALL enviar `POST /participantes` com `status: "APROVADO"` e `dataCadastro` em ISO string.

### SP-055 - Pos-adicao de participante

WHEN `POST /participantes` concluir com sucesso, THE SYSTEM SHALL limpar campos do modal, fechar modal, exibir alerta de sucesso e recarregar dados da reserva.

### SP-056 - Remover participante

WHEN o dono confirmar remocao de participante, THE SYSTEM SHALL enviar `DELETE /participantes/{id}` e recarregar dados apos sucesso.

### SP-057 - Criar solicitacao

WHEN usuario nao dono pressionar `Solicitar Participacao`, THE SYSTEM SHALL enviar `POST /solicitacoes` com `status: "PENDENTE"`, `reservaId`, `usuarioId` e `dataSolicitacao` em ISO string.

### SP-058 - Pos-solicitacao

WHEN `POST /solicitacoes` concluir com sucesso, THE SYSTEM SHALL exibir alerta de sucesso e definir `temSolicitacao` como verdadeiro.

### SP-059 - Solicitar uma unica vez

WHILE `temSolicitacao` for verdadeiro, THE SYSTEM SHALL ocultar `Solicitar Participacao` e exibir `Aguardando aprovacao do dono`.

### SP-060 - Aprovar solicitacao

WHEN o dono aprovar solicitacao pendente, THE SYSTEM SHALL enviar `PATCH /solicitacoes/{id}` com `status: "APROVADO"`, `dataAprovacao` e `usuarioAprovouId`.

### SP-061 - Criar participante por aprovacao

WHEN a solicitacao for aprovada, THE SYSTEM SHALL criar participante em `POST /participantes` com `status: "APROVADO"`, `reservaId`, `usuarioId`, `nome` e `dataCadastro`.

### SP-062 - Rejeitar solicitacao

WHEN o dono rejeitar solicitacao pendente, THE SYSTEM SHALL enviar `PATCH /solicitacoes/{id}` com `status: "REJEITADO"`, `dataRejeicao` e `usuarioRejeitouId`.

### SP-063 - Pos-aprovacao ou rejeicao

WHEN aprovacao ou rejeicao concluir com sucesso, THE SYSTEM SHALL exibir alerta de sucesso e recarregar dados da reserva.

## Fluxo 5 - API local

### SP-064 - Base URL web

WHERE `Platform.OS === "web"`, WHEN `fetchJson` executar, THE SYSTEM SHALL usar `http://localhost:3000` como base URL.

### SP-065 - Base URL android

WHERE `Platform.OS === "android"`, WHEN `fetchJson` executar, THE SYSTEM SHALL usar `http://10.0.2.2:3000` como base URL.

### SP-066 - Base URL fallback

WHERE `Platform.OS` nao for `web` nem `android`, WHEN `fetchJson` executar, THE SYSTEM SHALL usar `http://localhost:3000` como base URL.

### SP-067 - Resposta HTTP sem sucesso

WHEN `fetchJson` receber `response.ok === false`, THE SYSTEM SHALL ler o corpo como texto e lancar `Error` com formato `API error {status}: {text}`.

### SP-068 - Resposta HTTP com sucesso

WHEN `fetchJson` receber `response.ok === true`, THE SYSTEM SHALL retornar `response.json()`.

## Fluxo 6 - Tratamento de erro e feedback

### SP-069 - Erro em acao assincrona

WHEN qualquer handler assincrono capturar erro, THE SYSTEM SHALL exibir alerta `Erro` com `error.message` quando o erro for instancia de `Error`.

### SP-070 - Erro desconhecido

WHEN qualquer handler assincrono capturar valor que nao e instancia de `Error`, THE SYSTEM SHALL exibir mensagem fallback especifica da acao.

### SP-071 - Registro de erro

WHEN qualquer handler assincrono capturar erro, THE SYSTEM SHALL registrar o erro com `console.log(error)`.

### SP-072 - Falha ao salvar reserva

WHEN criacao ou edicao de reserva falhar, THE SYSTEM SHALL manter modal aberto e preservar campos preenchidos.

### SP-073 - Falha ao adicionar participante

WHEN adicao de participante falhar, THE SYSTEM SHALL manter modal aberto e preservar campos preenchidos.

## Fluxo 7 - Padroes de codigo e organizacao

### SP-074 - Criacao de tela

WHEN uma nova tela navegavel for criada, THE SYSTEM SHALL coloca-la em `src/app` e exporta-la como `default function NomeDaTela()`.

### SP-075 - Registro de rota

WHEN uma nova tela precisar aparecer no Stack principal, THE SYSTEM SHALL registra-la em `src/app/_layout.tsx`.

### SP-076 - Nova chamada de backend

WHEN uma nova operacao de backend for necessaria, THE SYSTEM SHALL implementa-la em `src/apiService/api.ts` e chama-la pela tela por funcao exportada.

### SP-077 - Nova entidade

WHEN uma nova entidade de dominio for necessaria, THE SYSTEM SHALL declarar type ou interface em `src/types` antes de usa-la em multiplas telas.

### SP-078 - Nome de componente

WHEN criar ou renomear componente React, THE SYSTEM SHALL usar PascalCase e nome em portugues quando representar dominio do app.

### SP-079 - Nome de funcao

WHEN criar ou renomear funcao de dominio, THE SYSTEM SHALL usar camelCase e verbo em portugues que descreva a acao.

### SP-080 - Import sem uso

WHEN uma alteracao deixar import sem uso, THE SYSTEM SHALL remover o import antes de concluir a tarefa.

### SP-081 - Cor de UI

WHEN uma tela precisar de cor ja existente no tema, THE SYSTEM SHALL usar `theme.colors` em vez de literal hexadecimal.

### SP-082 - Estilo de UI

WHEN uma tela criar estilos React Native, THE SYSTEM SHALL usar `StyleSheet.create`.

### SP-083 - Codigo fora do escopo

WHEN uma alteracao for solicitada para o FutApp, THE SYSTEM SHALL nao ler, copiar ou adaptar arquivos em `jogo-da-velha/` como fonte de requisitos.

## Criterios de verificacao

### CV-001 - Lint

WHEN uma alteracao em codigo TypeScript ou TSX for concluida, THE SYSTEM SHALL executar `npm run lint` ou `npx.cmd expo lint` quando o ambiente permitir.

### CV-002 - Validacao de memoria

WHEN requirements ou spec forem alterados, THE SYSTEM SHALL garantir que cada outcome contenha condicao, gatilho e resposta explicitos.

### CV-003 - Persistencia local

WHEN teste manual criar, editar ou deletar dados, THE SYSTEM SHALL refletir a mudanca em `json-server/db.json` por meio da API local.

### CV-004 - Exclusao de jogo da velha

WHEN os arquivos `.specify/memory/requirements.md` e `.specify/memory/spec.md` forem revisados, THE SYSTEM SHALL nao conter requisito funcional do jogo da velha.
