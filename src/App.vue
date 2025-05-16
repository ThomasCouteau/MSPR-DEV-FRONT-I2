<script setup lang="ts">
import { RouterView } from 'vue-router'
import MyNavBar from '@/components/MyNavBar.vue'
</script>

<template>
  <header>
    <MyNavBar />
  </header>

  <RouterView />
</template>
