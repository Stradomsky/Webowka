<template>
    <div class="w-full max-w-xs">
        <label for="listbox" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Select a Project</label>
        <div class="relative mt-1">
            <button type="button"
                class="relative w-full cursor-default rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm">
                <span class="block truncate text-gray-900 dark:text-gray-100">{{ selectedProjectName }}</span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg class="h-5 w-5 text-gray-400 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"
                        stroke="currentColor">
                        <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                    </svg>
                </span>
            </button>

            <select v-model="selectedProjectId" @change="setCurrentProject"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option value="" disabled class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">Select project</option>
                <option v-for="project in projects" :key="project.id" :value="project.id" class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    {{ project.name }}
                </option>
            </select>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import CurrentProjectService from '../services/currentProject-service';
import { ProjectService } from '../services/project-service';
import { Project } from '../models/project';
import { selectedProjectId } from '../reactive/refs';


const projects = ref<Project[]>([]);
const selectedProjectName = ref('Select project');

//odświeżanie listy projektów, ustawianie nazwy aktualnego projektu
const refreshProjects = async () => {
    projects.value = await ProjectService.loadProjects();
    if (selectedProjectId.value) {
        const project = projects.value.find(p => p.id === selectedProjectId.value);
        selectedProjectName.value = project ? project.name : 'Select project';
    }
};

onMounted(() => {
    const savedProjectId = localStorage.getItem('selectedProjectId');
    if (savedProjectId) {
        selectedProjectId.value = Number(savedProjectId);
    }
    refreshProjects();
});

//nasłuchiwanie zmiany wartości selectedProjektId
watch(selectedProjectId,  (newVal) => {
    if (newVal) {
        localStorage.setItem('selectedProjectId', newVal.toString());
        CurrentProjectService.setCurrentProject(newVal);
    } else {
        selectedProjectName.value = 'Select project';
    }
});

//ustawianie akutalnego projektu
const setCurrentProject = () => {
    if (selectedProjectId.value) {
        CurrentProjectService.setCurrentProject(selectedProjectId.value);
    }
    refreshProjects();
};
</script>
