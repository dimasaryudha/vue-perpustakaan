<template>
  <div class="dashboard">
    <!-- Statistik -->
    <div class="stats">
      <div class="stat-card red">
        <div class="icon"><i class="fas fa-user"></i></div>
        <div class="info">
          <p class="label">Total Member</p>
          <p class="value">{{ totalMember }}</p>
        </div>
      </div>

      <div class="stat-card purple">
        <div class="icon"><i class="fas fa-book"></i></div>
        <div class="info">
          <p class="label">Total Buku</p>
          <p class="value">{{ totalBuku }}</p>
        </div>
      </div>

      <div class="stat-card blue">
        <div class="icon"><i class="fas fa-file-invoice"></i></div>
        <div class="info">
          <p class="label">Total Peminjaman</p>
          <p class="value">{{ totalPeminjaman }}</p>
        </div>
      </div>

      <div class="stat-card green">
        <div class="icon"><i class="fas fa-undo-alt"></i></div>
        <div class="info">
          <p class="label">Total Pengembalian</p>
          <p class="value">{{ totalPengembalian }}</p>
        </div>
      </div>
    </div>

    <!-- Konten Utama -->
    <div class="main-content">
      <!-- Grafik -->
      <div class="chart">
        <h2>Grafik Peminjaman Buku</h2>
        <BarChart v-if="chartData" :chart-data="chartData" />
        <div v-else class="chart-placeholder">(Memuat grafik...)</div>
      </div>

      <!-- Pemberitahuan -->
      <div class="notifications">
        <h2>Pemberitahuan</h2>
        <div class="notification red">
          Davi Hardiansyah, Telah terdaftar menjadi anggota perpustakaan.
        </div>
        <div class="notification green">
          Admin PerpustakaanKU, Telah ditambahkan menjadi admin PerPusWeb yang baru.
        </div>
        <div class="notification blue">
          Buku Pertama Belajar Pemrograman JAVA, Buku bacaan baru yang ada di PerPusWeb.
        </div>
        <div class="notification yellow">
          Wardana Pengunjung baru di PerPusWeb.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BarChart from "@/components/BarChart.vue";

const MEMBER_API_URL = "http://45.64.100.26:88/perpus-api/public/api/member";
const BUKU_API_URL = "http://45.64.100.26:88/perpus-api/public/api/buku";
const PEMINJAMAN_API_URL = "http://45.64.100.26:88/perpus-api/public/api/peminjaman";

export default {
  name: "DashboardView",
  components: {
    BarChart,
  },
  data() {
    return {
      totalMember: 0,
      totalBuku: 0,
      totalPeminjaman: 0,
      totalPengembalian: 0,
      chartData: null,
    };
  },
  mounted() {
    this.fetchTotalMember();
    this.fetchTotalBuku();
    this.fetchTotalPeminjaman();
    this.fetchTotalPengembalian();
    this.fetchChartData();
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Silakan login terlebih dahulu.");
        this.$router.push("/login");
        return null;
      }
      return { Authorization: `Bearer ${token}` };
    },
    fetchTotalMember() {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      axios
        .get(MEMBER_API_URL, { headers })
        .then((res) => {
          const users = Array.isArray(res.data) ? res.data : res.data.data;
          this.totalMember = users.length;
        })
        .catch((err) => {
          alert("Gagal mengambil data anggota.");
          console.error(err);
        });
    },
    fetchTotalBuku() {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      axios
        .get(BUKU_API_URL, { headers })
        .then((res) => {
          const books = Array.isArray(res.data) ? res.data : res.data.data;
          this.totalBuku = books.length;
        })
        .catch((err) => {
          alert("Gagal mengambil data buku.");
          console.error(err);
        });
    },
    fetchTotalPeminjaman() {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      axios
        .get(PEMINJAMAN_API_URL, { headers })
        .then((res) => {
          const peminjaman = Array.isArray(res.data) ? res.data : res.data.data;
          this.totalPeminjaman = peminjaman.length;
        })
        .catch((err) => {
          alert("Gagal mengambil data peminjaman.");
          console.error(err);
        });
    },
      async fetchTotalPengembalian() {
      const headers = await this.getAuthHeaders();
      if (!headers) return;
      try {
        const response = await axios.get(PEMINJAMAN_API_URL, { headers });
        const data = response.data.data;
        this.totalPengembalian = data.filter(p => p.status_pengembalian === 1).length;
      } catch (error) {
        console.error("Gagal mengambil data pengembalian:", error);
      }
    },
    fetchChartData() {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      axios
        .get(PEMINJAMAN_API_URL, { headers })
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : res.data.data;

          const monthlyData = Array(12).fill(0);

          data.forEach((item) => {
            const date = new Date(item.tgl_pinjam); // pastikan fieldnya tgl_pinjam
            if (!isNaN(date)) {
              const month = date.getMonth();
              monthlyData[month]++;
            }
          });

          this.chartData = {
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "Mei",
              "Jun",
              "Jul",
              "Agu",
              "Sep",
              "Okt",
              "Nov",
              "Des",
            ],
            datasets: [
              {
                label: "Jumlah Peminjaman",
                backgroundColor: "#3498db",
                data: monthlyData,
              },
            ],
          };
        })
        .catch((err) => {
          alert("Gagal mengambil data grafik.");
          console.error(err);
        });
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
  font-family: sans-serif;

}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.stat-card .icon {
  font-size: 28px;
  margin-right: 12px;
}

.stat-card .label {
  font-size: 14px;
  color: #888;
}

.stat-card .value {
  font-size: 20px;
  font-weight: bold;
}

.stat-card.red .icon {
  color: #e74c3c;
}
.stat-card.purple .icon {
  color: #8e44ad;
}
.stat-card.blue .icon {
  color: #3498db;
}
.stat-card.green .icon {
  color: #27ae60;
}

.main-content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.chart,
.notifications {
  flex: 1 1 100%;
}

@media (min-width: 768px) {
  .chart {
    flex: 2;
  }
  .notifications {
    flex: 1;
  }
}

.chart {
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  max-height: 400px;
}

.chart-placeholder {
  height: 250px;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #aaa;
  border-radius: 4px;
  margin-top: 10px;
}

.notifications {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  max-height: 400px;
}

.notification {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 14px;
}

.notification.red {
  background: #fdecea;
  color: #c0392b;
}

.notification.green {
  background: #e9f7ef;
  color: #27ae60;
}

.notification.blue {
  background: #e8f4fd;
  color: #2980b9;
}

.notification.yellow {
  background: #fff9e6;
  color: #f39c12;
}
</style>
