# Autoflex Inventory System

# Seções

- [Entenda o Escopo do Desafio](#entenda-o-escopo-do-desafio)
- [Minha Solução — Autoflex Inventory](#minha-solução--autoflex-inventory)
- [Documentação Técnica](#documentação-técnica)
- [Acesse a aplicação](#deploy)
- [Como rodar localmente via Docker](#tutorial--subindo-os-serviços-com-docker-compose)
- [Desenvolvedor](#desenvolvedor)

---

# Entenda o Escopo do Desafio

O desafio consiste no desenvolvimento de um **sistema web para controle de estoque industrial**, permitindo o gerenciamento de:

- Produtos finais
- Matérias-primas
- Relação entre produtos e suas matérias-primas
- Cálculo de quais produtos podem ser produzidos com o estoque atual

A proposta central é construir uma aplicação **Full Stack**, separando backend e frontend, seguindo boas práticas de arquitetura, persistência relacional e organização de código.

---

## 🎯 Objetivo principal

Criar uma aplicação capaz de:

- Realizar CRUD completo de **Produtos**
- Realizar CRUD completo de **Matérias-primas**
- Associar matérias-primas aos produtos com quantidade necessária
- Calcular automaticamente:
  - Quais produtos podem ser produzidos
  - Quantidade máxima possível de produção
  - Priorizar produtos de maior valor
- Exibir essas informações por meio de uma interface web responsiva

---

## 🧱 Componentes do Sistema

A solução foi estruturada em duas camadas principais:

### 1️⃣ Backend (API REST)

- Desenvolvido em **Java com Spring Boot**
- Persistência em **PostgreSQL**
- Controle de schema via **Flyway (migrations versionadas)**
- Arquitetura baseada em:
  - Entities
  - DTOs
  - Services
  - Repositories
  - Controllers

Principais endpoints:

- `/products`
- `/raw-materials`
- `/production`
- `/auth`

---

### 2️⃣ Frontend (Interface Web)

- Desenvolvido com **React**
- Componentização com **Chakra UI**
- Comunicação com backend via API REST
- Interface responsiva

Principais rotas:

```
/login
/
/products
/products/new
/products/:id
/raw-materials
/raw-materials/new
/raw-materials/:id
/production
```

---

## 💡 Problema resolvido

Indústrias precisam controlar corretamente o consumo de matérias-primas para evitar desperdício, ruptura de estoque e prejuízo financeiro.

O sistema entrega:

- Visão clara do estoque atual
- Relação explícita entre produto e insumos
- Simulação de produção com base no estoque
- Priorização automática por valor de produto

---

# Minha Solução — Autoflex Inventory

A aplicação foi desenvolvida com foco em:

- Separação clara entre frontend e backend
- Uso de Docker para padronização do ambiente
- Controle versionado do banco com Flyway
- Organização por camadas (Controller → Service → Repository)
- Uso de DTOs para desacoplamento da camada de persistência
- Validação automática do schema com `ddl-auto: validate`

Arquitetura geral:

```
Frontend (React)
        ↓
Backend (Spring Boot API)
        ↓
PostgreSQL (Docker)
```

---

## ✅ Diferenciais Implementados

- Autenticação básica com controle de perfil (ADMIN / USER)
- Migrations versionadas
- Docker Compose com múltiplos serviços
- Validação automática do schema
- Associação N:N modelada corretamente via entidade intermediária (`product_materials`)
- Endpoint específico para cálculo de produção priorizada

---

# Documentação Técnica

Arquivos complementares:

- [`ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`DATABASE.md`](docs/DATABASE.md)
- [`DECISIONS.md`](docs/DECISIONS.md)
- [`API-CONTRACT-BACKEND.md`](docs/API-CONTRACT-BACKEND.md)

Esses documentos detalham:

- Modelagem do banco
- Decisões arquiteturais
- Escolha de tecnologias
- Estratégia de versionamento

---

# Deploy

https://autoflex-inventory.netlify.app

---

# Tutorial — Subindo os serviços com Docker Compose

## 🧱 Requisitos

- Docker Desktop
- Git
- Node.js

---

## 🚀 Setup Completo (ambiente local)

### 1️⃣ Clone o repositório do backend

```bash
git clone https://github.com/seu-usuario/autoflex-backend.git
cd autoflex-backend
```

---

### 2️⃣ Limpe containers e volumes antigos

```bash
docker compose down -v
```

---

### 3️⃣ Suba os serviços

```bash
docker compose up --build
```

Esse comando irá:

- Subir o PostgreSQL
- Aplicar automaticamente as migrations do Flyway
- Subir a API Spring Boot
- Subir o Adminer

---

### 4️⃣ Em outra pasta, clone o frontend:

```bash
git clone https://github.com/seu-usuario/autoflex-frontend.git
cd autoflex-frontend
```

## 🌐 Frontend — Configuração do .env

O frontend precisa saber onde o backend está rodando.

### 5️⃣ Criar arquivo `.env` na raiz do frontend

Dentro da pasta `autoflex-frontend`, crie um arquivo:

```bash
.env
```

Com o seguinte conteúdo:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

---

## ▶️ Rodando o Frontend

### 6️⃣ Instale dependências e EWxecute o Projeto

```bash
npm install
npm run dev
```

## 🧩 Acessos

- Backend API: http://localhost:8080
- Frontend: http://localhost:5173
- Adminer: http://localhost:8081

> Adminer Login:
>
> - Sistema: PostgreSQL
> - Servidor: autoflex-database
> - user: autoflex
> - password: autoflex
> - Base de Dados: autoflex-database

---

## 🧹 Parar e limpar ambiente

Parar containers:

```bash
docker compose down
```

Parar e apagar banco:

```bash
docker compose down -v
```

---

# Desenvolvedor

<strong>Winicius</strong>

<p>
<a href="https://github.com/Winiicius" rel="noopener">
    <img width="100" height="100" style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/102719335?v=4" alt="Foto Winicius">
</a>
</p>
<p>
<a href="https://www.linkedin.com/in/winicius-alexandre" target="_blank">
    <img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
</a>
</p>
