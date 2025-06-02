<template>
  <div class="container mt-4">
    <h2>Riwayat Peminjaman Member: {{ memberName }}</h2>

    <div class="mb-3">
      <button @click="$router.back()" class="btn btn-secondary me-2">Kembali</button>
      <button @click="cetakPDF" class="btn btn-primary">Cetak PDF</button>
    </div>

    <div ref="pdfContent">
      <table class="table table-bordered">
        <thead class="table-light text-center">
          <tr>
            <th>No</th>
            <th>Judul Buku</th>
            <th>Tanggal Peminjaman</th>
            <th>Tanggal Pengembalian</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pinjam, index) in riwayatList" :key="pinjam.id">
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ pinjam.buku?.judul || "Data buku tidak tersedia" }}</td>
            <td>{{ formatTanggal(pinjam.tgl_pinjam) }}</td>
            <td>{{ formatTanggal(pinjam.tgl_pengembalian) }}</td>
            <td class="text-center">
              <span :class="{
                'text-success fw-semibold': pinjam.status === 'kembali',
                'text-danger fw-semibold': pinjam.status !== 'kembali'
              }">
                {{ pinjam.status === 'kembali' ? 'Sudah Dikembalikan' : 'Belum Dikembalikan' }}
              </span>
            </td>
          </tr>
          <tr v-if="riwayatList.length === 0">
            <td colspan="5" class="text-center">Riwayat peminjaman kosong.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import html2pdf from "html2pdf.js";

const API_BASE_URL = "http://45.64.100.26:88/perpus-api/public/api";

export default {
  name: "RiwayatPeminjamanView",
  props: ['id'], // id member
  data() {
    return {
      riwayatList: [],
      bukuList: [],
      memberName: '',
    };
  },
  mounted() {
    this.fetchRiwayat();
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
    async fetchRiwayat() {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      try {
        const [memberRes, peminjamanRes, bukuRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/member/${this.id}`, { headers }),
          axios.get(`${API_BASE_URL}/peminjaman/${this.id}`, { headers }),
          axios.get(`${API_BASE_URL}/buku`, { headers }),
        ]);

        this.memberName = memberRes.data.nama || "Unknown";
        const bukuList = bukuRes.data.data || bukuRes.data;
        this.bukuList = bukuList;

        const peminjamanList = peminjamanRes.data.data || peminjamanRes.data;

        // Gabungkan data buku dan status pengembalian
        this.riwayatList = peminjamanList.map(p => ({
          ...p,
          buku: bukuList.find(b => b.id === p.id_buku) || null,
          status: p.status_pengembalian === 1 ? 'kembali' : 'belum',
        }));

      } catch (error) {
        console.error("Gagal mengambil data riwayat peminjaman:", error);
        alert("Gagal mengambil data peminjaman atau buku.");
      }
    },
    formatTanggal(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      if (isNaN(date)) return "-";
      return date.toLocaleDateString("id-ID", {
        year: "numeric", month: "short", day: "numeric"
      });
    },
    cetakPDF() {
      const element = this.$refs.pdfContent;
      const opt = {
        margin: 0.5,
        filename: `Riwayat_Peminjaman_${this.memberName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().from(element).set(opt).save();
    }
  }
};
</script>

<style scoped>
.table td, .table th {
  vertical-align: middle;
}
</style>
