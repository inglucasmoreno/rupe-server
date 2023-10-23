import { USUARIOS_ROLES } from "src/constants";

export interface IUsuarios {
  id: number,
  usuario: string;
  dni: string;
  apellido: string;
  nombre: string;
  password: string;
  email: string;
  role: USUARIOS_ROLES;
  permisos: any;
  activo: boolean;
}