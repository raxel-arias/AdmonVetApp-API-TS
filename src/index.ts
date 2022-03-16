import express, {Application, Request, Response} from 'express';

const server:Application = express();

server.get('/', (req: Request, res: Response):void => {
    res.send('Hola Mundo');
});

const PORT = 3200;

server.listen(PORT, ():void => {
    console.log(`Servidor Express funcionando en ${PORT}`);
});