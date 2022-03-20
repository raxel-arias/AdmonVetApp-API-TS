"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClonarObjeto = void 0;
const ClonarObjeto = (objeto) => {
    return JSON.parse(JSON.stringify(objeto));
};
exports.ClonarObjeto = ClonarObjeto;
