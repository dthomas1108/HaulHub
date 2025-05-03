<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Truck Dealership</h1>
      <div class="text-right">
        <div class="text-lg">Balance: <span class="font-bold">${{ formatNumber(company.balance) }}</span></div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="truck in availableTrucks" :key="truck.id" class="card hover:shadow-md transition">
        <div class="flex justify-between">
          <h3 class="text-lg font-bold">{{ truck.name }}</h3>
          <span class="text-brand-blue font-bold">${{ formatNumber(truck.price) }}</span>
        </div>

        <div class="my-3">
          <img :src="truck.image || '/img/default-truck.png'" alt="Truck" class="w-full h-48 object-cover rounded bg-gray-100">
        </div>

        <div class="space-y-2 text-sm">
          <div class="grid grid-cols-2 gap-x-2">
            <div>Type: <span class="font-medium">{{ truck.type }}</span></div>
            <div>Capacity: <span class="font-medium">{{ truck.capacity }} tons</span></div>
          </div>
          <div class="grid grid-cols-2 gap-x-2">
            <div>Fuel Eff: <span class="font-medium">{{ truck.fuelEfficiency }} mpg</span></div>
            <div>Speed: <span class="font-medium">{{ truck.speed }} mph</span></div>
          </div>
          <div>{{ truck.description }}</div>
        </div>

        <div class="mt-4">
          <button
              @click="purchaseTruck(truck)"
              class="btn btn-primary w-full"
              :disabled="company.balance < truck.price"
              :class="{'opacity-50 cursor-not-allowed': company.balance < truck.price}"
          >
            {{ company.balance >= truck.price ? 'Purchase' : 'Insufficient Funds' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '~/store/game'

const store = useGameStore()
const company = computed(() => store.company)

// Mock data for available trucks
const availableTrucks = ref([
  {
    id: 'model-1',
    name: 'Road Runner 350',
    type: 'Semi-Truck',
    price: 45000,
    capacity: 20,
    fuelEfficiency: 6.5,
    speed: 65,
    description: 'Reliable entry-level semi-truck suitable for most cargo types.',
    image: null
  },
  {
    id: 'model-2',
    name: 'Maverick 500',
    type: 'Semi-Truck',
    price: 75000,
    capacity: 25,
    fuelEfficiency: 6.0,
    speed: 70,
    description: 'Mid-range truck with good balance between capacity and efficiency.',
    image: null
  },
  {
    id: 'model-3',
    name: 'Titan 750',
    type: 'Heavy Hauler',
    price: 120000,
    capacity: 35,
    fuelEfficiency: 5.0,
    speed: 60,
    description: 'Heavy-duty truck designed for maximum load capacity.',
    image: null
  },
  {
    id: 'model-4',
    name: 'EcoHaul 300',
    type: 'Hybrid Semi',
    price: 95000,
    capacity: 18,
    fuelEfficiency: 9.5,
    speed: 65,
    description: 'Hybrid truck with excellent fuel efficiency for lower operating costs.',
    image: null
  },
  {
    id: 'model-5',
    name: 'Sprinter 200',
    type: 'Light Truck',
    price: 35000,
    capacity: 10,
    fuelEfficiency: 8.0,
    speed: 75,
    description: 'Fast and nimble truck ideal for express deliveries.',
    image: null
  }
])

const formatNumber = (num) => {
  return num.toLocaleString('en-US');
}

const purchaseTruck = (truck) => {
  if (store.purchaseTruck(truck)) {
    // Show success notification
    alert(`Successfully purchased ${truck.name}!`);
  } else {
    // Show error
    alert('Failed to purchase truck. Check your balance.');
  }
}
</script>