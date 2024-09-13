<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
    <div class="container mx-auto max-w-7xl">
      <h1 class="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-10">Project Stories</h1>

      <SelectCurrentProject />

      <div class="flex justify-center mb-6">
        <button @click="toggleModal()"
          class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50">
          ADD NEW STORY
        </button>
      </div>

      <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-lg">
          <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Add New Story</h3>
          <form @submit.prevent="isEditing ? updateStory() : addStory()">
            <div class="mb-4">
              <label for="story-name" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Story
                Name</label>
              <input type="text" id="story-name" v-model="newStory.name"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm">
            </div>
            <div class="mb-4">
              <label for="story-description"
                class="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
              <textarea id="story-description" v-model="newStory.description"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm"></textarea>
            </div>
            <div class="mb-4">
              <label for="story-priority"
                class="block text-sm font-medium text-gray-700 dark:text-gray-200">Priority</label>
              <select id="story-priority" v-model="newStory.priority"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm">
                <option value="" disabled>Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="story-state" class="block text-sm font-medium text-gray-700 dark:text-gray-200">State</label>
              <select id="story-state" v-model="newStory.state"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm">
                <option value="" disabled>Select state</option>
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select>
            </div>
            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
              {{ isEditing ? 'Save Changes' : 'Add Story' }}
            </button>
            <button type="button" @click="toggleModal()"
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 ml-2">Cancel</button>
          </form>
        </div>
      </div>


      <div class="flex flex-row justify-between space-x-4">
        <div class="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 class="text-center text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">To Do Stories</h2>
          <ul class="space-y-3">
            <li v-for="story in todoStories" :key="story.id":class="{
              'bg-green-100 dark:bg-green-700': story.priority === 'low',
              'bg-yellow-100 dark:bg-yellow-700': story.priority === 'medium',
              'bg-red-100 dark:bg-red-700': story.priority === 'high'
            }"
              class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Name: {{ story.name }}</h3>
                <p class="text-gray-600 dark:text-gray-300">Description: {{ story.description }}</p>
                <p class="text-gray-600 dark:text-gray-300">Priority: {{ story.priority }}</p>
                <p class="text-gray-600 dark:text-gray-300">State: {{ story.state }}</p>
              </div>
              <div>
                <button @click="editStory(story)"
                  class="text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg focus:outline-none mr-2">
                  EDIT
                </button>
                <button @click="deleteStory(story.id)"
                  class="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg focus:outline-none">
                  DELETE
                </button>
              </div>
            </li>
            <li v-if="todoStories.length === 0" class="text-center text-gray-500 dark:text-gray-300">No stories found.
            </li>
          </ul>
        </div>

        <div class="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 class="text-center text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Doing Stories</h2>
          <ul class="space-y-3">
            <li v-for="story in doingStories" :key="story.id":class="{
              'bg-green-100 dark:bg-green-700': story.priority === 'low',
              'bg-yellow-100 dark:bg-yellow-700': story.priority === 'medium',
              'bg-red-100 dark:bg-red-700': story.priority === 'high'
            }"
              class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Name: {{ story.name }}</h3>
                <p class="text-gray-600 dark:text-gray-300">Description: {{ story.description }}</p>
                <p class="text-gray-600 dark:text-gray-300">Priority: {{ story.priority }}</p>
                <p class="text-gray-600 dark:text-gray-300">State: {{ story.state }}</p>
              </div>
              <div>
                <button @click="editStory(story)"
                  class="text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg focus:outline-none mr-2">
                  EDIT
                </button>
                <button @click="deleteStory(story.id)"
                  class="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg focus:outline-none">
                  DELETE
                </button>
              </div>
            </li>
            <li v-if="doingStories.length === 0" class="text-center text-gray-500 dark:text-gray-300">No stories found.
            </li>
          </ul>
        </div>

        <div class="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 class="text-center text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Done Stories</h2>
          <ul class="space-y-3">
            <li v-for="story in doneStories" :key="story.id":class="{
              'bg-green-100 dark:bg-green-700': story.priority === 'low',
              'bg-yellow-100 dark:bg-yellow-700': story.priority === 'medium',
              'bg-red-100 dark:bg-red-700': story.priority === 'high'
            }"
              class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Name: {{ story.name }}</h3>
                <p class="text-gray-600 dark:text-gray-300">Description: {{ story.description }}</p>
                <p class="text-gray-600 dark:text-gray-300">Priority: {{ story.priority }}</p>
                <p class="text-gray-600 dark:text-gray-300">State: {{ story.state }}</p>
                <p class="text-gray-600 dark:text-gray-300">Created: {{ formatDate(story.creationDate) }}</p>
              </div>
              <div>
                <button @click="editStory(story)"
                  class="text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg focus:outline-none mr-2">
                  EDIT
                </button>
                <button @click="deleteStory(story.id)"
                  class="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg focus:outline-none">
                  DELETE
                </button>
              </div>
            </li>
            <li v-if="doneStories.length === 0" class="text-center text-gray-500 dark:text-gray-300">No stories found.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import CurrentProjectService from '../services/currentProject-service';
import { ProjectStoryService } from '../services/projectStory-service';
import { ProjectStory, Priority, StoryState } from '../models/projectStory';
import { loggedUser, selectedProjectId } from '../reactive/refs';
import SelectCurrentProject from '../components/SelectCurrentProject.vue';
import { format } from 'date-fns/format';

const stories = ref<ProjectStory[]>([]);
const isModalOpen = ref(false);
const isEditing = ref(false);
const editableStory = ref<ProjectStory | null>(null);

const newStory = ref<ProjectStory>({
  id: Date.now(),
  name: '',
  description: '',
  priority: '' as Priority,
  projectId: selectedProjectId.value as number,
  creationDate: new Date(),
  state: '' as StoryState,
  ownerId: loggedUser.value?.id as number,
});

//pobieranie historii dla wybranego projektu
onMounted(async () => {
  selectedProjectId.value = CurrentProjectService.getCurrentProjectId();
  if (selectedProjectId.value) {
    stories.value = await ProjectStoryService.loadStoriesForCurrentProject();
  }
});

//wyciąganie historii z "To Do"
const todoStories = computed(() =>
  stories.value.filter((story) => story.state === 'todo')
);

//wyciąganie historii z "Doing"
const doingStories = computed(() =>
  stories.value.filter((story) => story.state === 'doing')
);

//wyciąganie historii z "Done"
const doneStories = computed(() =>
  stories.value.filter((story) => story.state === 'done')
);

//nasłuchiwanie zmian w aktualnym projekcie i odświeżanie listy historii
watch(selectedProjectId, async (newId) => {
  if (newId) {
    stories.value = await ProjectStoryService.loadStoriesForCurrentProject();
  } else {
    stories.value = [];
  }
});

//otiweranie, zamykanie modal
const toggleModal = (story: ProjectStory | null = null) => {
  if (story) {
    isEditing.value = true;
    editableStory.value = { ...story };
  } else {
    isEditing.value = false;
    editableStory.value = null;
  }
  isModalOpen.value = !isModalOpen.value;
};

//dodawanie nowej story
const addStory = async () => {
  if (!selectedProjectId.value) {
    alert("Please select a project first.");
    return;
  }

  const projectId = selectedProjectId.value!;
  const storyData = newStory.value;

  if (!storyData.name || !storyData.description) {
    alert("Please fill out all the fields.");
    return;
  }

  const storyToAdd = {
    ...storyData,
    id: Date.now(),
    projectId: projectId,
    priority: storyData.priority || 'medium',
    state: storyData.state || 'todo',
    ownerId: loggedUser.value?.id as number,
    creationDate: new Date(),
  };

  await ProjectStoryService.createStory(storyToAdd);

  stories.value = await ProjectStoryService.loadStoriesForCurrentProject();

  newStory.value = {
    id: Date.now(),
    name: '',
    description: '',
    priority: '' as Priority,
    projectId: selectedProjectId.value as number,
    creationDate: new Date(),
    state: '' as StoryState,
    ownerId: loggedUser.value?.id as number,
  };
  toggleModal();
};

//edytowanie story
const updateStory = async () => {

  const projectId = selectedProjectId.value!;
  const storyData = newStory.value;

  if (isEditing.value && editableStory.value && editableStory.value.id) {
    await ProjectStoryService.updateStory({ ...editableStory.value, ...storyData, projectId: projectId });
  }
  else {
    alert("Something went wrong with story update")
  }

  stories.value = await ProjectStoryService.loadStoriesForCurrentProject();
  toggleModal()
}

//wypełnianie formularza w trybie edycji
const editStory = (story: ProjectStory) => {
  newStory.value = { ...story };
  isEditing.value = true;
  toggleModal(newStory.value);
};

//usuwanie historii
const deleteStory = async (storyId: number) => {
  await ProjectStoryService.deleteStory(storyId);
  stories.value = await ProjectStoryService.loadStoriesForCurrentProject();
};

//formatowanie daty 
const formatDate = (date: Date) => {
  if (typeof date === 'string') {
    return format(new Date(date), 'yyyy-MM-dd');
  } else {
    return format(date, 'yyyy-MM-dd');
  }
};
</script>

  