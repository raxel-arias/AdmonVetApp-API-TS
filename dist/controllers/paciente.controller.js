"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const paciente_model_1 = __importDefault(require("../models/paciente.model"));
const usuario_model_1 = __importDefault(require("../models/usuario.model"));
const objects_utils_1 = require("../utils/objects.utils");
class PacienteController {
    constructor() { }
    CrearPaciente(paciente) {
        const FORMATO_FECHA_HORA = 'YYYY-MM-DD HH:mm:ss';
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const fechaHoraActual = (0, moment_1.default)(Date.now()).format(FORMATO_FECHA_HORA);
                const fechaHoraCita = (0, moment_1.default)(paciente.fechaAlta).format(FORMATO_FECHA_HORA);
                if (fechaHoraCita < fechaHoraActual) {
                    reject({
                        status: 409,
                        msg: `No se puede asignar una cita antes de ${fechaHoraActual}`,
                        isError: true
                    });
                    return;
                }
                const pacienteAgregado = yield new paciente_model_1.default(paciente).save();
                resolve({
                    status: 201,
                    msg: 'Paciente agregado correctamente',
                    data: {
                        pacienteAgregado
                    }
                });
            }
            catch (error) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al agregar al Paciente',
                    isError: true,
                    errorDetails: error
                });
            }
        }));
    }
    ListadoPacientes(filtrosBusqueda) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioFound = yield usuario_model_1.default.findById(filtrosBusqueda.veterinario_id);
                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Usuario no encontrado',
                        isError: true
                    });
                    return;
                }
                const listadoPacientes = yield paciente_model_1.default.find(filtrosBusqueda);
                resolve({
                    status: 200,
                    msg: 'Listado consultado',
                    data: {
                        listadoPacientes
                    }
                });
            }
            catch (error) {
                if (error.name === 'CastError') {
                    resolve({
                        status: 404,
                        msg: 'Listado consultado',
                        data: {
                            listadoPacientes: []
                        }
                    });
                    return;
                }
                reject({
                    status: 500,
                    msg: 'Hubo un error al realizar la búsqueda de pacientes',
                    isError: true,
                    errorDetails: error
                });
            }
        }));
    }
    ActualizarPaciente(paciente) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [usuarioFound, pacienteFound] = yield Promise.all([
                    usuario_model_1.default.findById(paciente.veterinario_id),
                    paciente_model_1.default.findById(paciente._id)
                ]);
                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Usuario no encontrado',
                        isError: true
                    });
                    return;
                }
                if (!pacienteFound) {
                    reject({
                        status: 404,
                        msg: 'Paciente no encontrado',
                        isError: true
                    });
                    return;
                }
                if (pacienteFound.veterinario_id.toString() !== usuarioFound._id.toString()) {
                    reject({
                        status: 403,
                        msg: 'No se puede actualizar el paciente',
                        isError: true
                    });
                    return;
                }
                //Se separan los datos sensibles (que no deben ser manipulados)
                let { _id, veterinario_id } = paciente, pacienteEditar = __rest(paciente, ["_id", "veterinario_id"]);
                const pacienteDesactualizado = (0, objects_utils_1.ClonarObjeto)(pacienteFound);
                //Sobreescribir sin perder las claves sin reemplazar del antiguo objeto propietario dentro de pacienteFound
                Object.assign(pacienteFound, pacienteEditar, {
                    propietario: Object.assign(Object.assign({}, pacienteFound.propietario), pacienteEditar.propietario)
                });
                yield pacienteFound.save();
                resolve({
                    status: 200,
                    msg: 'Información del paciente actualizada',
                    data: {
                        pacienteDesactualizado,
                        pacienteActualizado: pacienteFound
                    }
                });
            }
            catch (error) {
                reject({
                    status: 500,
                    msg: 'Ocurrió un error al realizar esta acción',
                    isError: true,
                    errorDetails: error
                });
            }
        }));
    }
    EliminarPaciente(paciente) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [usuarioFound, pacienteFound] = yield Promise.all([
                    usuario_model_1.default.findById(paciente.veterinario_id),
                    paciente_model_1.default.findById(paciente._id)
                ]);
                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Usuario no encontrado',
                        isError: true
                    });
                    return;
                }
                if (!pacienteFound) {
                    reject({
                        status: 404,
                        msg: 'Paciente no encontrado',
                        isError: true
                    });
                    return;
                }
                if (pacienteFound.veterinario_id.toString() !== usuarioFound._id.toString()) {
                    reject({
                        status: 403,
                        msg: 'No se puede eliminar el paciente',
                        isError: true
                    });
                    return;
                }
                const pacienteEliminado = (0, objects_utils_1.ClonarObjeto)(pacienteFound);
                yield pacienteFound.delete();
                resolve({
                    status: 200,
                    msg: 'Paciente eliminado correctamente',
                    data: {
                        pacienteEliminado
                    }
                });
            }
            catch (error) {
                if (error.name === 'CastError') {
                    reject({
                        status: 404,
                        msg: 'Paciente no encontrado',
                        isError: true
                    });
                    return;
                }
                reject({
                    status: 500,
                    msg: 'Ocurrió un error al eliminar el paciente',
                    isError: true,
                    errorDetails: error
                });
            }
        }));
    }
}
exports.default = PacienteController;
