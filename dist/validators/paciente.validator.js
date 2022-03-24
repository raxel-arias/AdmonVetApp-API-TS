"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarPacienteValidator = exports.NuevoPacienteValidator = void 0;
const express_validator_1 = require("express-validator");
exports.NuevoPacienteValidator = [
    (0, express_validator_1.body)('nombre')
        .exists().withMessage('Debe existir un nombre')
        .not().isEmpty().withMessage('Nombre de la mascota vacío')
        .trim()
        .toUpperCase(),
    //Objeto Propietario
    (0, express_validator_1.body)('propietario')
        .exists().withMessage('Debe existir un propietario'),
    (0, express_validator_1.body)('propietario.nombre')
        .exists().withMessage('Propietario: Debe existir un nombre')
        .not().isEmpty().withMessage('Propietario: Nombre vacío')
        .isString().withMessage('Propietario.nombre: Debe ser una cadena')
        .trim()
        .toUpperCase(),
    (0, express_validator_1.body)('propietario.apellido')
        .exists().withMessage('Propietario: Debe existir un apellido')
        .not().isEmpty().withMessage('Propietario: Apellido vacío')
        .isString().withMessage('Propietario.apellido: Debe ser una cadena')
        .trim()
        .toUpperCase(),
    (0, express_validator_1.body)('propietario.email')
        .exists().withMessage('Propietario: Debe existir un email')
        .not().isEmpty().withMessage('Propietario: Email vacío')
        .isEmail().withMessage('Debe ser un email')
        .trim()
        .toUpperCase(),
    (0, express_validator_1.body)('sintomas')
        .exists().withMessage('Debe existir un síntoma')
        .not().isEmpty().withMessage('Síntomas vacíos')
        .isString().withMessage('Debe ser una cadena')
        .trim()
        .toUpperCase(),
    (0, express_validator_1.body)('fechaAlta')
        .exists().withMessage('Debe existir una fecha')
        .not().isEmpty().withMessage('Fecha vacía')
];
exports.ActualizarPacienteValidator = [
    (0, express_validator_1.body)('nombre')
        .optional()
        .not().isEmpty().withMessage('Nombre de la mascota vacío'),
    //Objeto Propietario
    (0, express_validator_1.body)('propietario')
        .optional()
        .not().isEmpty().withMessage('Propietario vacío')
        .isObject().withMessage('Debe ser un objeto Propietario'),
    (0, express_validator_1.body)('propietario.nombre')
        .optional()
        .not().isEmpty().withMessage('Propietario: Nombre vacío')
        .isString().withMessage('Propietario.nombre: Debe ser una cadena')
        .trim()
        .toUpperCase(),
    (0, express_validator_1.body)('propietario.apellido')
        .optional()
        .not().isEmpty().withMessage('Propietario: Apellido vacío')
        .isString().withMessage('Propietario.apellido: Debe ser una cadena')
        .trim()
        .toUpperCase(),
    (0, express_validator_1.body)('propietario.email')
        .optional()
        .not().isEmpty().withMessage('Propietario: Email vacío')
        .isEmail().withMessage('Debe ser un email')
        .trim()
        .toUpperCase(),
    (0, express_validator_1.body)('sintomas')
        .optional()
        .not().isEmpty().withMessage('Síntomas vacíos')
        .isString().withMessage('Debe ser una cadena')
        .trim()
        .toUpperCase(),
    (0, express_validator_1.body)('fechaAlta')
        .optional()
        .not().isEmpty().withMessage('Fecha vacía'),
    (0, express_validator_1.body)('pendiente')
        .optional()
        .not().isEmpty().withMessage('Pendiente vacío')
        .isBoolean().withMessage('Debe ser un booleano')
];
