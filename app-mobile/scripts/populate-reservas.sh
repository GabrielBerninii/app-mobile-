#!/bin/bash
# Script para popular o banco de dados com exemplos de reservas

# Dados de exemplo para o Ginásio Dom Bosco
curl -X POST http://localhost:3000/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "ginasioId": 1,
    "ginasioNome": "Ginásio Poliesportivo Dom Bosco",
    "quadra": "Quadra 1",
    "nomeResponsavel": "João Silva",
    "dia": "17/06/2024",
    "horaInicio": "14:00",
    "duracao": 60,
    "horaFim": "15:00",
    "valorTotal": 100
  }'

curl -X POST http://localhost:3000/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "ginasioId": 1,
    "ginasioNome": "Ginásio Poliesportivo Dom Bosco",
    "quadra": "Quadra 2",
    "nomeResponsavel": "Maria Santos",
    "dia": "17/06/2024",
    "horaInicio": "15:30",
    "duracao": 90,
    "horaFim": "17:00",
    "valorTotal": 150
  }'

# Dados de exemplo para o Ginásio São Domingos
curl -X POST http://localhost:3000/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "ginasioId": 2,
    "ginasioNome": "Ginásio Poliesportivo São Domingos",
    "quadra": "Quadra 1",
    "nomeResponsavel": "Carlos Oliveira",
    "dia": "18/06/2024",
    "horaInicio": "16:00",
    "duracao": 120,
    "horaFim": "18:00",
    "valorTotal": 200
  }'

echo "Dados de exemplo adicionados com sucesso!"
