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
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Auth {
    static genHash(password) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const hashed = yield bcrypt_1.default.hash(password, bcrypt_1.default.genSaltSync(5));
            resolve(hashed);
        }));
    }
    static genToken() {
        return crypto_1.default.randomBytes(20).toString('hex');
    }
    static validateHashBcrypt(password, correctHashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const isValid = yield bcrypt_1.default.compare(password, correctHashedPassword);
                resolve(isValid);
            }));
        });
    }
    static genJWT(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign(data, this._JWT_SECRET, {
                expiresIn: '30d'
            });
        });
    }
    static validateJWT(req, res, next) {
        const authHeaders = req.headers.authorization;
        if (!authHeaders || !authHeaders.startsWith('Bearer')) {
            res.status(403).json({
                msg: 'Token Inválido o no encontrado',
                error: true
            });
            return;
        }
        let token = authHeaders.split(' ')[1].trim();
        if (!token) {
            res.status(404).json({
                msg: 'No existe un token para validar',
                error: true
            });
            return;
        }
        const decodedData = jsonwebtoken_1.default.verify(token, this._JWT_SECRET, (err, user) => {
            if (err) {
                res.status(403).json({
                    msg: 'Token JWT Inválido',
                    errorMsg: err,
                    error: true
                });
            }
            else {
                req.user.id = user;
                next();
            }
        });
    }
}
exports.default = Auth;
Auth._JWT_SECRET = process.env.JWT_SECRET;
