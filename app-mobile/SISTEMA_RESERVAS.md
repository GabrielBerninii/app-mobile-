# Sistema de Reservas de Quadras - Documentação

## 📋 Visão Geral

O sistema foi transformado de um gerenciador de alunos para um sistema completo de reservas de quadras em ginásios. Cada ginásio tem suas próprias reservas de forma isolada.

## 🏗️ Arquitetura

### Estrutura de Dados (db.json)
```json
{
  "reservas": [
    {
      "id": "unique-id",
      "ginasioId": 1,
      "ginasioNome": "Ginásio Poliesportivo Dom Bosco",
      "quadra": "Quadra 1",
      "nomeResponsavel": "João Silva",
      "dia": "17/06/2024",
      "horaInicio": "14:00",
      "duracao": 60,
      "horaFim": "15:00",
      "valorTotal": 100.00
    }
  ]
}
```

## 🔄 Fluxo de Navegação

```
Home → Selecionar Ginásio → Tela de Reservas do Ginásio
                              ├─ Listar Reservas
                              ├─ Nova Reserva (Modal)
                              ├─ Editar Reserva (Modal)
                              └─ Deletar Reserva
```

## ⚙️ Funcionalidades Implementadas

### 1. **Isolamento por Ginásio**
- Cada ginásio (1-5) tem suas próprias reservas
- As reservas de um ginásio NÃO aparecem em outro
- O ginásio é passado via parâmetros de rota

### 2. **Formulário de Reserva**
O modal de nova reserva contém:
- **Escolha de Quadra**: Quadra 1, 2 ou 3
- **Duração**: 5 opções (30 min a 2h 30min)
- **Nome Responsável**: Campo de texto
- **Dia da Reserva**: Seletor de data
- **Horário Inicial**: Seletor de hora
- **Cálculo Automático**: 
  - Horário final calculado automaticamente
  - Valor calculado: R$ 50 a cada 30 minutos

### 3. **Tabela de Preços**
| Duração | Valor |
|---------|-------|
| 30 min | R$ 50,00 |
| 1 hora | R$ 100,00 |
| 1h 30min | R$ 150,00 |
| 2 horas | R$ 200,00 |
| 2h 30min | R$ 250,00 |

### 4. **Validação de Conflitos de Horários**

A função `verificarConflito()` valida:
- ✅ **Mesmo ginásio, mesma quadra, mesmo dia**: BLOQUEIA se houver sobreposição
- ✅ **Horários que se sobrepõem**: Usa lógica:
  ```
  novaReservaInicio < reservaExistenteFim
  E
  novaReservaFim > reservaExistenteInicio
  ```

#### Exemplos de Bloqueio
Se existe reserva de **17:00 a 18:00**:
- ❌ 17:00 - 17:30 (conflito)
- ❌ 17:30 - 18:00 (conflito)
- ❌ 16:30 - 17:30 (conflito)
- ❌ 17:00 - 18:00 (conflito exato)

#### Exemplos Permitidos
- ✅ 16:00 - 17:00 (termina antes)
- ✅ 18:00 - 19:00 (começa depois)
- ✅ 16:00 - 16:30 (termina antes)

### 5. **Permissões do Sistema**
- ✅ Reservas em **ginásios diferentes** no mesmo horário (PERMITIDO)
- ✅ Reservas em **quadras diferentes** do mesmo ginásio no mesmo horário (PERMITIDO)
- ❌ Reservas na **mesma quadra, mesmo ginásio, mesmo dia** com conflito (BLOQUEADO)

## 📱 Telas Principais

### Tela de Reservas (lista.tsx)
- Header com nome do ginásio
- Botão "+ Nova Reserva"
- Lista de reservas com cards
- Cada card mostra:
  - Quadra e dia
  - Nome do responsável
  - Horário (início - fim)
  - Duração
  - Valor total
  - Botões de editar e deletar

### Modal de Nova/Edição de Reserva
- Seleção de quadra (3 botões)
- Seleção de duração (5 opções)
- Input para nome do responsável
- Seletor de data
- Seletor de horário
- Card de resumo com cálculos automáticos
- Botões Cancelar/Criar/Atualizar

## 🔧 API Endpoints

### Funções em `apiService/api.ts`

#### Leitura
- `getReservasPorGinasio(ginasioId: number)` - Lista reservas do ginásio
- `verificarConflito(...)` - Valida conflito de horários

#### Escrita
- `adicionarReserva(reserva)` - Cria nova reserva
- `editarReserva(id, reserva)` - Atualiza reserva
- `removerReserva(id)` - Deleta reserva

#### Utilitários
- `calcularHoraFim(inicio, duracao)` - Calcula hora final
- `calcularValor(duracao)` - Calcula valor total
- `converterHoraParaMinutos(hora)` - Converte "14:30" → 870
- `converterMinutosParaHora(minutos)` - Converte 870 → "14:30"

## 📂 Arquivos Modificados

```
src/
├── app/
│   ├── lista.tsx                    [TOTALMENTE REESCRITO]
│   ├── ginasios.tsx                 [Sem mudanças - já passava params]
│   └── _layout.tsx                  [Sem mudanças]
├── apiService/
│   └── api.ts                       [+ Funções de reserva]
└── types/
    └── reserva.ts                   [NOVO - Interfaces]

json-server/
└── db.json                          [+ Array "reservas"]
```

## ✅ Critérios de Aceite - Status

- ✅ Tela de ginásio mostra reservas isoladas por ginásio
- ✅ Usuário seleciona Quadra 1, 2 ou 3
- ✅ Usuário seleciona duração (5 opções)
- ✅ Valor calculado automaticamente
- ✅ Horário final calculado automaticamente
- ✅ Sistema previne reservas duplicadas/conflitantes
- ✅ Reservas em ginásios diferentes no mesmo horário são permitidas
- ✅ Reservas em quadras diferentes do mesmo ginásio são permitidas
- ✅ Mensagens de erro claras para conflitos
- ✅ Suporta edição e exclusão de reservas
- ✅ Interface responsiva e intuitiva

## 🚀 Como Usar

### Criar uma Reserva
1. Na home, selecione um ginásio
2. Toque em "+ Nova Reserva"
3. Selecione quadra, duração, nome, data e horário
4. Revise o resumo
5. Toque em "Criar Reserva"

### Editar uma Reserva
1. Toque no botão "Editar" do card da reserva
2. Modifique os dados no modal
3. Toque em "Atualizar"

### Deletar uma Reserva
1. Toque no botão "Deletar" do card
2. Confirme a exclusão

## ⚠️ Notas Importantes

- O banco de dados em memória (json-server) é resetado quando o servidor reinicia
- Para persistência real, migre para um backend com database
- As datas usam formato DD/MM/YYYY
- Os horários usam formato 24h (HH:MM)
- A validação de conflito ocorre ANTES de criar/editar
- Editar uma reserva não revida novamente conflitos com ela mesma
