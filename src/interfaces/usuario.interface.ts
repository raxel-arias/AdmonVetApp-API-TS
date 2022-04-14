export interface UsuarioSignUp {
    nombre: string,
    apellido: string,
    email: string,
    password: string
}

export interface UsuarioLogin {
    email: string,
    password: string
}

export interface UsuarioUpdate {
    _id: string,
    nombre?: string,
    apellido?: string,
    telefono?: string,
    email: string,
    password: string,
    previousPassword: string
}