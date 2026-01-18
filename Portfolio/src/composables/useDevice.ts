import { ref, onMounted, onUnmounted } from 'vue';

export function useDevice() {
  const isMobile = ref(false);
  const isTablet = ref(false);
  const isDesktop = ref(false);
  const screenWidth = ref(0);

  function updateDevice() {
    screenWidth.value = window.innerWidth;
    isMobile.value = window.innerWidth < 768;
    isTablet.value = window.innerWidth >= 768 && window.innerWidth < 1024;
    isDesktop.value = window.innerWidth >= 1024;
  }

  onMounted(() => {
    updateDevice();
    window.addEventListener('resize', updateDevice);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateDevice);
  });

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth
  };
}
