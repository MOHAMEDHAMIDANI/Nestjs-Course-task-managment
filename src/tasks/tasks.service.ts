import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { createTaskDto } from './Dto/create-task.dto';
import { getTaskFilterDto } from './Dto/get-tasks-filter.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) { }
  async createTask(createTaskDto: createTaskDto , user : User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task: Task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user : user,
    });
    await this.taskRepository.save(task);
    return task;
  }
  async getTaskById(id: string , user : User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id: id  , user : user },
    });
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return found;
  }
  async deleteTask(id: string , user : User): Promise<void> {
    const task = await this.taskRepository.delete({id: id  , user : user });
    if (!task.affected) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
  async updateTaskStatus(id: string, status: TaskStatus , user : User): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: id  , user : user } });
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
  async getTasks(filtersDto: getTaskFilterDto , user : User): Promise<Task[]> {
    const { status, search } = filtersDto;
    const Query = this.taskRepository.createQueryBuilder('task')
    Query.where({user : user})
    if (status) {
      Query.andWhere('task.status = :status', { status })
    }
    if (search) {
      Query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search:` %${ search }%` })
  }
  const tasks = await Query.getMany()
    return tasks
  }
}
