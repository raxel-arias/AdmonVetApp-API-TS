import { UsuarioSignUp } from '../interfaces/usuario.interface';
import UsuarioModel from '../models/usuario.model';

export default class UsuarioController {
    constructor() {}

    public SignUp(usuario: UsuarioSignUp):Promise<void> {
        return new Promise(async (resolve, reject):Promise<void> => {
            try {
                const usuarioFound = await UsuarioModel.findOne({email: usuario.email});

            } catch (error) {

            }
        });
    }
}