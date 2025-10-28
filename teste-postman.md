# Testes CRUD no Postman

Base URL: http://localhost:3000

---

# 1CREATE – POST /alunos
Headers:
Content-Type: application/json

Body (raw JSON):
{
  "nome": "Maria Silva",
  "idade": 22,
  "curso": "Análise e Desenvolvimento de Sistemas"
}

---

## 2 READ – GET /alunos
Listar todos:
GET http://localhost:3000/alunos

Buscar por ID:
GET http://localhost:3000/alunos/1

---

## 3 UPDATE – PUT /alunos/:id
Headers:
Content-Type: application/json

Body (raw JSON):
{
  "nome": "Maria Oliveira",
  "idade": 23,
  "curso": "Engenharia de Software"
}

URL:
PUT http://localhost:3000/alunos/1

---

## 4 DELETE – DELETE /alunos/:id
URL:
DELETE http://localhost:3000/alunos/1