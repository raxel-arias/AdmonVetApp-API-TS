import {Router} from 'express';
import { ActualizarInfoValidator } from '../../validators/usuario.validator';
import Auth from '../../auth/Auth.class';

import { ActualizarInfo, ObtenerPerfil } from '../../middlewares/endpoints/usuario.mw';

const UsuarioRouterChilds = Router({mergeParams: true});

export const UsuarioRouter = Router();

UsuarioRouter.use('/user', UsuarioRouterChilds);
UsuarioRouterChilds.get('/', Auth.ValidateJWT, ObtenerPerfil)
UsuarioRouterChilds.put('/actualizar', Auth.ValidateJWT, ActualizarInfoValidator, ActualizarInfo);