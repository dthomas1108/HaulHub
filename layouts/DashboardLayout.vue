<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-brand-dark text-white">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-2">
            <router-link to="/" class="text-2xl font-bold">HaulHub</router-link>
            <span class="text-xs bg-brand-blue px-2 py-0.5 rounded">BETA</span>
          </div>

          <div class="text-right text-sm">
            <div>Game Date: {{ formatDate(gameDate) }}</div>
            <div>Company Value: ${{ formatNumber(companyNetworth) }}</div>
          </div>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-6 flex">
      <aside class="w-56 mr-6 flex-shrink-0">
        <nav class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-4 bg-gray-50 border-b">
            <div class="font-bold text-lg truncate">{{ company.name }}</div>
            <div class="text-xs text-gray-600">Transport Management</div>
          </div>

          <div class="py-2">
            <div v-for="(item, index) in navItems" :key="index">
              <router-link :to="item.route" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition" :class="{'bg-gray-100': isActiveRoute(item.route)}">
                <span class="mr-3 text-gray-500">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </router-link>
            </div>
          </div>
        </nav>

        <div class="mt-4 bg-white shadow rounded-lg p-4">
          <h3 class="font-bold text-gray-700 mb-2">Quick Stats</h3>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span>Fleet Size:</span>
              <span>{{ fleet.length }} trucks</span>
            </div>
            <div class="flex justify-between">
              <span>Active Jobs:</span>
              <span>{{ activeJobs.length }}</span>
            </div>
            <div class="flex justify-between">
              <span>Job Offers:</span>
              <span>{{ availableJobs.length }}</span>
            </div>
            <div class="flex justify-between">
              <span>Reputation:</span>
              <span>{{ company.reputation.toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </aside>

      <main class="flex-grow">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '~/store/game'

const route = useRoute()
const store = useGameStore()

const company = computed(() => store.company)
const fleet = computed(() => store.fleet)
const activeJobs = computed(() => store.activeJobs)
const availableJobs = computed(() => store.availableJobs)
const gameDate = computed(() => store.gameDate)
const companyNetworth = computed(() => store.companyNetworth)

const navItems = [
  { label: 'Dashboard', route: '/', icon: '📊' },
  { label: 'Fleet Management', route: '/fleet', icon: '🚚' },
  { label: 'Job Market', route: '/jobs', icon: '📋' },
  { label: 'Truck Dealership', route: '/market', icon: '🏪' },
  // Future modules
  // { label: 'Finances', route: '/finances', icon: '💰' },
  // { label: 'Drivers', route: '/drivers', icon: '👤' },
  // { label: 'Depots', route: '/depots', icon: '🏢' },
]

const isActiveRoute = (path) => {
  return route.path === path;
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const formatNumber = (num) => {
  return num.toLocaleString('en-US');
}
</script>