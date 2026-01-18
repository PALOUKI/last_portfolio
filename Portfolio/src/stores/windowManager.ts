import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface AppWindow {
    id: string;
    title: string;
    component: string;
    icon: string;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    props?: any;
    previousBounds?: { x: number, y: number, width: number, height: number };
}

export const useWindowManager = defineStore('windowManager', () => {
    const windows = ref<AppWindow[]>([]);
    const activeWindowId = ref<string | null>(null);
    const baseZIndex = 10;

    const openWindows = computed(() => windows.value.filter(w => w.isOpen));

    function registerWindow(appId: string, title: string, component: string, icon: string) {
        if (!windows.value.find(w => w.id === appId)) {
            windows.value.push({
                id: appId,
                title,
                component,
                icon,
                isOpen: false,
                isMinimized: false,
                isMaximized: false,
                zIndex: baseZIndex,
                width: 800,
                height: 600,
                x: 100, // Randomize slightly in real impl
                y: 50
            });
        }
    }

    function openWindow(id: string, props?: any) {
        const win = windows.value.find(w => w.id === id);
        if (win) {
            if (!win.isOpen) {
                win.isOpen = true;
                win.isMinimized = false;
                // Reset position if needed or keep last
            } else if (win.isMinimized) {
                win.isMinimized = false;
            }
            if (props) {
                win.props = props
            }
            focusWindow(id);
        }
    }

    function closeWindow(id: string) {
        const win = windows.value.find(w => w.id === id);
        if (win) {
            win.isOpen = false;
            win.isMaximized = false;
            if (activeWindowId.value === id) {
                activeWindowId.value = null;
                // Focus next highest window
                const remaining = openWindows.value.sort((a, b) => b.zIndex - a.zIndex);
                if (remaining.length > 0 && remaining[0]) {
                    focusWindow(remaining[0].id);
                }
            }
        }
    }

    function toggleMinimize(id: string) {
        const win = windows.value.find(w => w.id === id);
        if (win) {
            win.isMinimized = !win.isMinimized;
            if (!win.isMinimized) {
                focusWindow(id);
            } else if (activeWindowId.value === id) {
                activeWindowId.value = null;
            }
        }
    }

    function toggleMaximize(id: string) {
        const win = windows.value.find(w => w.id === id);
        if (win) {
            win.isMaximized = !win.isMaximized;
            focusWindow(id);
        }
    }

    function focusWindow(id: string) {
        const win = windows.value.find(w => w.id === id);
        if (win && !win.isMinimized) {
            activeWindowId.value = id;
            // Bring to front
            const maxZ = Math.max(...windows.value.map(w => w.zIndex), baseZIndex);
            win.zIndex = maxZ + 1;
        }
    }

    return {
        windows,
        activeWindowId,
        openWindows,
        registerWindow,
        openWindow,
        closeWindow,
        toggleMinimize,
        toggleMaximize,
        focusWindow
    };
});
