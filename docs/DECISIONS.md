# DECISIONS — Autoflex Inventory System

## 1) Estrutura de Repositórios (Monorepo vs Multirepo)

**Decisão:** Utilizar repositórios separados para Backend e Frontend.

**Motivação:**
Em experiências anteriores com monorepo, houve dificuldade no processo de deploy, especialmente na configuração de build e publicação do frontend.

**Justificativa Técnica:**

- Separação clara de responsabilidades.
- Deploy independente de cada aplicação.
- Maior simplicidade de configuração em plataformas como Render, Netlify e similares.
- Redução de complexidade no pipeline de build.

---

## 2) Spring Boot vs Quarkus

**Decisão:** Utilizar Spring Boot.

**Motivação:**
Spring Boot é a tecnologia com maior domínio técnico no momento, permitindo uma entrega mais sólida e consistente.

**Justificativa Técnica:**

- Ecossistema maduro e amplamente utilizado.
- Forte integração com JPA, validação e segurança.
- Documentação extensa e comunidade ativa.
- Redução da curva de aprendizado durante o desafio.

---

## 3) PostgreSQL vs Oracle

**Decisão:** Utilizar PostgreSQL.

**Motivação:**
Experiência prévia com PostgreSQL e maior familiaridade com sua configuração em ambiente Docker.

**Justificativa Técnica:**

- Banco relacional robusto e amplamente utilizado.
- Excelente compatibilidade com Spring Data JPA.
- Simples de configurar em ambiente containerizado.
- Suporte nativo a tipos NUMERIC com precisão adequada.

---

## 4) Uso de Docker (Backend e Banco)

**Decisão:** Containerizar backend e banco de dados com Docker Compose.

**Motivação:**
Garantir ambiente reproduzível e independente da máquina do desenvolvedor.

**Justificativa Técnica:**

- Facilidade de setup.
- Padronização de ambiente.
- Eliminação de conflitos locais.
- Facilidade para avaliadores executarem o projeto.

---

## 5) Uso de Adminer

**Decisão:** Utilizar Adminer como ferramenta de inspeção do banco.

**Motivação:**
Facilitar a visualização e validação de dados durante o desenvolvimento.

**Justificativa Técnica:**

- Interface leve.
- Fácil integração via Docker.
- Útil para inspeção rápida de tabelas e dados.

---

## 6) Flyway para Controle de Schema

**Decisão:** Utilizar Flyway para versionamento do banco de dados.

**Motivação:**
Evitar uso de `ddl-auto` para criação automática de tabelas.

**Justificativa Técnica:**

- Versionamento explícito do schema.
- Reprodutibilidade do banco.
- Controle total sobre alterações estruturais.
- Boa prática em projetos reais.

---

## 8) Uso de BigDecimal para Valores Numéricos

**Decisão:** Utilizar BigDecimal na aplicação e NUMERIC no banco.

**Motivação:**
Evitar erros de precisão com valores financeiros e quantidades fracionadas.

**Justificativa Técnica:**

- Precisão determinística.
- Boas práticas para sistemas financeiros/industriais.

---

## 9) Modelagem N:N com Entidade Intermediária

**Decisão:** Criar entidade `product_materials` ao invés de usar @ManyToMany simples.

**Motivação:**
A relação contém atributo próprio (`quantity`).

**Justificativa Técnica:**

- Permite armazenar quantidade necessária por produto.
- Maior flexibilidade futura.
- Modelagem mais correta do ponto de vista relacional.

---

## 10) Separação por Camadas (Controller → Service → Repository)

**Decisão:** Utilizar arquitetura em camadas.

**Motivação:**
Organização clara e manutenção facilitada.

**Justificativa Técnica:**

- Separação de responsabilidades.
- Facilita testes.
- Escalabilidade do projeto.

---

## 11) JWT para Autenticação

**Decisão:** Implementar autenticação baseada em token.

**Motivação:**
Adicionar maturidade e simular cenário real.

**Justificativa Técnica:**

- Separação entre autenticação e autorização.
- Escalável para múltiplos perfis de usuário.

---

## 12) Chakra UI no Frontend

**Decisão:** Utilizar Chakra UI ao invés de Tailwind.

**Motivação:**
Produtividade maior na construção de interfaces consistentes.

**Justificativa Técnica:**

- Componentes prontos.
- Sistema de design integrado.
- Rapidez no desenvolvimento.

---
