<template>
  <div class="container mt-4">
    <h2>Tambah Denda Baru</h2>

    <form @submit.prevent="createDenda" autocomplete="off" class="mb-4">
      <div class="mb-3">
        <label class="form-label">Member</label>
        <select v-model="form.id_member" class="form-select" required>
          <option value="" disabled>Pilih Member</option>
          <option v-for="member in memberList" :key="member.id" :value="member.id">
            {{ member.nama }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Buku</label>
        <select v-model="form.id_buku" class="form-select" required>
          <option value="" disabled>Pilih Buku</option>
          <option v-for="buku in bukuList" :key="buku.id" :value="buku.id">
            {{ buku.judul }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Jumlah Denda</label>
        <input
          v-model.number="form.jumlah_denda"
          type="number"
          min="0"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Jenis Denda</label>
        <select v-model="form.jenis_denda" class="form-select" required>
          <option disabled value="">Pilih Jenis Denda</option>
          <option value="terlambat">Terlambat</option>
          <option value="kerusakan">Kerusakan</option>
          <option value="lainnya">Lainnya</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Deskripsi</label>
        <textarea v-model="form.deskripsi" class="form-control" placeholder="Misal: cover rusak"></textarea>
      </div>

      <button type="submit" class="btn btn-primary">Tambah Denda</button>
      <router-link to="/denda" class="btn btn-secondary ms-2">Kembali</router-link>
    </form>
  </div>
</template>

<script>
import axios from "axios";

const API_BASE_URL = "http://45.64.100.26:88/perpus-api/public/api";

export default {
  name: "TambahDendaView",
  data() {
    return {
      form: {
        id_member: "",
        id_buku: "",
        jumlah_denda: 0,
        jenis_denda: "",
        deskripsi: "",
      },
      memberList: [],
      bukuList: [],
    };
  },
  mounted() {
    this.fetchMembers();
    this.fetchBuku();
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

async createDenda() {
  const headers = this.getAuthHeaders();
  if (!headers) return;

  try {
    await axios.post(`${API_BASE_URL}/denda`, this.form, { headers });
    alert("Denda berhasil ditambahkan!");
    this.$router.push({ path: "/denda", query: { reload: Date.now() } }); // ⬅️ Trigger reload
  } catch (err) {
    const msg = err.response?.data?.message || "Gagal menambahkan denda.";
    alert(msg);
    console.error("Error tambah denda:", err);
  }
},

  },
};
</script>
