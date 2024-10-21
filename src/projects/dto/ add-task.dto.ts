  export class AddTaskDto {
    title: string;
    status: string;
    deadline?: Date;
    userId: string;  // Assign the task to a user
  }
  