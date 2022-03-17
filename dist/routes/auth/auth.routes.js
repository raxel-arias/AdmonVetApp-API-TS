"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_mw_1 = require("../../middlewares/endpoints/auth.mw");
const AuthRouterChilds = (0, express_1.Router)({ mergeParams: true });
exports.AuthRouter = (0, express_1.Router)();
exports.AuthRouter.use('/auth', AuthRouterChilds);
AuthRouterChilds.post('/signup', auth_mw_1.SignUp);
