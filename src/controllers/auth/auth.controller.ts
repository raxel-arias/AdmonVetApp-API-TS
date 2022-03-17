import Auth from '../../auth/Auth.class';
import { UsuarioLogin, UsuarioSignUp } from '../../interfaces/usuario.interface';
import UsuarioModel from '../../models/usuario.model';

export default class AuthController {
    constructor() {}

    public SignUp(usuario: UsuarioSignUp): Promise<any> {
        return new Promise(async (resolve, reject): Promise<any> => {
            try {
                const usuarioFound = await UsuarioModel.findOne({email: usuario.email});

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

                    await usuarioFound.save();
 
                    resolve({
                        status: 201,
                        msg: `Token de activación generado y enviado a ${usuarioFound.email}`,
                        tokenEncontrado,
                        tokenActivacion: usuarioFound.tokenActivacion,
                        email: usuarioFound.email
                    });

                    return;
                }

                const usuarioCreado = await new UsuarioModel(usuario).save();

                resolve({
                    status: 201,
                    msg: `Usuario creado correctamente, token de activación generado y enviado a ${usuarioCreado.email}`,
                    usuarioCreado
                });
            } catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al registrar al usuario',
                    error: true,
                    details: error
                });
            }
        });
    }

    public Confirm(token: string): Promise<any> {
        return new Promise(async (resolve, reject): Promise<any> => {
            try {

            } catch (error) {
                reject({
                    status: 404,
                    msg: 'Hubo un error al confirmar la cuenta',
                    error: true,
                    details: error
                });
            }
        });
    }

    public Login(usuario: UsuarioLogin): Promise<any> {
        return new Promise(async (resolve, reject): Promise<any> => {
            try {
                const usuarioFound = await UsuarioModel.findOne({email: usuario.email});

                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Usuario no encontrado',
                        error: true
                    });
                    return;
                }

                const passwordCorrecto = await Auth.validateHashBcrypt(usuario.password, usuarioFound.password);

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
                    jwt: Auth.genJWT({id: usuarioFound._id})
                });
            } catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al iniciar sesión',
                    error: true,
                    details: error
                })
            }
        });
    }
}