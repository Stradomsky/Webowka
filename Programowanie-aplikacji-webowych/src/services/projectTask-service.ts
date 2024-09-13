import axios from 'axios';
import { selectedStoryId } from '../reactive/refs';
import { Task } from '../models/Task';
import currentStoryService from './currentStory-service';

export class ProjectTaskService {
    private static API_URL = `${import.meta.env.VITE_URL}/api/tasks`;

    static async loadTasks(): Promise<Task[]> {
        try {
            const response = await axios.get(this.API_URL);
            return response.data;
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    }

    static async getTasksByStory(): Promise<Task[]> {
        let tasks;
        selectedStoryId.value = currentStoryService.getCurrentStoryId();

        if (selectedStoryId.value) {
            tasks = await ProjectTaskService.loadTasks();
            tasks = tasks.filter(t => t.storyId === selectedStoryId.value);
        }

        return tasks as Task[]
    }

    static async addTask(task: Task): Promise<void> {
        try {
            task.storyId = selectedStoryId.value as number;
            task.creationDate = new Date();
            await axios.post(this.API_URL, task);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    static async updateTask(updatedTask: Task): Promise<void> {
        try {
            if (updatedTask.status === 'Doing') {
                updatedTask.startDate = new Date();
            }
            if (updatedTask.status === 'Done') {
                if (!updatedTask.startDate) {
                    updatedTask.startDate = new Date();
                }
                updatedTask.endDate = new Date();
            }
            await axios.put(`${this.API_URL}/${updatedTask.id}`, updatedTask);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    static async deleteTask(taskId: number): Promise<void> {
        try {
            await axios.delete(`${this.API_URL}/${taskId}`);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
}
