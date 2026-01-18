<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWindowManager } from '../../stores/windowManager';
import type { AppWindow } from '../../stores/windowManager';

const props = defineProps<{
  window: AppWindow
}>();

const wm = useWindowManager();
const windowRef = ref<HTMLElement | null>(null);

// Dragging Logic
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const snapPreview = ref<'left' | 'right' | 'top' | null>(null);


function startDrag(e: MouseEvent) {
  // Allow starting drag even if maximized (to support drag-down-to-restore)
  // if (props.window.isMaximized) return; 
  
  e.preventDefault(); // Prevent text selection etc
  isDragging.value = true;
  
  if(windowRef.value) {
      const rect = windowRef.value.getBoundingClientRect();
      
      // If we are dragging a maximized (or snapped) window, we want to calculate offset relative to 
      // where the mouse would be if resized to "normal" width?
      // Or just standard offset.
      dragOffset.value = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      // If MAXIMIZED, we don't change size yet, only on MOVE
  }
  wm.focusWindow(props.window.id);
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value) return;
  
  // Logic: Dragging a maximized window restores it
  if (props.window.isMaximized) {
      // Threshold to start dragging out of maximized state?
      // Just immediately restore
      // Calculate new X to center window on mouse proportionately?
      const winW = props.window.previousBounds?.width || 800; // Default or previous
      // Center X on mouse
      const newX = e.clientX - (winW / 2);
      
      props.window.isMaximized = false;
      props.window.width = winW;
      props.window.height = props.window.previousBounds?.height || 600;
      props.window.x = newX;
      props.window.y = e.clientY - 10; // Slightly down from cursor? Or match offset?
      
      // Update offset for smooth dragging after restore
      dragOffset.value.x = winW / 2;
      dragOffset.value.y = 10; // approximate title bar height click
  }

  // Snap Detection
  const { clientX, clientY } = e;
  const screenW = window.innerWidth;
  const edgeThreshold = 20;

  if (clientY < edgeThreshold) {
    snapPreview.value = 'top';
  } else if (clientX < edgeThreshold) {
    snapPreview.value = 'left';
  } else if (clientX > screenW - edgeThreshold) {
    snapPreview.value = 'right';
  } else {
    snapPreview.value = null;
  }

  // Constrain Y to not go above Menu Bar (28px)
  const menuBarHeight = 28;
  const newY = e.clientY - dragOffset.value.y;
  props.window.y = Math.max(menuBarHeight, newY);
  
  props.window.x = e.clientX - dragOffset.value.x;
}

function stopDrag() {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  
  // Apply Snap
  if (snapPreview.value) {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const menuH = 28;
    const dockH = 70;
    const availableH = screenH - menuH - dockH;

    // Save current bounds before snapping
    if (!props.window.isMaximized) {
         props.window.previousBounds = {
             x: props.window.x || 100,
             y: props.window.y || 50,
             width: props.window.width || 800,
             height: props.window.height || 600
         };
    }

    if (snapPreview.value === 'top') {
      wm.toggleMaximize(props.window.id);
    } else if (snapPreview.value === 'left') {
      props.window.x = 0;
      props.window.y = menuH;
      props.window.width = screenW / 2;
      props.window.height = availableH;
      props.window.isMaximized = false; // pseudo-maximized
    } else if (snapPreview.value === 'right') {
      props.window.x = screenW / 2;
      props.window.y = menuH;
      props.window.width = screenW / 2;
      props.window.height = availableH;
      props.window.isMaximized = false;
    }
    
    snapPreview.value = null;
  }
}

// ... minWidth, minHeight, Resizing Logic ...
const minWidth = 300;
const minHeight = 200;

// Resizing Logic
const isResizing = ref(false);
const resizeDirection = ref('');
const initialSize = ref({ width: 0, height: 0, x: 0, y: 0 });
const initialMouse = ref({ x: 0, y: 0 });

function startResize(e: MouseEvent, direction: string) {
  if (props.window.isMaximized) return;
  
  e.stopPropagation(); // Prevent drag start
  isResizing.value = true;
  resizeDirection.value = direction;
  
  initialMouse.value = { x: e.clientX, y: e.clientY };
  initialSize.value = {
    width: props.window.width || 800,
    height: props.window.height || 600,
    x: props.window.x || 100,
    y: props.window.y || 50
  };
  
  wm.focusWindow(props.window.id);
  window.addEventListener('mousemove', onResize);
  window.addEventListener('mouseup', stopResize);
}

function onResize(e: MouseEvent) {
  if (!isResizing.value) return;
  
  const dx = e.clientX - initialMouse.value.x;
  const dy = e.clientY - initialMouse.value.y;
  
  const dir = resizeDirection.value;
  
  // Width & X
  if (dir.includes('e')) { // Right
    const newWidth = Math.max(minWidth, initialSize.value.width + dx);
    props.window.width = newWidth;
  } else if (dir.includes('w')) { // Left
    const newWidth = Math.max(minWidth, initialSize.value.width - dx);
    props.window.width = newWidth;
    props.window.x = initialSize.value.x + (initialSize.value.width - newWidth);
  }
  
  // Height & Y
  if (dir.includes('s')) { // Bottom
    const newHeight = Math.max(minHeight, initialSize.value.height + dy);
    props.window.height = newHeight;
  } else if (dir.includes('n')) { // Top
    const newHeight = Math.max(minHeight, initialSize.value.height - dy);
    props.window.height = newHeight;
    props.window.y = initialSize.value.y + (initialSize.value.height - newHeight);
  }
}

function stopResize() {
  isResizing.value = false;
  window.removeEventListener('mousemove', onResize);
  window.removeEventListener('mouseup', stopResize);
}

// Window Controls
function close() {
  wm.closeWindow(props.window.id);
}
function minimize() {
  wm.toggleMinimize(props.window.id);
}
function maximize() {
  wm.toggleMaximize(props.window.id);
}
const onFocus = () => wm.focusWindow(props.window.id);

// Dynamic Styles
const styles = computed(() => {
  if (props.window.isMaximized) {
    return {
      top: '28px', // Menubar height
      left: '0',
      width: '100%',
      height: 'calc(100% - 28px - 70px)', // Minus menubar and dock area
      zIndex: props.window.zIndex,
      transform: 'none'
    };
  }
  return {
    top: `${props.window.y}px`,
    left: `${props.window.x}px`,
    width: `${props.window.width}px`,
    height: `${props.window.height}px`,
    zIndex: props.window.zIndex
  };
});
</script>

<template>
  <div 
    ref="windowRef"
    class="os-window" 
    :class="{ 'active': wm.activeWindowId === window.id, 'minimized': window.isMinimized, 'maximized': window.isMaximized }"
    :style="styles"
    @mousedown="onFocus"
  >
    <!-- Snap Preview Overlay -->
    <div v-if="snapPreview && isDragging" class="snap-preview" :class="snapPreview"></div>

    <!-- Resize Handles -->
    <template v-if="!window.isMaximized">
      <div class="resize-handle n" @mousedown="startResize($event, 'n')"></div>
      <div class="resize-handle e" @mousedown="startResize($event, 'e')"></div>
      <div class="resize-handle s" @mousedown="startResize($event, 's')"></div>
      <div class="resize-handle w" @mousedown="startResize($event, 'w')"></div>
      <div class="resize-handle ne" @mousedown="startResize($event, 'ne')"></div>
      <div class="resize-handle nw" @mousedown="startResize($event, 'nw')"></div>
      <div class="resize-handle se" @mousedown="startResize($event, 'se')"></div>
      <div class="resize-handle sw" @mousedown="startResize($event, 'sw')"></div>
    </template>

    <div class="window-header" @mousedown="startDrag" @dblclick="maximize">
      <div class="window-controls">
        <button class="control close" @click.stop="close"></button>
        <button class="control minimize" @click.stop="minimize"></button>
        <button class="control maximize" @click.stop="maximize"></button>
      </div>
      <div class="window-title">{{ window.title }}</div>
    </div>
    <div class="window-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* ... os-window base styles ... */
.os-window {
  position: absolute;
  background: rgba(255, 255, 255, 0.85); /* Glass morphism base */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05); /* Outline for contrast */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: opacity 0.2s, transform 0.2s; /* Removed sizing transitions for drag performance */

  &.minimized {
    opacity: 0;
    pointer-events: none;
    transform: scale(0.8) translateY(200px);
  }

  &.active {
    box-shadow: 0 15px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1);
  }
}

/* Snap Preview */
.snap-preview {
  position: fixed;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  z-index: 9999; /* Below dragging window but above others */
  transition: all 0.2s ease-out;
  
  &.left {
    top: 28px;
    left: 8px;
    width: calc(50vw - 16px);
    height: calc(100vh - 28px - 70px - 16px);
  }
  
  &.right {
    top: 28px;
    left: calc(50vw + 8px);
    width: calc(50vw - 16px);
    height: calc(100vh - 28px - 70px - 16px);
  }
  
  &.top {
    top: 28px;
    left: 8px;
    width: calc(100vw - 16px);
    height: calc(100vh - 28px - 70px - 16px);
  }
}

/* Resize Handles */
$handle-size: 6px;
.resize-handle {
  position: absolute;
  z-index: 100;
  /* ... same handle styles ... */
  &.n { top: 0; left: 0; width: 100%; height: $handle-size; cursor: n-resize; }
  &.e { top: 0; right: 0; width: $handle-size; height: 100%; cursor: e-resize; }
  &.s { bottom: 0; left: 0; width: 100%; height: $handle-size; cursor: s-resize; }
  &.w { top: 0; left: 0; width: $handle-size; height: 100%; cursor: w-resize; }
  
  &.ne { top: 0; right: 0; width: $handle-size*2; height: $handle-size*2; cursor: ne-resize; }
  &.nw { top: 0; left: 0; width: $handle-size*2; height: $handle-size*2; cursor: nw-resize; }
  &.se { bottom: 0; right: 0; width: $handle-size*2; height: $handle-size*2; cursor: se-resize; }
  &.sw { bottom: 0; left: 0; width: $handle-size*2; height: $handle-size*2; cursor: sw-resize; }
}

.window-header {
  height: 38px;
  background: #f6f6f6;
  border-bottom: 1px solid #d1d1d1;
  display: flex;
  align-items: center;
  padding: 0 16px;
  user-select: none;
  border-top-left-radius: 10px; 
  border-top-right-radius: 10px;
}

.os-window {
  border-radius: 10px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(0,0,0,0.1);
  background: #fff;
}

@media (prefers-color-scheme: dark) {
  .window-header {
    background: #323232;
    border-bottom: 1px solid #000;
  }
  .window-title {
    color: #dfdfdf;
  }
  .os-window {
    background: #1e1e1e;
    box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(0,0,0,0.3);
  }
  
  /* Update snap preview for dark mode */
  .snap-preview {
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
}

.window-controls {
  display: flex;
  gap: 8px;
  margin-left: 4px;
}
/* ... rest of existing styles ... */
/* NOTE: Truncating for brevity in replacement, will ensure full content is preserved */


.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 0.5px solid rgba(0,0,0,0.1);
  cursor: pointer;
  position: relative;
  padding: 0;
  transition: filter 0.1s;
  
  &.close { background: #FF5F57; }
  &.minimize { background: #FEBC2E; }
  &.maximize { background: #28C840; }

  &:active { filter: brightness(0.8); }

  /* Icons appear on hover only for the group */
  .window-header:hover &::after {
    opacity: 0.6;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 8px;
    font-weight: 900;
    color: #000;
    opacity: 0;
    transition: opacity 0.1s;
  }
}

.window-title {
  flex: 1;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin-right: 50px; /* Balance the controls */
}

.window-content {
  flex: 1;
  overflow: auto;
  position: relative;
  background-color: var(--window-bg); /* Default white */
}
</style>
