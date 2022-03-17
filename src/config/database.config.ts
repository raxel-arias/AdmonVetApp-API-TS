import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const ConnectDB = (): Promise<any> => {
    return new Promise(async (resolve: any, reject: any):Promise<void> => {
        try {
            const DB_URL:string | any = process.env.MONGO_URI;
            const DATABASE = await mongoose.connect(DB_URL);

            const URL:string = `${mongoose.connection.host}:${mongoose.connection.port}`;
            console.log('Base de datos conectada\n', URL);
            resolve(DATABASE);
        } catch (error: any) {
            console.log(`Hubo un error al conectar a la base de datos`);
            console.log(error);
            reject({
                msg: 'Hubo un error al conectar a la base de datos',
                error
            });
        } 
    });
}