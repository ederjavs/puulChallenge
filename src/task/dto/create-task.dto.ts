import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum EstadoTarea {
  ACTIVA = 'activa',
  TERMINADA = 'terminada',
}

export class CreateTaskDto {
  @ApiProperty()
  titulo: string;

  @ApiProperty()
  descripcion: string;

  @ApiProperty()
  estimacionHoras: number;

  @ApiProperty()
  fechaVencimiento: Date;

  @ApiProperty()
  costo: number;

  @ApiProperty({ type: [Number]})
  usuarios?: number[];
}
