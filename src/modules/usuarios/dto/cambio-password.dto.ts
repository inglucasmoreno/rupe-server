import { IsString } from "class-validator";

export class CambioPasswordDTO {
  
  @IsString()
  readonly password_actual: string;
  
  @IsString()
  readonly password_nuevo: string;
  
  @IsString()
  readonly password_nuevo_repetir: string;

}