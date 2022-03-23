import { Router } from "express";
import { SignUpValidator, LoginValidator, RecuperarCuentaValidator, ResetearPasswordValidator } from "../../validators/auth.validator";

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

AuthRouterChilds.post('/signup', SignUpValidator, SignUp);
AuthRouterChilds.post('/login', LoginValidator, Login);
AuthRouterChilds.post('/recover-account', RecuperarCuentaValidator, RecuperarCuenta);
AuthRouterChilds.post('/reset-password/:token', ResetearPasswordValidator, ResetearPassword);
AuthRouterChilds.get('/reset-password/:token', ValidarTokenRecuperacion);
AuthRouterChilds.get('/confirm/:token', ActivarCuenta);