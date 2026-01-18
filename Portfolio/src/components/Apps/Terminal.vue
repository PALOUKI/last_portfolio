<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

const output = ref<string[]>([
  'Welcome to PortfolioOS v1.0.0',
  'Type "help" for available commands.',
  ''
]);
const input = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

const currentPath = ref('~');

// Mock File System
const fileSystem: Record<string, string[]> = {
  '~': ['Documents', 'Downloads', 'Pictures', 'Projects'],
  '~/Documents': ['Certifications', 'Badges'],
  '~/Downloads': ['cv.pdf', 'myPicture.jpg'],
  '~/Pictures': [],
  '~/Projects': [],
  '~/Documents/Certifications': ['dockerCrashCourse.pdf', 'flutter.pdf'],
  '~/Documents/Badges': ['git.pdf']
};

const commands: Record<string, (args: string[]) => string | void> = {
  help: () => 'Available commands: help, clear, whoami, ls, cat, contact, cd, pwd',
  clear: () => { output.value = []; return; },
  whoami: () => 'godbless',
  pwd: () => currentPath.value,
  ls: () => {
    const files = fileSystem[currentPath.value];
    return files ? files.join('  ') : '';
  },
  contact: () => 'Email: godbless.dev@gmail.com\nLinkedIn: linkedin.com/in/godbless-dev',
  cd: (args) => {
    const target = args[0];
    
    // cd (home)
    if (!target || target === '~') {
      currentPath.value = '~';
      return;
    }

    // cd ..
    if (target === '..') {
      if (currentPath.value === '~') return; // Already at root
      const parts = currentPath.value.split('/');
      parts.pop();
      currentPath.value = parts.join('/');
      return;
    }

    // cd [folder]
    const potentialPath = currentPath.value === '~' ? `~/${target}` : `${currentPath.value}/${target}`;
    if (fileSystem[potentialPath]) {
      currentPath.value = potentialPath;
    } else {
      return `bash: cd: ${target}: No such file or directory`;
    }
  },
  cat: (args) => {
    if (args[0] === 'bio.txt') return 'Student Software Engineer. Code, Design, Deploy.';
    return `cat: ${args[0]}: No such file or directory`;
  }
};

function execute() {
  const cmdLine = input.value.trim();
  if (!cmdLine) return;

  output.value.push(`godbless@macbook:${currentPath.value}$ ${cmdLine}`);
  
  const parts = cmdLine.split(' ');
  const cmd = parts[0];
  const args = parts.slice(1);
  
  if (cmd && commands[cmd]) {
    const result = commands[cmd](args);
    if (result) output.value.push(result);
  } else {
    output.value.push(`bash: ${cmd}: command not found`);
  }
  
  input.value = '';
  nextTick(() => {
    // Scroll to bottom
    const terminal = document.querySelector('.terminal-container');
    if (terminal) terminal.scrollTop = terminal.scrollHeight;
  });
}

function focusInput() {
  inputRef.value?.focus();
}

onMounted(() => {
  focusInput();
});
</script>

<template>
  <div class="terminal-container" @click="focusInput">
    <div class="output">
      <div v-for="(line, i) in output" :key="i" class="line">{{ line }}</div>
    </div>
    <div class="input-line">
      <span class="prompt">godbless@macbook:{{ currentPath }}$</span>
      <input 
        ref="inputRef"
        v-model="input" 
        @keydown.enter="execute" 
        type="text" 
        autofocus
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.terminal-container {
  background: #1e1e1e;
  color: #f0f0f0;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  padding: 8px;
  height: 100%;
  overflow-y: auto;
  cursor: text;
}

.line {
  white-space: pre-wrap;
  margin-bottom: 2px;
}

.input-line {
  display: flex;
}

.prompt {
  color: #4cd964;
  margin-right: 8px;
}

input {
  background: transparent;
  border: none;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  flex: 1;
  outline: none;
}
</style>
