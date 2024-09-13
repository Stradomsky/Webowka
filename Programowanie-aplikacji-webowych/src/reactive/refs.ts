import { ref } from 'vue';
import { Task } from '../models/Task';
import { LoggedUser } from '../models/User/loggedUser';

export const selectedProjectId = ref<number | null>(null);
export const selectedStoryId = ref<number | null>(null);
export const tasks = ref<Task[]>([]);
export const loggedUser = ref<LoggedUser | null>(null);