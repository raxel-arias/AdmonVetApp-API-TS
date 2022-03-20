export const ClonarObjeto = (objeto: any) => {
    return JSON.parse(JSON.stringify(objeto));
}