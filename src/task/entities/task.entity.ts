import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  descripcion: string;

  @Column('float')
  estimacionHoras: number;

  @Column('date')
  fechaVencimiento: Date;

  @Column()
  estado: string;

  @Column('float')
  costo: number;

  @ManyToMany(() => User, user => user.tareas)
  @JoinTable()
  usuarios: User[];
}
