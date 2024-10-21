import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  
  controllers: [ProjectsController],
  imports: [
    PrismaModule,   
    UsersModule,
    AuthModule
  ],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
