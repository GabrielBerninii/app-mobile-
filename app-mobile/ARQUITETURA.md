# 📐 Arquitetura do Sistema de Reservas

## 🗂️ Estrutura de Arquivos

```
app-mobile/
├── json-server/
│   └── db.json                     ← Banco de dados com "reservas"
├── src/
│   ├── app/
│   │   ├── _layout.tsx            ← Rotas (adicionada rota ginasios)
│   │   ├── home.tsx               ← Home (link para ginasios)
│   │   ├── ginasios.tsx           ← Menu de 5 ginásios
│   │   └── lista.tsx              ← NOVO: Tela de reservas
│   ├── apiService/
│   │   └── api.ts                 ← NOVO: Funções de reserva
│   ├── types/
│   │   ├── usuario.ts
│   │   └── reserva.ts             ← NOVO: Interfaces
│   └── constants/
│       └── theme.ts
├── SISTEMA_RESERVAS.md            ← Documentação técnica
├── GUIA_TESTE.md                  ← 10 testes práticos
└── scripts/
    └── populate-reservas.sh       ← Script de dados de exemplo
```

## 🔄 Fluxo de Dados

```
┌─────────┐
│  Login  │
└────┬────┘
     │
     ▼
┌─────────────┐
│    Home     │
└────┬────────┘
     │
     ▼
┌──────────────────────┐
│  Selecionar Ginásio  │
│  (ginasios.tsx)      │
└────┬─────────────────┘
     │ (ginasioId, ginasio)
     ▼
┌────────────────────────────┐
│  Tela de Reservas          │
│  (lista.tsx)               │
│  - Listar reservas         │
│  - Nova reserva (modal)    │
│  - Editar reserva (modal)  │
│  - Deletar reserva         │
└────┬───────────────────────┘
     │ API calls
     ▼
┌────────────────────────────┐
│   API Service (api.ts)     │
│  - getReservasPorGinasio   │
│  - verificarConflito       │
│  - addReserva/editarReserva
│  - removerReserva          │
└────┬───────────────────────┘
     │ HTTP requests
     ▼
┌────────────────────┐
│   JSON Server      │
│   (localhost:3000) │
└────┬───────────────┘
     │
     ▼
┌────────────────────┐
│    db.json         │
│  - usuarios        │
│  - alunos          │
│  - reservas ←──────┤ Array com todas as reservas
└────────────────────┘
```

## 🎯 Modal de Reserva - Campos

```
┌─────────────────────────────────────┐
│     Nova Reserva / Editar Reserva   │
├─────────────────────────────────────┤
│                                     │
│  Escolha sua quadra                 │
│  [Quadra 1] [Quadra 2] [Quadra 3]  │
│                                     │
│  Duração da reserva                 │
│  [30 minutos]                       │
│  [1 hora]                           │
│  [1 hora e 30 minutos]              │
│  [2 horas]                          │
│  [2 horas e 30 minutos]             │
│                                     │
│  Nome da pessoa principal           │
│  [________________]                 │
│                                     │
│  Dia da reserva                     │
│  [📅 17/06/2024]                    │
│                                     │
│  Horário inicial                    │
│  [🕐 14:00]                         │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Resumo da Reserva             │  │
│  │ Horário final: 15:00          │  │
│  │ Duração: 60 min               │  │
│  │ ───────────────────────────   │  │
│  │ Valor total: R$ 100,00        │  │
│  └───────────────────────────────┘  │
│                                     │
│  [Cancelar]        [Criar Reserva] │
│                                     │
└─────────────────────────────────────┘
```

## 📋 Card de Reserva - Exibição

```
┌──────────────────────────────────┐
│ Quadra 1                17/06     │  ← Header
├──────────────────────────────────┤
│ Responsável: João Silva           │
│ Horário: 14:00 - 15:00            │
│ Duração: 60 minutos               │
│ Valor: R$ 100,00                  │  ← Body
├──────────────────────────────────┤
│ [   Editar   ]  [   Deletar   ]   │  ← Actions
└──────────────────────────────────┘
```

## 🔐 Validação de Conflitos

```
EXISTENTE:  [====== 14:00 - 15:00 ======]

TESTANDO    RESULTADO
                           
[=== 13:00 - 14:00 ===]    ✅ OK (termina antes)
[=== 14:00 - 14:30 ===]    ❌ CONFLITO
[=== 14:30 - 15:30 ===]    ❌ CONFLITO
[=== 15:00 - 16:00 ===]    ✅ OK (começa depois)
[=== 13:30 - 15:30 ===]    ❌ CONFLITO (envolve tudo)

CONDIÇÃO: 
  novaInicio < existenteFim  AND  novaFim > existenteInicio
```

## 💰 Tabela de Precificação

```
Duração                Cálculo          Valor
────────────────────────────────────────────
30 minutos             1 × R$50         R$50,00
1 hora                 2 × R$50         R$100,00
1h 30min               3 × R$50         R$150,00
2 horas                4 × R$50         R$200,00
2h 30min               5 × R$50         R$250,00
```

## 🌐 Endpoints da API (REST)

```
GET    /reservas
       Retorna todas as reservas

GET    /reservas?ginasioId=1
       Retorna apenas reservas do ginásio 1

POST   /reservas
       Cria nova reserva
       Body: { ginasioId, quadra, nomeResponsavel, dia, horaInicio, duracao, horaFim, valorTotal }

PUT    /reservas/:id
       Atualiza uma reserva
       Body: { ...campos }

DELETE /reservas/:id
       Deleta uma reserva
```

## 🎯 Estados da Aplicação

```
Tela de Reservas
├── Estado 1: Lista vazia
│   └── Mostra "Nenhuma reserva ainda"
│
├── Estado 2: Com reservas
│   └── FlatList renderiza cards
│
├── Estado 3: Modal aberto - Nova
│   └── Todos os campos em branco
│
└── Estado 4: Modal aberto - Editar
    └── Campos preenchidos com dados da reserva

Durante validação de conflito:
├── Sem conflito ✅ → Salva
└── Com conflito ❌ → Exibe alert
```

## 🔀 Isolamento por Ginásio

```
Dom Bosco (ID=1)        São Domingos (ID=2)    Jacy Teixeira (ID=3)
────────────────────    ───────────────────    ─────────────────────
[Reserva A]             [Reserva X]            [Reserva M]
[Reserva B]             [Reserva Y]            [Reserva N]
[Reserva C]

Usuário vê DOM BOSCO:
  GET /reservas?ginasioId=1
  Retorna: [Reserva A, B, C]
  
Usuário vê SÃO DOMINGOS:
  GET /reservas?ginasioId=2
  Retorna: [Reserva X, Y]
```

## 🛡️ Validações

```
1. Criar Reserva
   ├─ Nome responsável vazio? → ❌ Erro
   ├─ Conflito de horário? → ❌ Erro com mensagem clara
   └─ Tudo OK? → ✅ Salva

2. Editar Reserva
   ├─ Nova data cria conflito? → ❌ Erro
   └─ Tudo OK? → ✅ Atualiza

3. Deletar Reserva
   └─ Solicita confirmação → ✅ Deleta
```

## 📊 Tabela de Funções da API

| Função | Tipo | Entrada | Saída | Descrição |
|--------|------|---------|-------|-----------|
| `getReservasPorGinasio` | GET | ginasioId | Reserva[] | Filtra por ginásio |
| `verificarConflito` | Query | ginasioId, quadra, dia, hora, duracao | boolean | Valida sobreposição |
| `adicionarReserva` | POST | Reserva | Reserva | Cria nova |
| `editarReserva` | PUT | id, Reserva | Reserva | Atualiza |
| `removerReserva` | DELETE | id | void | Deleta |
| `calcularHoraFim` | Util | horaInicio, duracao | string | "14:00" + 60 = "15:00" |
| `calcularValor` | Util | duracao | number | 60 min = R$ 100 |
| `converterHoraParaMinutos` | Util | "14:00" | number | 840 |
| `converterMinutosParaHora` | Util | 840 | string | "14:00" |
