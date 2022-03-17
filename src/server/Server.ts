import express, {Application} from 'express';
import Routes from '../routes/Routes';
import {app} from '../index';
import { MIDDLEWARES } from './middlewares.index';
import { ConnectDB } from '../config/database.config';

export let WEB_SERVER: Application;

export default class Server {
    public constructor() {
        if (!WEB_SERVER) {
            this.WebService();
            return;
        }
        return app;
    }

    private WebService():void {
        WEB_SERVER = express();
    
        (async ():Promise<void> => {
            await ConnectDB();

            this.LoadMiddlewares();
            this.LoadRoutes();
            this.InitializeServer();
        })();
    }

    private LoadMiddlewares():void {
        WEB_SERVER.use(MIDDLEWARES);
    }
    
    private LoadRoutes():void {
        const routes:Routes = new Routes();
    }

    public InitializeServer():void {
        const PORT:any = process.env.PORT || 3200;
        const HOST:string = process.env.HOST || '0.0.0.0';

        WEB_SERVER.listen(PORT, HOST, (): void => {
            console.log(`Servidor Inicializado en ${HOST}:${PORT}`);
        });
    }
}