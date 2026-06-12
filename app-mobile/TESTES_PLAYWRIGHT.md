# Testes E2E com Playwright

## 1. O que foi analisado

Foi analisado o app FutApp, um projeto Expo/React Native Web com Expo Router, `json-server` local e fluxo de reservas de ginásios. A pasta `jogo-da-velha/` foi ignorada, conforme pedido.

Arquivos principais analisados:

- `src/app/index.tsx`
- `src/app/login.tsx`
- `src/app/cadastro.tsx`
- `src/app/home.tsx`
- `src/app/ginasios.tsx`
- `src/app/lista.tsx`
- `src/app/detalhar.tsx`
- `src/apiService/api.ts`
- `src/types/usuario.ts`
- `src/types/reserva.ts`
- `src/types/participante.ts`
- `json-server/db.json`

## 2. Funcionalidades cobertas

- Autenticação:
  - Login com sucesso.
  - Login com dados inválidos.
  - Login com campos vazios.
  - Logout.
- Cadastro:
  - Campos obrigatórios.
  - E-mail duplicado.
  - Cadastro com sucesso.
- Reservas:
  - Seleção de ginásio.
  - Listagem por ginásio.
  - Criação de reserva.
  - Cálculo de valor.
  - Bloqueio de conflito de horário.
  - Permissão de reserva em quadra diferente.
- Participantes:
  - Dono adicionando participante manualmente.
  - Participante aparecendo como aprovado.
  - Usuário não dono solicitando participação.
  - Solicitação pendente.
  - Dono aprovando solicitação.
  - Dono rejeitando solicitação.
- Permissões:
  - Usuário não dono não vê ações de editar/deletar reserva.
  - Usuário não dono não vê ações de adicionar participante, aprovar ou rejeitar solicitação.
- Responsividade:
  - Tela inicial em desktop.
  - Tela inicial em tablet.
  - Tela inicial em mobile.

## 3. Arquivos de teste criados

- `tests/auth/login.spec.ts`
- `tests/formularios/cadastro.spec.ts`
- `tests/reservas/reservas.spec.ts`
- `tests/reservas/participantes.spec.ts`
- `tests/permissoes/permissoes.spec.ts`
- `tests/responsividade/responsividade.spec.ts`

Helpers criados:

- `tests/helpers/auth.helper.ts`
- `tests/helpers/evidencia.helper.ts`
- `tests/helpers/test-data.helper.ts`

## 4. Configuração criada

Arquivo:

- `playwright.config.ts`

Configurações aplicadas:

- Browser: Chromium.
- `baseURL` configurável por `PLAYWRIGHT_BASE_URL`.
- API configurável por `PLAYWRIGHT_API_URL`.
- Relatório HTML em `playwright-report/`.
- Resultados técnicos em `test-results/`.
- Trace habilitado.
- Screenshot automática em falha.
- Vídeo retido em falha.
- Servidores locais automáticos:
  - `npm run server`
  - `npx.cmd expo start --web --port 8081`

O comando do Expo redireciona `EXPO_HOME`, `USERPROFILE` e `HOME` para pastas locais durante a execução do Playwright, evitando cache fora do projeto quando possível.

## 5. Scripts adicionados

No `package.json`:

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:report": "playwright show-report"
}
```

## 6. Como rodar os testes

Na pasta do projeto:

```bash
npm run test:e2e
```

Ou diretamente:

```bash
npx playwright test
```

Para abrir o relatório HTML:

```bash
npm run test:e2e:report
```

Para modo visual/interativo:

```bash
npm run test:e2e:ui
```

## 7. Evidências visuais

Screenshots manuais por etapa são salvos em:

- `evidences/auth/`
- `evidences/dashboard/`
- `evidences/reservas/`
- `evidences/formularios/`
- `evidences/permissoes/`
- `evidences/erros/`

Exemplos de nomes gerados:

- `login-sucesso-dono.png`
- `login-dados-invalidos.png`
- `cadastro-sucesso.png`
- `reserva-criada-com-sucesso.png`
- `reserva-horario-indisponivel.png`
- `usuario-sem-permissao.png`
- `solicitacao-aprovada.png`
- `tela-inicial-mobile.png`

## 8. Relatório HTML

O relatório HTML do Playwright fica em:

- `playwright-report/`

Abra com:

```bash
npx playwright show-report
```

## 9. Dados de teste

Os testes usam dados controlados via API local do `json-server`, criados no helper:

- `tests/helpers/test-data.helper.ts`

Usuários de teste:

- `dono.e2e@example.com`
- `visitante.e2e@example.com`

Reservas de teste:

- `e2e-reserva-principal`
- `e2e-reserva-outro-ginasio`

Participante e solicitação:

- `e2e-participante-aprovado`
- `e2e-solicitacao-pendente`

Antes de cada teste, os dados E2E conhecidos são removidos e recriados para manter os cenários previsíveis.

## 10. Execução realizada nesta implementação

Validações que passaram:

```bash
npx.cmd tsc --noEmit
npx.cmd expo lint
```

Tentativa de execução dos testes:

```bash
npx.cmd playwright test
```

Resultado no ambiente do Codex:

- Os servidores do Playwright chegaram a iniciar.
- O Expo inicialmente tentou escrever cache em `C:\Users\gabri\.expo`; a configuração foi ajustada para cache local.
- Depois disso, o ambiente bloqueou o lançamento do Chromium com erro `browserType.launch: spawn EPERM`.
- O executável bloqueado estava em `C:\Users\gabri\AppData\Local\ms-playwright\...`.

Esse erro é uma limitação de permissão do sandbox desta sessão, não uma falha de sintaxe dos testes. Em um terminal normal do Windows, com permissão para executar o Chromium instalado pelo Playwright, a suíte está preparada para rodar.

## 11. Cenários não cobertos e motivo

- Administrador: o projeto não possui perfil ou tela administrativa.
- Busca, filtros, paginação e ordenação: essas funcionalidades não existem no código atual.
- Acesso negado por URL direta: o app atual não implementa guarda de rota/autenticação persistente para bloquear rotas diretamente.
- Máscaras de CPF/moeda/data: não há campos com essas máscaras no app atual.
- Confirmação de senha: não existe campo de confirmação de senha.

## 12. Melhorias futuras

- Criar guarda de rotas para usuário não autenticado.
- Persistir sessão com `@react-native-async-storage/async-storage`.
- Adicionar `testID` em todos os componentes novos desde o início.
- Separar regras puras de reserva em módulo testável com testes unitários.
- Adicionar cenário visual de edição e exclusão de reserva após estabilizar confirmação web/mobile.
- Executar a suíte em CI com permissões explícitas para browsers do Playwright.
