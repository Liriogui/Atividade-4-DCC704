require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const helmet = require('helmet');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const path = require('path');

const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

/* ========== MIDDLEWARES BÁSICOS ========== */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 // 1 hora
    }
  })
);

/* ========== Rate limiter específico para /login (Força Bruta) ========== */
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // 5 tentativas
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Muitas tentativas de login. Tente novamente em 1 minuto.'
});

/* ========== Conexão Mongoose (use .env) ========== */
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aula18_trabalho4')
  .then(() => console.log('MongoDB conectado.'))
  .catch((err) => console.error('Erro MongoDB:', err));

/* ========== ROTAS QUE DEVEM FICAR ANTES DO CSRF (exceção: /login) ========== */
/* login GET e POST ficarão aqui (POST sem CSRF conforme enunciado) */
const { loginPage, login } = require('./src/controllers/userController');
app.get('/login', loginPage);
app.post('/login', loginLimiter, login);
app.get('/', (req, res) => res.redirect('/login'));

/* ========== APLICAR CSRF PARA O RESTANTE DAS ROTAS POST ========== */
app.use(csrf());

/* Envia o token CSRF para todas as views (exceto quando não existe) */
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : '';
  res.locals.session = req.session;
  next();
});

app.use((err, req, res, next) => {
  if (err && err.code === 'EBADCSRFTOKEN') {
    return res.status(403).render('error', { message: 'Formulário expirado ou inválido (CSRF).' });
  }
  next(err);
});

app.use('/', userRoutes);

/* ========== ERRO 404 ========== */
app.use((req, res) => {
  res.status(404).render('error', { message: 'Página não encontrada.' });
});

/* ========== INICIA SERVIDOR ========== */
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
