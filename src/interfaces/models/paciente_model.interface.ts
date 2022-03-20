export default interface IPacienteModel {
    nombre: string,
    propietario: IPropietario,
    fechaAlta: Date | null,
    sintomas: string
    veterinario_id: any,
    pendiente: boolean
}

export interface IPropietario {
    nombre?: string,
    apellido?: string,
    email?: string
}