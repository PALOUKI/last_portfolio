<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWindowManager } from '../../stores/windowManager';
import { useDevice } from '../../composables/useDevice';

const wm = useWindowManager();
const { isMobile, isTablet } = useDevice();

interface FileSystemItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parentId: string | null;
  content?: string; // For text files
  app?: string; // App to open with
  icon?: string;
  src?: string; // path to asset
}

const fileSystem = ref<FileSystemItem[]>([
  { id: 'root', name: 'Root', type: 'folder', parentId: null },
  { id: 'desktop', name: 'Desktop', type: 'folder', parentId: 'root' },
  { id: 'documents', name: 'Documents', type: 'folder', parentId: 'root' },
  { id: 'downloads', name: 'Downloads', type: 'folder', parentId: 'root' },
  
  // Documents content
  // We can scan the assets/Certifications folder ideally, but hardcoding for now based on previous analysis
  { id: 'certs_folder', name: 'Certifications', type: 'folder', parentId: 'documents' },
  { id: 'badges_folder', name: 'Badges', type: 'folder', parentId: 'documents' },
  
  // Certifications
  { id: 'cert_docker1', name: 'dockerCrashCourse.pdf', type: 'file', parentId: 'certs_folder', app: 'preview', src: '/assets/Certifications/dockerCrashCourse.pdf' },
  { id: 'cert_docker2', name: 'dockerTrainingCourse.pdf', type: 'file', parentId: 'certs_folder', app: 'preview', src: '/assets/Certifications/dockerTrainingCourse.pdf' },
  { id: 'cert_flutter1', name: 'flutter.pdf', type: 'file', parentId: 'certs_folder', app: 'preview', src: '/assets/Certifications/flutter.pdf' },
  { id: 'cert_flutter2', name: 'flutter1.pdf', type: 'file', parentId: 'certs_folder', app: 'preview', src: '/assets/Certifications/flutter1.pdf' },
  { id: 'cert_java', name: 'java_springboot.pdf', type: 'file', parentId: 'certs_folder', app: 'preview', src: '/assets/Certifications/java_springboot.pdf' },

  // Badges
  { id: 'badge_git', name: 'introductionToGit.pdf', type: 'file', parentId: 'badges_folder', app: 'preview', src: '/assets/Badges/introductionToGit.pdf' },
  { id: 'badge_github', name: 'introductionToGithub.pdf', type: 'file', parentId: 'badges_folder', app: 'preview', src: '/assets/Badges/introductionToGithub.pdf' },

  // Downloads
  { id: 'cv', name: 'cv.pdf', type: 'file', parentId: 'downloads', app: 'preview', src: '/assets/cv.pdf' },
  { id: 'pic', name: 'myPicture.jpg', type: 'file', parentId: 'downloads', app: 'preview', src: '/assets/myPicture.jpg' }
]);

const currentPathId = ref('documents');
const selectedItemId = ref<string | null>(null);

// Mobile: preview state
const mobilePreviewFile = ref<FileSystemItem | null>(null);

const currentItems = computed(() => {
  return fileSystem.value.filter(item => item.parentId === currentPathId.value);
});

const currentFolder = computed(() => fileSystem.value.find(i => i.id === currentPathId.value));

const breadcrumbPath = computed(() => {
  let path = [];
  let current = currentFolder.value;
  while (current && current.parentId) { // Stop at root children (Desktop, Docs, Downloads)
     path.unshift(current.name);
     current = fileSystem.value.find(i => i.id === current!.parentId);
  }
  // If we are at root child, add it
  if (current) path.unshift(current.name);
  
  return path.join(' / ');
});

function selectItem(id: string) {
  selectedItemId.value = id;
}

function deselect(e: MouseEvent) {
  // Only deselect if clicking the background grid, not an item
  if ((e.target as HTMLElement).classList.contains('grid-view')) {
    selectedItemId.value = null;
  }
}

function navigate(item: FileSystemItem) {
  if (item.type === 'folder') {
    currentPathId.value = item.id;
    selectedItemId.value = null; // Clear selection on nav
  } else {
    // Open file
    if (item.app && item.src) {
      if (isMobile.value || isTablet.value) {
        // Mobile: show file preview inside Finder
        mobilePreviewFile.value = item;
      } else {
        // Desktop: open in new window
        const winId = `${item.app}-${item.id}`;
        wm.registerWindow(winId, item.name, 'preview', '📄');
        wm.openWindow(winId, { src: item.src, type: item.name.endsWith('pdf') ? 'pdf' : 'image' });
      }
    }
  }
}

function closeMobilePreview() {
  mobilePreviewFile.value = null;
}

function goBack() {
  if (currentFolder.value?.parentId) {
    currentPathId.value = currentFolder.value.parentId;
    selectedItemId.value = null;
  }
}
</script>

<template>
  <div class="finder" :class="{ mobile: isMobile || isTablet }">
    <!-- Mobile File Preview Overlay -->
    <div v-if="(isMobile || isTablet) && mobilePreviewFile" class="mobile-preview-overlay">
      <div class="mobile-preview-header">
        <button class="preview-back" @click="closeMobilePreview">
          <span>←</span>
        </button>
        <span class="preview-title">{{ mobilePreviewFile.name }}</span>
        <div class="spacer"></div>
      </div>
      <div class="mobile-preview-content">
        <!-- PDF Preview -->
        <iframe 
          v-if="mobilePreviewFile.name.endsWith('.pdf')" 
          :src="mobilePreviewFile.src" 
          class="preview-iframe"
        ></iframe>
        <!-- Image Preview -->
        <img 
          v-else 
          :src="mobilePreviewFile.src" 
          :alt="mobilePreviewFile.name"
          class="preview-image"
        />
      </div>
    </div>

    <!-- Main Finder UI -->
    <div class="sidebar" v-if="!isMobile">
      <div class="sidebar-group">
        <div class="sidebar-title">Favorites</div>
        <div class="sidebar-item" :class="{ active: currentPathId === 'desktop' }" @click="currentPathId = 'desktop'"> 
             <!-- SF Symbol: macwindow -->
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><line x1="2" y1="8" x2="22" y2="8"></line></svg>
             Desktop
        </div>
        <div class="sidebar-item" :class="{ active: currentPathId === 'documents' }" @click="currentPathId = 'documents'"> 
             <!-- SF Symbol: doc.text -->
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
             Documents
        </div>
        <div class="sidebar-item" :class="{ active: currentPathId === 'downloads' }" @click="currentPathId = 'downloads'"> 
             <!-- SF Symbol: arrow.down.circle -->
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><circle cx="12" cy="12" r="10"></circle><polyline points="8 12 12 16 16 12"></polyline><line x1="12" y1="8" x2="12" y2="16"></line></svg>
             Downloads
        </div>
      </div>
    </div>
    <div class="main-view">
      <div class="toolbar">
         <button @click="goBack" :disabled="!currentFolder?.parentId">&lt;</button>
         <span>{{ breadcrumbPath }}</span>
      </div>
      <div class="grid-view" @click="deselect">
        <div 
          v-for="item in currentItems" 
          :key="item.id" 
          class="grid-item"
          :class="{ selected: selectedItemId === item.id }"
          @click.stop="isMobile || isTablet ? navigate(item) : selectItem(item.id)"
          @dblclick="navigate(item)"
        >
          <div class="icon">
             <!-- Real SVG for MacOS Blue Folder -->
             <svg v-if="item.type === 'folder'" viewBox="0 0 100 100" class="folder-icon" xmlns="http://www.w3.org/2000/svg">
               <defs>
                 <linearGradient id="folderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                   <stop offset="0%" style="stop-color:#5FB8FF;stop-opacity:1" />
                   <stop offset="100%" style="stop-color:#1E90FF;stop-opacity:1" />
                 </linearGradient>
               </defs>
               <path d="M10,35 L40,35 L45,40 L90,40 C92,40 94,42 94,44 L94,85 C94,88 92,90 90,90 L10,90 C8,90 6,88 6,85 L6,39 C6,37 8,35 10,35 Z" fill="url(#folderGrad)" stroke="#167AC6" stroke-width="1"/>
               <rect x="6" y="45" width="88" height="45" rx="2" ry="2" fill="url(#folderGrad)" stroke="#4CA0E0" stroke-width="0"/>
               <!-- Top Tab -->
               <path d="M10,36 L38,36 L43,41 L88,41 L88,45 L6,45 L6,40 C6,38 8,36 10,36" fill="#7AC5FF" opacity="0.6"/>
             </svg>
             <span v-else style="font-size: 48px">📄</span>
          </div>
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.finder {
  display: flex;
  height: 100%;
  font-size: 13px;
}

/* --- DEFAULT STYLES (Basic Layout & Light Mode) --- */

.sidebar {
  width: 180px;
  background: rgba(240, 240, 240, 0.8); /* Translucent side bar */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0,0,0,0.1);
  padding-top: 20px;
  font-size: 13px;
}

.sidebar-title {
  color: #888;
  font-size: 11px;
  font-weight: 700;
  padding: 0 16px 8px;
  text-transform: uppercase;
}

.sidebar-item {
  padding: 6px 16px;
  cursor: default;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 6px;
  margin: 0 8px;
  color: #333; /* Default text color */
  
  svg {
    opacity: 0.8; 
    color: #007AFF; /* Mac Blue tint for icons usually */
  }
  
  &:hover {
    background: rgba(0,0,0,0.05); /* Subtle hover */
  }
  &.active {
    background: rgba(0,0,0,0.1);
    color: #000;
  }
}

.main-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.toolbar {
  height: 30px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 10px;
  
  button {
    border: 1px solid #ddd;
    background: #f8f8f8;
    border-radius: 4px;
    cursor: pointer;
    
    &:disabled {
      opacity: 0.5;
    }
  }
}

.grid-view {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 15px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 90px;
  height: max-content; /* Don't stretch */
  align-self: start; /* Align to top of grid cell */
  padding: 8px; /* Added padding for better hover area */
  transition: background-color 0.1s ease; /* Smooth hover */
  border-radius: 6px;
  
  .icon {
    width: 64px;
    height: 64px;
    margin-bottom: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    img, svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    }
    
    .folder-icon {
       width: 100%;
       height: 100%;
       /* Custom SVG styling if needed */
    }
  }
  
  .name {
    text-align: center;
    word-break: break-all;
    font-size: 13px;
    color: #000000; /* Deep black for maximum contrast */
    line-height: 1.3;
    padding: 2px 4px;
    border-radius: 4px;
  }
  
  /* Hover State: Clearly visible gray */
  &:hover:not(.selected) {
     background-color: rgba(0, 0, 0, 0.08); /* Reduced opacity */
     border-radius: 6px;
  }

  /* Selection State: Strong blue overrides hover */
  &.selected {
    background-color: transparent; /* Selection uses name bg, not item bg in macOS usually */
    .name {
       background: #0060df;
       color: white;
    }
    
    .icon {
      filter: brightness(0.8);
    }
  }
}

/* --- MOBILE PREVIEW OVERLAY --- */
.mobile-preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 100;
  display: flex;
  flex-direction: column;
  animation: slideInFromRight 0.3s ease-out;
}

@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.mobile-preview-header {
  height: 56px;
  background: #f6f6f6;
  border-bottom: 1px solid #d1d1d1;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  flex-shrink: 0;
}

.preview-back {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 24px;
  color: #007aff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  
  &:active {
    opacity: 0.5;
  }
}

.preview-title {
  flex: 1;
  text-align: center;
  font-weight: 600;
  font-size: 17px;
  color: #1d1d1f;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.spacer {
  width: 40px;
}

.mobile-preview-content {
  flex: 1;
  overflow: hidden;
  background: #f5f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* --- MOBILE RESPONSIVE --- */
.finder.mobile {
  .main-view {
    width: 100%;
  }
  
  .grid-view {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 12px;
    padding: 16px;
  }
  
  .grid-item {
    width: 75px;
    
    .icon {
      width: 56px;
      height: 56px;
    }
    
    .name {
      font-size: 12px;
    }
  }
  
  .toolbar {
    height: 44px;
    padding: 0 16px;
    font-size: 16px;
    
    button {
      padding: 8px 12px;
      font-size: 18px;
    }
  }
}

/* --- DARK MODE OVERRIDES (Applied LAST) --- */
@media (prefers-color-scheme: dark) {
  /* Dark Mode specific overrides */
  .sidebar {
    background: rgba(40, 40, 40, 0.8);
    border-right: 1px solid rgba(255,255,255,0.1);
  }
  .sidebar-item {
    color: #ccc;
    &.active {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }
  }
  /* 
     User requested explicit WHITE background and BLACK text even in dark mode 
     for the main content area.
  */
  .main-view {
    background: white !important; 
    color: black !important;
  }
  .toolbar {
     background: #f8f8f8; /* Keep toolbar light too for consistency with white bg */
     border-bottom: 1px solid #ddd;
     color: #333;
  }
  .toolbar button {
     background: #f8f8f8;
     border-color: #ddd;
     color: #333;
  }
  .grid-item .name {
    color: #000000 !important; /* Force black text */
  }
}
</style>
