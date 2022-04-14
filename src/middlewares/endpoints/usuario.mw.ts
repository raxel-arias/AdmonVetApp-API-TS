import {Request, Response} from 'express';
import UsuarioController from "../../controllers/usuario.controller";
import { PromiseResponse } from '../../interfaces/promise_response.interface';
import { Result, ValidationError, validationResult } from 'express-validator';

export const ActualizarInfo = async (req: Request, res: Response): Promise<any> => {
    const usuario = req.body;

    const {errors}: Result<ValidationError>['errors'] = validationResult(req);

    if (errors.length) {
        res.status(400).json({
            msg: 'Error en las entradas',
            isError: true,
            errorDetails: {errors}
        });
        return;
    }

    usuario._id = req.user.userId;
    
    try {
        const response: PromiseResponse = await new UsuarioController().ActualizarInfo(usuario);

        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}

export const ObtenerPerfil = async (req: Request, res: Response): Promise<any> => {
    const {userId}: Request['user'] = req.user;

    try {
        const response = await new UsuarioController().ObtenerPerfil(userId);

        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}