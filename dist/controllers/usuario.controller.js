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
const Auth_class_1 = __importDefault(require("../auth/Auth.class"));
const usuario_model_1 = __importDefault(require("../models/usuario.model"));
class UsuarioController {
    constructor() { }
    ActualizarInfo(usuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let usuarioFound = yield usuario_model_1.default.findOne({ email: usuario.email });
                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Usuario no encontrado',
                        isError: true
                    });
                    return;
                }
                const passwordValido = yield Auth_class_1.default.validateHashBcrypt(usuario.password, usuarioFound.password);
                if (!passwordValido) {
                    reject({
                        status: 401,
                        msg: 'Password incorrecto',
                        isError: true
                    });
                    return;
                }
                if (!usuarioFound.activado) {
                    reject({
                        status: 403,
                        msg: 'El usuario no se encuentra activado',
                        isError: true
                    });
                }
                const usuarioOutdated = JSON.parse(JSON.stringify(usuarioFound));
                Object.assign(usuarioFound, usuario);
                yield usuarioFound.save();
                resolve({
                    status: 201,
                    msg: 'Usuario actualizado correctamente',
                    data: {
                        usuarioOutdated,
                        usuarioUptaded: usuarioFound
                    }
                });
            }
            catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al actualizar el usuario',
                    isError: true,
                    errorDetails: error
                });
            }
        }));
    }
}
exports.default = UsuarioController;
