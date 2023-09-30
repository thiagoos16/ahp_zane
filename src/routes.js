const express = require('express');
const routes = express.Router();
const authMiddleware = require('./middlewares/auth');
const AuthController = require('./controllers/AuthController');
const ProjectController = require('./controllers/projectController');
const ParameterController = require('./controllers/parameterController')

routes.post("/register", AuthController.register);
routes.post("/login", AuthController.login);
routes.get("/profile", authMiddleware, AuthController.profile);
routes.post("/forgot_password", AuthController.forgot_password);
routes.post("/reset_password", AuthController.reset_password);

routes.get("/projects", ProjectController.index);
routes.get("/projects/:id", ProjectController.show);
routes.post("/projects", ProjectController.create);
routes.put("/projects/:id", ProjectController.update);
routes.delete("/projects/:id", ProjectController.destroy);

routes.post("/parameters", ParameterController.create);

module.exports = routes;