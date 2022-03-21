import nodemailer from 'nodemailer';
import { IMessage } from './../interfaces/email/email.interface';

const HOST: string = process.env.MAIL_HOST!;
const PORT: string = process.env.MAIL_PORT!;
const USER: string = process.env.MAIL_USER!;
const PASS: string = process.env.MAIL_PASS!;

export const transport = nodemailer.createTransport({
    host: HOST,
    port: Number(PORT),
    auth: {
      user: USER,
      pass: PASS
    }
});

export const EnviarEmail = (email: IMessage): void => {
  transport.sendMail(email, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}