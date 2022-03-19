import { Request, Response, NextFunction } from "express";
import AuthController from "../../controllers/auth/auth.controller";
import { PromiseResponse } from "../../interfaces/promise_response.interface";

export const SignUp = async (req: Request, res: Response): Promise<any> => {
    const usuario = req.body;
    
    try {
        const response: PromiseResponse = await new AuthController().SignUp(usuario);
        
        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}

export const Login = async (req: Request, res: Response): Promise<any> => {
    const usuario = req.body;

    try {
        const response: PromiseResponse = await new AuthController().Login(usuario);

        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}

export const ActivarCuenta = async (req: Request, res: Response): Promise<any> => {
    const token: string = req.params.token;

    try {
        const response: PromiseResponse = await new AuthController().ActivarCuenta(token);

        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}

export const RecuperarCuenta = async (req: Request, res: Response): Promise<any> => {
    const {email} = req.body;

    try {
        const response: PromiseResponse = await new AuthController().GenerarTokenRecuperacion(email);

        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}

export const ValidarTokenRecuperacion = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {token}: Request['params'] = req.params;
    
    try {
        const response: PromiseResponse = await new AuthController().ValidarTokenRecuperacion(token);
          
        req.user = {
            userId: response.data.usuarioId
        }

        next();
    } catch (error: any) {
        console.log(error);
        res.status(error.status).json(error);
    }
}

export const ResetearPassword = async (req: Request, res: Response): Promise<any> => {
    const {userId}: Request['user'] = req.user;
    const {password}: Request["body"] = req.body;

    try {
        const response: PromiseResponse = await new AuthController().ResetearPassword(password, userId);

        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}
