import { body, ValidationChain } from "express-validator";

export const LoginValidator: ValidationChain[] = [
    body('email', 'Debe ser un email válido')
        .exists()
        .not().isEmpty().withMessage('Email vacío')
        .isEmail()
        .trim()
        .toUpperCase(),
    body('password')
        .exists()
];

export const SignUpValidator: ValidationChain[] = [
    body('nombre')
        .exists().withMessage('Debe existir un nombre') //En caso de que no se encuentre la key
        .not().isEmpty().withMessage('Nombre vacío')
        .isString().withMessage('Debe ser una cadena')
        .trim()
        .toUpperCase(),
    body('apellido')
        .exists().withMessage('Debe existir un apellido')
        .not().isEmpty().withMessage('Apellido vacío')
        .isString().withMessage('Debe ser una cadena')
        .trim()
        .toUpperCase(),
    body('email')
        .exists().withMessage('Debe existir un email')
        .not().isEmpty().withMessage('Email vacío')
        .isEmail().withMessage('Debe ser un email')
        .trim()
        .toUpperCase(),
    body('password')
        .exists().withMessage('Debe existir una contraseña')
        .not().isEmpty().withMessage('Contraseña vacía')
        .isLength({min: 8}).withMessage('La contraseña debe tener al menos 9 caracteres')
];

export const RecuperarCuentaValidator: ValidationChain[] = [
    body('email')
        .exists().withMessage('Debe existir un email')
        .not().isEmpty().withMessage('Email vacío')
        .trim()
        .toUpperCase()
]

export const ResetearPasswordValidator: ValidationChain[] = [
    body('password')
        .exists().withMessage('Debe existir una contraseña')
        .not().isEmpty().withMessage('Contraseña vacía')
]