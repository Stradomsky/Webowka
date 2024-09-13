<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { loggedUser } from './reactive/refs';

const route = useRoute();
const router = useRouter();
const user = computed(() => loggedUser.value);
const isDarkMode = ref(localStorage.theme === 'dark');

const logout = () => {
  router.push('/login');
};

//sprawdza czy obecnie aktywna trasa odpowiada przekazanej ścieżce
const isActive = (path: string) => {
  return route.path === path;
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};
//hook onMounted do inicjalizacji stanu trybu ciemnego po załadowaniu komponentu
onMounted(() => {
  if (localStorage.theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
});
</script>

<template>
  <div :class="{'dark': isDarkMode}" class="flex flex-col min-h-screen bg-green-100 dark:bg-green-900">
    <!-- Navbar -->
    <nav class="bg-green-800 dark:bg-green-700">
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
          <!-- Logo and navigation -->
          <div class="flex-1 flex items-center justify-start sm:items-stretch sm:justify-start">
            <div class="flex-shrink-0 flex items-center">
              <img class="hidden lg:block h-8 w-auto"
                src="https://img.icons8.com/?size=100&id=HoLN3Co8UYQh&format=png&color=000000" alt="Workflow">
            </div>
            <div class="hidden sm:block sm:ml-6">
              <div class="flex space-x-4">
                <router-link
                  to="/"
                  :class="{'bg-green-900 text-white': isActive('/'), 'text-green-300 hover:bg-green-700 dark:hover:bg-green-800 hover:text-white': !isActive('/')}"
                  class="px-3 py-2 rounded-md text-sm font-medium"
                  aria-current="page"
                >Project Manager</router-link>
                <router-link
                  to="/stories"
                  :class="{'bg-green-900 text-white': isActive('/stories'), 'text-green-300 hover:bg-green-700 dark:hover:bg-green-800 hover:text-white': !isActive('/stories')}"
                  class="px-3 py-2 rounded-md text-sm font-medium"
                >Project Stories</router-link>
                <router-link
                  to="/tasks"
                  :class="{'bg-green-900 text-white': isActive('/tasks'), 'text-green-300 hover:bg-green-700 dark:hover:bg-green-800 hover:text-white': !isActive('/tasks')}"
                  class="px-3 py-2 rounded-md text-sm font-medium"
                >Project Tasks</router-link>
              </div>
            </div>
          </div>

          <div class="hidden sm:block">
            <div class="flex items-center">
              <template v-if="!user">
                <router-link to="/login"
                  class="text-green-300 hover:bg-green-700 dark:hover:bg-green-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</router-link>
                <router-link to="/register"
                  class="text-green-300 hover:bg-green-700 dark:hover:bg-green-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Register</router-link>
              </template>
              <template v-if="user">
                <img src="https://img.icons8.com/?size=100&id=83151&format=png&color=F0F0FF" alt="User Avatar" class="h-8 w-8 rounded-full">
                <span class="text-green-300 px-3 py-2 rounded-md text-sm font-medium">{{ user.name }}</span>
                <button @click="logout" class="text-green-300 hover:bg-green-700 dark:hover:bg-green-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Logout</button>
              </template>
              <button @click="toggleDarkMode" class="text-green-300 hover:bg-gray-700 dark:hover:bg-green-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium ml-4">
                Dark Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <main class="flex-grow">
      <div class="py-6 lg:px-8 flex items-start">
        <div class="flex-1">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>
