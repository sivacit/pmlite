import { Task } from './task.entity';
export class Project {
    id: string;
    name: string;
    credit: number;
    createdBy: string;
    lastModifiedBy: string;
    tasks: Task[];
}
