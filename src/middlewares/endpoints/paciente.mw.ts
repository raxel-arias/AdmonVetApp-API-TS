import {Request, Response} from 'express';

import { Result, ValidationError, validationResult } from 'express-validator';

import PacienteController from '../../controllers/paciente.controller';
import { PromiseResponse } from '../../interfaces/promise_response.interface';

export const NuevoPaciente = async (req: Request, res: Response): Promise<any> => {
    const paciente = req.body;

    const {errors}: Result<ValidationError>['errors'] = validationResult(req);
    
    if (errors.length) {
        res.status(400).json({
            msg: 'Error en las entradas',
            isError: true,
            errorDetails: {errors}
        });
        return;
    }

    const {userId}: Request['user'] = req.user;
    paciente.veterinario_id = userId;

    try {
        const response: PromiseResponse = await new PacienteController().CrearPaciente(paciente);

        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}

export const ListadoPacientes = async (req: Request, res: Response): Promise<any> => {
    const {userId}: Request['user'] = req.user;
    const {id, ...queryParams}: Request['query'] = req.query;

    const searchParams = {
        veterinario_id: userId,
        ...(id && {_id: id}),
        ...queryParams
    }
    
    try {
        const response = await new PacienteController().ListadoPacientes(searchParams);

        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}

export const ActualizarInfoPaciente = async (req: Request, res: Response): Promise<any> => {
    const paciente = req.body;

    const {errors}: Result<ValidationError>['errors'] = validationResult(req);

    if (errors.length) {
        res.status(400).json({
            msg: 'Error en las entradas',
            isError: true,
            errorDetails: {errors}
        });
        return;
    }

    const {userId}: Request["user"] = req.user;

    paciente._id = req.params.id;
    paciente.veterinario_id = userId;

    try {
        const response: PromiseResponse = await new PacienteController().ActualizarPaciente(paciente);
    
        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}

export const ActualizarEstadoPaciente = async (req: Request, res: Response): Promise<any> => {
    const {userId}: Request['user'] = req.user;

    const _id = req.params.id;
    const veterinario_id = userId;
    try {
        const response = await new PacienteController().ActualizarEstadoPaciente({_id, veterinario_id});

        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}

export const EliminarPaciente = async (req: Request, res: Response): Promise<any> => {
    const {userId}: Request['user'] = req.user;

    const paciente = {
        _id: req.params.id,
        veterinario_id: userId
    }
    
    try {
        const response: PromiseResponse = await new PacienteController().EliminarPaciente(paciente);

        res.status(response.status).json(response);
    } catch (error: any) {
        res.status(error.status).json(error);
    }
}