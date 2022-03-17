import Auth from "../auth/Auth.class";
import { UsuarioUpdate } from "../interfaces/usuario.interface";
import UsuarioModel from "../models/usuario.model";

export default class UsuarioController {
    constructor() {}

    public ActualizarInfo(usuario: UsuarioUpdate): Promise<any> {
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

                const passwordValido = await Auth.validateHashBcrypt(usuario.password, usuarioFound.password);

                if (!passwordValido) {
                    reject({
                        status: 401,
                        msg: 'Password incorrecto',
                        error: true
                    });
                }

                const usuarioOutdated = JSON.parse(JSON.stringify(usuarioFound));

                Object.assign(usuarioFound, usuario);

                await usuarioFound.save();

                resolve({
                    status: 201,
                    msg: 'Usuario actualizado correctamente',
                    usuarioOutdated,
                    usuarioUptaded: usuarioFound
                });
            } catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al actualizar el usuario',
                    error
                });
            }
        });
    }
}