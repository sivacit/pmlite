import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddTaskDto } from './dto/ add-task.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  // Add a task to a project and assign it to a user
  @Post(':projectId/tasks')
  addTask(
    @Param('projectId') projectId: string,
    @Body() addTaskDto: AddTaskDto
  ) {
    return this.projectsService.addTask(projectId, addTaskDto);
  }

  // Delete a task from a project
  @Delete(':projectId/tasks/:taskId')
  removeTask(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string
  ) {
    return this.projectsService.removeTask(projectId, taskId);
  }
}
