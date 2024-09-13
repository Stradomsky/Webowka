<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
      <div class="container mx-auto max-w-7xl">
        <h1 class="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-10">Project Tasks</h1>
  
        <SelectCurrentProject />
        <SelectCurrentStory />
  
        <div class="flex justify-center mb-6">
          <button @click="toggleModal"
            class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50">
            ADD NEW TASK
          </button>
        </div>
  
        <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div class="bg-white dark:bg-gray-800 p-8 rounded-lg">
            <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{{ isEditing ? 'Edit Task' : 'Add New Task' }}</h3>
            <form @submit.prevent="isEditing ? updateTask() : addTask()">
              <!-- Task fields -->
              <div class="space-y-4">
                <div>
                  <label for="task-name" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Task Name</label>
                  <input type="text" id="task-name" v-model="newTask.name" required
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm">
                </div>
                <div>
                  <label for="task-description" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
                  <textarea id="task-description" v-model="newTask.description" required
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm"></textarea>
                </div>
                <div>
                  <label for="task-priority" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Priority</label>
                  <select id="task-priority" v-model="newTask.priority" required
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm">
                    <option value="" disabled>Select priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label for="task-status" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Status</label>
                  <select id="task-status" v-model="newTask.status" required
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm">
                    <option value="" disabled>Select status</option>
                    <option value="Todo">Todo</option>
                    <option value="Doing">Doing</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div>
                  <label for="assigned-user" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Assigned User</label>
                  <select id="assigned-user" v-model="newTask.assignedUserId"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm">
                    <option value="" disabled>Select user</option>
                    <option :value="null">None</option>
                    <option v-for="user in filteredUsers" :key="user.id" :value="user.id">
                      {{ user.firstName }} {{ user.lastName }}
                    </option>
                  </select>
                </div>
              </div>
              <!-- Form actions -->
              <div class="mt-6 flex justify-end">
                <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mr-2">
                  {{ isEditing ? 'Save Changes' : 'Add Task' }}
                </button>
                <button type="button" @click="toggleModal"
                  class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
  
        <div v-if="detailedTask" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div class="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-md max-w-md mx-auto">
            <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Task Details</h3>
            <div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Name: {{ detailedTask.name }}</h4>
              <p class="text-gray-600 dark:text-gray-300">Description: {{ detailedTask.description }}</p>
              <p class="text-gray-600 dark:text-gray-300">Priority: {{ detailedTask.priority }}</p>
              <p v-if="detailedTask.assignedUserId" class="text-gray-600 dark:text-gray-300">Assigned to: {{ getUserName(detailedTask.assignedUserId) }}</p>              
              <p v-if="detailedTask.startDate" class="text-gray-600 dark:text-gray-300">Start Date: {{ formatDate(detailedTask.startDate) }}</p>
              <p v-if="detailedTask.endDate" class="text-gray-600 dark:text-gray-300">End Date: {{ formatDate(detailedTask.endDate) }}</p>
              <p class="text-gray-600 dark:text-gray-300">Estimated Hours: {{ detailedTask.estimatedTime }}</p>
            </div>
            <button @click="detailedTask = undefined"
              class="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Close</button>
          </div>
        </div>
        <div class="flex flex-row justify-between space-x-4">
          <div class="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 class="text-center text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">To Do Tasks</h2>
            <ul class="space-y-3">
              <li v-for="task in todoTasks" :key="task.id":class="{
              'bg-green-100 dark:bg-green-700': task.priority === 'Low',
              'bg-yellow-100 dark:bg-yellow-700': task.priority === 'Medium',
              'bg-red-100 dark:bg-red-700': task.priority === 'High'
              }"
                class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ task.name }}</h3>
                  <p class="text-gray-600 dark:text-gray-300">Priority: {{ task.priority }}</p>
                  <p v-if="task.assignedUserId" class="text-gray-600 dark:text-gray-300">Assigned to: {{ getUserName(task.assignedUserId) }}</p>
                </div>
                <div class="flex flex-col items-center justify-between">
                  <div class="flex mb-2">
                    <button @click="editTask(task)"
                      class="text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg focus:outline-none mr-2">EDIT</button>
                    <button @click="deleteTask(task.id)"
                      class="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg focus:outline-none">DELETE</button>
                  </div>
                  <button @click="showDetails(task)"
                    class="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg focus:outline-none">SEE DETAILS</button>
                </div>
              </li>
              <li v-if="todoTasks.length === 0" class="text-center text-gray-500 dark:text-gray-300">No tasks found.</li>
            </ul>
          </div>
  
          <div class="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 class="text-center text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Doing Tasks</h2>
            <ul class="space-y-3">
              <li v-for="task in doingTasks" :key="task.id":class="{
              'bg-green-100 dark:bg-green-700': task.priority === 'Low',
              'bg-yellow-100 dark:bg-yellow-700': task.priority === 'Medium',
              'bg-red-100 dark:bg-red-700': task.priority === 'High'
              }"
                class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ task.name }}</h3>
                  <p class="text-gray-600 dark:text-gray-300">Priority: {{ task.priority }}</p>
                  <p v-if="task.assignedUserId" class="text-gray-600 dark:text-gray-300">Assigned to: {{ getUserName(task.assignedUserId) }}</p>                  
                  <p v-if="task.startDate" class="text-gray-600 dark:text-gray-300">Start Date: {{ formatDate(task.startDate) }}</p>
                  <p class="text-gray-600 dark:text-gray-300">Estimated Hours: {{ task.estimatedTime }}</p>
                </div>
                <div class="flex flex-col items-center justify-between">
                  <div class="flex mb-2">
                    <button @click="editTask(task)"
                      class="text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg focus:outline-none mr-2">EDIT</button>
                    <button @click="deleteTask(task.id)"
                      class="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg focus:outline-none">DELETE</button>
                  </div>
                  <button @click="showDetails(task)"
                    class="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg focus:outline-none">SEE DETAILS</button>
                </div>
              </li>
              <li v-if="doingTasks.length === 0" class="text-center text-gray-500 dark:text-gray-300">No tasks found.</li>
            </ul>
          </div>
  
          <div class="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 class="text-center text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Done Tasks</h2>
            <ul class="space-y-3">
              <li v-for="task in doneTasks" :key="task.id":class="{
              'bg-green-100 dark:bg-green-700': task.priority === 'Low',
              'bg-yellow-100 dark:bg-yellow-700': task.priority === 'Medium',
              'bg-red-100 dark:bg-red-700': task.priority === 'High'
              }"
                class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ task.name }}</h3>
                  <p class="text-gray-600 dark:text-gray-300">Priority: {{ task.priority }}</p>
                  <p v-if="task.assignedUserId" class="text-gray-600 dark:text-gray-300">Assigned to: {{ getUserName(task.assignedUserId) }}</p>                  
                  <p v-if="task.startDate" class="text-gray-600 dark:text-gray-300">Start Date: {{ formatDate(task.startDate) }}</p>
                  <p v-if="task.endDate" class="text-gray-600 dark:text-gray-300">End Date: {{ formatDate(task.endDate) }}</p>
                  <p class="text-gray-600 dark:text-gray-300">Estimated Hours: {{ task.estimatedTime }}</p>
                </div>
                <div class="flex flex-col items-center justify-between">
                  <div class="flex mb-2">
                    <button @click="editTask(task)"
                      class="text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg focus:outline-none mr-2">EDIT</button>
                    <button @click="deleteTask(task.id)"
                      class="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg focus:outline-none">DELETE</button>
                  </div>
                  <button @click="showDetails(task)"
                    class="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg focus:outline-none">SEE DETAILS</button>
                </div>
              </li>
              <li v-if="doneTasks.length === 0" class="text-center text-gray-500 dark:text-gray-300">No tasks found.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { format } from 'date-fns';
import SelectCurrentProject from './SelectCurrentProject.vue';
import SelectCurrentStory from './SelectCurrentStory.vue';
import { Task, TaskPriority, TaskStatus } from '../models/Task';
import { ProjectTaskService } from '../services/projectTask-service';
import { tasks } from '../reactive/refs';
import AuthService from '../services/auth/auth-service';
import { User } from '../models/User/user';

const isModalOpen = ref(false);
const isEditing = ref(false);
const detailedTask = ref<Task>();
const users = ref<User[]>([]);

//ładowanie listy użytkowników
const loadUsers = async () => {
    try {
        const response = await AuthService.getUsers();
        users.value = response;
    } catch (error) {
        console.error("Failed to fetch users", error);
    }
};

//obiekt reprezenutjący nowe zadanie
const newTask = ref<Task>({
    id: Date.now(),
    name: '',
    description: '',
    priority: '' as TaskPriority,
    storyId: 0,
    estimatedTime: 0,
    status: '' as TaskStatus,
    creationDate: new Date(),
    assignedUserId: undefined,
});

//funkcja uruchamiana po zamontowaniu komponentu
onMounted(async () => {
    await loadUsers();
    tasks.value = await ProjectTaskService.getTasksByStory()
});


const todoTasks = computed(() =>
    tasks.value.filter((task) => task.status === "Todo")
);

const doingTasks = computed(() =>
    tasks.value.filter((task) => task.status === "Doing")
);

const doneTasks = computed(() =>
    tasks.value.filter((task) => task.status === "Done")
);

const filteredUsers = computed(() =>
    users.value.filter((user) => user.role === 'Developer' || user.role === 'DevOps')
);

//owietanie, zamykanie modal
const toggleModal = () => {
    isModalOpen.value = !isModalOpen.value;
    if (!isModalOpen.value) {
        resetForm();
    }
};

//wyświeltanie detali zadania
const showDetails = (task: Task) => {
    detailedTask.value = task;
};

//dodawanie nowego zadania
const addTask = async () => {
    if (newTask.value.assignedUserId && newTask.value.status !== 'Done') {
        newTask.value.status = 'Doing'
    }
    await ProjectTaskService.addTask(newTask.value);
    tasks.value = await ProjectTaskService.getTasksByStory();
    toggleModal();
};

//akutalizowanie nowego zadania
const updateTask = async () => {
    if (newTask.value.assignedUserId && newTask.value.status !== 'Done') {
        newTask.value.status = 'Doing'
    }
    await ProjectTaskService.updateTask(newTask.value);
    tasks.value = await ProjectTaskService.getTasksByStory();
    toggleModal();
};

//otwieranie modal w trybie edycji dla wybranego zadania
const editTask = (task: Task) => {
    newTask.value = { ...task };
    isEditing.value = true;
    toggleModal();
};

//usuwanie zadania
const deleteTask = async (taskId: number) => {
    await ProjectTaskService.deleteTask(taskId);
    tasks.value = await ProjectTaskService.getTasksByStory();
};

//resetowanie formularzu
const resetForm = () => {
    newTask.value = {
        id: Date.now(),
        name: '',
        description: '',
        priority: '' as TaskPriority,
        storyId: 0,
        estimatedTime: 0,
        status: '' as TaskStatus,
        creationDate: new Date(),
        assignedUserId: undefined,
    };
    isEditing.value = false;
};

const getUserName = (userId: number) => {
    const user = users.value.find(user => user.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
};

const formatDate = (date: Date) => {
    if (typeof date === 'string') {
        return format(new Date(date), 'yyyy-MM-dd');
    } else {
        return format(date, 'yyyy-MM-dd');
    }
};


</script>