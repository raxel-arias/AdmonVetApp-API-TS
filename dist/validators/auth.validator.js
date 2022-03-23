"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetearPasswordValidator = exports.RecuperarCuentaValidator = exports.SignUpValidator = exports.LoginValidator = void 0;
const express_validator_1 = require("express-validator");
exports.LoginValidator = [
    (0, express_validator_1.body)('email', 'Debe ser un email válido')
        .exists()
        .not().isEmpty().withMessage('Email vacío')
        .isEmail()
        .trim()
        .toUpperCase(),
    (0, express_validator_1.body)('password')
        .exists()
];
exports.SignUpValidator = [
    (0, express_validator_1.body)('nombre')
        .exists().withMessage('Debe existir un nombre') //En caso de que no se encuentre la key
        .not().isEmpty().withMessage('Nombre vacío')
        .isString().withMessage('Debe ser una cadena')
        .trim()
        .toUpperCase(),
    (0, express_validator_1.body)('apellido')
        .exists().withMessage('Debe existir un apellido')
        .not().isEmpty().withMessage('Apellido vacío')
        .isString().withMessage('Debe ser una cadena')
        .trim()
        .toUpperCase(),
    (0, express_validator_1.body)('email')
        .exists().withMessage('Debe existir un email')
        .not().isEmpty().withMessage('Email vacío')
        .isEmail().withMessage('Debe ser un email')
        .trim()
        .toUpperCase(),
    (0, express_validator_1.body)('password')
        .exists().withMessage('Debe existir una contraseña')
        .not().isEmpty().withMessage('Contraseña vacía')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 9 caracteres')
];
exports.RecuperarCuentaValidator = [
    (0, express_validator_1.body)('email')
        .exists().withMessage('Debe existir un email')
        .not().isEmpty().withMessage('Email vacío')
        .trim()
        .toUpperCase()
];
exports.ResetearPasswordValidator = [
    (0, express_validator_1.body)('password')
        .exists().withMessage('Debe existir una contraseña')
        .not().isEmpty().withMessage('Contraseña vacía')
];
