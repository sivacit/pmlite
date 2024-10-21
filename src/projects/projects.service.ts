import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddTaskDto } from './dto/ add-task.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        credit: createProjectDto.credit,
        createdBy: createProjectDto.createdBy,
      },
    });
  }

  findAll() {
    return this.prisma.project.findMany({
      include: { tasks: true }, // Include tasks associated with each project
    });
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: { tasks: true }, // Include tasks when finding a single project
    });
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: {
        name: updateProjectDto.name,
        credit: updateProjectDto.credit,
        lastModifiedBy: updateProjectDto.lastModifiedBy,
      },
    });
  }

  remove(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }

  // Add a task to the project and assign it to a user
  async addTask(projectId: string, addTaskDto: AddTaskDto) {
    return this.prisma.task.create({
      data: {
        title: addTaskDto.title,
        status: addTaskDto.status,
        deadline: addTaskDto.deadline,
        projectId,
        userId: addTaskDto.userId,  // Assign to a user
      },
    });
  }

  // Remove a task from the project
  async removeTask(projectId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: { projectId: true },
    });

    if (task.projectId !== projectId) {
      throw new Error('Task does not belong to this project');
    }

    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
