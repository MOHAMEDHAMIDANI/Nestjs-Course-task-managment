import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { createTaskDto } from './Dto/create-task.dto';
import { getTaskFilterDto } from './Dto/get-tasks-filter.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}
  async createTask(createTaskDto: createTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task: Task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.taskRepository.save(task);
    return task;
  }
  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id: id },
    });
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return found;
  }
  async deleteTask(id: string): Promise<void> {
    const task = await this.taskRepository.delete(id);
    if (!task.affected) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: id } });
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
  // getTaskWithFilters(filtersDto: getTaskFilterDto) {
  //   const { status, search } = filtersDto;
  //   let tasks = this.tasks;
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) =>
  //       task.title.toLowerCase().includes(search.toLowerCase()),
  //     );
  //   }
  //   return tasks;
  // }
}
