import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto) {
    const existing = await this.userRepository.findOne({
      where: { correo: data.correo },
    });
    if (existing) {
      throw new BadRequestException('Usuario ya existe');
    }
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findAll(filters: any) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tareas', 'tarea');

    if (filters.nombre) {
      query.andWhere('user.nombre ILIKE :nombre', {
        nombre: `%${filters.nombre}%`,
      });
    }
    if (filters.correo) {
      query.andWhere('user.correo ILIKE :correo', {
        correo: `%${filters.correo}%`,
      });
    }
    if (filters.rol) {
      query.andWhere('user.rol = :rol', { rol: filters.rol });
    }

    const users = await query.getMany();

    return users.map((user) => {
      const tareasTerminadas = (user.tareas || []).filter(
        (t) => t.estado === 'terminada',
      );
      return {
        ...user,
        tareasTerminadas: tareasTerminadas.length,
        sumaCostoTareasTerminadas: tareasTerminadas.reduce(
          (acc, t) => acc + (t.costo || 0),
          0,
        ),
      };
    });
  }
}
