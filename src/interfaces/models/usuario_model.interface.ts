export default interface IUsuarioModel {
    nombre: string,
    apellido: string,
    telefono: string,
    email: string,
    password: string,
    activado: boolean,
    tokenActivacion: string | null,
    tokenReseteo: string | null,
    tokenReseteoExp: Date | null
}