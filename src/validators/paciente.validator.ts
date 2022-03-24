import { ValidationChain, body } from "express-validator";

export const NuevoPacienteValidator: ValidationChain[] = [
    body('nombre')
        .exists().withMessage('Debe existir un nombre')
        .not().isEmpty().withMessage('Nombre de la mascota vacío')
        .trim()
        .toUpperCase(),
    //Objeto Propietario
    body('propietario')
        .exists().withMessage('Debe existir un propietario'),
        body('propietario.nombre')
            .exists().withMessage('Propietario: Debe existir un nombre')
            .not().isEmpty().withMessage('Propietario: Nombre vacío')
            .isString().withMessage('Propietario.nombre: Debe ser una cadena')
            .trim()
            .toUpperCase(),
        body('propietario.apellido')
            .exists().withMessage('Propietario: Debe existir un apellido')
            .not().isEmpty().withMessage('Propietario: Apellido vacío')
            .isString().withMessage('Propietario.apellido: Debe ser una cadena')
            .trim()
            .toUpperCase(),
        body('propietario.email')
            .exists().withMessage('Propietario: Debe existir un email')
            .not().isEmpty().withMessage('Propietario: Email vacío')
            .isEmail().withMessage('Debe ser un email')
            .trim()
            .toUpperCase(),
    body('sintomas')
        .exists().withMessage('Debe existir un síntoma')
        .not().isEmpty().withMessage('Síntomas vacíos')
        .isString().withMessage('Debe ser una cadena')
        .trim()
        .toUpperCase(),
    body('fechaAlta')
        .exists().withMessage('Debe existir una fecha')
        .not().isEmpty().withMessage('Fecha vacía')
];

export const ActualizarPacienteValidator: ValidationChain[] = [
    body('nombre')
        .optional()
        .not().isEmpty().withMessage('Nombre de la mascota vacío'),
    //Objeto Propietario
    body('propietario')
        .optional()
        .not().isEmpty().withMessage('Propietario vacío')
        .isObject().withMessage('Debe ser un objeto Propietario'),
        body('propietario.nombre')
            .optional()
            .not().isEmpty().withMessage('Propietario: Nombre vacío')
            .isString().withMessage('Propietario.nombre: Debe ser una cadena')
            .trim()
            .toUpperCase(),
        body('propietario.apellido')
            .optional()
            .not().isEmpty().withMessage('Propietario: Apellido vacío')
            .isString().withMessage('Propietario.apellido: Debe ser una cadena')
            .trim()
            .toUpperCase(),
        body('propietario.email')
            .optional()
            .not().isEmpty().withMessage('Propietario: Email vacío')
            .isEmail().withMessage('Debe ser un email')
            .trim()
            .toUpperCase(),
    body('sintomas')
        .optional()
        .not().isEmpty().withMessage('Síntomas vacíos')
        .isString().withMessage('Debe ser una cadena')
        .trim()
        .toUpperCase(),
    body('fechaAlta')
        .optional()
        .not().isEmpty().withMessage('Fecha vacía'),
    body('pendiente')
        .optional()
        .not().isEmpty().withMessage('Pendiente vacío')
        .isBoolean().withMessage('Debe ser un booleano')
];