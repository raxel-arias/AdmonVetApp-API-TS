"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacienteSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PacienteSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'veterinarios',
        required: true
    },
    pendiente: {
        type: Boolean,
        required: true,
        default: true
    }
});
const PacienteModel = (0, mongoose_1.model)('Pacientes', exports.PacienteSchema);
exports.default = PacienteModel;
