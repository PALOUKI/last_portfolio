<script setup lang="ts">
import { useWindowManager } from '../../stores/windowManager';
import Window from './Window.vue';
import MobileApp from './MobileApp.vue';
import MenuBar from './MenuBar.vue';
import Dock from './Dock.vue';
import { defineAsyncComponent, ref, computed } from 'vue';
import { useDevice } from '../../composables/useDevice';

// Async load apps to avoid circular deps or heavy bundle
const Finder = defineAsyncComponent(() => import('../Apps/Finder.vue'));
const Terminal = defineAsyncComponent(() => import('../Apps/Terminal.vue'));
const Safari = defineAsyncComponent(() => import('../Apps/Safari.vue'));
const Preview = defineAsyncComponent(() => import('../Apps/Preview.vue'));
const Mail = defineAsyncComponent(() => import('../Apps/Mail.vue'));
// const VSCode = defineAsyncComponent(() => import('../Apps/VSCode.vue'));

const wm = useWindowManager();
const { isMobile, isTablet, isDesktop } = useDevice();

const componentMap: Record<string, any> = {
  'finder': Finder,
  'terminal': Terminal,
  'safari': Safari,
  'preview': Preview,
  'mail': Mail
};

// Split text into individual letters for animation
const brandingText = "Palouki's Portfolio";
const brandingWords = computed(() => {
  if (isMobile.value) {
    // Split into two lines for mobile
    return [
      "Palouki's".split('').map((char, index) => ({
        char,
        index
      })),
      "Portfolio".split('').map((char, index) => ({
        char,
        index: index + "Palouki's".length
      }))
    ];
  } else {
    // Single line for desktop
    return [brandingText.split('').map((char, index) => ({
      char: char === ' ' ? '\u00A0' : char,
      index
    }))];
  }
});
</script>

<template>
  <div class="desktop" :class="{ mobile: isMobile, tablet: isTablet }">
    <div class="wallpaper"></div>
    
    <!-- Branding - hide on mobile when app is open -->
    <div class="branding" v-show="!isMobile || wm.openWindows.length === 0">
      <div 
        v-for="(word, wordIndex) in brandingWords" 
        :key="wordIndex" 
        class="branding-line"
      >
        <span 
          v-for="letter in word" 
          :key="letter.index" 
          class="letter"
          :style="{ '--letter-index': letter.index }"
        >
          {{ letter.char }}
        </span>
      </div>
    </div>
    
    <MenuBar />
    
    <!-- Desktop: Windows -->
    <div v-if="isDesktop" class="windows-layer">
      <Window 
        v-for="win in wm.openWindows" 
        :key="win.id" 
        :window="win"
      >
        <component :is="componentMap[win.component]" :windowId="win.id" />
      </Window>
    </div>
    
    <!-- Mobile/Tablet: Full screen apps -->
    <div v-else class="mobile-apps-layer">
      <MobileApp 
        v-for="win in wm.openWindows" 
        :key="win.id" 
        :window="win"
      >
        <component :is="componentMap[win.component]" :windowId="win.id" />
      </MobileApp>
    </div>

    <Dock />
  </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap');

.desktop {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  
  &.mobile, &.tablet {
    .branding {
      font-size: 32px;
      text-align: center;
      max-width: 90%;
      flex-wrap: wrap;
      justify-content: center;
      
      .letter {
        &:hover {
          transform: translateY(-10px) scale(1.2) rotate(3deg);
        }
      }
    }
  }
  
  &.mobile {
    .branding {
      font-size: 42px;
    }
  }
}

.branding {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 80px;
  font-weight: 700;
  z-index: 1;
  user-select: none;
  letter-spacing: -2px;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  
  .branding-line {
    display: flex;
  }
  
  .letter {
    display: inline-block;
    color: rgba(255, 255, 255, 0.95);
    background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    cursor: default;
    
    &:hover {
      transform: translateY(-20px) scale(1.3) rotate(5deg);
      filter: drop-shadow(0 8px 20px rgba(139, 92, 246, 0.6));
      background: linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f97316 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: rainbow 0.6s ease-in-out;
    }
    
    &:active {
      transform: translateY(-15px) scale(1.2) rotate(-3deg);
    }
  }
}

@keyframes rainbow {
  0%, 100% {
    background: linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f97316 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  25% {
    background: linear-gradient(135deg, #ec4899 0%, #f97316 50%, #fbbf24 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  50% {
    background: linear-gradient(135deg, #f97316 0%, #fbbf24 50%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  75% {
    background: linear-gradient(135deg, #fbbf24 0%, #a78bfa 50%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.wallpaper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000000;
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(76, 29, 149, 0.4), transparent 50%), 
    radial-gradient(circle at 85% 30%, rgba(219, 39, 119, 0.25), transparent 50%), 
    linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%);
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.windows-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none; /* Let clicks pass through to wallpaper if not on window */
}

/* Re-enable pointer events for windows */
.windows-layer > * {
  pointer-events: auto;
}

.mobile-apps-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
</style>
