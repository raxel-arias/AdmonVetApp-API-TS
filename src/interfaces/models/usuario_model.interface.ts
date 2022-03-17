export default interface IUsuarioModel {
    nombre: string,
    apellido: string,
    telefono: string,
    email: string,
    password: string,
    activado: boolean,
    tokenActivacion: string,
    tokenReseteo: string,
    tokenReseteoExp: Date
}