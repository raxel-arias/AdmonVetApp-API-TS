import cors from 'cors';
import { urlencoded, json} from 'express';

export const MIDDLEWARES: any = [
    json(),
    urlencoded({extended: true}),
    cors()
];