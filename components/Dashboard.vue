<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">{{ company.name }} Dashboard</h1>
      <div class="text-right">
        <div class="text-lg">Balance: <span class="font-bold">${{ formatNumber(company.balance) }}</span></div>
        <div>Reputation: <span class="font-bold">{{ company.reputation.toFixed(1) }}</span></div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card">
        <h2 class="text-lg font-bold mb-2">Fleet Summary</h2>
        <div class="space-y-1">
          <div>Total Vehicles: {{ fleet.length }}</div>
          <div>Available: {{ availableTrucks.length }}</div>
          <div>In Transit: {{ fleet.length - availableTrucks.length }}</div>
        </div>
        <div class="mt-4">
          <button @click="navigateTo('/fleet')" class="btn btn-primary">Manage Fleet</button>
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-bold mb-2">Job Overview</h2>
        <div class="space-y-1">
          <div>Available Jobs: {{ availableJobs.length }}</div>
          <div>Active Jobs: {{ activeJobs.length }}</div>
          <div>Urgent Jobs: {{ availableJobs.filter(job => job.urgent).length }}</div>
        </div>
        <div class="mt-4">
          <button @click="navigateTo('/jobs')" class="btn btn-primary">Job Market</button>
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-bold mb-2">Game Controls</h2>
        <div class="space-y-1">
          <div>Current Date: {{ formatDate(gameDate) }}</div>
          <div>Game Speed: {{ gamePaused ? 'Paused' : 'Running' }}</div>
        </div>
        <div class="mt-4 flex space-x-2">
          <button @click="togglePause" class="btn" :class="gamePaused ? 'btn-success' : 'btn-secondary'">
            {{ gamePaused ? 'Start' : 'Pause' }}
          </button>
          <button @click="advanceOneDay" class="btn btn-primary">Advance 1 Day</button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="card">
        <h2 class="text-lg font-bold mb-2">Active Jobs</h2>
        <div v-if="activeJobs.length === 0" class="text-gray-500">
          No active jobs. Visit the job market to find work!
        </div>
        <div v-else class="space-y-3">
          <div v-for="job in activeJobs" :key="job.id" class="border-b pb-2 last:border-0">
            <div class="font-medium">{{ job.title }}</div>
            <div class="text-sm text-gray-600">
              {{ job.status === 'pending' ? 'Needs truck assignment' : `In transit - ${formatDate(job.estimatedCompletion)}` }}
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-bold mb-2">Maintenance Alerts</h2>
        <div v-if="maintenanceAlerts.length === 0" class="text-gray-500">
          No maintenance alerts! Your fleet is in good condition.
        </div>
        <div v-else class="space-y-3">
          <div v-for="alert in maintenanceAlerts" :key="alert.truckId" class="border-b pb-2 last:border-0">
            <div class="font-medium">{{ alert.truckName }}</div>
            <div class="text-sm" :class="getAlertColorClass(alert.type)">
              {{ alert.message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from '~/store/game.js';
import { useRouter } from 'vue-router';

const store = useGameStore();
const router = useRouter();

const company = computed(() => store.company)
const fleet = computed(() => store.fleet)
const availableTrucks = computed(() => store.availableTrucks)
const availableJobs = computed(() => store.availableJobs)
const activeJobs = computed(() => store.activeJobs)
const gameDate = computed(() => store.gameDate)
const gamePaused = computed(() => store.gamePaused)

const maintenanceAlerts = computed(() => {
  const alerts = [];
  fleet.value.forEach(truck => {
    if (truck.condition < 30) {
      alerts.push({
        truckId: truck.id,
        truckName: truck.name,
        type: 'repair',
        message: `Critical! Condition at ${truck.condition}% - Repair immediately!`,
      });
    } else if (truck.condition < 60) {
      alerts.push({
        truckId: truck.id,
        truckName: truck.name,
        type: 'repair-warning',
        message: `Maintenance needed - Condition at ${truck.condition}%`,
      });
    }

    if (truck.fuel < 20) {
      alerts.push({
        truckId: truck.id,
        truckName: truck.name,
        type: 'fuel',
        message: `Low fuel! Only ${truck.fuel}% remaining`,
      });
    }
  });
  return alerts;
})

const formatNumber = (num) => {
  return num.toLocaleString('en-US');
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const getAlertColorClass = (type) => {
  switch (type) {
    case 'repair':
      return 'text-red-600';
    case 'repair-warning':
      return 'text-amber-600';
    case 'fuel':
      return 'text-amber-600';
    default:
      return 'text-gray-600';
  }
}

const togglePause = () => {
  store.gamePaused = !store.gamePaused;
  // Start/stop a timer here
}

const advanceOneDay = () => {
  store.advanceDay();
}

const navigateTo = (path) => {
  router.push(path);
}
</script>