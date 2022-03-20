import { Router } from "express";
import { ActualizarInfoPaciente, EliminarPaciente, ListadoPacientes, NuevoPaciente } from "../../middlewares/endpoints/paciente.mw";

import Auth from '../../auth/Auth.class';

const PacienteRouterChilds: Router = Router({mergeParams: true});

export const PacienteRouter: Router = Router();

PacienteRouter.use('/pacientes', PacienteRouterChilds);

PacienteRouter.get('/pacientes', Auth.ValidateJWT, ListadoPacientes);
PacienteRouterChilds.post('/nuevo', Auth.ValidateJWT, NuevoPaciente);
PacienteRouterChilds.put('/editar/:id', Auth.ValidateJWT, ActualizarInfoPaciente);
PacienteRouterChilds.delete('/eliminar/:id', Auth.ValidateJWT, EliminarPaciente);
