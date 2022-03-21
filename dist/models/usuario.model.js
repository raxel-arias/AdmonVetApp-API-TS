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
exports.UsuarioSchema = void 0;
const mongoose_1 = require("mongoose");
const Auth_class_1 = __importDefault(require("../auth/Auth.class"));
exports.UsuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    activado: {
        type: Boolean,
        default: false
    },
    tokenActivacion: {
        type: String,
        default: null
    },
    tokenReseteo: {
        type: String,
        default: null
    },
    tokenReseteoExp: {
        type: Date,
        default: null
    }
});
exports.UsuarioSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            next();
        }
        this.tokenActivacion = this.activado ? null : Auth_class_1.default.genToken();
        this.password = yield Auth_class_1.default.genHash(this.password);
    });
});
const UsuarioModel = (0, mongoose_1.model)('Usuarios', exports.UsuarioSchema);
exports.default = UsuarioModel;
