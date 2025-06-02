<template>
  <div class="container mt-4">
    <h2>Daftar Buku</h2>
    <router-link to="/buku/tambah" class="btn btn-primary mb-3">Tambah Buku</router-link>

    <div class="table-responsive">
      <table class="table table-bordered align-middle">
        <thead class="table-primary text-center">
          <tr>
            <th>No Rak</th>
            <th>Judul</th>
            <th>Pengarang</th>
            <th>Tahun Terbit</th>
            <th>Penerbit</th>
            <th>Stok</th>
            <th>Detail</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="buku in bukuList" :key="buku.id">
            <td>{{ buku.no_rak }}</td>
            <td>{{ buku.judul }}</td>
            <td>{{ buku.pengarang }}</td>
            <td>{{ buku.tahun_terbit }}</td>
            <td>{{ buku.penerbit }}</td>
            <td>{{ buku.stok }}</td>
            <td>{{ buku.detail }}</td>
            <td class="text-center">
              <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-info" @click="showDetail(buku)">
                  <i class="bi bi-eye-fill"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" @click="showEdit(buku)">
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteBuku(buku.id)">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Detail / Edit -->
    <div v-if="selectedBuku" class="modal-overlay" @click.self="closeForm">
      <div class="modal-content">
        <h4>{{ isEditMode ? 'Edit Buku' : 'Detail Buku' }}</h4>
        <form @submit.prevent="isEditMode ? updateBuku() : null">
          <div class="mb-3">
            <label class="form-label">No Rak</label>
            <input type="text" class="form-control" v-model="form.no_rak" :disabled="!isEditMode" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Judul</label>
            <input type="text" class="form-control" v-model="form.judul" :disabled="!isEditMode" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Pengarang</label>
            <input type="text" class="form-control" v-model="form.pengarang" :disabled="!isEditMode" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Tahun Terbit</label>
            <input type="number" class="form-control" v-model.number="form.tahun_terbit" :disabled="!isEditMode" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Penerbit</label>
            <input type="text" class="form-control" v-model="form.penerbit" :disabled="!isEditMode" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Stok</label>
            <input type="number" class="form-control" v-model.number="form.stok" :disabled="!isEditMode" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Detail</label>
            <input type="text" class="form-control" v-model="form.detail" :disabled="!isEditMode" required />
          </div>

          <div>
            <button v-if="isEditMode" type="submit" class="btn btn-success me-2">Simpan</button>
            <button type="button" class="btn btn-secondary" @click="closeForm">Batal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const API_BASE_URL = "http://45.64.100.26:88/perpus-api/public/api/buku";

export default {
  name: "DataBukuView",
  data() {
    return {
      bukuList: [],
      selectedBuku: null,
      isEditMode: false,
      form: {
        no_rak: "",
        judul: "",
        pengarang: "",
        tahun_terbit: null,
        penerbit: "",
        stok: null,
        detail: ""
      }
    };
  },
  mounted() {
    this.fetchBuku();
  },
  watch: {
    '$route.query.reload'(val) {
      if (val) this.fetchBuku();
    }
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

      axios.get(API_BASE_URL, { headers })
        .then(res => {
          this.bukuList = Array.isArray(res.data) ? res.data : res.data.data;
        })
        .catch(err => {
          console.error("Gagal mengambil data buku:", err);
          alert("Gagal mengambil data buku.");
        });
    },
    showDetail(buku) {
      this.isEditMode = false;
      this.selectedBuku = buku;
      this.form = { ...buku };
    },
    showEdit(buku) {
      this.isEditMode = true;
      this.selectedBuku = buku;
      this.form = { ...buku };
    },
    closeForm() {
      this.selectedBuku = null;
      this.isEditMode = false;
      this.form = {
        no_rak: "",
        judul: "",
        pengarang: "",
        tahun_terbit: null,
        penerbit: "",
        stok: null,
        detail: ""
      };
    },
    updateBuku() {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      axios.put(`${API_BASE_URL}/${this.selectedBuku.id}`, this.form, { headers })
        .then(() => {
          alert("Data buku berhasil diperbarui.");
          this.fetchBuku();
          this.closeForm();
        })
        .catch(err => {
          console.error("Gagal memperbarui data buku:", err);
          alert("Gagal memperbarui data buku.");
        });
    },
    deleteBuku(id) {
      if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
        const headers = this.getAuthHeaders();
        if (!headers) return;

        axios.delete(`${API_BASE_URL}/${id}`, { headers })
          .then(() => {
            alert("Buku berhasil dihapus.");
            if (this.selectedBuku && this.selectedBuku.id === id) {
              this.closeForm();
            }
            this.fetchBuku();
          })
          .catch(err => {
            console.error("Gagal menghapus buku:", err);
            alert("Gagal menghapus buku.");
          });
      }
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: white;
  border-radius: 6px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

@media (max-width: 576px) {
  .modal-content {
    padding: 15px;
  }

  table th, table td {
    font-size: 0.85rem;
    padding: 0.4rem;
  }

  .btn-group .btn {
    padding: 0.25rem 0.5rem;
  }
}
</style>
