import { Controller, Get, Query } from '@nestjs/common';
import { KnexService } from '../global/knex.service';
// import { OpenAIService } from '../global/openai.service';
import { cosineSimilarity } from '../global/cosineSimilarity';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly knexService: KnexService,
    // private readonly openAIService: OpenAIService,
  ) {}

  // Search tasks route
  @Get('search')
  async searchTasks(
    @Query('searchQuery') searchQuery: string,
    @Query('status') status: string,
    @Query('projectId') projectId: string,
    @Query('sortField') sortField = 'created_at',
    @Query('sortOrder') sortOrder = 'asc',
    @Query('groupByField') groupByField?: string,
  ) {
    const knex = this.knexService.getKnex();
    let query = knex('task');

    // Apply status filtering
    if (status) {
      query = query.where('status', status);
    }

    // Apply projectId filtering
    if (projectId) {
      query = query.where('projectId', projectId);
    }

    // Apply sorting
    query = query.orderBy(sortField, sortOrder);

    // Group by (if required)
    if (groupByField) {
      query = query.select(knex.raw(`count(*) as count, ${groupByField}`)).groupBy(groupByField);
    }

    // If searchQuery is provided, perform semantic search
    // if (searchQuery) {
    //   const semanticResults = await this.semanticSearchTasks(searchQuery);
    //   return semanticResults;
    // }

    // Execute the query for basic filtering/sorting/grouping
    const tasks = await query;
    return tasks;
  }

  // // Semantic search using OpenAI embeddings
  // private async semanticSearchTasks(searchQuery: string) {
  //   const knex = this.knexService.getKnex();

  //   // Get embedding for the search query
  //   const queryEmbedding = await this.openAIService.getEmbedding(searchQuery);

  //   // Retrieve all tasks with their embeddings
  //   const tasks = await knex('tasks').select('id', 'title', 'embedding');

  //   // Compute cosine similarity between the search query and task embeddings
  //   const results = tasks
  //     .filter(task => task.embedding) // Ensure tasks have embeddings
  //     .map(task => {
  //       const similarity = cosineSimilarity(queryEmbedding, task.embedding);
  //       return { ...task, similarity };
  //     });

  //   // Sort by similarity
  //   results.sort((a, b) => b.similarity - a.similarity);

  //   return results;
  // }
}
