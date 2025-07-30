import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserQueryDto } from './dto/find-user-query.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('createUser')
  async createUser(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get('findUsers')
  findUsers(@Query() query: FindUserQueryDto) {
    return this.userService.findAll(query);
  }
}
