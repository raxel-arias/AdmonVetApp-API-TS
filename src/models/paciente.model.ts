import {Schema, model} from 'mongoose';
import IPacienteModel from '../interfaces/models/paciente_model.interface';

export const PacienteSchema = new Schema<IPacienteModel>({
    nombre: {
        type: String,
        required: true
    },
    propietario: {
        nombre: {
            type: String
        },
        apellido: {
            type: String
        },
        email: {
            type: String
        }
    },
    fechaAlta: {
        type: Date,
        required: true
    },
    veterinario_id: {
        type: Schema.Types.ObjectId,
        ref: 'veterinarios',
        required: true
    },
    pendiente: {
        type: Boolean,
        required: true,
        default: true
    }
});

const PacienteModel = model<IPacienteModel>('Pacientes', PacienteSchema);

export default PacienteModel;