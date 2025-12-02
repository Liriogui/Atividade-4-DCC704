const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.loginPage = (req, res) => {
  res.render('login', { message: null });
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.render('login', { message: 'Preencha email e senha.' });

    const user = await User.findOne({ email });
    if (!user) return res.render('login', { message: 'Usuário não encontrado.' });

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.render('login', { message: 'Senha incorreta.' });

    req.session.userId = user._id;
    req.session.email = user.email;
    res.redirect('/perfil');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Erro interno no login.' });
  }
};

exports.registerPage = (req, res) => {
  res.render('register', { message: null });
};

exports.register = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.render('register', { message: 'Preencha email e senha.' });

    const exists = await User.findOne({ email });
    if (exists) return res.render('register', { message: 'Email já cadastrado.' });

    const hash = await bcrypt.hash(senha, 10);
    await User.create({ email, senha: hash });

    return res.redirect('/login');
  } catch (err) {
    console.error(err);
    return res.status(500).render('error', { message: 'Erro ao registrar usuário.' });
  }
};

// GET /perfil  (protegido)
exports.perfil = (req, res) => {
  res.render('perfil', { email: req.session.email });
};

// GET /logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao destruir sessão:', err);
      return res.redirect('/perfil');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};
