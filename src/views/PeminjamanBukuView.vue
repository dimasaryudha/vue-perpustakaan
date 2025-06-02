<template>
  <div class="container mt-4">
    <h2>Daftar Peminjaman Buku</h2>

    <!-- Tombol Aksi -->
    <div class="mb-3 d-flex flex-wrap gap-2">
      <router-link to="/peminjaman/tambah" class="btn btn-primary flex-grow-1 flex-sm-grow-0">
        Tambah Peminjaman
      </router-link>
      <button class="btn btn-success flex-grow-1 flex-sm-grow-0" @click="exportToExcel">
        Export ke Excel
      </button>
    </div>

    <!-- Tabel Data -->
    <div class="table-responsive mb-4">
      <table class="table table-bordered align-middle">
        <thead class="table-primary text-center">
          <tr>
            <th>No</th>
            <th>Nama Member</th>
            <th>Judul Buku</th>
            <th>Tanggal Peminjaman</th>
            <th>Tanggal Pengembalian</th>
            <th>Status</th>
            <th>Jumlah Hari Terlambat</th>
            <th>Total Denda (Rp)</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="(peminjaman, index) in peminjamanList" :key="peminjaman.id">
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ peminjaman.member?.nama || "Data member tidak tersedia" }}</td>
            <td>{{ peminjaman.buku?.judul || "Data buku tidak tersedia" }}</td>
            <td>{{ formatTanggal(peminjaman.tgl_pinjam) }}</td>
            <td>{{ formatTanggal(peminjaman.tgl_pengembalian) }}</td>
            <td class="text-center">
              <span :class="{
                'text-success fw-semibold': peminjaman.status_pengembalian === 1,
                'text-danger fw-semibold': peminjaman.status_pengembalian !== 1
              }">
                {{ peminjaman.status_pengembalian === 1 ? 'Sudah Dikembalikan' : 'Belum Dikembalikan' }}
              </span>
            </td>
            <td class="text-center">
              {{ getJumlahHariDenda(peminjaman) }}
            </td>
            <td class="text-end">{{ formatRupiah(getTotalDenda(peminjaman)) }}</td>
            <td class="text-center">
              <button
                v-if="peminjaman.status_pengembalian !== 1"
                class="btn btn-sm btn-warning"
                @click="kembalikanBuku(peminjaman.id)"
              >
                Kembalikan
              </button>
              <span v-else class="text-muted">-</span>
            </td>
          </tr>
          <tr v-if="peminjamanList.length === 0">
            <td colspan="9" class="text-center">Data peminjaman kosong.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_BASE_URL = "http://45.64.100.26:88/perpus-api/public/api";

export default {
  name: "PeminjamanView",
  data() {
    return {
      peminjamanList: [],
      bukuList: [],
      memberList: [],
      dendaList: [],
      tarifDendaPerHari: 1000,
    };
  },
  mounted() {
    this.fetchAllData();
    this.fetchDenda();
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
      const headers = this.getAuthHeaders();
      if (!headers) return;

      try {
        const [peminjamanRes, bukuRes, memberRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/peminjaman`, { headers }),
          axios.get(`${API_BASE_URL}/buku`, { headers }),
          axios.get(`${API_BASE_URL}/member`, { headers }),
        ]);

        this.bukuList = bukuRes.data.data || bukuRes.data;
        this.memberList = memberRes.data.data || memberRes.data;

        const peminjamanData = peminjamanRes.data.data || peminjamanRes.data;

        this.peminjamanList = peminjamanData.map((item) => ({
          ...item,
          member: this.memberList.find((m) => m.id === item.id_member) || null,
          buku: this.bukuList.find((b) => b.id === item.id_buku) || null,
        }));
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        alert("Gagal mengambil data peminjaman, buku, atau member.");
      }
    },

    async fetchDenda() {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      try {
        const dendaRes = await axios.get(`${API_BASE_URL}/denda`, { headers });
        const dendaData = dendaRes.data.data || dendaRes.data;

        this.dendaList = dendaData.map((item) => ({
          ...item,
          jumlah_denda: Number(item.jumlah_denda) || 0,
        }));
      } catch (error) {
        console.error("Gagal mengambil data denda:", error);
        alert("Gagal mengambil data denda.");
      }
    },

    getJumlahHariDenda(peminjaman) {
      if (!peminjaman) return "-";
      if (peminjaman.status_pengembalian === 1) return 0;

      const tglPengembalian = new Date(peminjaman.tgl_pengembalian);
      const today = new Date();

      const tglPengembalianDateOnly = new Date(tglPengembalian.getFullYear(), tglPengembalian.getMonth(), tglPengembalian.getDate());
      const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      if (todayDateOnly <= tglPengembalianDateOnly) return 0;

      const diffTime = todayDateOnly - tglPengembalianDateOnly;
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    },

    getTotalDenda(peminjaman) {
      if (!peminjaman) return 0;
      if (peminjaman.status_pengembalian === 1) return 0;

      const jumlahHari = this.getJumlahHariDenda(peminjaman);
      if (jumlahHari <= 0) return 0;

      return jumlahHari * this.tarifDendaPerHari;
    },

    formatTanggal(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      if (isNaN(date)) return "-";
      return date.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
    },

    formatRupiah(number) {
      if (number == null || number === 0) return "-";
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(number);
    },

    exportToExcel() {
      const data = this.peminjamanList.map((item, index) => ({
        No: index + 1,
        "Nama Member": item.member?.nama || "N/A",
        "Judul Buku": item.buku?.judul || "N/A",
        "Tanggal Peminjaman": this.formatTanggal(item.tgl_pinjam),
        "Tanggal Pengembalian": this.formatTanggal(item.tgl_pengembalian),
        Status: item.status_pengembalian === 1 ? "Sudah Dikembalikan" : "Belum Dikembalikan",
        "Jumlah Hari Terlambat": this.getJumlahHariDenda(item),
        "Total Denda (Rp)": this.getTotalDenda(item),
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Peminjaman");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, "DataPeminjaman.xlsx");
    },

    async kembalikanBuku(id) {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      if (!confirm("Yakin ingin mengembalikan buku ini?")) return;

      try {
        const peminjaman = this.peminjamanList.find((p) => p.id === id);
        if (!peminjaman) return alert("Data peminjaman tidak ditemukan.");

        const today = new Date();
        const tglPengembalian = new Date(peminjaman.tgl_pengembalian);

        // Buat denda jika terlambat
        if (today > tglPengembalian) {
          const selisihHari = Math.floor((today - tglPengembalian) / (1000 * 60 * 60 * 24));
          const nominalDenda = selisihHari * this.tarifDendaPerHari;

          await axios.post(`${API_BASE_URL}/denda`, {
            id_member: peminjaman.id_member,
            id_buku: peminjaman.id_buku,
            jumlah_denda: nominalDenda,
            jenis_denda: "terlambat",
            deskripsi: `${selisihHari} hari keterlambatan`,
          }, { headers });
        }

        // Update status pengembalian
        await axios.put(`${API_BASE_URL}/peminjaman/pengembalian/${id}`, {}, { headers });

        // Tambah stok buku saat buku dikembalikan
        await this.tambahStokBuku(peminjaman.id_buku, 1);

        alert("Buku berhasil dikembalikan.");

        // Refresh data denda dan peminjaman supaya update UI
        await this.fetchAllData();
        await this.fetchDenda();
      } catch (error) {
        console.error("Gagal mengembalikan buku:", error.response?.data || error.message);
        alert("Gagal mengembalikan buku. Cek console untuk detail error.");
      }
    },

    async kurangiStokBuku(id_buku, jumlah = 1) {
      const headers = this.getAuthHeaders();
      if (!headers) return false;

      try {
        const buku = this.bukuList.find(b => b.id === id_buku);
        if (!buku) {
          alert("Buku tidak ditemukan.");
          return false;
        }
        if (buku.stok < jumlah) {
          alert("Stok buku tidak cukup.");
          return false;
        }
        const updatedStok = buku.stok - jumlah;
        await axios.put(`${API_BASE_URL}/buku/${id_buku}`, {
          ...buku,
          stok: updatedStok
        }, { headers });

        buku.stok = updatedStok;

        return true;
      } catch (error) {
        console.error("Gagal mengurangi stok buku:", error);
        alert("Gagal mengurangi stok buku.");
        return false;
      }
    },

    async tambahStokBuku(id_buku, jumlah = 1) {
      const headers = this.getAuthHeaders();
      if (!headers) return false;

      try {
        const buku = this.bukuList.find(b => b.id === id_buku);
        if (!buku) {
          alert("Buku tidak ditemukan.");
          return false;
        }
        const updatedStok = buku.stok + jumlah;
        await axios.put(`${API_BASE_URL}/buku/${id_buku}`, {
          ...buku,
          stok: updatedStok
        }, { headers });

        buku.stok = updatedStok;

        return true;
      } catch (error) {
        console.error("Gagal menambah stok buku:", error);
        alert("Gagal menambah stok buku.");
        return false;
      }
    },

    async tambahPeminjaman(dataPeminjaman) {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      try {
        await axios.post(`${API_BASE_URL}/peminjaman`, dataPeminjaman, { headers });

        const berhasilKurangi = await this.kurangiStokBuku(dataPeminjaman.id_buku, 1);
        if (!berhasilKurangi) return;

        alert("Peminjaman berhasil dan stok buku dikurangi.");

        await this.fetchAllData();
        await this.fetchDenda();
      } catch (error) {
        console.error("Gagal menambah peminjaman:", error);
        alert("Gagal menambah peminjaman.");
      }
    }
  }
};
</script>

<style scoped>
.table th, .table td {
  vertical-align: middle;
}
</style>
