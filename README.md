# Trabalho 4 – Implementando Defesas Arquiteturais
### Disciplina: DCC704 – Arquitetura e Tecnologias de Sistemas Web
### Professor: Jean Bertrand
### Aluno: GUILHERME LIRIOBERTO DA SILVA ALVES
### Ano: 2025  
---

## 🎯 Objetivo
Implementar proteções arquiteturais contra:
- SQL Injection (SQLi)
- Cross-Site Scripting (XSS)
- CSRF
- Força Bruta
- Exposição de credenciais
- Cabeçalhos HTTP inseguros

O projeto parte da versão final da Aula 18.

---

# ✅ 1. SQL Injection (SQLi)
**Mitigação:** uso de *queries parametrizadas* do Mongoose.  
Não há concatenação manual de strings. Exemplo:

```js
User.findOne({ email: req.body.email })
