import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum RolUsuario {
  MIEMBRO = 'miembro',
  ADMINISTRADOR = 'administrador',
}

export class CreateUserDto {
  @ApiProperty()
  nombre: string;

  @ApiProperty()
  correo: string;

  @ApiProperty({
    enum: RolUsuario,
    example: `${RolUsuario.MIEMBRO}|${RolUsuario.ADMINISTRADOR}`,
  })
  @IsEnum(RolUsuario, {
    message: 'El rol solo puede ser miembro o administrador',
  })
  rol: RolUsuario;
}
