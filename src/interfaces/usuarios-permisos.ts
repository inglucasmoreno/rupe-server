import { IUsuarios } from "./usuarios.interface";

export interface IUsuariosPermisos {
  id: number;
  alcance: string;
  permiso: string;
  activo: boolean;
  usuario: IUsuarios;
  creatorUser: IUsuarios;
  updatorUser: IUsuarios;
}