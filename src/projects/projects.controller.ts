import { Controller, Get, Post, Body, Patch,Request, Param, Delete, UploadedFile, UseInterceptors  } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { UsersService } from 'src/users/users.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddTaskDto } from './dto/ add-task.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService, private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':projectId/tasks/import')
  @UseInterceptors(FileInterceptor('file'))
  async importTasks(
    @Request() req,
    @Param('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log("-----------------", req);
    // Check if `userId` is available in `req.user`
    const username = req.user?.username;
    const user =  await this.usersService.getUserByEmail(username);
    console.log("User ID:", user.id);
    console.log("Project ID:", projectId);
    const csv = file.buffer.toString(); // Convert the file buffer to a string
    const tasks = await this.projectsService.importTasksFromCsv(csv, projectId, user.id);
    await this.projectsService.saveTasksToDatabase(tasks);
    return { message: 'Tasks imported successfully' };
  }

}
