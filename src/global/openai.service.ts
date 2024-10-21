import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    // Initialize the OpenAI client with your API key directly
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API key in the environment variables
    });
  }

  // Function to create an embedding for the search query
  async getEmbedding(query: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
    });

    return response.data[0].embedding;
  }
}
