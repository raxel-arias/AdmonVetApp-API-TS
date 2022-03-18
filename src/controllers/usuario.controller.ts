import Auth from "../auth/Auth.class";
import { UsuarioUpdate } from "../interfaces/usuario.interface";
import {PromiseResponse, ResponseError} from "../interfaces/promise_response.interface";
import UsuarioModel from "../models/usuario.model";

export default class UsuarioController {
    constructor() {}

    public ActualizarInfo(usuario: UsuarioUpdate): Promise<PromiseResponse | ResponseError> {
        return new Promise(async (resolve: (args: PromiseResponse) => void, reject: (reason: ResponseError) => void) => {
            try {
                let usuarioFound = await UsuarioModel.findOne({email: usuario.email});

                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Usuario no encontrado',
                        isError: true
                    });
                    return;
                }

                const passwordValido = await Auth.validateHashBcrypt(usuario.password, usuarioFound.password);

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

                await usuarioFound.save();

                resolve({
                    status: 201,
                    msg: 'Usuario actualizado correctamente',
                    data: {
                        usuarioOutdated,
                        usuarioUptaded: usuarioFound
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