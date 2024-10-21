// task.entity.ts
export class Task {
    id: string;
    title: string;
    status: string;
    deadline?: Date;
    projectId: string;
    userId: string;
  
    constructor(partial: Partial<Task>) {
      Object.assign(this, partial);
    }
  }
  