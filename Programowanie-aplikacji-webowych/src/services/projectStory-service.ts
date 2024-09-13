import axios from 'axios';
import { ProjectStory, StoryState } from '../models/projectStory';
import { selectedProjectId } from '../reactive/refs';
import CurrentProjectService from '../services/currentProject-service';
export class ProjectStoryService {
    private static API_URL = `${import.meta.env.VITE_URL}/api/stories`;

    static async loadStories(): Promise<ProjectStory[]> {
        try {
            const response = await axios.get(this.API_URL);
            return response.data;
        } catch (error) {
            console.error('Error loading stories:', error);
            return [];
        }
    }

    static async loadStoriesForCurrentProject(): Promise<ProjectStory[]> {
        let stories;
        selectedProjectId.value = CurrentProjectService.getCurrentProjectId();
        if (selectedProjectId.value) {
            stories = await ProjectStoryService.loadStories();
            stories = stories.filter(s => s.projectId === selectedProjectId.value);
        }
        return stories as ProjectStory[]
    }

    static async createStory(story: ProjectStory): Promise<void> {
        try {
            await axios.post(this.API_URL, story);
        } catch (error) {
            console.error('Error creating story:', error);
        }
    }

    static async updateStory(updatedStory: ProjectStory): Promise<void> {
        try {
            await axios.put(`${this.API_URL}/${updatedStory.id}`, updatedStory);
        } catch (error) {
            console.error('Error updating story:', error);
        }
    }

    static async deleteStory(storyId: number): Promise<void> {
        try {
            await axios.delete(`${this.API_URL}/${storyId}`);
        } catch (error) {
            console.error('Error deleting story:', error);
        }
    }

    static async updateStoryState(storyId: string, newState: StoryState): Promise<void> {
        try {
            await axios.patch(`${this.API_URL}/${storyId}`, { state: newState });
        } catch (error) {
            console.error('Error updating story state:', error);
        }
    }
}
