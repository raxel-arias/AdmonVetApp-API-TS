import { Router } from "express";

import { 
    ActivarCuenta, 
    Login, 
    RecuperarCuenta, 
    ResetearPassword, 
    SignUp, 
    ValidarTokenRecuperacion } from "../../middlewares/endpoints/auth.mw";

const AuthRouterChilds:Router = Router({mergeParams: true});

export const AuthRouter:Router = Router();

AuthRouter.use('/auth', AuthRouterChilds);

AuthRouterChilds.post('/signup', SignUp);
AuthRouterChilds.post('/login', Login);
AuthRouterChilds.get('/confirm/:token', ActivarCuenta);
AuthRouterChilds.post('/recover-account', RecuperarCuenta);
AuthRouterChilds.get('/reset-passsword/:token', ValidarTokenRecuperacion);
AuthRouterChilds.post('/reset-password/:token', ResetearPassword);