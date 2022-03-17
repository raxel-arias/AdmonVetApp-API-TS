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
                        status: 409,
                        error: true,
                        msg: 'El email está siendo utilizado por otro usuario',
                    });
                    return;
                }
                if (usuarioFound && usuarioFound.tokenActivacion && !usuarioFound.activado) {
                    const tokenEncontrado = 'Se ha encontrado un token de activación previo, se procedió a reemplazarlo';
                    Object.assign(usuarioFound, usuario);
                    yield usuarioFound.save();
                    resolve({
                        status: 201,
                        msg: `Token de activación generado y enviado a ${usuarioFound.email}`,
                        tokenEncontrado,
                        tokenActivacion: usuarioFound.tokenActivacion,
                        email: usuarioFound.email
                    });
                    return;
                }
                const usuarioCreado = yield new usuario_model_1.default(usuario).save();
                resolve({
                    status: 201,
                    msg: `Usuario creado correctamente, token de activación generado y enviado a ${usuarioCreado.email}`,
                    usuarioCreado
                });
            }
            catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al registrar al usuario',
                    error: true,
                    details: error
                });
            }
        }));
    }
    Confirm(token) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) {
                reject({
                    status: 404,
                    msg: 'Hubo un error al confirmar la cuenta',
                    error: true,
                    details: error
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
                        error: true
                    });
                    return;
                }
                const passwordCorrecto = yield Auth_class_1.default.validateHashBcrypt(usuario.password, usuarioFound.password);
                if (!passwordCorrecto) {
                    reject({
                        status: 401,
                        msg: 'Password incorrecto',
                        error: true
                    });
                    return;
                }
                if (!usuarioFound.activado) {
                    reject({
                        status: 409,
                        msg: 'El usuario no se encuentra activado',
                        error: true
                    });
                    return;
                }
                resolve({
                    status: 200,
                    msg: 'Inicio de Sesión correcto',
                    jwt: Auth_class_1.default.genJWT({ id: usuarioFound._id })
                });
            }
            catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al iniciar sesión',
                    error: true,
                    details: error
                });
            }
        }));
    }
}
exports.default = AuthController;
