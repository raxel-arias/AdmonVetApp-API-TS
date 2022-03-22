import moment from 'moment';

import Auth from '../../auth/Auth.class';
import UsuarioModel from '../../models/usuario.model';
import { PromiseResponse, ResponseError } from '../../interfaces/promise_response.interface';
import { UsuarioLogin, UsuarioSignUp } from '../../interfaces/usuario.interface';
import { EnviarEmail } from '../../config/email.config';

export default class AuthController {
    constructor() {}

    public SignUp(usuario: UsuarioSignUp): Promise<PromiseResponse | ResponseError> {
        return new Promise(async (resolve: (info: PromiseResponse) => void, reject: (reason: ResponseError) => void) => {
            try {
                const usuarioFound = await UsuarioModel.findOne({email: usuario.email});

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
                    const alertaToken:string = 'Se ha encontrado un token antiguo, se procedió a generar uno nuevo';

                    Object.assign(usuarioFound, usuario);

                    await usuarioFound.save();

                    EnviarEmail({
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
                    })
                    return;
                }

                const usuarioCreado = await new UsuarioModel(usuario).save();

                EnviarEmail({
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

    public ActivarCuenta(token: string): Promise<PromiseResponse | ResponseError> {
        return new Promise(async (resolve: (info: PromiseResponse) => void, reject: (reason: ResponseError) => void) => {
            try {
                const usuarioFound = await UsuarioModel.findOne({tokenActivacion: token});

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

    public Login(usuario: UsuarioLogin): Promise<PromiseResponse | ResponseError> {
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

                const jwtToken = await Auth.genJWT({
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

    public GenerarTokenRecuperacion(email: string): Promise<PromiseResponse | ResponseError> {
        const FORMATO_FECHA_HORA: string = 'YYYY-MM-DD HH:mm:ss';

        return new Promise(async (resolve: (info: PromiseResponse) => void, reject: (reason: ResponseError) => void) => {
            try {
                const usuarioFound = await UsuarioModel.findOne({email});

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

                const IN_ONE_HOUR: number = 900000;

                usuarioFound.tokenReseteo = Auth.genToken();
                usuarioFound.tokenReseteoExp = new Date((Date.now() + IN_ONE_HOUR));

                await usuarioFound.save();

                EnviarEmail({
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
                            El link caducará el ${moment(usuarioFound.tokenReseteoExp).format(FORMATO_FECHA_HORA)}.
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
                        expiracion: moment(usuarioFound.tokenReseteoExp).format(FORMATO_FECHA_HORA)
                    }
                });
            } catch (error: any) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al enviar el email',
                    isError: true,
                    errorDetails: error
                }); 
            }
        });
    }

    public ValidarTokenRecuperacion(token: string): Promise<PromiseResponse | ResponseError> {
        const FORMATO_FECHA_HORA: string = 'YYYY-MM-DD HH:mm:ss';

        return new Promise(async (resolve: (info: PromiseResponse) => void, reject: (reason: ResponseError) => void) => {
            try {
                const usuarioFound = await UsuarioModel.findOne({tokenReseteo: token});

                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Token de recuperación no encontrado',
                        isError: true
                    });
                    return;
                }
                const fechaHoraActual = moment(Date.now()).format(FORMATO_FECHA_HORA);
                const fechaHoraExpiracion = moment(usuarioFound.tokenReseteoExp).format(FORMATO_FECHA_HORA);

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
            } catch (error: any) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al validar el token de recuperación',
                    isError: true,
                    errorDetails: error
                });
            }
        });
    }

    public ResetearPassword(password: string, tokenReseteo: string): Promise<PromiseResponse | ResponseError> {
        return new Promise(async (resolve: (info: PromiseResponse) => void, reject: (reason: ResponseError) => void) => {
            try {
                const usuarioFound = await UsuarioModel.findOne({tokenReseteo});

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

                await usuarioFound.save();

                resolve({
                    status: 201,
                    msg: 'Password actualizado',
                    data: {
                        email: usuarioFound.email
                    }
                });
            } catch (error: any) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al resetear el password',
                    isError: true,
                    errorDetails: error
                });
            }
        });
    }
}