export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Todo' | 'Doing' | 'Done';

export interface Task {
    id: number;
    name: string;
    description: string;
    priority: TaskPriority;
    storyId: number;
    estimatedTime: number; 
    status: TaskStatus;
    creationDate: Date;
    startDate?: Date; 
    endDate?: Date; 
    assignedUserId?: number; 
  }