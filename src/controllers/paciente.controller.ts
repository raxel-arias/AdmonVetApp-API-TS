import moment from 'moment';

import PacienteModel from '../models/paciente.model';
import UsuarioModel from '../models/usuario.model';
import { FiltrosPacienteBusqueda, PacienteEditar, PacienteNuevo, PacienteEliminar } from '../interfaces/paciente.interface';
import {PromiseResponse, ResponseError} from '../interfaces/promise_response.interface';
import { ClonarObjeto } from '../utils/objects.utils';

export default class PacienteController {
    
    constructor() {}
    
    public CrearPaciente(paciente: PacienteNuevo): Promise<PromiseResponse | ResponseError> {
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

    public ListadoPacientes(filtrosBusqueda : FiltrosPacienteBusqueda): Promise<PromiseResponse | ResponseError> {
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

    public ActualizarPaciente(paciente: PacienteEditar): Promise<PromiseResponse | ResponseError> {
        return new Promise (async (resolve: (info: PromiseResponse) => void, reject: (reason: ResponseError) => void) => {
            try {
                const [usuarioFound, pacienteFound] = await Promise.all([
                    UsuarioModel.findById(paciente.veterinario_id),
                    PacienteModel.findById(paciente._id)
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
                let {_id, veterinario_id, ...pacienteEditar} = paciente;

                const pacienteDesactualizado = ClonarObjeto(pacienteFound);
                
                Object.assign(pacienteFound, pacienteEditar);

                await pacienteFound.save();

                resolve({
                    status: 200,
                    msg: 'Información del paciente actualizada',
                    data: {
                        pacienteDesactualizado,
                        pacienteActualizado: pacienteFound
                    }
                });
            } catch (error: any) {
                reject({
                    status: 500,
                    msg: 'Ocurrió un error al realizar esta acción',
                    isError: true,
                    errorDetails: error
                });
            } 
        });
    }

    public EliminarPaciente(paciente: PacienteEliminar): Promise<PromiseResponse | ResponseError> {
        return new Promise (async (resolve: (info: PromiseResponse) => void, reject: (reason: ResponseError) => void) => {
            try {
                const [usuarioFound, pacienteFound] = await Promise.all([
                    UsuarioModel.findById(paciente.veterinario_id),
                    PacienteModel.findById(paciente._id)
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
                
                const pacienteEliminado = ClonarObjeto(pacienteFound);

                await pacienteFound.delete();

                resolve({
                    status: 200,
                    msg: 'Paciente eliminado correctamente',
                    data: {
                        pacienteEliminado
                    }
                });
            } catch (error: any) {
                reject({
                    status: 500,
                    msg: 'Ocurrió un error al eliminar el paciente',
                    isError: true,
                    errorDetails: error
                });
            }
        });
    }
}