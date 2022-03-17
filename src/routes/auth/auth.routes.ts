import { Router } from "express";

import { SignUp } from "../../middlewares/endpoints/auth.mw";

const AuthRouterChilds:Router = Router({mergeParams: true});

export const AuthRouter:Router = Router();

AuthRouter.use('/auth', AuthRouterChilds);
AuthRouterChilds.post('/signup', SignUp);