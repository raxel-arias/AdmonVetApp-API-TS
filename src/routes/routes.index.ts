import { AuthRouter } from "./auth/auth.routes";
import { IRouteDeclarations } from "../interfaces/route_declarations.interface";

export const ROUTE_DECLARATIONS:IRouteDeclarations = {
    path: '/api',
    routers: [
        AuthRouter
    ]
}