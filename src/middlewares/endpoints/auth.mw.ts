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

export const ValidarTokenRecuperacion = async (req: Request, res: Response): Promise<any> => {
    const {token}: Request['params'] = req.params;
    
    try {
        const response: PromiseResponse = await new AuthController().ValidarTokenRecuperacion(token);
    
        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}

export const ResetearPassword = async (req: Request, res: Response): Promise<any> => {
    const {token}: Request['query'] = req.query;
    const {password}: Request["body"] = req.body;

    try {
        const response: PromiseResponse = await new AuthController().ResetearPassword(password, (token as string));

        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}
