import moment from 'moment';

import Auth from '../../auth/Auth.class';
import { PromiseResponse, ResponseError } from '../../interfaces/promise_response.interface';
import { UsuarioLogin, UsuarioSignUp } from '../../interfaces/usuario.interface';
import UsuarioModel from '../../models/usuario.model';

export default class AuthController {
    constructor() {}

    public SignUp(usuario: UsuarioSignUp): Promise<PromiseResponse> {
        return new Promise(async (resolve: (info: PromiseResponse) => void, reject: (reason: ResponseError) => void) => {
            try {
                const usuarioFound = await UsuarioModel.findOne({email: usuario.email});

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
                    const alertaToken:string = 'Se ha encontrado un token antiguo, se procedió a generar uno nuevo';

                    Object.assign(usuarioFound, usuario);
                    
                    resolve({
                        status: 201,
                        msg: `Se ha enviado un token de activación a ${usuario.email}`,
                        data: {
                            alertaToken,
                            token:usuarioFound.tokenActivacion
                        }
                    })
                    return;
                }

                const usuarioCreado = await new UsuarioModel(usuario).save();

                resolve({
                    status: 201,
                    msg: `Se ha enviado un token de activación a ${usuario.email}`,
                    data: {
                        usuarioCreado
                    }
                });
            } catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al Registrar la Cuenta',
                    isError: true,
                    errorDetails: error
                });
            }
        });
    }

    public ActivarCuenta(token: string): Promise<PromiseResponse> {
        return new Promise(async (resolve: (info: PromiseResponse) => void, reject: (reason: ResponseError) => void) => {
            try {
                const usuarioFound = await UsuarioModel.findOne({tokenActivacion: token});

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

                await usuarioFound.save();

                resolve({
                    status: 200,
                    msg: 'Usuario registrado correctamente',
                    data: {
                        usuarioRegistrado: usuarioFound
                    }
                })
            } catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al activar la cuenta',
                    isError: true,
                    errorDetails: error
                });
            }
        });
    } 

    public Login(usuario: UsuarioLogin): Promise<PromiseResponse> {
        return new Promise(async (resolve: (info: PromiseResponse) => void, reject: (reason: ResponseError) => void) => {
            try {
                const usuarioFound = await UsuarioModel.findOne({email: usuario.email});

                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Usuario no encontrado',
                        isError: true
                    })
                    return;
                }

                const correctPassword = await Auth.validateHashBcrypt(usuario.password, usuarioFound.password);

                if (!correctPassword) {
                    reject({
                        status: 401,
                        msg: 'Password incorrecto',
                        isError: true
                    })
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
            } catch (error: any) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al Iniciar Sesión',
                    isError: true,
                    errorDetails: error
                });
            }
        })
    }

    public GenerarTokenRecuperacion(email: string): Promise<PromiseResponse> {
        return new Promise(async (resolve: (info: PromiseResponse) => void, reject: (reason: ResponseError) => void) => {
            try {
                const usuarioFound = await UsuarioModel.findOne({email});

                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Usuario no encontrado',
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

                const IN_ONE_HOUR = 3600000;

                usuarioFound.tokenActivacion = Auth.genToken();
                usuarioFound.tokenReseteoExp = new Date(Date.now() + IN_ONE_HOUR);

                await usuarioFound.save();

                resolve({
                    status: 200,
                    msg: `Token de recuperación generado y enviado a ${usuarioFound.email}`,
                    data: {
                        tokenRecuperacion: usuarioFound.tokenReseteo
                    }
                });
            } catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al enviar el email',
                    isError: true,
                    errorDetails: error
                }); 
            }
        });
    }

    public ValidarTokenRecuperacion() {

    }

    public ResetearPassword() {

    }
}