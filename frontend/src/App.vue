<template>
  <div id="app" class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">🚀 Cabinet ACTe - MissionFlow</h1>
        <p class="app-subtitle">Système de gestion de missions et tâches</p>
      </div>
    </header>

    <main class="app-main">
      <TaskList />
    </main>

    <footer class="app-footer">
      <p>&copy; 2026 Cabinet ACTe. Tous droits réservés.</p>
    </footer>
  </div>
</template>

<script>
import TaskList from './components/TaskList.vue'

export default {
  name: 'App',
  components: {
    TaskList
  },
  data() {
    return {
      appVersion: '1.0.0'
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica',
    'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
  color: #333;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.app-subtitle {
  font-size: 1.1rem;
  font-weight: 300;
  opacity: 0.9;
}

.app-main {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 30px 20px;
}

.app-footer {
  background-color: #333;
  color: #999;
  text-align: center;
  padding: 20px;
  margin-top: auto;
  border-top: 1px solid #555;
}

.app-footer p {
  margin: 0;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .app-title {
    font-size: 1.8rem;
  }

  .app-subtitle {
    font-size: 1rem;
  }

  .app-main {
    padding: 20px 10px;
  }
}
</style>
