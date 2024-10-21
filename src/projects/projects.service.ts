import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddTaskDto } from './dto/ add-task.dto';
import { Task } from './entities/task.entity';
import * as Papa from 'papaparse';
import { generateTaskId } from '../utils/id-generator';
import { Role } from './dto/collaborator.dto';
import { CreateCollaboratorDto } from './dto/collaborator.dto';

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

  // Parse CSV data into Task entities
  async importTasksFromCsv(csvContent: string, projectId: string, userId: string): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true, // Parse CSV with headers
        complete: (result) => {
          const tasks: Task[] = result.data.map((row: any) => new Task({
            id: generateTaskId(), // Generate a unique ID for each task
            title: row?.title,
            status: row?.status,
            deadline: row?.deadline ? new Date(row.deadline) : undefined,
            projectId: projectId,
            userId: userId,
          }));
          resolve(tasks);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  async saveTasksToDatabase(tasks: Task[]) {
    for (const task of tasks) {
      // Check if the project exists before inserting or updating the task
      const projectExists = await this.prisma.project.findUnique({
        where: { id: task.projectId },
      });
  
      if (!projectExists) {
        throw new Error(`Project with id ${task.projectId} does not exist.`);
      }
  
      // Check if the user exists
      const userExists = await this.prisma.user.findUnique({
        where: { id: task.userId },
      });
  
      if (!userExists) {
        throw new Error(`User with id ${task.userId} does not exist.`);
      }
  
      // Upsert the task
      await this.prisma.task.upsert({
        where: { id: task.projectId },
        update: {
          title: task.title,
          status: task.status,
          deadline: task.deadline,
          projectId: task.projectId,
          userId: task.userId,
        },
        create: {
          id: task.id,
          title: task.title,
          status: task.status,
          deadline: task.deadline,
          projectId: task.projectId,
          userId: task.userId,
        },
      });
    }
  }  

  // Find task by id within a project
  async findTaskInProject(projectId: string, taskId: string) {
    return this.prisma.task.findFirst({
      where: { id: taskId, projectId },
    });
  }

  // Find user by id
  async findUserById(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

   // Assign a user to a task
   async assignTaskToUser(taskId: string, userId: string) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: { userId },
    });
  }

  async addCollaborator(projectId: string, userId: string, createCollaboratorDto: CreateCollaboratorDto) {
    return this.prisma.collaborator.create({
      data: {
        roleName: createCollaboratorDto.roleName ?? Role.EDITOR,
        resourceType: createCollaboratorDto.resourceType,
        resourceId: createCollaboratorDto.resourceId,
        userId,
        createdBy: createCollaboratorDto.createdBy,
      },
    });
  }
}
