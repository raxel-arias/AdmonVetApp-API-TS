import { Request, Response, NextFunction } from 'express';
import UsuarioModel from '../models/usuario.model';

export const ValidarExistenciaUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {userId}: Request['user'] = req.user;
    try {
        const usuarioFound = await UsuarioModel.findById(userId);

        if (!usuarioFound) {
            res.status(404).json({
                status: 404,
                msg: 'Usuario no encontrado',
                isError: true
            });
            return;
        }

        next();
    } catch (error: any) {
        if (error.name === 'CastError') {
            res.status(404).json({
                status: 404,
                msg: 'Usuario no encontrado'
            });
            return;
        }
        res.status(500).json({
            status: 500,
            msg: 'Hubo un error al consultar el usuario',
            isError: true,
            errorDetails: error
        });
    }
}