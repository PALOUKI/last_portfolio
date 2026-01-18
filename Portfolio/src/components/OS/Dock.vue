<script setup lang="ts">
import { useWindowManager } from '../../stores/windowManager';
import { useDevice } from '../../composables/useDevice';

const wm = useWindowManager();
const { isMobile, isTablet } = useDevice();

// Hardcoded apps for now, eventually move to a config
const apps = [
  { id: 'finder', title: 'Finder', icon: '/assets/finder_icon_1768077375190.png' },
  { id: 'safari', title: 'Safari', icon: '/assets/safari_icon_1768077394907.png' },
  { id: 'terminal', title: 'Terminal', icon: '/assets/terminal_icon_1768077410721.png' },
  { id: 'preview', title: 'Preview', icon: '/assets/preview_icon_1768077425500.png' },
  { id: 'mail', title: 'Mail', icon: '/assets/mail_icon_1768077437949.png' }
];

// Special action button
const desktopAction = {
  id: 'desktop',
  title: 'Show Desktop',
  icon: '/assets/vscode_icon_1768077452433.png'
};

function launch(app: any) {
  // Register with app.id as the component name to match Desktop.vue's componentMap
  wm.registerWindow(app.id, app.title, app.id, app.icon);
  
  // If launching Preview, open with myPicture.jpg by default
  if (app.id === 'preview') {
    wm.openWindow(app.id, { src: '/assets/myPicture.jpg', type: 'image' });
  } else {
    wm.openWindow(app.id);
  }
}

function showDesktop() {
  // Close all open windows
  wm.windows.forEach(window => {
    if (window.isOpen) {
      wm.closeWindow(window.id);
    }
  });
}

const isOpen = (id: string) => wm.windows.find(w => w.id === id)?.isOpen;
</script>

<template>
  <div class="dock-container" :class="{ mobile: isMobile, tablet: isTablet }">
    <div class="dock">
      <div 
        v-for="app in apps" 
        :key="app.id" 
        class="dock-item"
        @click="launch(app)"
      >
        <div class="icon" :data-title="app.title">
            <img :src="app.icon" :alt="app.title" draggable="false" />
        </div>
        <div class="dot" v-if="isOpen(app.id)"></div>
      </div>
      
      <!-- Separator -->
      <div class="dock-separator"></div>
      
      <!-- Desktop Action Button -->
      <div 
        class="dock-item"
        @click="showDesktop"
      >
        <div class="icon" :data-title="desktopAction.title">
            <img :src="desktopAction.icon" :alt="desktopAction.title" draggable="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dock-container {
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 9999;
  
  &.mobile {
    bottom: 10px;
    padding: 0 10px;
    
    .dock {
      width: 100%;
      max-width: 100%;
      justify-content: space-around;
      padding: 8px 12px;
      border-radius: 20px;
      gap: 8px;
    }
    
    .dock-item {
      width: 45px;
      height: 45px;
      
      &:hover {
        transform: scale(1.1) translateY(-5px);
        margin: 0 5px;
      }
      
      .icon::after {
        display: none; // Hide tooltips on mobile
      }
    }
  }
  
  &.tablet {
    bottom: 15px;
    
    .dock {
      padding: 9px 11px;
    }
    
    .dock-item {
      width: 48px;
      height: 48px;
    }
  }
}

.dock {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 10px 10px;
  display: flex;
  gap: 12px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  transition: all 0.3s;
}

.dock-item {
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);

  &:hover {
    transform: scale(1.2) translateY(-10px);
    margin: 0 10px; // Spacing effect
  }

  /* Tooltip logic */
  .icon::after {
    content: attr(data-title);
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.6);
    color: white;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    white-space: nowrap;
  }
 
  &:hover .icon::after {
    opacity: 1;
  }
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Fill the rounded shape */
    border-radius: 12px; /* Authentic macos squircle-ish */
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
    transition: transform 0.2s;
  }
}

.dot {
  width: 4px;
  height: 4px;
  background: black;
  border-radius: 50%;
  position: absolute;
  bottom: -6px;
  opacity: 0.6;
}

.dock-separator {
  width: 1px;
  height: 50px;
  background: rgba(0, 0, 0, 0.2);
  margin: 0 8px;
  align-self: center;
  
  @media (max-width: 768px) {
    height: 45px;
    margin: 0 4px;
  }
}

@media (prefers-color-scheme: dark) {
  .dot { background: white; }
  .dock { background: rgba(0, 0, 0, 0.2); border-color: rgba(255,255,255,0.1); }
  .dock-separator { background: rgba(255, 255, 255, 0.3); }
}
</style>
