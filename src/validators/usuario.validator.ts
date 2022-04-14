import {body} from 'express-validator';
import { ValidationChain } from 'express-validator';

export const ActualizarInfoValidator: ValidationChain[] = [
    body('nombre')
        .optional()
        .not().isEmpty().withMessage('Nombre vacío')
        .trim()
        .toUpperCase(),
    body('apellido')
        .optional()
        .not().isEmpty().withMessage('Apellido vacío')
        .trim()
        .toUpperCase(),
    body('telefono')
        .optional()
        .not().isEmpty().withMessage('Número Telefónico vacío')
        .trim()
        .toUpperCase(),
    body('email')
        .optional()
        .not().isEmpty().withMessage('Email Vacío')
        .isEmail().withMessage('Debe ser un email válido')
        .trim()
        .toUpperCase(),
    body('password')
        .optional()
        .not().isEmpty().withMessage('Contraseña Vacía')
        .isLength({min: 8}).withMessage('Debe ser de al menos 8 caracteres')
];