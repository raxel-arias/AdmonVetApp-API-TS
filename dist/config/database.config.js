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
exports.ConnectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ConnectDB = () => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const DB_URL = process.env.MONGO_URI;
            const DATABASE = yield mongoose_1.default.connect(DB_URL);
            const URL = `${mongoose_1.default.connection.host}:${mongoose_1.default.connection.port}`;
            console.log('Base de datos conectada\n', URL);
            resolve(DATABASE);
        }
        catch (error) {
            console.log(`Hubo un error al conectar a la base de datos`);
            console.log(error);
            reject({
                msg: 'Hubo un error al conectar a la base de datos',
                error
            });
        }
    }));
};
exports.ConnectDB = ConnectDB;
