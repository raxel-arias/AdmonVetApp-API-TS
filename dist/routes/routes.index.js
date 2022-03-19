"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE_DECLARATIONS = void 0;
const auth_routes_1 = require("./auth/auth.routes");
const usuario_routes_1 = require("./usuarios/usuario.routes");
const pacientes_routes_1 = require("./pacientes/pacientes.routes");
exports.ROUTE_DECLARATIONS = {
    path: '/api',
    routers: [
        auth_routes_1.AuthRouter,
        usuario_routes_1.UsuarioRouter,
        pacientes_routes_1.PacienteRouter
    ]
};
