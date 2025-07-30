import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(data: any) {
    const existing = await this.taskRepository.findOne({
      where: { titulo: data.titulo },
    });
    if (existing) {
      throw new BadRequestException('Tarea ya existe');
    }
    let usuarios: User[] = [];
    if (data.usuarios && Array.isArray(data.usuarios)) {
      usuarios = data.usuarios.map((id: number) => {
        const user = new User();
        user.id = id;
        return user;
      });
    }
    const estado = 'activa';
    const task = this.taskRepository.create({ ...data, usuarios, estado });
    return this.taskRepository.save(task);
  }

  async findAll(filters: any) {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.usuarios', 'usuario');

    if (filters.titulo) {
      query.andWhere('task.titulo ILIKE :titulo', {
        titulo: `%${filters.titulo}%`,
      });
    }

    if (filters.fechaVencimiento) {
      query.andWhere('task.fechaVencimiento = :fechaVencimiento', {
        fechaVencimiento: filters.fechaVencimiento,
      });
    }

    if (filters.usuarioId) {
      query.andWhere('usuario.id = :usuarioId', {
        usuarioId: filters.usuarioId,
      });
    }

    if (filters.usuarioNombre) {
      query.andWhere('usuario.nombre ILIKE :usuarioNombre', {
        usuarioNombre: `%${filters.usuarioNombre}%`,
      });
    }

    if (filters.usuarioCorreo) {
      query.andWhere('usuario.correo ILIKE :usuarioCorreo', {
        usuarioCorreo: `%${filters.usuarioCorreo}%`,
      });
    }

    query.orderBy('task.id', 'DESC');

    return query.getMany();
  }
  async update(id: number, data: any) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['usuarios'],
    });
    if (!task) {
      throw new BadRequestException('Tarea no encontrada');
    }

    if (data.titulo) {
      const duplicate = await this.taskRepository.findOne({
        where: { titulo: data.titulo },
      });
      if (duplicate && duplicate.id !== id) {
        throw new BadRequestException('Ya existe una tarea con ese título');
      }
    }

    let usuarios = task.usuarios;
    if (data.usuarios && Array.isArray(data.usuarios)) {
      usuarios = data.usuarios.map((userId: number) => {
        const user = new User();
        user.id = userId;
        return user;
      });
    }

    Object.assign(task, data, { usuarios });
    return this.taskRepository.save(task);
  }
  async remove(id: number) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new BadRequestException('Tarea no encontrada');
    }

    const deleted = await this.taskRepository.delete(id);

    if (!deleted) {
      throw new BadRequestException('Error al eliminar la tarea');
    }
    return { message: 'Tarea eliminada exitosamente' };
  }

  async getAnalytics() {
    const estados = await this.taskRepository
      .createQueryBuilder('task')
      .select('task.estado', 'estado')
      .addSelect('COUNT(*)', 'cantidad')
      .groupBy('task.estado')
      .getRawMany();

    const promedio = await this.taskRepository
      .createQueryBuilder('task')
      .select('AVG(task.estimacionHoras)', 'promedioHoras')
      .addSelect('AVG(task.costo)', 'promedioCosto')
      .where('task.estado = :estado', { estado: 'terminada' })
      .getRawOne();

    return {
      tareasPorEstado: estados,
      promedioTareasTerminadas: {
        promedioHoras: Number(promedio?.promedioHoras) || 0,
        promedioCosto: Number(promedio?.promedioCosto) || 0,
      },
    };
  }
}
