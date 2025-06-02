<template>
  <div class="container mt-4">
    <h2>Tambah Peminjaman Baru</h2>

    <form autocomplete="off" @submit.prevent="createPeminjaman" class="mb-4">
      <div class="mb-3">
        <label class="form-label">Pilih Buku</label>
        <select v-model="form.id_buku" class="form-select" required>
          <option disabled value="">-- Pilih Buku --</option>
          <option v-for="buku in bukuList" :key="buku.id" :value="buku.id">
            {{ buku.judul }} (Rak: {{ buku.no_rak }})
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Pilih Member</label>
        <select v-model="form.id_member" class="form-select" required>
          <option disabled value="">-- Pilih Member --</option>
          <option v-for="member in memberList" :key="member.id" :value="member.id">
            {{ member.nama }} (No KTP: {{ member.no_ktp }})
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Tanggal Peminjaman</label>
        <input v-model="form.tgl_pinjam" type="date" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Tanggal Pengembalian</label>
        <input v-model="form.tgl_pengembalian" type="date" class="form-control" required />
      </div>

      <button type="submit" class="btn btn-primary">Tambah Peminjaman</button>
      <router-link to="/peminjaman" class="btn btn-secondary ms-2">Kembali</router-link>
    </form>
  </div>
</template>

<script>
import axios from "axios";

const API_BASE_URL = "http://45.64.100.26:88/perpus-api/public/api";

export default {
  name: "TambahPeminjamanView",
  data() {
    return {
      bukuList: [],
      memberList: [],
      form: {
        id_buku: "",
        id_member: "",
        tgl_pinjam: "",
        tgl_pengembalian: ""
      }
    };
  },
  mounted() {
    this.fetchBuku();
    this.fetchMember();
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
    fetchBuku() {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      axios.get(`${API_BASE_URL}/buku`, { headers })
        .then(res => {
          this.bukuList = Array.isArray(res.data) ? res.data : res.data.data;
        })
        .catch(err => {
          console.error("Gagal mengambil data buku:", err);
          alert("Gagal mengambil data buku.");
        });
    },
    fetchMember() {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      axios.get(`${API_BASE_URL}/member`, { headers })
        .then(res => {
          this.memberList = Array.isArray(res.data) ? res.data : res.data.data;
        })
        .catch(err => {
          console.error("Gagal mengambil data member:", err);
          alert("Gagal mengambil data member.");
        });
    },
    async createPeminjaman() {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      try {
        // Tambah peminjaman
        const payload = {
          id_buku: this.form.id_buku,
          id_member: this.form.id_member,
          tgl_pinjam: this.form.tgl_pinjam,
          tgl_pengembalian: this.form.tgl_pengembalian
        };

        await axios.post(`${API_BASE_URL}/peminjaman`, payload, { headers });

        // Update stok buku
        const buku = this.bukuList.find(b => b.id === this.form.id_buku);
        if (buku && buku.stok > 0) {
          const updatedBuku = { ...buku, stok: buku.stok - 1 };
          await axios.put(`${API_BASE_URL}/buku/${buku.id}`, updatedBuku, { headers });
        }

        alert("Peminjaman berhasil ditambahkan!");
        this.$router.push({ path: "/peminjaman", query: { reload: Date.now() } });

      } catch (err) {
        const msg = err.response?.data?.message || "Gagal menambahkan peminjaman.";
        alert(msg);
        console.error("Error saat tambah peminjaman:", err);
      }
    }
  }
};
</script>
