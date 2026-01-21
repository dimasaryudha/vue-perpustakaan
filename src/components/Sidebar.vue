<template>
  <div :class="['sidebar', { collapsed }]">
    <!-- Header Logo dan Toggle -->
    <div class="d-flex align-items-center mb-4 justify-content-between">
      <div class="d-flex align-items-center" v-if="!collapsed">
        <i class="bi bi-book fs-3 text-primary me-2"></i>
        <span class="fs-4 fw-bold">Perpustakaan</span>
      </div>
      <button class="btn btn-toggle" @click="toggleSidebar">
        <i :class="collapsed ? 'bi bi-chevron-double-right' : 'bi bi-chevron-double-left'"></i>
      </button>
    </div>

    <!-- Menu Navigasi -->
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item" v-for="item in menuItems" :key="item.path">
        <router-link :to="item.path" :class="['nav-link', 'sidebar-link', isActive(item) ? 'active' : '']">
          <i :class="item.icon" class="me-2"></i>
          <span v-if="!collapsed">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>

    <!-- Tombol Logout -->
    <div class="mt-auto">
      <button v-if="isLoggedIn" @click="logout" class="btn btn-logout w-100 d-flex align-items-center">
        <i class="bi bi-box-arrow-right me-2"></i>
        <span v-if="!collapsed">Logout</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      collapsed: false,
      menuItems: [
        {
          path: "/dashboard",
          label: "Dashboard",
          icon: "bi bi-house-door",
        },
        {
          path: "/galery",
          label: "Galery",
          icon: "bi bi-image",
          matchPaths: ["/galery"]
        },
        {
          path: "/maps",
          label: "Maps",
          icon: "bi bi-geo-alt",
          matchPaths: ["/maps"],
        },

        {
          path: "/members",
          label: "Members",
          icon: "bi bi-people",
          matchPaths: ["/members", "/members/tambah", "/members/edit"],
        },
        {
          path: "/buku",
          label: "Buku",
          icon: "bi bi-journal-bookmark",
          matchPaths: ["/buku", "/buku/tambah", "/buku/edit"],
        },
        {
          path: "/peminjaman",
          label: "Peminjaman",
          icon: "bi bi-calendar-check",
          matchPaths: ["/peminjaman", "/peminjaman/tambah", "/peminjaman/edit"],
        },
        {
          path: "/denda",
          label: "Denda",
          icon: "bi bi-cash-stack",
          matchPaths: ["/denda", "/denda/tambah", "/denda/edit"],
        },
      ],
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem("access_token");
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      this.$router.push("/login");
    },
    toggleSidebar() {
      this.collapsed = !this.collapsed;
    },
    isActive(item) {
      const currentPath = this.$route.path;
      if (item.matchPaths && Array.isArray(item.matchPaths)) {
        return item.matchPaths.some((path) => currentPath.startsWith(path));
      }
      return currentPath === item.path || currentPath.startsWith(item.path + "/");
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #ffffff;
  color: #000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: width 0.3s;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-link {
  color: #000;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  transition:
    background-color 0.3s,
    color 0.3s;
  display: flex;
  align-items: center;
  text-decoration: none;
  white-space: nowrap;
}

.sidebar-link:hover,
.sidebar-link:focus,
.sidebar-link:active {
  background-color: #ffffff !important;
  color: #000 !important;
  outline: none;
  box-shadow: none;
}

.active {
  background-color: #ffffff !important;
  font-weight: 700;
  padding-left: calc(1rem - 4px);
  border-left: 4px solid #2a86dd;
  color: #000 !important;
}

.btn-logout {
  background-color: transparent !important;
  border: none;
  color: #000;
  font-weight: 500;
  padding: 0.5rem 1rem;
  text-align: left;
  transition: background-color 0.2s ease;
  border-radius: 0.375rem;
}

.btn-logout:hover {
  background-color: #f0f0f0;
}

.btn-toggle {
  background: none;
  border: none;
  color: #000;
  font-size: 1.25rem;
}
</style>
