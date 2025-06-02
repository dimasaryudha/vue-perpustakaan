<template>
  <div class="container mt-4">
    <h2>Tambah Member Baru</h2>

    <form autocomplete="off" @submit.prevent="createUser" class="mb-4">
      <div class="mb-3">
        <label class="form-label">No KTP</label>
        <input
          v-model="form.no_ktp"
          type="text"
          class="form-control"
          required
          maxlength="16"
          pattern="^\d{16}$"
          title="No KTP harus terdiri dari 16 digit angka"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Nama</label>
        <input
          v-model="form.nama"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Alamat</label>
        <input
          v-model="form.alamat"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Tanggal Lahir</label>
        <input
          v-model="form.tgl_lahir"
          type="date"
          class="form-control"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary">Tambah Member</button>
      <router-link to="/members" class="btn btn-secondary ms-2">Kembali</router-link>
    </form>
  </div>
</template>

<script>
import axios from "axios";

const API_BASE_URL = "http://45.64.100.26:88/perpus-api/public/api/member";

export default {
  name: "TambahMemberView",
  data() {
    return {
      form: {
        no_ktp: "",
        nama: "",
        alamat: "",
        tgl_lahir: ""
      }
    };
  },
  methods: {
    async createUser() {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Silakan login terlebih dahulu.");
        this.$router.push("/login");
        return;
      }

      // Validasi No KTP
      const noKtp = this.form.no_ktp;
      if (!/^\d{16}$/.test(noKtp)) {
        alert("No KTP harus terdiri dari 16 digit angka.");
        return;
      }

      try {
        await axios.post(API_BASE_URL, this.form, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        alert("Member berhasil ditambahkan!");
        this.$router.push({ path: "/members", query: { reload: Date.now() } });
      } catch (err) {
        const msg = err.response?.data?.message || "Gagal menambahkan member.";
        alert(msg);
        console.error("Error saat tambah member:", err);
      }
    }
  }
};
</script>
