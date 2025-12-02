const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const userRoutes = require("./src/routes/userRoutes");

const app = express();

// Configuração do Express
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Sessões
app.use(
  session({
    secret: "chave_super_secreta",
    resave: false,
    saveUninitialized: false,
  })
);

// Conexão com o MongoDB
mongoose
  .connect("mongodb://localhost:27017/aula18", {})
  .then(() => console.log("MongoDB conectado."))
  .catch((err) => console.log("Erro na conexão: ", err));

app.use("/", userRoutes);

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
