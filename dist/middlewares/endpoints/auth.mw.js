"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetearPassword = exports.ValidarTokenRecuperacion = exports.RecuperarCuenta = exports.ActivarCuenta = exports.Login = exports.SignUp = void 0;
const auth_controller_1 = __importDefault(require("../../controllers/auth/auth.controller"));
const SignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = req.body;
    try {
        const response = yield new auth_controller_1.default().SignUp(usuario);
        res.status(response.status).json(response);
    }
    catch (error) {
        res.status(error.status).json(error);
    }
});
exports.SignUp = SignUp;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = req.body;
    try {
        const response = yield new auth_controller_1.default().Login(usuario);
        res.status(response.status).json(response);
    }
    catch (error) {
        res.status(error.status).json(error);
    }
});
exports.Login = Login;
const ActivarCuenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    try {
        const response = yield new auth_controller_1.default().ActivarCuenta(token);
        res.status(response.status).json(response);
    }
    catch (error) {
        res.status(error.status).json(error);
    }
});
exports.ActivarCuenta = ActivarCuenta;
const RecuperarCuenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const response = yield new auth_controller_1.default().GenerarTokenRecuperacion(email);
        res.status(response.status).json(response);
    }
    catch (error) {
        res.status(error.status).json(error);
    }
});
exports.RecuperarCuenta = RecuperarCuenta;
const ValidarTokenRecuperacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    try {
        const response = yield new auth_controller_1.default().ValidarTokenRecuperacion(token);
        res.status(response.status).json(response);
    }
    catch (error) {
        res.status(error.status).json(error);
    }
});
exports.ValidarTokenRecuperacion = ValidarTokenRecuperacion;
const ResetearPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const response = yield new auth_controller_1.default().ResetearPassword(password, token.toString());
        res.status(response.status).json(response);
    }
    catch (error) {
        res.status(error.status).json(error);
    }
});
exports.ResetearPassword = ResetearPassword;
