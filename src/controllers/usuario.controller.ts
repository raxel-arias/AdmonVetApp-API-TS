import Auth from "../auth/Auth.class";
import { UsuarioUpdate } from "../interfaces/usuario.interface";
import {PromiseResponse, ResponseError} from "../interfaces/promise_response.interface";
import UsuarioModel from "../models/usuario.model";
import { ClonarObjeto } from "../utils/objects.utils";

export default class UsuarioController {
    constructor() {}

    public ObtenerPerfil(usuarioId: string): Promise<PromiseResponse | ResponseError> {
        return new Promise(async (resolve: (args: PromiseResponse) => void, reject: (reason: ResponseError) => void) => {
            try {
                const usuarioFound = await UsuarioModel.findById(usuarioId).select('-password -tokenActivacion -tokenReseteo -tokenReseteoExp -activado');

                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Usuario no encontrado',
                        isError: true
                    })
                    return;
                }

                resolve({
                    status: 200,
                    msg: 'Usuario encontrado',
                    data: {
                        usuario: usuarioFound
                    }
                });
            } catch (error: any) {
                if (error.name === 'CastError') {
                    reject({
                        status: 404,
                        msg: 'Usuario no encontrado',
                        isError: true
                    });
                    return;
                }
                reject({
                    status: 500,
                    msg: 'Hubo un error al consultar el perfil',
                    isError: true,
                    errorDetails: error
                });
            }
        });
    }

    public ActualizarInfo(usuario: UsuarioUpdate): Promise<PromiseResponse | ResponseError> {
        return new Promise(async (resolve: (args: PromiseResponse) => void, reject: (reason: ResponseError) => void) => {
            try {
                let usuarioFound = await UsuarioModel.findById(usuario._id);

                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Usuario no encontrado',
                        isError: true
                    });
                    return;
                }

                const passwordValido = await Auth.validateHashBcrypt(usuario.previousPassword, usuarioFound.password);

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

                const usuarioOutdated = ClonarObjeto(usuarioFound);

                Object.assign(usuarioFound, usuario);

                await usuarioFound.save();

                resolve({
                    status: 201,
                    msg: 'Usuario actualizado correctamente',
                    data: {
                        usuarioOutdated,
                        usuarioUpdated: usuarioFound
                    }
                });
            } catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al actualizar el usuario',
                    isError: true,
                    errorDetails: error
                });
            }
        });
    }
}