import moment from 'moment';

import PacienteModel from '../models/paciente.model';
import UsuarioModel from '../models/usuario.model';
import { FiltrosPacienteBusqueda, PacienteNuevo } from '../interfaces/paciente.interface';
import {PromiseResponse, ResponseError} from '../interfaces/promise_response.interface';

export default class PacienteController {
    
    constructor() {}
    
    CrearPaciente(paciente: PacienteNuevo, usuarioId: string): Promise<PromiseResponse | ResponseError> {
        const FORMATO_FECHA_HORA: string = 'YYYY-MM-DD HH:mm:ss';

        return new Promise(async (resolve: (info: PromiseResponse) => void, reject: (reason: ResponseError) => void) => {
            try {
                const fechaHoraActual = moment(Date.now()).format(FORMATO_FECHA_HORA);
                const fechaHoraCita = moment(paciente.fechaAlta).format(FORMATO_FECHA_HORA);

                if (fechaHoraCita < fechaHoraActual) {
                    reject({
                        status: 409,
                        msg: `No se puede asignar una cita antes de ${fechaHoraActual}`,
                        isError: true
                    });
                    return;
                }

                paciente.veterinario_id = usuarioId;

                const pacienteAgregado = await new PacienteModel(paciente).save();

                resolve({
                    status: 201,
                    msg: 'Paciente agregado correctamente',
                    data: {
                        pacienteAgregado
                    }
                });
            } catch (error: any) {
                reject({
                    status: 500,
                    msg: 'Hubo un error al agregar al Paciente',
                    isError: true,
                    errorDetails: error
                });
            }
        });
    }

    ListadoPacientes(filtrosBusqueda : FiltrosPacienteBusqueda): Promise<PromiseResponse | ResponseError> {
        return new Promise(async (resolve: (info: PromiseResponse) => void, reject: (reason: ResponseError) => void) => {
            try{
                const usuarioFound = await UsuarioModel.findById(filtrosBusqueda.veterinario_id);

                if (!usuarioFound) {
                    reject({
                        status: 404,
                        msg: 'Usuario no encontrado',
                        isError: true
                    })
                    return;
                }

                const listadoPacientes = await PacienteModel.find(filtrosBusqueda);

                resolve({
                    status: 200,
                    msg: 'Listado consultado',
                    data: {
                        listadoPacientes
                    }
                });
            } catch (error: any) {
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
        });
    }
}