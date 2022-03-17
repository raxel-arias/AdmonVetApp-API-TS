"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIDDLEWARES = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = require("express");
exports.MIDDLEWARES = [
    (0, express_1.json)(),
    (0, express_1.urlencoded)({ extended: true }),
    (0, cors_1.default)()
];
