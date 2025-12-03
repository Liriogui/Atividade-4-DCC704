# 🛡️ Trabalho 4 – Implementando Defesas Arquiteturais  
**Disciplina:** DCC704 – Arquitetura e Tecnologias de Sistemas Web  
**Professor:** Jean Bertrand  
**Aluno:** GUILHERME LIRIOBERTO DA SILVA ALVES  
**Ano:** 2025  

---

# 📘 1. Introdução

Este relatório descreve a implementação das defesas arquiteturais solicitadas no **Trabalho 4** da disciplina DCC704.

A base do sistema foi construída seguindo a **Aula 18 – Autenticação e Sessões**, e todas as medidas de segurança foram fundamentadas teoricamente na **Aula 19 – Segurança de Sistemas Web**.

O objetivo principal é demonstrar como cada vulnerabilidade apresentada na Aula 19 foi mitigada no código, aplicando boas práticas recomendadas pela OWASP.

---

# 📚 2. Referencial Teórico – Aula 19

## 🔒 2.1 – SQL Injection (SQLi)

A Aula 19 mostra que SQL Injection ocorre quando dados enviados pelo usuário são inseridos diretamente em comandos SQL.

### ✔ Defesas aplicadas:
- Não confiar em nenhum input
- Queries parametrizadas
- Uso exclusivo de **Mongoose**, que separa comandos de dados automaticamente

### 🔧 Exemplo seguro:
\`\`\`js
const user = await User.findOne({ email });
\`\`\`

---

## ⚠️ 2.2 – Cross-Site Scripting (XSS)

XSS ocorre quando valores vindos do usuário são exibidos sem escaping, permitindo execução de \`<script>\` no navegador.

### ✔ Defesas aplicadas:
- EJS com escaping automático (\`<%= %>\`)
- Nenhum uso de \`<%- %>\` (que renderizaria HTML bruto)
- Sanitização natural pelo próprio EJS

### 🔧 Exemplo seguro:
\`\`\`html
<p><%= email %></p>
\`\`\`

---

## 🧷 2.3 – Cross-Site Request Forgery (CSRF)

CSRF explora o envio automático de cookies e força ações indesejadas.

### ✔ Defesas aplicadas:
- Middleware \`csurf\`
- Tokens únicos enviados a cada formulário
- Validação automática do token

### 🔧 Exemplo de token no formulário:
\`\`\`html
<input type="hidden" name="_csrf" value="<%= csrfToken %>">
\`\`\`

⚠ **Atenção:** Rota \`/login\` é exceção e não utiliza CSRF, conforme solicitado no enunciado.

---

## 🧩 2.4 – Segurança de Cabeçalhos HTTP

A aula reforça a importância de cabeçalhos como:

- X-Frame-Options  
- X-Content-Type-Options  
- Content-Security-Policy  

### ✔ Implementação:
\`\`\`js
const helmet = require('helmet');
app.use(helmet());
\`\`\`

---

## 🔑 2.5 – Variáveis de Ambiente

Aula 19 enfatiza:

> "Nunca salve credenciais no código. Use dotenv."

### ✔ Implementação:
\`\`\`js
require('dotenv').config();
\`\`\`

### 🔧 Exemplo de `.env`:
\`\`\`
MONGO_URI=...
SESSION_SECRET=...
\`\`\`

---

## 🚫 2.6 – Rate Limiting (Força Bruta)

Ataques de força bruta tentam senhas repetidamente até acertar.

### ✔ Implementação:
\`\`\`js
const loginLimiter = rateLimit({
  windowMs: 60000,
  max: 5
});
\`\`\`

Ao exceder 5 tentativas/min:
\`\`\`
429 Too Many Requests
\`\`\`

---

# ⚙️ 3. Implementação das Defesas na Aplicação

## ✔ 3.1 – Defesa contra SQL Injection
- Uso exclusivo de Mongoose  
- Nenhuma string SQL manual presente  
- Consultas 100% seguras

---

## ✔ 3.2 – Defesa contra XSS
- Todas as views usam \`<%= %>\`  
- Nada é exibido sem escape

---

## ✔ 3.3 – Defesa contra CSRF
- \`csurf\` habilitado globalmente  
- Formulários recebem token  
- \`/login\` isenta conforme especificado  

---

## ✔ 3.4 – Rate Limit no Login
Única rota limitada conforme boas práticas OWASP.

---

## ✔ 3.5 – Helmet
- Ativado globalmente  
- Proteção contra múltiplos vetores de ataque via cabeçalhos

---

## ✔ 3.6 – Variáveis de Ambiente
- `.env` para segredos  
- `.env.example` incluído no repositório  

---

## ✔ 3.7 – Sessões e Autenticação (Aula 18)
Todos os requisitos cumpridos:

- `/register`  
- `/login`  
- Sessões com `express-session`  
- Middleware `isAuth`  
- Rota protegida `/perfil`  
- Logout  
- Hash de senha com bcrypt

---

# 📁 4. Estrutura Final do Projeto

\`\`\`
/Trabalho-4-Defesas-Arquiteturais
 ├─ server.js
 ├─ package.json
 ├─ .gitignore
 ├─ .env.example
 ├─ README.md
 └─ src/
    ├─ controllers/
    ├─ models/
    ├─ middlewares/
    ├─ routes/
    └─ views/
\`\`\`

---

# 🏁 5. Conclusão

Com base na Aula 19, todas as defesas arquiteturais solicitadas foram implementadas, resultando em uma aplicação segura contra as principais vulnerabilidades modernas:

- SQL Injection  
- Cross-Site Scripting (XSS)  
- Cross-Site Request Forgery (CSRF)  
- Ataques de força bruta  
- Exposição de credenciais  
- Falhas em cabeçalhos HTTP  

O projeto segue rigorosamente boas práticas recomendadas pela OWASP e as orientações do professor, alcançando uma arquitetura robusta e confiável.

---
