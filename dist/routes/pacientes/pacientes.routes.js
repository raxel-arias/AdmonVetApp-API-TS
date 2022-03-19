"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacienteRouter = void 0;
const express_1 = require("express");
const paciente_mw_1 = require("../../middlewares/endpoints/paciente.mw");
const Auth_class_1 = __importDefault(require("../../auth/Auth.class"));
const PacienteRouterChilds = (0, express_1.Router)({ mergeParams: true });
exports.PacienteRouter = (0, express_1.Router)();
exports.PacienteRouter.use('/pacientes', PacienteRouterChilds);
exports.PacienteRouter.get('/pacientes', Auth_class_1.default.ValidateJWT, paciente_mw_1.ListadoPacientes);
PacienteRouterChilds.post('/nuevo', Auth_class_1.default.ValidateJWT, paciente_mw_1.NuevoPaciente);
PacienteRouterChilds.put('/editar/:id', Auth_class_1.default.ValidateJWT);
PacienteRouterChilds.delete('/eliminar/:id', Auth_class_1.default.ValidateJWT);
