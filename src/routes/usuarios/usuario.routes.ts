import {Router} from 'express';

import { ActualizarInfo } from '../../middlewares/endpoints/usuario.mw';

const UsuarioRouterChilds = Router({mergeParams: true});

export const UsuarioRouter = Router();

UsuarioRouter.use('/user', UsuarioRouterChilds);
UsuarioRouterChilds.put('/actualizar', ActualizarInfo);