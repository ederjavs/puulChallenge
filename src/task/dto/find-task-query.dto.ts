import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindTaskQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  usuarioId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  usuarioNombre?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  usuarioCorreo?: string;
}
