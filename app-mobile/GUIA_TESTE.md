# 🎯 Guia de Teste - Sistema de Reservas

## ✅ Verificação de Implementação

Todos os requisitos foram implementados com sucesso! Aqui estão os testes que você pode fazer:

---

## 🧪 Teste 1: Isolamento por Ginásio

### O que testar:
- As reservas criadas em um ginásio NÃO aparecem em outro

### Passos:
1. Na Home, clique em **"Ginásio Poliesportivo Dom Bosco"**
2. Crie uma reserva (Nova Reserva → preencha os dados)
3. Volte e selecione **"Ginásio Poliesportivo São Domingos"**
4. ✅ **Esperado**: Lista vazia (nenhuma reserva do Dom Bosco aparece)

---

## 🧪 Teste 2: Seleção de Quadras

### O que testar:
- O usuário consegue selecionar entre Quadra 1, 2 ou 3

### Passos:
1. Na tela de reserva, clique em "+ Nova Reserva"
2. Na seção "Escolha sua quadra", você verá 3 botões
3. ✅ **Esperado**: Consegue selecionar qualquer uma das 3 quadras

---

## 🧪 Teste 3: Seleção de Duração

### O que testar:
- 5 opções de duração aparecem e o valor é calculado automaticamente

### Passos:
1. Abra o modal de nova reserva
2. Clique em cada opção de duração:
   - 30 minutos → Deve mostrar **R$ 50,00** no resumo
   - 1 hora → Deve mostrar **R$ 100,00**
   - 1 hora e 30 minutos → Deve mostrar **R$ 150,00**
   - 2 horas → Deve mostrar **R$ 200,00**
   - 2 horas e 30 minutos → Deve mostrar **R$ 250,00**

3. ✅ **Esperado**: Valores corretos aparecem no card "Resumo da Reserva"

---

## 🧪 Teste 4: Cálculo Automático de Horário Final

### O que testar:
- Horário final é calculado automaticamente baseado na duração

### Passos:
1. Selecione horário inicial: **14:00**
2. Selecione duração: **1 hora**
3. Veja o resumo
4. ✅ **Esperado**: Mostra "Horário final: **15:00**"

### Teste adicional:
1. Mude para: **16:30** + **1 hora e 30 minutos**
2. ✅ **Esperado**: Mostra "Horário final: **18:00**"

---

## 🧪 Teste 5: Bloqueio de Conflitos (Mesma Quadra, Mesmo Dia)

### O que testar:
- Sistema impede reservas conflitantes na mesma quadra

### Passo 1: Criar reserva base
1. Crie a primeira reserva:
   - Quadra: **Quadra 1**
   - Dia: **17/06/2024**
   - Horário: **17:00**
   - Duração: **1 hora** (17:00 - 18:00)

### Passo 2: Tentar criar conflito
1. "+ Nova Reserva"
2. Selecione:
   - Quadra: **Quadra 1** (MESMA)
   - Dia: **17/06/2024** (MESMO)
   - Horário: **17:30**
   - Duração: **30 minutos**

3. ✅ **Esperado**: Erro "Esse horário já está agendado para esta quadra. Escolha outro horário."

---

## 🧪 Teste 6: Casos Permitidos Após Conflito

### Teste 6a: Reserva ANTES (termina antes de começar a existente)
1. Quadra 1, Dia 17/06, **16:00 - 17:00** (termina quando a outra começa)
2. ✅ **Esperado**: Deve ser criada com sucesso

### Teste 6b: Reserva DEPOIS (começa depois de terminar a existente)
1. Quadra 1, Dia 17/06, **18:00 - 19:00** (começa quando a outra termina)
2. ✅ **Esperado**: Deve ser criada com sucesso

### Teste 6c: Quadra DIFERENTE no mesmo horário
1. Quadra 2, Dia 17/06, **17:00 - 18:00** (mesmo horário, OUTRA quadra)
2. ✅ **Esperado**: Deve ser criada com sucesso

---

## 🧪 Teste 7: Reservas em Ginásios Diferentes no Mesmo Horário

### O que testar:
- Permissão de reserva no mesmo horário em ginásios diferentes

### Passos:
1. Crie reserva no **Dom Bosco**:
   - Quadra 1, Dia 17/06, 14:00-15:00
2. Volte à Home → Vá para **São Domingos**
3. Crie reserva idêntica:
   - Quadra 1, Dia 17/06, 14:00-15:00
4. ✅ **Esperado**: Criada com sucesso (ginásios diferentes = sem conflito)

---

## 🧪 Teste 8: Edição de Reserva

### O que testar:
- Usuário consegue editar uma reserva existente

### Passos:
1. Na lista de reservas, clique em "Editar" de uma reserva
2. Modifique algum campo (ex: mude responsável ou quadra)
3. Clique "Atualizar"
4. ✅ **Esperado**: Reserva atualizada na lista

---

## 🧪 Teste 9: Exclusão de Reserva

### O que testar:
- Usuário consegue deletar uma reserva

### Passos:
1. Na lista de reservas, clique em "Deletar"
2. Confirme a exclusão
3. ✅ **Esperado**: Reserva removida da lista

---

## 🧪 Teste 10: Mensagens de Erro

### O que testar:
- Mensagens claras aparecem em situações de erro

### Casos:
1. **Sem nome do responsável**: Tente criar sem preencher o nome
   - ✅ **Esperado**: "Preencha o nome do responsável."

2. **Conflito de horário**: Tente criar em horário ocupado
   - ✅ **Esperado**: "Esse horário já está agendado para esta quadra. Escolha outro horário."

3. **Erro na API**: Se o servidor cair
   - ✅ **Esperado**: Mensagem de erro genérica

---

## 📊 Checklist Final

- [ ] Teste 1: Isolamento por ginásio ✅
- [ ] Teste 2: Seleção de quadras ✅
- [ ] Teste 3: Seleção de duração e cálculo de valor ✅
- [ ] Teste 4: Cálculo automático de horário final ✅
- [ ] Teste 5: Bloqueio de conflitos ✅
- [ ] Teste 6: Casos permitidos após conflito ✅
- [ ] Teste 7: Ginásios diferentes no mesmo horário ✅
- [ ] Teste 8: Edição de reserva ✅
- [ ] Teste 9: Exclusão de reserva ✅
- [ ] Teste 10: Mensagens de erro ✅

---

## 🚀 Comandos Úteis

### Iniciar o servidor (com json-server)
```bash
cd c:\Users\gabri\Desktop\TrabalhoH1\app-mobile
npm run server
```

### Iniciar o app (em outra aba do terminal)
```bash
npm start  # Expo
npm run web  # Web
npm run android  # Android
npm run ios  # iOS
```

### Ver dados no banco
```bash
curl http://localhost:3000/reservas
curl "http://localhost:3000/reservas?ginasioId=1"
```

---

## 💡 Dicas de Teste

1. Use datas futuras para evitar confusão
2. Sempre teste com MESMA quadra, MESMO dia para validar conflitos
3. O horário é em formato 24h (14:00 = 2 da tarde)
4. Refreshe a página se não vir as alterações refletidas
5. Abra o console do browser (F12) para ver logs de erro

---

## ❓ FAQ

**P: Por que a reserva não aparece após criar?**
R: Verifique se clicou em "Criar Reserva" e espere a resposta da API.

**P: Como faço para limpar todas as reservas?**
R: Mate o servidor (Ctrl+C) e reinicie - o json-server usa um arquivo local.

**P: Posso editar e criar conflito?**
R: Sim, a validação ocorre na edição também. Se a nova data criar conflito, será bloqueada.

**P: Como adiciono um novo ginásio?**
R: Edite o arquivo `ginasios.tsx` e adicione um novo objeto no array.
