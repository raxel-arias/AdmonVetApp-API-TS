import { Request, Response } from "express";

export const SignUp = async (req: Request, res: Response): Promise<any> => {
    const user:any = req.body;

    try {
        console.log(user);
    } catch (error: any) {

    }
}