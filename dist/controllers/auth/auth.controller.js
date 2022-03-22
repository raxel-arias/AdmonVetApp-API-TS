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
const moment_1 = __importDefault(require("moment"));
const Auth_class_1 = __importDefault(require("../../auth/Auth.class"));
const usuario_model_1 = __importDefault(require("../../models/usuario.model"));
const email_config_1 = require("../../config/email.config");
class AuthController {
    constructor() { }
    SignUp(usuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioFound = yield usuario_model_1.default.findOne({ email: usuario.email });
                if (usuarioFound && usuarioFound.activado) {
                    reject({
                        status: 403,
                        msg: 'El email ya se encuentra en uso',
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
                    yield usuarioFound.save();
                    (0, email_config_1.EnviarEmail)({
                        from: 'AdmonVet | Administrador de Pacientes de Veterinaria',
                        to: usuarioFound.email,
                        subject: 'Activación de Cuenta',
                        html: `
                            <p>Saludos, ${usuarioFound.nombre}</p>
                            <h1>Active su cuenta para utilizar nuestra aplicación</h1>

                            <a href="${process.env.FRONTEND_URL}/confirm/${usuarioFound.tokenActivacion}">
                                Ingrese al este link para validar la autenticidad de la cuenta.
                            </a>

                            <p>
                                Se ha detectado varias veces el uso de este email para intentar registrarse a nuestra aplicación.
                                Si usted no reconoce este mensaje, ignórelo.
                            </p>
                        `
                    });
                    resolve({
                        status: 201,
                        msg: `Se ha enviado un token de activación a ${usuario.email}`,
                        data: {
                            alertaToken
                        }
                    });
                    return;
                }
                const usuarioCreado = yield new usuario_model_1.default(usuario).save();
                (0, email_config_1.EnviarEmail)({
                    from: 'AdmonVet | Administrador de Pacientes de Veterinaria',
                    to: usuarioCreado.email,
                    subject: 'Activación de Cuenta',
                    html: `
                        <p>Saludos, ${usuarioCreado.nombre}</p>
                        <h1>Active su cuenta para utilizar nuestra aplicación</h1>

                        <a href="${process.env.FRONTEND_URL}/confirm/${usuarioCreado.tokenActivacion}">
                            Ingrese al este link para validar la autenticidad de la cuenta.
                        </a>

                        <p>
                            Si usted no reconoce este mensaje, ignórelo.
                        </p>
                    `
                });
                resolve({
                    status: 201,
                    msg: `Se ha enviado un token de activación a ${usuario.email}`,
                    data: {
                        email: usuarioCreado.email
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
                        msg: 'Token de activación no encontrado',
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
                const jwtToken = yield Auth_class_1.default.genJWT({
                    userId: usuarioFound._id.toString()
                });
                resolve({
                    status: 200,
                    msg: 'Inicio de Sesión correcto',
                    data: {
                        usuarioFound,
                        jwtToken
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
    GenerarTokenRecuperacion(email) {
        const FORMATO_FECHA_HORA = 'YYYY-MM-DD HH:mm:ss';
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioFound = yield usuario_model_1.default.findOne({ email });
                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Token de recuperación no encontrado',
                        isError: true
                    });
                    return;
                }
                if (usuarioFound && !usuarioFound.activado) {
                    reject({
                        status: 403,
                        msg: 'El usuario no está activado',
                        isError: true
                    });
                    return;
                }
                const IN_ONE_HOUR = 900000;
                usuarioFound.tokenReseteo = Auth_class_1.default.genToken();
                usuarioFound.tokenReseteoExp = new Date((Date.now() + IN_ONE_HOUR));
                yield usuarioFound.save();
                (0, email_config_1.EnviarEmail)({
                    from: 'AdmonVet | Administrador de Pacientes de Veterinaria',
                    to: usuarioFound.email,
                    subject: 'Recuperación de Cuenta',
                    html: `
                        <p>Saludos, ${usuarioFound.nombre}</p>
                        <h1>Token de recuperación de cuenta</h1>

                        <a href="${process.env.FRONTEND_URL}/reset-password/${usuarioFound.tokenReseteo}">
                            Ingrese al este link para poder recuperar el acceso a su cuenta.
                        </a>

                        <p>
                            El link caducará el ${(0, moment_1.default)(usuarioFound.tokenReseteoExp).format(FORMATO_FECHA_HORA)}.
                        </p>

                        <p>
                            Si usted no reconoce este mensaje, ignórelo.
                        </p>
                    `
                });
                resolve({
                    status: 200,
                    msg: `Token de recuperación generado y enviado a ${usuarioFound.email}`,
                    data: {
                        tokenRecuperacion: usuarioFound.tokenReseteo,
                        expiracion: (0, moment_1.default)(usuarioFound.tokenReseteoExp).format(FORMATO_FECHA_HORA)
                    }
                });
            }
            catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al enviar el email',
                    isError: true,
                    errorDetails: error
                });
            }
        }));
    }
    ValidarTokenRecuperacion(token) {
        const FORMATO_FECHA_HORA = 'YYYY-MM-DD HH:mm:ss';
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioFound = yield usuario_model_1.default.findOne({ tokenReseteo: token });
                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Token de recuperación no encontrado',
                        isError: true
                    });
                    return;
                }
                const fechaHoraActual = (0, moment_1.default)(Date.now()).format(FORMATO_FECHA_HORA);
                const fechaHoraExpiracion = (0, moment_1.default)(usuarioFound.tokenReseteoExp).format(FORMATO_FECHA_HORA);
                // console.log(fechaHoraActual);
                // console.log(fechaHoraExpiracion);
                // console.log(fechaHoraActual > fechaHoraExpiracion);
                const fechaHoraExpirado = JSON.parse(JSON.stringify(fechaHoraExpiracion));
                if (fechaHoraActual > fechaHoraExpiracion) {
                    reject({
                        status: 403,
                        msg: `Token de recuperación caducado el ${fechaHoraExpirado}`,
                        isError: true
                    });
                    return;
                }
                resolve({
                    status: 200,
                    msg: `Token de recuperación validado, proceder a actualizar la contraseña`,
                    data: {
                        tokenValidado: true,
                        usuarioId: usuarioFound._id.toString(),
                        tokenReseteo: usuarioFound.tokenReseteo
                    }
                });
            }
            catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al validar el token de recuperación',
                    isError: true,
                    errorDetails: error
                });
            }
        }));
    }
    ResetearPassword(password, tokenReseteo) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioFound = yield usuario_model_1.default.findOne({ tokenReseteo });
                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Usuario no encontrado',
                        isError: true
                    });
                    return;
                }
                usuarioFound.password = password;
                usuarioFound.tokenReseteo = null;
                usuarioFound.tokenReseteoExp = null;
                yield usuarioFound.save();
                resolve({
                    status: 201,
                    msg: 'Password actualizado',
                    data: {
                        email: usuarioFound.email
                    }
                });
            }
            catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al resetear el password',
                    isError: true,
                    errorDetails: error
                });
            }
        }));
    }
}
exports.default = AuthController;
