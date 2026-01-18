<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useWindowManager } from '../../stores/windowManager';
import { useDevice } from '../../composables/useDevice';

const wm = useWindowManager();
const { isMobile, isTablet } = useDevice();

// Clock
const time = ref('');
const date = ref('');

function updateTime() {
  const now = new Date();
  time.value = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  date.value = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

let timer: number;
onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});
onUnmounted(() => clearInterval(timer));

// Active App Name and Icon
const activeAppTitle = computed(() => {
    if (wm.activeWindowId) {
        const win = wm.windows.find(w => w.id === wm.activeWindowId);
        return win ? win.title : 'Finder';
    }
    return 'Finder';
});

const activeAppIcon = computed(() => {
    if (wm.activeWindowId) {
        const win = wm.windows.find(w => w.id === wm.activeWindowId);
        return win ? win.icon : '📁';
    }
    return '📁';
});
</script>

<template>
  <div class="menubar" :class="{ mobile: isMobile, tablet: isTablet }">
    <div class="left">
      <div class="apple-wrapper">
         <span class="apple-logo"></span>
      </div>
      <div class="app-info" v-if="!isMobile || wm.activeWindowId">
        <img v-if="activeAppIcon" :src="activeAppIcon" alt="app icon" class="app-icon" />
        <span class="app-name">{{ activeAppTitle }}</span>
      </div>
    </div>
    <div class="right">
      <span class="menu-item icon" v-if="!isMobile">🔋 100%</span>
      <span class="menu-item icon" v-if="!isMobile">wifi</span>
      <span class="menu-item" v-if="!isMobile">{{ date }}</span>
      <span class="menu-item">{{ time }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.menubar {
  height: 28px;
  background: rgba(255, 255, 255, 0.3); /* Transparent blur like macOS */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  font-size: 13px;
  font-weight: 500;
  color: #000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10000;
  user-select: none;
  
  &.mobile {
    height: 44px; // iOS standard status bar height
    padding: 0 16px;
    font-size: 15px;
    
    .left, .right {
      gap: 12px;
    }
    
    .app-name {
      font-size: 16px;
    }
    
    .menu-item {
      font-size: 14px;
    }
  }
  
  &.tablet {
    height: 32px;
    font-size: 14px;
  }
}

.left, .right {
  display: flex;
  gap: 16px;
  align-items: center;
}

.apple-wrapper {
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: rgba(255,255,255,0.2);
    border-radius: 4px;
  }
}

.apple-logo {
  font-size: 18px;
  /* Ensure it looks good */
  transform: translateY(-1px); 
}

.app-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.app-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  display: block;
}

.app-name {
  font-weight: 700;
  font-size: 14px;
}

.menu-item {
  cursor: default;
  opacity: 0.9;
  font-weight: 500;
  
  &:hover {
    opacity: 1;
  }
}

@media (prefers-color-scheme: dark) {
  .menubar {
    color: #fff;
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>
