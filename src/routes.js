const express = require('express');
const routes = express.Router();
const authMiddleware = require('./middlewares/auth');
const AuthController = require('./controllers/authController');

routes.post("/register", AuthController.register);
routes.post("/login", AuthController.login);
routes.get("/profile", authMiddleware, AuthController.profile);
routes.post("/forgot_password", AuthController.forgot_password);
routes.post("/reset_password", AuthController.reset_password);

module.exports = routes;