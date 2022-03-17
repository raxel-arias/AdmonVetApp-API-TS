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
exports.WEB_SERVER = void 0;
const express_1 = __importDefault(require("express"));
const Routes_1 = __importDefault(require("../routes/Routes"));
const index_1 = require("../index");
const middlewares_index_1 = require("./middlewares.index");
const database_config_1 = require("../config/database.config");
class Server {
    constructor() {
        if (!exports.WEB_SERVER) {
            this.WebService();
            return;
        }
        return index_1.app;
    }
    WebService() {
        exports.WEB_SERVER = (0, express_1.default)();
        (() => __awaiter(this, void 0, void 0, function* () {
            yield (0, database_config_1.ConnectDB)();
            this.LoadMiddlewares();
            this.LoadRoutes();
            this.InitializeServer();
        }))();
    }
    LoadMiddlewares() {
        exports.WEB_SERVER.use(middlewares_index_1.MIDDLEWARES);
    }
    LoadRoutes() {
        const routes = new Routes_1.default();
    }
    InitializeServer() {
        const PORT = process.env.PORT || 3200;
        const HOST = process.env.HOST || '0.0.0.0';
        exports.WEB_SERVER.listen(PORT, HOST, () => {
            console.log(`Servidor Inicializado en ${HOST}:${PORT}`);
        });
    }
}
exports.default = Server;
