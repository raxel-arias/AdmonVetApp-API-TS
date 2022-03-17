import { Request, Response } from "express";
import AuthController from "../../controllers/auth/auth.controller";

export const SignUp = async (req: Request, res: Response): Promise<any> => {
    const user = req.body;
    
    try {
        const response:any = await new AuthController().SignUp(user);
        
        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}