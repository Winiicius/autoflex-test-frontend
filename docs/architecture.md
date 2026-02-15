# ARCHITECTURE — Autoflex Inventory System

## 1) Objetivo

Este documento descreve a arquitetura de alto nível do sistema Autoflex Inventory, incluindo:

- Componentes do sistema (Frontend, Backend, Banco de Dados)
- Fluxo de dados entre as camadas

---

## 2) Arquitetura Geral

### Componentes

- **Frontend (React + Chakra UI)**
  - Interface web para operações de CRUD e visualização da capacidade de produção
  - Comunicação com o backend via HTTP (REST)
  - Responsividade para diferentes tamanhos de tela

- **Backend (Java + Spring Boot)**
  - API REST responsável pelas regras de negócio
  - Contém:
    - Modelo de domínio (Entities)
    - Validações
    - Camada de serviços
    - Persistência com JPA
  - Executa automaticamente as migrations do Flyway ao iniciar

- **Banco de Dados (PostgreSQL)**
  - Responsável pela persistência das entidades:
    - products
    - raw_materials
    - product_materials
    - users
  - Estrutura controlada por migrations versionadas (Flyway)

- **Ferramenta de Administração (Adminer)**
  - Utilizada apenas para inspeção do banco em ambiente local

---

## 3) Diagrama Arquitetural (Visão Lógica)

```
+---------------------------+
|  Frontend (React + Chakra)|
|  - Telas / Formulários    |
|  - Listagens / Dashboard  |
+-------------+-------------+
              |
              | HTTP (REST) + JWT
              v
+-------------+-------------+
| Backend (Spring Boot API) |
| - Controllers             |
| - Services (regras)       |
| - Repositories (JPA)      |
| - DTOs / Mappers          |
| - Flyway (migrations)     |
+-------------+-------------+
              |
              | JDBC
              v
+-------------+-------------+
|   PostgreSQL Database     |
| - products                |
| - raw_materials           |
| - product_materials       |
| - users                   |
+---------------------------+

+---------------------------+
| Adminer (interface DB)    |
+---------------------------+
```
