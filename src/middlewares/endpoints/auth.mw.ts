import { Request, Response } from "express";
import AuthController from "../../controllers/auth/auth.controller";

export const SignUp = async (req: Request, res: Response): Promise<any> => {
    const usuario = req.body;
    
    try {
        const response:any = await new AuthController().SignUp(usuario);
        
        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}

export const Login = async (req: Request, res: Response): Promise<any> => {
    const usuario = req.body;

    try {
        const response:any = await new AuthController().Login(usuario);

        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}