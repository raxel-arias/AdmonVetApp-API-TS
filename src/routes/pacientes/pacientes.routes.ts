import { Router } from "express";
import { ActualizarEstadoPaciente, ActualizarInfoPaciente, EliminarPaciente, ListadoPacientes, NuevoPaciente } from "../../middlewares/endpoints/paciente.mw";

import Auth from '../../auth/Auth.class';
import { NuevoPacienteValidator, ActualizarPacienteValidator } from "../../validators/paciente.validator";
import { ValidarExistenciaUsuario } from "../../middlewares/auth.mw";

const PacienteRouterChilds: Router = Router({mergeParams: true});

export const PacienteRouter: Router = Router();

PacienteRouter.use('/pacientes', PacienteRouterChilds);

PacienteRouter.get('/pacientes', Auth.ValidateJWT, ValidarExistenciaUsuario, ListadoPacientes);
PacienteRouterChilds.post('/nuevo', Auth.ValidateJWT, ValidarExistenciaUsuario, NuevoPacienteValidator, NuevoPaciente);
PacienteRouterChilds.put('/editar/:id', Auth.ValidateJWT, ValidarExistenciaUsuario, ActualizarPacienteValidator, ActualizarInfoPaciente);
PacienteRouterChilds.put('/actualizar-estado/:id', Auth.ValidateJWT, ValidarExistenciaUsuario, ActualizarEstadoPaciente);
PacienteRouterChilds.delete('/eliminar/:id', Auth.ValidateJWT, ValidarExistenciaUsuario, EliminarPaciente);
