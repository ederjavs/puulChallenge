
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTaskQueryDto } from './dto/find-task-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('createTask')
  createTask(@Body() data: CreateTaskDto) {
    return this.taskService.create(data);
  }

  @Get('findAllTasks')
  findAllTasks(@Query() query: FindTaskQueryDto) {
    return this.taskService.findAll(query);
  }

  @Put('updateTask/:id')
  updateTask(@Param('id') id: number, @Body() data: UpdateTaskDto) {
    return this.taskService.update(id, data);
  }

  @Delete('deleteTask/:id')
  remove(@Param('id') id: number) {
    return this.taskService.remove(id);
  }

  @Get('analytics')
  getAnalytics() {
    return this.taskService.getAnalytics();
  }
}
