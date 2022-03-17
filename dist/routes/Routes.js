"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = require("../server/Server");
const routes_index_1 = require("./routes.index");
class Routes {
    constructor() {
        this.CorsHeaders();
        this.EnableRoutes();
        this.Route404();
    }
    EnableRoutes() {
        routes_index_1.ROUTE_DECLARATIONS.routers.forEach((router) => {
            Server_1.WEB_SERVER.use(routes_index_1.ROUTE_DECLARATIONS.path, router);
        });
    }
    Route404() {
        Server_1.WEB_SERVER.use('*', (req, res) => {
            res.status(404).json({
                msg: 'Recurso No Encontrado',
                url: req.originalUrl
            });
        });
    }
    CorsHeaders() {
        console.log('Cors personalizados en rutas');
        Server_1.WEB_SERVER.use('*', (req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
            res.header("Access-Control-Allow-Headers", "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
        });
    }
}
exports.default = Routes;
