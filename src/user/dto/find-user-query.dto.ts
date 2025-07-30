import { ApiPropertyOptional } from '@nestjs/swagger';
import { RolUsuario } from './create-user.dto';

export class FindUserQueryDto {
  @ApiPropertyOptional()
  nombre?: string;

  @ApiPropertyOptional()
  correo?: string;

  @ApiPropertyOptional({ enum: RolUsuario, example: RolUsuario.MIEMBRO })
  rol?: RolUsuario;
}
