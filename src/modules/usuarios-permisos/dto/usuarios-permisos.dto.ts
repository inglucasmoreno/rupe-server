import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { USUARIOS_ROLES } from "src/constants";

export class UsuariosPermisosDTO {
  
  @IsNumber()
  readonly usuario: string;
  
  @IsString()
  readonly alcance: string;
  
  @IsEnum(USUARIOS_ROLES)
  readonly permiso: USUARIOS_ROLES;
  
  @IsBoolean()
  @IsOptional()
  readonly activo: boolean;
  
  @IsNumber()
  readonly creatorUser: string;
  
  @IsNumber()
  readonly updatorUser: string;

}