import {Request} from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        user: IUserRequest
    }
}

interface IUserRequest {
    userId: string
}