<script setup lang="ts">
import { ref } from 'vue';
import Desktop from './components/OS/Desktop.vue';
import BootLoader from './components/OS/BootLoader.vue';

const booted = ref(false);
</script>

<template>
  <BootLoader v-if="!booted" @finished="booted = true" />
  <Desktop v-else />
</template>

<style>
/* Global resets handled in main.scss import in main.ts */
</style>
