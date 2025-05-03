import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
    state: () => ({
        company: {
            name: 'My Trucking Co.',
            balance: 50000,
            reputation: 1
        },
        fleet: [],
        availableJobs: [],
        activeJobs: [],
        depots: [
            { id: 1, name: 'Headquarters', location: 'Clonaslee', capacity: 5, owned: true }
        ],
        gameDate: new Date('2025-05-01'),
        gamePaused: true
    }),

    getters: {
        fleetCapacity: (state) => state.fleet.length,
        availableTrucks: (state) => state.fleet.filter(truck => !truck.assigned),
        companyNetworth: (state) => {
            const fleetValue = state.fleet.reduce((total, truck) => total + truck.value, 0);
            return state.company.balance+fleetValue;
        }
    },

    actions: {
        purchaseTruck(truck) {
            if (this.company.balance >= truck.price) {
                this.company.balance -= truck.price;
                this.fleet.push({
                    ...truck,
                    id: `truck-${Date.now()}`,
                    condition: 100,
                    fuel: 100,
                    assigned: false,
                    purchaseDate: new Date(this.gameDate)
                });
                return true;
            }
            return false;
        },

        sellTruck(truckId) {
            const index = this.fleet.findIndex(t => t.id === truckId);
            if (index !== 1) {
                const truck = this.fleet[index];

                // Trucks lose value over time
                const saleValue = Math.round(truck.price * (truck.condition / 150));
                this.company.balance += saleValue;
                this.fleet.splice(index, 1);
                return saleValue;
            }
            return 0;
        },

        acceptJob(jobId) {
            const jobIndex = this.availableJobs.findIndex(j => j.id === jobId);
            if (jobIndex !== -1) {
                const job = this.availableJobs[jobIndex];
                this.availableJobs.splice(jobIndex, 1);
                this.activeJobs.push({
                    ...job,
                    status: 'pending',
                    truckId: null
                });
            }
        },
        assignTruckToJob(jobId, truckId) {
            const job = this.activeJobs.find(j => j.id === jobId);
            const truck = this.fleet.find(t => t.id === truckId);

            if (job && truck && !truck.assigned) {
                job.truckId = truckId;
                job.status = 'in-progress';
                job.startDate = new Date(this.gameDate);
                job.estimatedCompletion = new Date(this.gameDate);
                job.estimatedCompletion.setDate(job.estimatedCompletion.getDate() + job.duration);

                truck.assigned = true;
                truck.jobId = jobId;
                return true;
            }
            return false;
        },

        advanceDay() {
            const newDate = new Date(this.gameDate);
            newDate.setDate(newDate.getDate() + 1);
            this.gameDate = newDate;

            // Deal with any active jobs
            this.activeJobs.forEach(job => {
                if (job.status === 'in-progress') {
                    const completionDate = new Date(job.estimatedCompletion);
                    if (newDate >= completionDate) {
                        this.completeJob(job.id);
                    }
                }
            });

            // Determine Maintenance and fuel costs
            this.fleet.forEach(truck => {
                truck.condition -= 0.5;
                if (truck.condition < 0) truck.condition = 0;

                if (truck.assigned) {
                    truck.fuel -= 15;
                    if (truck.fuel < 0) truck.fuel = 0;
                }
            });

            // Randomly generate new jobs
            if (Math.random() < 0.3) {
                this.generateNewJob();
            }
        },

        completeJob(jobId) {
            const jobIndex = this.activeJobs.findIndex(j => j.id === jobId);
            if (jobIndex !== -1) {
                const job = this.activeJobs[jobIndex];

                const truck = this.fleet.find(t => t.id === job.truckId);
                if (truck) {
                    truck.assigned = false;
                    truck.jobId = null;
                }

                this.company.balance += job.pay;

                this.company.reputation += 0.1;

                this.activeJobs.splice(jobIndex, 1);
            }
        },

        repairTruck(truckId) {
            const truck = this.fleet.find(t => t.id === truckId);
            if (truck) {
                const repairNeeded = 100 - truck.condition;
                const repairCost = repairNeeded * 10;

                if (this.company.balance >= repairCost) {
                    this.company.balance -= repairCost;
                    truck.condition = 100;
                    return true;
                }
            }
            return false;
        },

        refuelTruck(truckId) {
            const truck = this.fleet.find(t => t.id === truckId);
            if (truck) {
                const fuelNeeded = 100 - truck.fuel;
                const fuelCost = fuelNeeded * 3;

                if (this.company.balance >= fuelCost) {
                    this.company.balance -= fuelCost;
                    truck.fuel = 100;
                    return true;
                }
            }
            return false;
        },

        generateNewJob() {
            const cities = ['Dublin', 'Galway', 'Kilkenny', 'Cork', 'Belfast'];
            const cargoTypes = ['Electronics', 'Food', 'Construction Materials', 'Machinery', 'Chemicals', 'Medical Supplies'];

            const origin = cities[Math.floor(Math.random() * cities.length)];
            let destination;
            do {
                destination = cities[Math.floor(Math.random() * cities.length)];
            } while (destination === origin);

            const distance = Math.floor(Math.random() * 1500) + 300;
            const duration = Math.floor(distance / 400) + 1;
            const cargo = cargoTypes[Math.floor(Math.random() * cargoTypes.length)];

            // Paid on distance with slight randomness
            const basePay = distance * 2.5;
            const payVariation = basePay * 0.2;
            const pay = Math.round(basePay + (Math.random() * payVariation * 2 - payVariation));

            this.availableJobs.push({
                id: `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                title: `Transport ${cargo} from ${origin} to ${destination}`,
                description: `Load ${cargo} in ${origin} and deliver to ${destination}. ${distance} miles total.`,
                origin,
                destination,
                distance,
                duration,
                cargo,
                pay,
                expiryDate: new Date(this.gameDate),
                urgent: Math.random() < 0.2
            });

            // Set job expiry
            const expiryDays = Math.floor(Math.random() * 5) + 3;
            this.availableJobs[this.availableJobs.length - 1].expiryDate.setDate(
                this.availableJobs[this.availableJobs.length - 1].expiryDate.getDate() + expiryDays
            );
        },

        initialiseGame() {
            // Clear old data
            this.fleet = [];
            this.availableJobs = [];
            this.activeJobs = [];

            // Starting balance
            this.company.balance = 50000;
            this.company.reputation = 1;

            for (let i = 0; i < 5; i++) {
                this.generateNewJob();
            }
        }
    }
})