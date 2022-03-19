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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const paciente_model_1 = __importDefault(require("../models/paciente.model"));
const usuario_model_1 = __importDefault(require("../models/usuario.model"));
class PacienteController {
    constructor() { }
    CrearPaciente(paciente, usuarioId) {
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
                paciente.veterinario_id = usuarioId;
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
}
exports.default = PacienteController;
