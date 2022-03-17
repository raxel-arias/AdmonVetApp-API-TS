"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRouter = void 0;
const express_1 = require("express");
const usuario_mw_1 = require("../../middlewares/endpoints/usuario.mw");
const UsuarioRouterChilds = (0, express_1.Router)({ mergeParams: true });
exports.UsuarioRouter = (0, express_1.Router)();
exports.UsuarioRouter.use('/user', UsuarioRouterChilds);
UsuarioRouterChilds.put('/actualizar', usuario_mw_1.ActualizarInfo);
