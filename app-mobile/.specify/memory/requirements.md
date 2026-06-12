# Requirements - FutApp

## Escopo

Este documento define os outcomes verificaveis do FutApp, aplicativo Expo/React Native para autenticacao, selecao de ginasios, reservas de quadras, participantes e solicitacoes de entrada.

Tudo relacionado a `jogo-da-velha/` esta fora do escopo.

## Atores

- Usuario visitante: pessoa sem sessao iniciada.
- Usuario autenticado: pessoa com conta cadastrada e login realizado.
- Dono da reserva: usuario autenticado cujo `usuarioId` corresponde ao `usuarioId` da reserva.
- Participante: pessoa adicionada ou aprovada em uma reserva.

## Entidades

- Usuario: `id`, `nome`, `email`, `senha`.
- Ginasio: `id`, `nome`.
- Reserva: `id`, `ginasioId`, `ginasioNome`, `quadra`, `nomeResponsavel`, `dia`, `horaInicio`, `duracao`, `horaFim`, `valorTotal`, `usuarioId`.
- Participante: `id`, `reservaId`, `usuarioId`, `nome`, `email`, `telefone`, `observacao`, `status`, `dataCadastro`.
- Solicitacao: `id`, `reservaId`, `usuarioId`, `status`, `dataSolicitacao`, `dataAprovacao`, `usuarioAprovouId`, `dataRejeicao`, `usuarioRejeitouId`.

## Outcomes funcionais em EARS

### RF-001 - Abertura do app

WHEN o usuario abrir o aplicativo, THE SYSTEM SHALL exibir a tela inicial `index` com opcoes para entrar e criar conta.

### RF-002 - Navegacao para login

WHEN o usuario acionar o botao `ENTRAR` na tela inicial, THE SYSTEM SHALL navegar para a rota `/login`.

### RF-003 - Navegacao para cadastro

WHEN o usuario acionar o botao `CRIAR CONTA` na tela inicial, THE SYSTEM SHALL navegar para a rota `/cadastro`.

### RF-004 - Validacao de login obrigatorio

WHEN o usuario tentar fazer login com `email` vazio OR `senha` vazia, THE SYSTEM SHALL exibir alerta com titulo `Atencao` e mensagem `Preencha todos os campos.`.

### RF-005 - Login com credenciais validas

WHEN o usuario informar `email` e `senha` correspondentes a um registro em `usuarios`, THE SYSTEM SHALL armazenar `usuarioId` e `usuarioNome`, exibir alerta de sucesso e navegar para `/home`.

### RF-006 - Login com credenciais invalidas

WHEN o usuario informar `email` existente com `senha` diferente OR `email` inexistente, THE SYSTEM SHALL exibir alerta com titulo `Erro` e mensagem `E-mail ou senha invalidos.`.

### RF-007 - Validacao de cadastro obrigatorio

WHEN o usuario tentar cadastrar conta com `nome` vazio OR `email` vazio OR `senha` vazia, THE SYSTEM SHALL exibir alerta com titulo `Atencao` e mensagem `Preencha todos os campos.`.

### RF-008 - Bloqueio de email duplicado

WHEN o usuario tentar cadastrar conta com `email` ja existente em `usuarios`, THE SYSTEM SHALL exibir alerta com titulo `Erro` e mensagem `Ja existe um usuario com esse e-mail.`.

### RF-009 - Cadastro valido

WHEN o usuario informar `nome`, `email` unico e `senha`, THE SYSTEM SHALL criar um novo registro em `usuarios`, exibir alerta de sucesso e navegar para `/login`.

### RF-010 - Medidor de forca da senha

WHEN o usuario alterar o campo `senha` na tela de cadastro, THE SYSTEM SHALL recalcular a forca da senha e atualizar a barra visual de forca.

### RF-011 - Menu principal

WHEN o usuario acessar `/home`, THE SYSTEM SHALL exibir a opcao de visualizar a lista de ginasios.

### RF-012 - Lista de ginasios

WHEN o usuario acessar `/ginasios`, THE SYSTEM SHALL exibir exatamente os ginasios configurados na tela de selecao.

### RF-013 - Selecao de ginasio

WHEN o usuario selecionar um ginasio, THE SYSTEM SHALL navegar para `/lista` enviando os parametros `ginasio` e `ginasioId`.

### RF-014 - Carregamento de reservas por ginasio

WHEN a tela `/lista` receber um `ginasioId`, THE SYSTEM SHALL carregar de `json-server` somente as reservas com o mesmo `ginasioId`.

### RF-015 - Estado vazio de reservas

WHEN a lista carregada para um ginasio nao possuir reservas, THE SYSTEM SHALL exibir a mensagem `Nenhuma reserva ainda`.

### RF-016 - Abertura de modal de nova reserva

WHEN o usuario acionar `+ Nova Reserva`, THE SYSTEM SHALL abrir o modal de reserva com valores iniciais: `Quadra 1`, duracao `30`, data atual, horario `09:00` e nome do responsavel vazio.

### RF-017 - Validacao de responsavel da reserva

WHEN o usuario tentar salvar reserva com `nomeResponsavel` vazio ou apenas espacos, THE SYSTEM SHALL exibir alerta com titulo `Erro` e mensagem `Preencha o nome do responsavel.`.

### RF-018 - Calculo de hora final

WHEN o usuario alterar `horaInicio` OR `duracao`, THE SYSTEM SHALL recalcular `horaFim` somando a duracao em minutos ao horario inicial.

### RF-019 - Calculo de valor

WHEN o usuario alterar a duracao da reserva, THE SYSTEM SHALL recalcular `valorTotal` usando a regra `R$ 50,00` a cada `30` minutos.

### RF-020 - Bloqueio de conflito de reserva

WHEN o usuario tentar criar reserva para o mesmo `ginasioId`, mesma `quadra` e mesmo `dia` com intervalo sobreposto a uma reserva existente, THE SYSTEM SHALL impedir a criacao e exibir alerta `Horario Indisponivel`.

### RF-021 - Criacao de reserva valida

WHEN o usuario salvar uma nova reserva sem conflito e com responsavel preenchido, THE SYSTEM SHALL criar registro em `reservas`, fechar o modal, exibir alerta de sucesso e recarregar a lista.

### RF-022 - Edicao de reserva pelo dono

WHEN o dono da reserva acionar `Editar`, THE SYSTEM SHALL abrir o modal preenchido com os dados atuais da reserva selecionada.

### RF-023 - Salvamento de edicao de reserva

WHEN o dono salvar uma edicao valida de reserva existente, THE SYSTEM SHALL atualizar o registro correspondente em `reservas`, fechar o modal, exibir alerta de sucesso e recarregar a lista.

### RF-024 - Exclusao de reserva pelo dono

WHEN o dono confirmar a exclusao de uma reserva, THE SYSTEM SHALL remover o registro correspondente em `reservas`, exibir alerta de sucesso e recarregar a lista.

### RF-025 - Bloqueio visual de acoes de dono

WHILE o usuario autenticado nao for o dono da reserva, THE SYSTEM SHALL nao exibir botoes de editar ou deletar para essa reserva.

### RF-026 - Acesso aos detalhes da reserva

WHEN o usuario tocar em uma reserva da lista, THE SYSTEM SHALL navegar para `/detalhar` enviando `reservaId`, dados serializados da `reserva` e `usuarioId`.

### RF-027 - Reserva nao encontrada

WHEN a tela de detalhes nao receber dados validos de reserva, THE SYSTEM SHALL exibir a mensagem `Reserva nao encontrada`.

### RF-028 - Carregamento de participantes

WHEN a tela de detalhes receber uma reserva valida, THE SYSTEM SHALL carregar todos os participantes com o mesmo `reservaId`.

### RF-029 - Carregamento de solicitacoes

WHEN a tela de detalhes receber uma reserva valida, THE SYSTEM SHALL carregar todas as solicitacoes com o mesmo `reservaId`.

### RF-030 - Exibicao de dono

WHILE o usuario autenticado for o dono da reserva, THE SYSTEM SHALL exibir identificacao visual de dono na tela de detalhes.

### RF-031 - Adicao manual de participante

WHEN o dono da reserva adicionar participante com `nome` preenchido, THE SYSTEM SHALL criar participante com status `APROVADO`, fechar modal, limpar formulario, exibir alerta de sucesso e recarregar dados.

### RF-032 - Validacao de participante sem nome

WHEN o dono tentar adicionar participante com `nome` vazio ou apenas espacos, THE SYSTEM SHALL exibir alerta com titulo `Erro` e mensagem `Preencha o nome do participante.`.

### RF-033 - Remocao de participante

WHEN o dono confirmar a remocao de participante aprovado, THE SYSTEM SHALL remover o participante de `participantes`, exibir alerta de sucesso e recarregar dados.

### RF-034 - Solicitacao de entrada

WHEN usuario que nao e dono acionar `Solicitar Participacao`, THE SYSTEM SHALL criar solicitacao com status `PENDENTE`, data ISO atual, `reservaId` da reserva e `usuarioId` do usuario autenticado.

### RF-035 - Estado de solicitacao pendente

WHILE usuario que nao e dono possuir solicitacao `PENDENTE` para a reserva, THE SYSTEM SHALL exibir estado `Aguardando aprovacao do dono` e ocultar o botao `Solicitar Participacao`.

### RF-036 - Aprovacao de solicitacao

WHEN o dono aprovar uma solicitacao pendente, THE SYSTEM SHALL atualizar a solicitacao para `APROVADO`, preencher `dataAprovacao` e `usuarioAprovouId`, criar participante aprovado e recarregar dados.

### RF-037 - Rejeicao de solicitacao

WHEN o dono rejeitar uma solicitacao pendente, THE SYSTEM SHALL atualizar a solicitacao para `REJEITADO`, preencher `dataRejeicao` e `usuarioRejeitouId`, exibir alerta de sucesso e recarregar dados.

### RF-038 - Compatibilidade de alerta web

WHERE `Platform.OS` for `web`, WHEN o sistema precisar exibir alerta, THE SYSTEM SHALL usar `window.alert` com titulo e mensagem concatenados.

### RF-039 - Compatibilidade de alerta mobile

WHERE `Platform.OS` nao for `web`, WHEN o sistema precisar exibir alerta, THE SYSTEM SHALL usar `Alert.alert` com titulo e mensagem separados.

### RF-040 - Compatibilidade de URL da API

WHERE `Platform.OS` for `android`, WHEN o sistema fizer chamada de API local, THE SYSTEM SHALL usar base URL `http://10.0.2.2:3000`.

### RF-041 - Compatibilidade de URL web/iOS

WHERE `Platform.OS` for `web` OR `ios`, WHEN o sistema fizer chamada de API local, THE SYSTEM SHALL usar base URL `http://localhost:3000`.

## Outcomes nao funcionais em EARS

### RNF-001 - Stack fixa

WHEN qualquer alteracao tecnica for planejada, THE SYSTEM SHALL preservar Expo `~54.0.35`, React `19.1.0`, React Native `0.81.5`, Expo Router `~6.0.24` e TypeScript `~5.9.2`, exceto quando houver aprovacao explicita para mudanca.

### RNF-002 - Centralizacao de API

WHEN uma nova chamada ao backend for criada, THE SYSTEM SHALL implementa-la em `src/apiService/api.ts` e expor funcao tipada para as telas.

### RNF-003 - Tipos compartilhados

WHEN uma nova entidade de dominio for criada, THE SYSTEM SHALL declarar interface ou type compartilhado em `src/types` ou reaproveitar tipo existente.

### RNF-004 - Padrao de idioma

WHEN novo codigo de dominio for escrito, THE SYSTEM SHALL usar nomes em portugues para variaveis, funcoes, estados e mensagens de UI.

### RNF-005 - PascalCase obrigatorio

WHEN um novo componente, tela, interface ou type exportado for criado, THE SYSTEM SHALL nomea-lo em PascalCase.

### RNF-006 - camelCase obrigatorio

WHEN uma nova variavel, funcao ou estado local for criado, THE SYSTEM SHALL nomea-lo em camelCase.

### RNF-007 - Tema centralizado

WHEN uma nova cor de UI for necessaria, THE SYSTEM SHALL verificar `constants/theme.ts` antes de criar valor hexadecimal direto.

### RNF-008 - Tratamento de erro padrao

WHEN uma acao assincrona falhar, THE SYSTEM SHALL capturar o erro, derivar mensagem amigavel, exibir alerta de erro e registrar o erro no console.

### RNF-009 - Memoria limpa do Specify

WHEN arquivos de memoria do Specify forem consultados, THE SYSTEM SHALL considerar `.specify/memory/constitution.md`, `.specify/memory/requirements.md` e `.specify/memory/spec.md` como fonte vigente.

### RNF-010 - Exclusao do jogo da velha

WHEN o agente analisar, especificar ou implementar qualquer comportamento do FutApp, THE SYSTEM SHALL ignorar completamente `jogo-da-velha/` e nao usar essa pasta como entrada.

## Criterios de aceite globais

- Cada outcome deve ser testavel por leitura de codigo, execucao manual no app ou verificacao de `json-server/db.json`.
- Cada erro de usuario deve ter uma resposta observavel na UI.
- Cada mutacao de reserva, participante ou solicitacao deve ser persistida via `json-server`.
- Cada tela navegavel deve permanecer registrada no Stack do Expo Router.
- Nenhuma funcionalidade do jogo da velha deve aparecer em rotas, textos, tipos, API ou requisitos do FutApp.
