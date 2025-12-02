require('dotenv').config();
const helmet = require('helmet');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');

// antes das rotas
app.use(helmet());

// proteção CSRF
app.use(csrf());

// token CSRF para views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Rate limiting na rota de login
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Muitas tentativas. Aguarde 1 minuto."
});
