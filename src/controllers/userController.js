const User = require("../models/User");
const bcrypt = require("bcrypt");

// Renderiza login
exports.loginPage = (req, res) => {
  res.render("login");
};

// Renderiza registro
exports.registerPage = (req, res) => {
  res.render("register");
};

// Registro
exports.register = async (req, res) => {
  const { email, senha } = req.body;

  const hash = await bcrypt.hash(senha, 10);

  await User.create({ email, senha: hash });

  res.redirect("/login");
};

// Login
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.send("Usuário não encontrado");

  const match = await bcrypt.compare(senha, user.senha);
  if (!match) return res.send("Senha incorreta");

  req.session.userId = user._id;

  res.redirect("/perfil");
};

// Perfil
exports.perfil = (req, res) => {
  res.render("perfil");
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
