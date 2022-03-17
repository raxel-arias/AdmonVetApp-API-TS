"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE_DECLARATIONS = void 0;
const auth_routes_1 = require("./auth/auth.routes");
exports.ROUTE_DECLARATIONS = {
    path: '/api',
    routers: [
        auth_routes_1.AuthRouter
    ]
};
