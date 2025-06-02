<template>
  <div class="container mt-4">
    <h2>Tambah Buku Baru</h2>
    <form @submit.prevent="submitForm" class="mt-3">
      <div class="mb-3">
        <label for="no_rak" class="form-label">No Rak</label>
        <input type="text" id="no_rak" v-model="form.no_rak" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="judul" class="form-label">Judul</label>
        <input type="text" id="judul" v-model="form.judul" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="pengarang" class="form-label">Pengarang</label>
        <input type="text" id="pengarang" v-model="form.pengarang" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="tahun_terbit" class="form-label">Tahun Terbit</label>
        <input type="number" id="tahun_terbit" v-model.number="form.tahun_terbit" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="penerbit" class="form-label">Penerbit</label>
        <input type="text" id="penerbit" v-model="form.penerbit" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="stok" class="form-label">Stok</label>
        <input type="number" id="stok" v-model.number="form.stok" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="detail" class="form-label">Detail</label>
        <textarea id="detail" v-model="form.detail" class="form-control" rows="3" required></textarea>
      </div>

      <button type="submit" class="btn btn-primary">Simpan</button>
      <router-link to="/buku" class="btn btn-secondary ms-2">Batal</router-link>
    </form>
  </div>
</template>

<script>
import axios from "axios";

const API_BASE_URL = "http://45.64.100.26:88/perpus-api/public/api/buku";

export default {
  name: "TambahBukuView",
  data() {
    return {
      form: {
        no_rak: "",
        judul: "",
        pengarang: "",
        tahun_terbit: null,
        penerbit: "",
        stok: 0,
        detail: ""
      }
    };
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
    submitForm() {
      
      this.form.stok=this.form.stok.toString();
      this.form.tahun_terbit=this.form.tahun_terbit.toString();
      console.log(this.form)
      const headers = this.getAuthHeaders();
      if (!headers) return;

      axios.post(API_BASE_URL, this.form, { headers })
        .then(() => {
          alert("Buku berhasil ditambahkan.");
          this.$router.push("/buku");
        })
        .catch(err => {
          console.error("Gagal menambahkan buku:", err);
          alert("Gagal menambahkan buku.");
        });
    }
  }
};
</script>
