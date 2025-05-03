<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Fleet Management</h1>
      <div class="text-right">
        <div class="text-lg">Balance: <span class="font-bold">${{ formatNumber(company.balance) }}</span></div>
      </div>
    </div>

    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Your Fleet</h2>
        <div>
          <button @click="navigateTo('/market')" class="btn btn-primary">Purchase New Truck</button>
        </div>
      </div>

      <div v-if="fleet.length === 0" class="text-center py-8 text-gray-500">
        <div class="text-lg mb-2">Your fleet is empty!</div>
        <div>Visit the truck market to purchase your first vehicle.</div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="truck in fleet" :key="truck.id" class="border rounded-lg overflow-hidden">
          <div class="bg-gray-50 p-3">
            <div class="flex justify-between items-center">
              <h3 class="font-bold">{{ truck.name }}</h3>
              <span :class="getStatusBadgeClass(truck)">{{ truck.assigned ? 'On Job' : 'Available' }}</span>
            </div>
          </div>

          <div class="p-4">
            <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
              <div>Type: <span class="font-medium">{{ truck.type }}</span></div>
              <div>Purchase Date: <span class="font-medium">{{ formatDate(truck.purchaseDate) }}</span></div>
              <div>Value: <span class="font-medium">${{ formatNumber(calculateValue(truck)) }}</span></div>
              <div>Capacity: <span class="font-medium">{{ truck.capacity }} tons</span></div>
            </div>

            <div class="space-y-2 mb-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Condition:</span>
                  <span :class="getConditionTextClass(truck.condition)">{{ truck.condition }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div :class="getConditionBarClass(truck.condition)" :style="`width: ${truck.condition}%`"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Fuel:</span>
                  <span :class="getFuelTextClass(truck.fuel)">{{ truck.fuel }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div :class="getFuelBarClass(truck.fuel)" :style="`width: ${truck.fuel}%`"></div>
                </div>
              </div>
            </div>

            <div class="flex space-x-2">
              <button
                  @click="repairTruck(truck.id)"
                  class="btn btn-secondary flex-1"
                  :disabled="truck.condition >= 100 || truck.assigned"
                  :class="{'opacity-50 cursor-not-allowed': truck.condition >= 100 || truck.assigned}"
              >
                Repair
              </button>
              <button
                  @click="refuelTruck(truck.id)"
                  class="btn btn-secondary flex-1"
                  :disabled="truck.fuel >= 100 || truck.assigned"
                  :class="{'opacity-50 cursor-not-allowed': truck.fuel >= 100 || truck.assigned}"
              >
                Refuel
              </button>
              <button
                  @click="sellTruck(truck.id)"
                  class="btn btn-danger flex-1"
                  :disabled="truck.assigned"
                  :class="{'opacity-50 cursor-not-allowed': truck.assigned}"
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '~/store/game'
import { useRouter } from 'vue-router'

const store = useGameStore()
const router = useRouter()

const company = computed(() => store.company)
const fleet = computed(() => store.fleet)

const formatNumber = (num) => {
  return num.toLocaleString('en-US');
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const getStatusBadgeClass = (truck) => {
  if (truck.assigned) {
    return 'px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded';
  } else {
    return 'px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded';
  }
}

const getConditionTextClass = (condition) => {
  if (condition < 30) return 'font-medium text-red-600';
  if (condition < 60) return 'font-medium text-amber-600';
  return 'font-medium text-green-600';
}

const getConditionBarClass = (condition) => {
  if (condition < 30) return 'bg-red-600 h-2 rounded-full';
  if (condition < 60) return 'bg-amber-500 h-2 rounded-full';
  return 'bg-green-500 h-2 rounded-full';
}

const getFuelTextClass = (fuel) => {
  if (fuel < 20) return 'font-medium text-red-600';
  if (fuel < 50) return 'font-medium text-amber-600';
  return 'font-medium text-green-600';
}

const getFuelBarClass = (fuel) => {
  if (fuel < 20) return 'bg-red-600 h-2 rounded-full';
  if (fuel < 50) return 'bg-amber-500 h-2 rounded-full';
  return 'bg-green-500 h-2 rounded-full';
}

const calculateValue = (truck) => {
  // Trucks lose value over time and based on condition
  return Math.round(truck.price * (truck.condition / 150));
}

const repairTruck = (truckId) => {
  if (store.repairTruck(truckId)) {
    alert(`Successfully repaired truck!`);
  } else {
    alert('Insufficient funds for repairs.');
  }
}

const refuelTruck = (truckId) => {
  if (store.refuelTruck(truckId)) {
    alert(`Successfully refueled truck!`);
  } else {
    alert('Insufficient funds for refueling.');
  }
}

const sellTruck = (truckId) => {
  if (confirm('Are you sure you want to sell this truck?')) {
    const amount = store.sellTruck(truckId);
    if (amount > 0) {
      alert(`Truck sold for ${formatNumber(amount)}.`);
    }
  }
}

const navigateTo = (path) => {
  router.push(path);
}
</script>