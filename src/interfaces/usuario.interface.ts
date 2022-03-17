export interface UsuarioSignUp {
    nombre: string,
    apellido: string,
    telefono: string,
    email: string,
    password: string
}

export interface UsuarioUpdate {
    nombre?: string,
    apellido?: string,
    telefono?: string,
    email: string,
    password: string
}