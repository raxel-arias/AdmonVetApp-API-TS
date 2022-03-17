import {Schema, model, connect} from 'mongoose';
import Auth from '../auth/Auth.class';
import IUsuarioModel from '../interfaces/models/usuario_model.interface';

const UsuarioSchema = new Schema<IUsuarioModel>({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    activado: {
        type: Boolean,
        default: false
    },
    tokenActivacion: {
        type: String
    },
    tokenReseteo: {
        type: String
    },
    tokenReseteoExp: {
        type: Date
    }
});
UsuarioSchema.pre('save', async function(next):Promise<void> {
    if (!this.isModified('password')) {
        next();
    }
    this.token = this.activo ? null : Auth.genToken();
    this.password = await Auth.genHash(this.password);
});

const UsuarioModel = model<IUsuarioModel>('Usuarios', UsuarioSchema);

export default UsuarioModel;