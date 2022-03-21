"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnviarEmail = exports.transport = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const HOST = process.env.MAIL_HOST;
const PORT = process.env.MAIL_PORT;
const USER = process.env.MAIL_USER;
const PASS = process.env.MAIL_PASS;
exports.transport = nodemailer_1.default.createTransport({
    host: HOST,
    port: Number(PORT),
    auth: {
        user: USER,
        pass: PASS
    }
});
const EnviarEmail = (email) => {
    exports.transport.sendMail(email, (err, info) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
        }
    });
};
exports.EnviarEmail = EnviarEmail;
