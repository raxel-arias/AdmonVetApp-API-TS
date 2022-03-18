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
const Auth_class_1 = __importDefault(require("../../auth/Auth.class"));
const usuario_model_1 = __importDefault(require("../../models/usuario.model"));
class AuthController {
    constructor() { }
    SignUp(usuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioFound = yield usuario_model_1.default.findOne({ email: usuario.email });
                if (usuarioFound && usuarioFound.activado) {
                    reject({
                        status: 403,
                        msg: 'El email ya se encuentra usado por otro usuario',
                        isError: true,
                        data: {
                            email: usuario.email
                        }
                    });
                    return;
                }
                if (usuarioFound && !usuarioFound.activado && usuarioFound.tokenActivacion) {
                    const alertaToken = 'Se ha encontrado un token antiguo, se procedió a generar uno nuevo';
                    Object.assign(usuarioFound, usuario);
                    resolve({
                        status: 201,
                        msg: `Se ha enviado un token de activación a ${usuario.email}`,
                        data: {
                            alertaToken,
                            token: usuarioFound.tokenActivacion
                        }
                    });
                    return;
                }
                const usuarioCreado = yield new usuario_model_1.default(usuario).save();
                resolve({
                    status: 201,
                    msg: `Se ha enviado un token de activación a ${usuario.email}`,
                    data: {
                        usuarioCreado
                    }
                });
            }
            catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al Registrar la Cuenta',
                    isError: true,
                    errorDetails: error
                });
            }
        }));
    }
    ActivarCuenta(token) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioFound = yield usuario_model_1.default.findOne({ tokenActivacion: token });
                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Usuario no encontrado',
                        isError: true
                    });
                    return;
                }
                usuarioFound.tokenActivacion = null;
                usuarioFound.activado = true;
                yield usuarioFound.save();
                resolve({
                    status: 200,
                    msg: 'Usuario registrado correctamente',
                    data: {
                        usuarioRegistrado: usuarioFound
                    }
                });
            }
            catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al activar la cuenta',
                    isError: true,
                    errorDetails: error
                });
            }
        }));
    }
    Login(usuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioFound = yield usuario_model_1.default.findOne({ email: usuario.email });
                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Usuario no encontrado',
                        isError: true
                    });
                    return;
                }
                const correctPassword = yield Auth_class_1.default.validateHashBcrypt(usuario.password, usuarioFound.password);
                if (!correctPassword) {
                    reject({
                        status: 401,
                        msg: 'Password incorrecto',
                        isError: true
                    });
                    return;
                }
                if (!usuarioFound.activado) {
                    reject({
                        status: 401,
                        msg: 'Usuario no activado',
                        isError: true
                    });
                    return;
                }
                resolve({
                    status: 200,
                    msg: 'Inicio de Sesión correcto',
                    data: {
                        usuarioFound
                    }
                });
            }
            catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al Iniciar Sesión',
                    isError: true,
                    errorDetails: error
                });
            }
        }));
    }
}
exports.default = AuthController;
