import axios from 'axios';
import { Project } from '../models/project';

export class ProjectService {
    private static API_URL = `${import.meta.env.VITE_URL}/api/projects`;

    static async saveProjects(projects: Project[]): Promise<void> {
        try {
            await axios.post(this.API_URL, projects);
        } catch (error) {
            console.error('Error saving projects:', error);
        }
    }

    static async loadProjects(): Promise<Project[]> {
        try {
            const response = await axios.get(this.API_URL);
            return response.data;
        } catch (error) {
            console.error('Error loading projects:', error);
            return [];
        }
    }

    static async addProject(project: Project): Promise<void> {
        try {
            await axios.post(this.API_URL, project);
        } catch (error) {
            console.error('Error adding project:', error);
        }
    }

    static async updateProject(updatedProject: Project): Promise<void> {
        try {
            await axios.put(`${this.API_URL}/${updatedProject.id}`, updatedProject);
        } catch (error) {
            console.error('Error updating project:', error);
        }
    }

    static async deleteProject(id: number): Promise<void> {
        try {
          await axios.delete(`${this.API_URL}/${id}`);
        } catch (error) {
          console.error('Error deleting project:', error);
        }
      }
}








