const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/userController");
const isAuth = require("../middlewares/auth");

router.get("/login", ctrl.loginPage);
router.post("/login", ctrl.login);

router.get("/register", ctrl.registerPage);
router.post("/register", ctrl.register);

router.get("/perfil", isAuth, ctrl.perfil);

router.get("/logout", ctrl.logout);

module.exports = router;
