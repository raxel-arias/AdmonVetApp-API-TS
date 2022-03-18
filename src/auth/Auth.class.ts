import {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default class Auth {
    private static _JWT_SECRET: any = process.env.JWT_SECRET;

    public static genHash(password: string): Promise<string> {
        return new Promise(async (resolve: any, reject: any) => {
            const hashed:string = await bcrypt.hash(password, bcrypt.genSaltSync(5));

            resolve(hashed);
        });
    }

    public static genToken():string {
        return crypto.randomBytes(20).toString('hex');
    }

    public static async validateHashBcrypt(password: string, correctHashedPassword: string): Promise<boolean> {
        return new Promise(async (resolve: any, reject: any) => {
            const isValid = await bcrypt.compare(password, correctHashedPassword);

            resolve(isValid);
        });
    }

    public static async genJWT(data: any): Promise<string> {
        return jwt.sign(data, this._JWT_SECRET, {
            expiresIn: '30d'
        });
    }

    public static validateJWT(req: Request, res: Response, next: NextFunction) {
        const authHeaders:string | undefined = req.headers.authorization;

        if (!authHeaders || !authHeaders.startsWith('Bearer')) {
            res.status(403).json({
                msg: 'Token Inválido o no encontrado',
                error: true
            });
            return;
        }

        let token:string = authHeaders.split(' ')[1].trim();

        if (!token) {
            res.status(404).json({
                msg: 'No existe un token para validar',
                error: true
            });
            return;
        }

        const decodedData = jwt.verify(token, this._JWT_SECRET, (err: any, user: any) => {
            if (err) {
                res.status(403).json({
                    msg: 'Token JWT Inválido',
                    errorMsg: err,
                    error: true
                });
            } else {
                req.user.id = user;
                next();
            }
        });
    }
}