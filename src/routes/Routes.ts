import { Router, Request, Response, NextFunction } from "express";
import { WEB_SERVER } from "../server/Server";
import { ROUTE_DECLARATIONS } from "./routes.index";

export default class Routes {
    public constructor() {
        this.CorsHeaders();
        this.EnableRoutes();
        this.TestRoute();
        this.Route404();
    }

    private TestRoute(): void {
        WEB_SERVER.use(ROUTE_DECLARATIONS.path, (req: Request, res: Response) => {
            res.status(200).json({
                msg: "AdmonVET API",
                author: "Raxel Arias"
            });
        })
    }

    private EnableRoutes(): void {
        ROUTE_DECLARATIONS.routers.forEach((router: Router): void => {
            WEB_SERVER.use(ROUTE_DECLARATIONS.path, router);
        });
    }

    private Route404(): void {
        WEB_SERVER.use('*', (req: Request, res: Response): void => {
            res.status(404).json({
                msg: 'Recurso No Encontrado',
                url: req.originalUrl
            });
        });
    }

    private CorsHeaders(): void {
        console.log('Cors personalizados en rutas');

        WEB_SERVER.use('*', (req: Request, res: Response, next: NextFunction): void => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
            res.header("Access-Control-Allow-Headers", "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            
            next();
        });
    }
}