import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { createTaskDto } from './Dto/create-task.dto';
import { getTaskFilterDto } from './Dto/get-tasks-filter.dto';
import { updateTaskStatusDto } from './Dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Logger } from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private logger = new Logger('tasks'), private taskService: TasksService) {}
  @Get()
  getTasks(@Query() filtersDto: getTaskFilterDto , @GetUser() user : User): Promise<Task[]> {
    this.logger.verbose(`Filters: ${JSON.stringify(filtersDto)}`);
    return this.taskService.getTasks(filtersDto , user)
  }
  @Get('/:id')
  getTaskById(@Param('id') id: string , @GetUser() user : User): Promise<Task> {
    this.logger.verbose(`Fetching task with id: ${id}`);
    return this.taskService.getTaskById(id , user);
  }
  @Post()
  createTask(@Body() createTaskDto: createTaskDto , @GetUser() user : User): Promise<Task> {
    this.logger.verbose(`Creating task. Data: ${JSON.stringify(createTaskDto)}`);
    return this.taskService.createTask(createTaskDto , user );
  }
  @Delete('/:id')
  deleteTask(@Param('id') id: string , @GetUser() user : User) {
    this.logger.verbose(`Fetching task with id: ${id}`);
    this.taskService.deleteTask(id , user);
  }
  @Put('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') updateTaskStatusDto: updateTaskStatusDto,
    @GetUser() user : User
  ) {
    const { status } = updateTaskStatusDto
    this.logger.verbose(`Updating task status. Data: ${JSON.stringify(updateTaskStatusDto)}`);
    return this.taskService.updateTaskStatus(id, status , user);
  }
}
