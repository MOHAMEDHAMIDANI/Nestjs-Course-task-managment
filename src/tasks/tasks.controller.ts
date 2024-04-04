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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { createTaskDto } from './Dto/create-task.dto';
import { getTaskFilterDto } from './Dto/get-tasks-filter.dto';
import { updateTaskStatusDto } from './Dto/update-tast-status.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}
  // @Get()
  // getTasks(@Query() filtersDto: getTaskFilterDto): Task[] {
  //   if (Object.keys(filtersDto).length) {
  //     this.taskService.getTaskWithFilters(filtersDto);
  //   } else {
  //     return this.taskService.getAllATasks();
  //   }
  // }
  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.taskService.getTaskById(id);
  }
  // @Get('/:id')
  // getTaskById(@Param('id') id: string) {
  //   return this.taskService.getTaskById(id);
  // }
  @Post()
  createTask(@Body() createTaskDto: createTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }
  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    this.taskService.deleteTask(id);
  }
  @Put('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') updateTaskStatusDto: updateTaskStatusDto,
  ) {
    const { status } = updateTaskStatusDto
    return this.taskService.updateTaskStatus(id, status);
  }
}
