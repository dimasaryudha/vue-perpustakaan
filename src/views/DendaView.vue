<template>
  <div class="container mt-4">
    <h2>Daftar Denda</h2>

    <router-link to="/tambah-denda" class="btn btn-primary mb-3">
      Tambah Denda
    </router-link>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>No</th>
          <th>Member</th>
          <th>Buku</th>
          <th>Jumlah Denda</th>
          <th>Jenis Denda</th>
          <th>Deskripsi</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(denda, idx) in dendaList" :key="denda.id">
          <td>{{ idx + 1 }}</td>
          <td>{{ getMemberName(denda.id_member) }}</td>
          <td>{{ getBukuJudul(denda.id_buku) }}</td>
          <td>{{ formatRupiah(denda.jumlah_denda) }}</td>
          <td>{{ denda.jenis_denda }}</td>
          <td>{{ denda.deskripsi || '-' }}</td>
          <td>
            <button class="btn btn-sm btn-danger" @click="hapusDenda(denda.id)">
              Hapus
            </button>
          </td>
        </tr>
        <tr v-if="dendaList.length === 0">
          <td colspan="7" class="text-center">Data denda tidak tersedia</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
const API_BASE_URL = "http://45.64.100.26:88/perpus-api/public/api";

export default {
  name: "DaftarDendaView",
  data() {
    return {
      dendaList: [],
      memberList: [],
      bukuList: [],
    };
  },
  created() {
    this.fetchAllData();
  },
  watch: {
    '$route.query.reload'(val) {
      if (val) {
        console.log("🔁 Reload triggered:", val); // log untuk debugging
        this.fetchAllData();
        this.$router.replace({ path: this.$route.path, query: {} }); // perbaikan: hapus query param
      }
    },
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

    async fetchAllData() {
      await Promise.all([this.fetchMembers(), this.fetchBuku()]);
      await this.fetchDenda();
    },

    async fetchDenda() {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/denda`, { headers });
        console.log("📥 Data denda:", res.data.data);
        this.dendaList = res.data.data || res.data;
      } catch (error) {
        console.error("Gagal mengambil data denda:", error);
        alert("Gagal mengambil data denda.");
      }
    },

    async fetchMembers() {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/member`, { headers });
        this.memberList = res.data.data || res.data;
      } catch (error) {
        console.error("Gagal mengambil data member:", error);
      }
    },

    async fetchBuku() {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/buku`, { headers });
        this.bukuList = res.data.data || res.data;
      } catch (error) {
        console.error("Gagal mengambil data buku:", error);
      }
    },

    getMemberName(id_member) {
      const member = this.memberList.find((m) => String(m.id) === String(id_member));
      return member ? member.nama : "-";
    },

    getBukuJudul(id_buku) {
      const buku = this.bukuList.find((b) => String(b.id) === String(id_buku));
      return buku ? buku.judul : "-";
    },

    formatRupiah(value) {
      if (!value) return "-";
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(value);
    },

    async hapusDenda(id) {
      if (!confirm("Yakin ingin menghapus data denda ini?")) return;

      const headers = this.getAuthHeaders();
      if (!headers) return;

      try {
        await axios.delete(`${API_BASE_URL}/denda/${id}`, { headers });
        alert("Data denda berhasil dihapus.");
        this.fetchDenda();
      } catch (error) {
        console.error("Gagal menghapus data denda:", error);
        alert("Gagal menghapus data denda.");
      }
    },
  },
};
</script>

