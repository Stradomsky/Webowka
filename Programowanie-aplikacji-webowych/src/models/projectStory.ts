export type Priority = 'low' | 'medium' | 'high';
export type StoryState = 'todo' | 'doing' | 'done';

export interface ProjectStory {
    id: number;
    name: string;
    description: string;
    priority: Priority;
    projectId: number;
    creationDate: Date;
    state: StoryState;
    ownerId: number;
}