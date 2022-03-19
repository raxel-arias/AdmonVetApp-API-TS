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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListadoPacientes = exports.NuevoPaciente = void 0;
const paciente_controller_1 = __importDefault(require("../../controllers/paciente.controller"));
const NuevoPaciente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paciente = req.body;
    const { userId } = req.user;
    try {
        const response = yield new paciente_controller_1.default().CrearPaciente(paciente, userId);
        res.status(response.status).json(response);
    }
    catch (error) {
        res.status(error.status).json(error);
    }
});
exports.NuevoPaciente = NuevoPaciente;
const ListadoPacientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const _a = req.query, { id } = _a, queryParams = __rest(_a, ["id"]);
    const searchParams = Object.assign(Object.assign({ veterinario_id: userId }, (id && { _id: id })), queryParams);
    try {
        const response = yield new paciente_controller_1.default().ListadoPacientes(searchParams);
        res.status(response.status).json(response);
    }
    catch (error) {
        res.status(error.status).json(error);
    }
});
exports.ListadoPacientes = ListadoPacientes;
