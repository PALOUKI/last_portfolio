<script setup lang="ts">
import { useWindowManager } from '../../stores/windowManager';

const props = defineProps<{
  window: any
}>();

const wm = useWindowManager();

function close() {
  wm.closeWindow(props.window.id);
}
</script>

<template>
  <div class="mobile-app" :class="{ 'active': wm.activeWindowId === window.id }">
    <div class="mobile-header">
      <button class="back-btn" @click="close">
        <span class="back-icon">←</span>
      </button>
      <div class="mobile-title">
        <img v-if="window.icon" :src="window.icon" alt="icon" class="title-icon" />
        <span>{{ window.title }}</span>
      </div>
      <div class="spacer"></div>
    </div>
    <div class="mobile-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mobile-app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transform: translateX(100%) scale(0.95);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), 
              opacity 0.3s ease-out;
  
  &.active {
    transform: translateX(0) scale(1);
    opacity: 1;
    animation: slideInBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

@keyframes slideInBounce {
  0% {
    transform: translateX(100%) scale(0.9);
    opacity: 0;
  }
  60% {
    transform: translateX(-10px) scale(1.02);
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

.mobile-header {
  height: 56px;
  background: #f6f6f6;
  border-bottom: 1px solid #d1d1d1;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  flex-shrink: 0;
}

.back-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 24px;
  color: #007aff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, opacity 0.2s;
  
  &:active {
    opacity: 0.5;
    transform: scale(0.9);
  }
  
  &:hover {
    transform: scale(1.1);
  }
}

.back-icon {
  display: block;
  line-height: 1;
}

.mobile-title {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  font-weight: 600;
  font-size: 17px;
  color: #1d1d1f;
}

.title-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.spacer {
  width: 40px; /* Balance the back button */
}

.mobile-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
