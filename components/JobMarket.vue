<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Job Market</h1>
      <div class="text-right">
        <div class="text-lg">Balance: <span class="font-bold">${{ formatNumber(company.balance) }}</span></div>
      </div>
    </div>

    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Available Jobs</h2>
        <span class="text-sm text-gray-500">{{ availableJobs.length }} jobs found</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Details</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="job in availableJobs" :key="job.id" :class="{'bg-amber-50': job.urgent}">
            <td class="px-6 py-4">
              <div class="flex items-start">
                <span v-if="job.urgent" class="flex-shrink-0 mr-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded">URGENT</span>
                <div>
                  <div class="font-medium text-gray-900">{{ job.title }}</div>
                  <div class="text-sm text-gray-500">{{ job.description }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ job.distance }} miles
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ job.duration }} day{{ job.duration > 1 ? 's' : '' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              ${{ formatNumber(job.pay) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(job.expiryDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="acceptJob(job.id)" class="btn btn-primary btn-sm">Accept</button>
            </td>
          </tr>
          <tr v-if="availableJobs.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
              No jobs available at this time. Check back later!
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Your Active Jobs</h2>
        <span class="text-sm text-gray-500">{{ activeJobs.length }} active jobs</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Details</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Truck</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="job in activeJobs" :key="job.id">
            <td class="px-6 py-4">
              <div class="font-medium text-gray-900">{{ job.title }}</div>
              <div class="text-sm text-gray-500">{{ job.description }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(job.status)">
                  {{ getStatusText(job.status) }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ job.truckId ? getTruckName(job.truckId) : 'Not assigned' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              ${{ formatNumber(job.pay) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ job.estimatedCompletion ? formatDate(job.estimatedCompletion) : 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                  v-if="job.status === 'pending'"
                  @click="openAssignTruckModal(job.id)"
                  class="btn btn-primary btn-sm"
              >
                Assign Truck
              </button>
              <span v-else-if="job.status === 'in-progress'" class="text-gray-500">In Transit</span>
            </td>
          </tr>
          <tr v-if="activeJobs.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
              You have no active jobs. Accept jobs from the job market!
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for assigning trucks (simplified) -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 class="text-lg font-bold mb-4">Assign Truck to Job</h3>

        <div v-if="availableTrucks.length === 0" class="text-center text-gray-500 my-4">
          No available trucks! Make sure you have unassigned trucks in your fleet.
        </div>

        <div v-else class="space-y-4">
          <div v-for="truck in availableTrucks" :key="truck.id"
               class="border p-3 rounded-md cursor-pointer hover:bg-gray-50"
               @click="assignTruck(truck.id)"
          >
            <div class="font-medium">{{ truck.name }}</div>
            <div class="grid grid-cols-2 text-sm">
              <div>Condition: {{ truck.condition }}%</div>
              <div>Fuel: {{ truck.fuel }}%</div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-2">
          <button @click="closeModal" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '~/store/game'

const store = useGameStore()
const company = computed(() => store.company)
const availableJobs = computed(() => store.availableJobs)
const activeJobs = computed(() => store.activeJobs)
const fleet = computed(() => store.fleet)
const availableTrucks = computed(() => store.availableTrucks)

const showAssignModal = ref(false)
const selectedJobId = ref(null)

const formatNumber = (num) => {
  return num.toLocaleString('en-US');
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded';
    case 'in-progress':
      return 'px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded';
    case 'completed':
      return 'px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded';
    default:
      return 'px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded';
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'Needs Assignment';
    case 'in-progress':
      return 'In Transit';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
}

const getTruckName = (truckId) => {
  const truck = fleet.value.find(t => t.id === truckId);
  return truck ? truck.name : 'Unknown';
}

const acceptJob = (jobId) => {
  store.acceptJob(jobId);
}

const openAssignTruckModal = (jobId) => {
  selectedJobId.value = jobId;
  showAssignModal.value = true;
}

const closeModal = () => {
  showAssignModal.value = false;
  selectedJobId.value = null;
}

const assignTruck = (truckId) => {
  if (selectedJobId.value) {
    if (store.assignTruckToJob(selectedJobId.value, truckId)) {
      // Success
      closeModal();
    } else {
      // Handle error
      alert('Failed to assign truck. Please try again.');
    }
  }
}
</script>