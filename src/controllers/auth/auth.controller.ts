import { UsuarioSignUp } from '../../interfaces/usuario.interface';
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
                    error
                });
            }
        });
    }
}