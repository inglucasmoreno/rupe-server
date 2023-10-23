import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { USUARIOS_ROLES } from "src/constants";

export class UsuariosDTO {

    @IsString()
    readonly usuario: string;

    @IsString()
    readonly dni: string;

    @IsString()
    apellido: string;

    @IsString()
    nombre: string;

    @IsString()
    password: string;

    @IsString()
    email: string;

    @IsEnum(USUARIOS_ROLES)
    @IsOptional()
    readonly role: USUARIOS_ROLES;

    @IsOptional()
    readonly permisos: any;

    @IsBoolean()
    @IsOptional()
    readonly activo: boolean;

}