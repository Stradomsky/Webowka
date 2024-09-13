<template>
    <div class="w-full max-w-xs">
        <label for="listbox" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Select a Story</label>
        <div class="relative mt-1">
            <button type="button"
                class="relative w-full cursor-default rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm">
                <span class="block truncate text-gray-900 dark:text-gray-100">{{ selectedStoryName }}</span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg class="h-5 w-5 text-gray-400 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"
                        stroke="currentColor">
                        <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                    </svg>
                </span>
            </button>

            <select v-model="selectedStoryId" @change="setCurrentStory"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option value="" disabled class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">Select story</option>
                <option v-for="story in stories" :key="story.id" :value="story.id" class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    {{ story.name }}
                </option>
            </select>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import CurrentProjectService from '../services/currentProject-service';
import CurrentStoryService from '../services/currentStory-service';
import { ProjectService } from '../services/project-service';
import { Project } from '../models/project';
import { selectedProjectId, tasks } from '../reactive/refs';
import { selectedStoryId } from '../reactive/refs';
import { ProjectStory } from '../models/projectStory';
import { ProjectStoryService } from '../services/projectStory-service';
import { ProjectTaskService } from '../services/projectTask-service';

const projects = ref<Project[]>([]);
const stories = ref<ProjectStory[]>([]);

const selectedProjectName = ref('Select project');
const selectedStoryName = ref('Select story');

onMounted(async () => {
    const savedProjectId = localStorage.getItem('selectedProjectId');
    const savedStoryId = localStorage.getItem('selectedStoryId');
    if (savedProjectId) {
        selectedProjectId.value = Number(savedProjectId);
    }
    if (savedStoryId) {
        selectedStoryId.value = Number(savedStoryId);
    }
    await refreshProjectsAndStories();
});

//odświeżanie listy projektów, historii i zadań
const refreshProjectsAndStories = async () => {
    projects.value = await ProjectService.loadProjects();
    stories.value = await ProjectStoryService.loadStories();

    if (selectedProjectId.value) {
        const project = projects.value.find(p => p.id === selectedProjectId.value);
        const story = stories.value.find(s => s.id === selectedStoryId.value);

        selectedProjectName.value = project ? project.name : 'Select project';
        selectedStoryName.value = story ? story.name : 'Select story';

        stories.value = await ProjectStoryService.loadStoriesForCurrentProject();

        const firstStory = stories.value.find(s => s.projectId === selectedProjectId.value);

        if (firstStory) {
            selectedStoryId.value = firstStory.id;
            selectedStoryName.value = firstStory.name;
            await refreshTasks();
        } else {
            selectedStoryName.value = 'Select story';
            tasks.value = [];
        }
    } else {
        selectedProjectName.value = 'Select project';
        selectedStoryName.value = 'Select story';
        tasks.value = [];
    }
    await refreshTasks();
};

//odświeżanie zadania dla wybranej story
const refreshTasks = async () => {
    tasks.value = await ProjectTaskService.getTasksByStory();
};

//nasłuchiwanie zmian po wybraniu projektu
watch(selectedProjectId, (newVal) => {
    if (newVal) {
        localStorage.setItem('selectedProjectId', newVal.toString());
        CurrentProjectService.setCurrentProject(newVal);
        refreshProjectsAndStories();
    } else {
        selectedProjectName.value = 'Select project';
    }
});

//nasłuchiwanie zmian po wybraniu story
watch(selectedStoryId, async (newVal) => {
    if (newVal) {
        localStorage.setItem('selectedStoryId', newVal.toString());
        CurrentStoryService.setCurrentStory(newVal);
        const story = stories.value.find(s => s.id === newVal);
        selectedStoryName.value = story ? story.name : 'Select story';
        await refreshTasks();
    } else {
        selectedStoryName.value = 'Select story';
        tasks.value = [];
    }
});

//ustawianie bieżacej story
const setCurrentStory = async () => {
    if (selectedStoryId.value) {
        CurrentStoryService.setCurrentStory(selectedStoryId.value);
        const story = stories.value.find(s => s.id === selectedStoryId.value);
        selectedStoryName.value = story ? story.name : 'Select story';
        await refreshTasks();
    } else {
        selectedStoryName.value = 'Select story';
        localStorage.removeItem('selectedStoryId');
        CurrentStoryService.clearCurrentStory();
        tasks.value = [];
    }
};
</script>
