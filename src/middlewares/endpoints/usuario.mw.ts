import {Request, Response} from 'express';
import UsuarioController from "../../controllers/usuario.controller";

export const ActualizarInfo = async (req: Request, res: Response): Promise<any> => {
    const usuario = req.body;

    try {
        const response: any = await new UsuarioController().ActualizarInfo(usuario);

        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}