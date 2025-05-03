<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useGameStore } from '~/store/game'

const store = useGameStore()

onMounted(() => {
  store.initialiseGame();

  // Set up game timer - not functional in this demo
  /*
  setInterval(() => {
    if (!store.gamePaused) {
      store.advanceDay();
    }
  }, 10000); // Advance one day every 10 seconds
  */
})
</script>