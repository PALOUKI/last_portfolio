<script setup lang="ts">
import { ref, onMounted } from 'vue';

const loading = ref(true);
const progress = ref(0);

const emit = defineEmits(['finished']);

onMounted(() => {
  const interval = setInterval(() => {
    progress.value += 1;
    if (progress.value >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loading.value = false;
        emit('finished');
      }, 500);
    }
  }, 30); // 3 seconds approx
});
</script>

<template>
  <div class="boot-screen" v-if="loading">
    <div class="logo"></div>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.boot-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  color: white;
}

.logo {
  font-size: 80px;
  margin-bottom: 40px;
}

.progress-bar {
  width: 200px;
  height: 6px;
  background: #333;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #fff;
  transition: width 0.1s linear;
}
</style>
