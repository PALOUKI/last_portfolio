<script setup lang="ts">
import { useWindowManager } from '../../stores/windowManager';
import { computed } from 'vue';

const props = defineProps<{
    windowId: string
}>();

const wm = useWindowManager();
const windowState = computed(() => wm.windows.find(w => w.id === props.windowId));

// We assume props are passed into the window object in store
const src = computed(() => windowState.value?.props?.src || '');
const type = computed(() => windowState.value?.props?.type || 'image');

</script>

<template>
  <div class="preview">
    <div v-if="!src" class="empty">
      No file selected
    </div>
    <div v-else-if="type === 'pdf'" class="pdf-viewer">
      <object :data="src" type="application/pdf" width="100%" height="100%">
        <div style="padding: 20px; text-align: center; color: white;">
          <p>Unable to display PDF file.</p>
          <a :href="src" target="_blank" style="color: #4daafc; text-decoration: underline;">Download instead</a>
          <br><br>
          <small>Source: {{ src }}</small>
        </div>
      </object>
    </div>
    <div v-else class="image-viewer">
      <img :src="src" alt="Preview" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.preview {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2e2e2e;
  color: #ccc;
}

.pdf-viewer, iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.image-viewer img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
