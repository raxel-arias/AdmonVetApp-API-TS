import {Schema, model} from 'mongoose';
import IPacienteModel from '../interfaces/models/paciente_model.interface';

export const PacienteSchema = new Schema<IPacienteModel>({
    nombre: {
        type: String,
        required: true
    },
    propietario: {
        nombre: {
            type: String,
            required: true
        },
        apellido: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    fechaAlta: {
        type: Date,
        required: true
    },
    veterinario_id: {
        type: Schema.Types.ObjectId,
        ref: 'veterinarios'
    },
    pendiente: {
        type: Boolean,
        required: true,
        default: true
    }
});

const PacienteModel = model<IPacienteModel>('Pacientes', PacienteSchema);

export default PacienteModel;