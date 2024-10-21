import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { KnexService } from '../global/knex.service';
// import { OpenAIService } from '../global/openai.service';

@Module({
  controllers: [TasksController],
  providers: [KnexService, TasksService],
})
export class TasksModule {}
