<script setup lang="ts">
import { ref, computed } from 'vue';

const lang = ref<'fr' | 'en'>('fr');
const theme = ref<'light' | 'dark'>('light');

const toggleLang = () => {
  lang.value = lang.value === 'fr' ? 'en' : 'fr';
};

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};

const t = computed(() => {
  const translations = {
    fr: {
      about: 'À Propos',
      projects: 'Projets',
      skills: 'Compétences',
      contact: 'Contact',
      aboutTitle: 'Profil',
      aboutSubtitle: 'system.out.println("Geek mode ON");',
      aboutText: 'Passionné par la conception logicielle, je navigue entre clean architecture, DevOps étudiant et UI futuristes. Je décortique des systèmes complexes, je dessine des API lisibles et je livre des fonctionnalités prêtes pour la prod.',
      currentStack: 'Stack actuelle',
      softSkills: 'Soft skills',
      projectsTitle: 'Mes Projets',
      projectsSubtitle: 'git push --force-with-precision',
      skillsTitle: 'Compétences ciblées',
      skillsSubtitle: 'cout << "Toujours curieux";',
      architecture: 'Architecture',
      frontend: 'Frontend',
      backend: 'Backend',
      opsQuality: 'Ops & Qualité',
      liveDemo: 'Live',
      viewCode: 'GitHub',
      stack: 'Stack'
    },
    en: {
      about: 'About',
      projects: 'Projects',
      skills: 'Skills',
      contact: 'Contact',
      aboutTitle: 'Profile',
      aboutSubtitle: 'system.out.println("Geek mode ON");',
      aboutText: 'Passionate about software design, I navigate between clean architecture, student DevOps and futuristic UIs. I dissect complex systems, design readable APIs and deliver production-ready features.',
      currentStack: 'Current Stack',
      softSkills: 'Soft Skills',
      projectsTitle: 'My Projects',
      projectsSubtitle: 'git push --force-with-precision',
      skillsTitle: 'Targeted Skills',
      skillsSubtitle: 'cout << "Always curious";',
      architecture: 'Architecture',
      frontend: 'Frontend',
      backend: 'Backend',
      opsQuality: 'Ops & Quality',
      liveDemo: 'Live',
      viewCode: 'GitHub',
      stack: 'Stack'
    }
  };
  return translations[lang.value];
});

const currentSection = ref('about');

const techStack = [
  'TypeScript', 'React', 'Node.js', 'Spring Boot', 'PostgreSQL', 'Docker'
];

const softSkills = {
  fr: ['Lead technique étudiant', 'Veille techno', 'Mentorat pair-à-pair', 'Communication claire'],
  en: ['Student Tech Lead', 'Tech Watch', 'Peer Mentoring', 'Clear Communication']
};

const projects = [
  {
    id: 1,
    title: 'CodePulse',
    category: { fr: 'Observabilité', en: 'Observability' },
    description: {
      fr: 'Dashboard de monitoring avec corrélations métriques et exports Notion en un clic.',
      en: 'Monitoring dashboard with metric correlations and one-click Notion exports.'
    },
    features: {
      fr: [
        'Clean architecture hexagonale',
        'Tests contract + mutation',
        'Corrélations metrics/Grafana',
        'Playground Notion API'
      ],
      en: [
        'Clean hexagonal architecture',
        'Contract + mutation testing',
        'Metrics/Grafana correlations',
        'Notion API playground'
      ]
    },
    stack: ['Spring', 'React', 'PostgreSQL'],
    links: {
      live: 'https://codepulse.dev',
      github: 'https://github.com/palouki/codepulse'
    }
  },
  {
    id: 2,
    title: 'FluxAI',
    category: { fr: 'DevTools', en: 'DevTools' },
    description: {
      fr: 'Assistant CLI IA pour générer des snippets locaux, templates et revues express.',
      en: 'AI CLI assistant for generating local snippets, templates and quick reviews.'
    },
    features: {
      fr: [
        'Intégration OpenAI + LangChain',
        'Plugins personnalisables',
        'Snippets IA locaux',
        'Templates instantanés'
      ],
      en: [
        'OpenAI + LangChain integration',
        'Customizable plugins',
        'Local AI snippets',
        'Instant templates'
      ]
    },
    stack: ['Node', 'LangChain', 'CLI'],
    links: {
      live: 'https://fluxai.dev',
      github: 'https://github.com/palouki/fluxai'
    }
  }
];

const skills = [
  {
    title: { fr: 'Architecture', en: 'Architecture' },
    description: {
      fr: 'Domain driven design, Event-driven, CQRS, API-first.',
      en: 'Domain driven design, Event-driven, CQRS, API-first.'
    }
  },
  {
    title: { fr: 'Frontend', en: 'Frontend' },
    description: {
      fr: 'React, Next.js, animations GSAP/Framer, accessibilité.',
      en: 'React, Next.js, GSAP/Framer animations, accessibility.'
    }
  },
  {
    title: { fr: 'Backend', en: 'Backend' },
    description: {
      fr: 'Node/Nest, Spring Boot, Prisma, PostgreSQL, MongoDB.',
      en: 'Node/Nest, Spring Boot, Prisma, PostgreSQL, MongoDB.'
    }
  },
  {
    title: { fr: 'Ops & Qualité', en: 'Ops & Quality' },
    description: {
      fr: 'Docker, GitHub Actions, Terraform étudiant, tests E2E.',
      en: 'Docker, GitHub Actions, Student Terraform, E2E testing.'
    }
  }
];
</script>

<template>
  <div class="safari" :class="theme">
    <div class="toolbar">
      <div class="url-bar">
        <span class="lock-icon">🔒</span>
        <span class="url-text">palouki.dev</span>
      </div>
      <button class="theme-toggle" @click="toggleTheme" :title="theme === 'light' ? '☀️ Light' : '🌙 Dark'">
        {{ theme === 'light' ? '☀️' : '🌙' }}
      </button>
      <button class="lang-toggle" @click="toggleLang">
        {{ lang.toUpperCase() }}
      </button>
    </div>
    
    <div class="content">
      <!-- Navigation -->
      <nav class="nav-bar">
        <button 
          v-for="section in ['about', 'projects', 'skills']" 
          :key="section"
          :class="{ active: currentSection === section }"
          @click="currentSection = section"
          class="nav-btn"
        >
          {{ t[section] }}
        </button>
      </nav>

      <!-- About Section -->
      <section v-show="currentSection === 'about'" class="section">
        <div class="section-header">
          <h1>{{ t.aboutTitle }}</h1>
          <span class="badge">{{ t.aboutSubtitle }}</span>
        </div>
        
        <p class="intro-text">{{ t.aboutText }}</p>
        
        <div class="cards-grid">
          <div class="neuro-card">
            <h3>{{ t.currentStack }}</h3>
            <div class="chips">
              <span v-for="tech in techStack" :key="tech" class="chip">{{ tech }}</span>
            </div>
          </div>
          
          <div class="neuro-card">
            <h3>{{ t.softSkills }}</h3>
            <div class="chips">
              <span v-for="skill in softSkills[lang]" :key="skill" class="chip">{{ skill }}</span>
            </div>
          </div>
        </div>

        <div class="linkedin-cta" style="margin-top: 40px; text-align: center;">
          <a href="https://www.linkedin.com/in/highly-sought-after/" target="_blank" rel="noopener noreferrer" class="neuro-btn large">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            {{ lang === 'fr' ? 'Me retrouver sur LinkedIn' : 'Connect on LinkedIn' }}
          </a>
        </div>
      </section>

      <!-- Projects Section -->
      <section v-show="currentSection === 'projects'" class="section">
        <div class="section-header">
          <h1>{{ t.projectsTitle }}</h1>
          <span class="badge">{{ t.projectsSubtitle }}</span>
        </div>
        
        <div class="projects-grid">
          <article v-for="project in projects" :key="project.id" class="project-card neuro-card">
            <div class="project-header">
              <span class="category">{{ project.category[lang] }}</span>
              <h3>{{ project.title }}</h3>
            </div>
            
            <p class="description">{{ project.description[lang] }}</p>
            
            <ul class="features-list">
              <li v-for="(feature, idx) in project.features[lang]" :key="idx">
                {{ feature }}
              </li>
            </ul>
            
            <div class="project-footer">
              <div class="stack-section">
                <span class="stack-label">{{ t.stack }}</span>
                <div class="chips">
                  <span v-for="tech in project.stack" :key="tech" class="chip-small">{{ tech }}</span>
                </div>
              </div>
              
              <div class="project-links">
                <a :href="project.links.live" target="_blank" rel="noopener noreferrer" class="neuro-btn primary">
                  {{ t.liveDemo }}
                </a>
                <a :href="project.links.github" target="_blank" rel="noopener noreferrer" class="neuro-btn secondary">
                  {{ t.viewCode }}
                </a>
              </div>
            </div>
          </article>
        </div>
        
        <div class="github-cta">
          <a href="https://github.com/palouki" target="_blank" rel="noopener noreferrer" class="neuro-btn large">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            {{ lang === 'fr' ? 'Voir mes projets publics GitHub' : 'View my public GitHub projects' }}
          </a>
        </div>
      </section>

      <!-- Skills Section -->
      <section v-show="currentSection === 'skills'" class="section">
        <div class="section-header">
          <h1>{{ t.skillsTitle }}</h1>
          <span class="badge">{{ t.skillsSubtitle }}</span>
        </div>
        
        <div class="skills-grid">
          <div v-for="(skill, idx) in skills" :key="idx" class="skill-card neuro-card">
            <h3>{{ skill.title[lang] }}</h3>
            <p>{{ skill.description[lang] }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.safari {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #e0e5ec;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.toolbar {
  height: 40px;
  background: #e0e5ec;
  border-bottom: 1px solid #d1d9e6;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #fff;
}

.url-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #e0e5ec;
  border-radius: 12px;
  font-size: 13px;
  color: #666;
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #fff;
  
  .lock-icon {
    font-size: 12px;
  }
  
  .url-text {
    color: #333;
    font-weight: 500;
  }
}

.lang-toggle, .theme-toggle {
  padding: 6px 16px;
  background: #e0e5ec;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
  color: #667eea;
  cursor: pointer;
  box-shadow: 3px 3px 6px #b8b9be, -3px -3px 6px #fff;
  transition: all 0.2s;
  
  &:active {
    box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #fff;
  }
}

.theme-toggle {
  font-size: 16px;
  padding: 6px 12px;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  
  @media (max-width: 768px) {
    padding: 20px 16px 100px 16px; // Extra bottom padding for mobile dock
  }
}

.nav-bar {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 12px 32px;
  background: #e0e5ec;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  font-size: 15px;
  color: #666;
  cursor: pointer;
  box-shadow: 5px 5px 10px #b8b9be, -5px -5px 10px #fff;
  transition: all 0.3s;
  
  &:hover {
    color: #667eea;
  }
  
  &.active {
    color: #667eea;
    box-shadow: inset 3px 3px 7px #b8b9be, inset -3px -3px 7px #fff;
  }
}

.section {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 42px;
    font-weight: 700;
    margin: 0 0 12px 0;
    color: #2d3748;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }
  
  .badge {
    display: inline-block;
    padding: 8px 20px;
    background: #e0e5ec;
    border-radius: 20px;
    font-size: 14px;
    color: #667eea;
    font-family: 'Courier New', monospace;
    box-shadow: inset 2px 2px 5px #b8b9be, inset -2px -2px 5px #fff;
  }
}

.intro-text {
  font-size: 18px;
  line-height: 1.8;
  color: #4a5568;
  text-align: center;
  margin-bottom: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-bottom: 40px;
}

.neuro-card {
  padding: 32px;
  background: #e0e5ec;
  border-radius: 20px;
  box-shadow: 9px 9px 16px #b8b9be, -9px -9px 16px #fff;
  
  h3 {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 20px 0;
    color: #2d3748;
  }
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  padding: 8px 16px;
  background: #e0e5ec;
  border-radius: 12px;
  font-size: 13px;
  color: #4a5568;
  font-weight: 500;
  box-shadow: 3px 3px 6px #b8b9be, -3px -3px 6px #fff;
}

.chip-small {
  padding: 6px 12px;
  background: #e0e5ec;
  border-radius: 10px;
  font-size: 12px;
  color: #4a5568;
  font-weight: 500;
  box-shadow: 2px 2px 4px #b8b9be, -2px -2px 4px #fff;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 32px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.project-card {
  .project-header {
    margin-bottom: 16px;
    
    .category {
      display: inline-block;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #667eea;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    h3 {
      margin: 8px 0 0 0;
    }
  }
  
  .description {
    color: #4a5568;
    line-height: 1.7;
    margin-bottom: 20px;
  }
  
  .features-list {
    list-style: none;
    padding: 0;
    margin: 0 0 24px 0;
    
    li {
      padding: 8px 0;
      color: #4a5568;
      font-size: 14px;
      
      &::before {
        content: '→ ';
        color: #667eea;
        font-weight: bold;
        margin-right: 8px;
      }
    }
  }
  
  .project-footer {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-top: 20px;
    border-top: 2px solid #d1d9e6;
  }
  
  .stack-section {
    .stack-label {
      display: block;
      font-size: 12px;
      color: #718096;
      font-weight: 600;
      margin-bottom: 12px;
    }
  }
  
  .project-links {
    display: flex;
    gap: 12px;
  }
}

.neuro-btn {
  flex: 1;
  padding: 12px 24px;
  background: #e0e5ec;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 5px 5px 10px #b8b9be, -5px -5px 10px #fff;
  
  &.primary {
    color: #667eea;
  }
  
  &.secondary {
    color: #718096;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 7px 7px 14px #b8b9be, -7px -7px 14px #fff;
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: inset 3px 3px 7px #b8b9be, inset -3px -3px 7px #fff;
  }
  
  &.large {
    padding: 16px 40px;
    font-size: 16px;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: #2d3748;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
}

.github-cta {
  text-align: center;
  margin-top: 48px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.skill-card {
  padding: 24px;
  
  h3 {
    font-size: 18px;
    margin-bottom: 12px;
  }
  
  p {
    color: #4a5568;
    line-height: 1.6;
    font-size: 14px;
    margin: 0;
  }
}

// Dark mode styles
.safari.dark {
  background: #2d3748;
  
  .toolbar {
    background: #2d3748;
    border-bottom-color: #1a202c;
    box-shadow: inset 2px 2px 5px #1a202c, inset -3px -3px 7px #3a4556;
  }
  
  .url-bar {
    background: #2d3748;
    box-shadow: inset 2px 2px 5px #1a202c, inset -3px -3px 7px #3a4556;
    
    .url-text {
      color: #e2e8f0;
    }
  }
  
  .lang-toggle, .theme-toggle {
    background: #2d3748;
    color: #667eea;
    box-shadow: 3px 3px 6px #1a202c, -3px -3px 6px #3a4556;
  }
  
  .content {
    background: #2d3748;
  }
  
  .nav-btn {
    background: #2d3748;
    color: #a0aec0;
    box-shadow: 5px 5px 10px #1a202c, -5px -5px 10px #3a4556;
    
    &.active {
      box-shadow: inset 3px 3px 7px #1a202c, inset -3px -3px 7px #3a4556;
    }
  }
  
  .section-header {
    h1 {
      color: #e2e8f0;
    }
    
    .badge {
      background: #2d3748;
      box-shadow: inset 2px 2px 5px #1a202c, inset -2px -2px 5px #3a4556;
    }
  }
  
  .intro-text {
    color: #cbd5e0;
  }
  
  .neuro-card {
    background: #2d3748;
    box-shadow: 9px 9px 16px #1a202c, -9px -9px 16px #3a4556;
    
    h3 {
      color: #e2e8f0;
    }
  }
  
  .chip, .chip-small {
    background: #2d3748;
    color: #cbd5e0;
    box-shadow: 3px 3px 6px #1a202c, -3px -3px 6px #3a4556;
  }
  
  .description, .features-list li {
    color: #cbd5e0;
  }
  
  .project-footer {
    border-top-color: #4a5568;
  }
  
  .neuro-btn {
    background: #2d3748;
    box-shadow: 5px 5px 10px #1a202c, -5px -5px 10px #3a4556;
    
    &.large {
      color: #e2e8f0;
    }
  }
  
  .skill-card p {
    color: #cbd5e0;
  }
}
</style>
