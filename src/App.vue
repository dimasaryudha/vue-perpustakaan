<template>
  <!-- class full-height dan no scroll -->
  <div id="app" :class="isLoginPage ? 'login-page' : 'app-layout'">
    <!-- Sidebar hanya jika bukan halaman login -->
    <Sidebar v-if="!isLoginPage" />

    <!-- Main content -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'

export default {
  components: { Sidebar },
  computed: {
    isLoginPage() {
      return this.$route.path === '/login'
    }
  }
}
</script>

<style>
/* Global reset */
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

/* Wrapper style jika buka halaman login */
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar-visible: konten scrollable */
.app-layout .main-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  height: 100vh;
}

/* Login page full height dan no scroll sama sekali */
.login-page {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
}
.login-page .main-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0;
}
</style>
