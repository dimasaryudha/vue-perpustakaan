<template>
  <div class="container mt-4">
    <h2>Daftar Buku</h2>

    <div class="row align-items-center mb-3">
      <div class="col-md-6 col-12 mb-2 mb-md-0">
        <router-link to="/buku/tambah" class="btn btn-primary">
          Tambah Buku
        </router-link>
      </div>

      <div class="col-md-6 col-12 text-md-end">
        <input
          type="text"
          class="form-control d-inline-block w-75"
          v-model="searchJudul"
          placeholder="Cari judul buku..."
        />
      </div>
    </div>

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
          <tr v-for="buku in filteredBuku" :key="buku.id">
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

    <div v-if="selectedBuku && !isEditing" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content p-3 position-relative">

          <button
            type="button"
            class="btn-close position-absolute top-0 end-0 m-3"
            @click="closeModal">
          </button>

          <h4>Detail Buku</h4>

          <div class="mb-2">
            <label class="form-label">No Rak</label>
            <input class="form-control" :value="selectedBuku.no_rak" readonly />
          </div>

          <div class="mb-2">
            <label class="form-label">Judul</label>
            <input class="form-control" :value="selectedBuku.judul" readonly />
          </div>

          <div class="mb-2">
            <label class="form-label">Pengarang</label>
            <input class="form-control" :value="selectedBuku.pengarang" readonly />
          </div>

          <div class="mb-2">
            <label class="form-label">Tahun Terbit</label>
            <input class="form-control" :value="selectedBuku.tahun_terbit" readonly />
          </div>

          <div class="mb-2">
            <label class="form-label">Penerbit</label>
            <input class="form-control" :value="selectedBuku.penerbit" readonly />
          </div>

          <div class="mb-2">
            <label class="form-label">Stok</label>
            <input class="form-control" :value="selectedBuku.stok" readonly />
          </div>

          <div class="mb-2">
            <label class="form-label">Detail</label>
            <textarea class="form-control" readonly>{{ selectedBuku.detail }}</textarea>
          </div>

        </div>
      </div>
    </div>

    <div v-if="selectedBuku && isEditing" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content p-3 position-relative">

          <button
            type="button"
            class="btn-close position-absolute top-0 end-0 m-3"
            @click="cancelEdit">
          </button>

          <h4>Edit Buku</h4>

          <form @submit.prevent="updateBuku">
            <div class="mb-2">
              <label>No Rak</label>
              <input class="form-control" v-model="editForm.no_rak" required />
            </div>

            <div class="mb-2">
              <label>Judul</label>
              <input class="form-control" v-model="editForm.judul" required />
            </div>

            <div class="mb-2">
              <label>Pengarang</label>
              <input class="form-control" v-model="editForm.pengarang" required />
            </div>

            <div class="mb-2">
              <label>Tahun Terbit</label>
              <input type="number" class="form-control" v-model="editForm.tahun_terbit" required />
            </div>

            <div class="mb-2">
              <label>Penerbit</label>
              <input class="form-control" v-model="editForm.penerbit" required />
            </div>

            <div class="mb-2">
              <label>Stok</label>
              <input type="number" class="form-control" v-model="editForm.stok" required />
            </div>

            <div class="mb-3">
              <label>Detail</label>
              <textarea class="form-control" v-model="editForm.detail"></textarea>
            </div>

            <button type="submit" class="btn btn-primary me-2">Simpan</button>
          </form>

        </div>
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
      searchJudul: "",

      selectedBuku: null,
      isEditing: false,

      editForm: {
        no_rak: "",
        judul: "",
        pengarang: "",
        tahun_terbit: "",
        penerbit: "",
        stok: "",
        detail: ""
      }
    };
  },

  mounted() {
    this.fetchBuku();
  },

  computed: {
    filteredBuku() {
      return this.bukuList.filter(buku =>
        (buku.judul || "")
          .toLowerCase()
          .includes(this.searchJudul.toLowerCase())
      );
    }
  },

  methods: {
    // ================= AUTH =================
    getAuthHeaders() {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Silakan login terlebih dahulu.");
        this.$router.push("/login");
        return null;
      }
      return { Authorization: `Bearer ${token}` };
    },

    // ================= FETCH =================
    fetchBuku() {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      axios.get(API_BASE_URL, { headers })
        .then(res => {
          this.bukuList = Array.isArray(res.data)
            ? res.data
            : res.data.data;
        })
        .catch(err => {
          console.error(err);
          alert("Gagal mengambil data buku");
        });
    },

    // ================= DETAIL =================
    showDetail(buku) {
      this.selectedBuku = buku;
      this.isEditing = false;
    },

    // ================= EDIT =================
    showEdit(buku) {
      this.selectedBuku = buku;
      this.isEditing = true;
      this.editForm = { ...buku };
    },

    // ================= CLOSE =================
    closeModal() {
      this.selectedBuku = null;
      this.isEditing = false;
      this.resetForm();
    },

    cancelEdit() {
      this.closeModal();
    },

    resetForm() {
      this.editForm = {
        no_rak: "",
        judul: "",
        pengarang: "",
        tahun_terbit: "",
        penerbit: "",
        stok: "",
        detail: ""
      };
    },

    // ================= UPDATE =================
    updateBuku() {
      const headers = this.getAuthHeaders();
      if (!headers || !this.selectedBuku) return;

      axios.put(`${API_BASE_URL}/${this.selectedBuku.id}`, this.editForm, { headers })
        .then(() => {
          alert("Data buku berhasil diperbarui");
          this.fetchBuku();
          this.closeModal();
        })
        .catch(err => {
          console.error(err);
          alert("Gagal memperbarui data buku");
        });
    },

    // ================= DELETE =================
    deleteBuku(id) {
      if (!confirm("Yakin hapus buku ini?")) return;

      const headers = this.getAuthHeaders();
      if (!headers) return;

      axios.delete(`${API_BASE_URL}/${id}`, { headers })
        .then(() => {
          alert("Buku berhasil dihapus");
          this.fetchBuku();
        })
        .catch(err => {
          console.error(err);
          alert("Gagal menghapus buku");
        });
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9999;
}

.modal-dialog {
  width: 100%;
  max-width: 500px;
  padding: 1rem;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
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
