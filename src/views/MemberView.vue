<template>
  <div class="container mt-4">
    <h2>Daftar Member</h2>

    <div class="row align-items-center mb-3">
      <div class="col-md-6 col-12 mb-2 mb-md-0">
        <router-link to="/members/tambah" class="btn btn-primary mb-3">Tambah Member</router-link>
      </div>
      <div class="col-md-6 col-12 text-md-end">
        <input
          type="text"
          class="form-control d-inline-block w-75"
          v-model="searchNama"
          placeholder="Cari Nama Member..."
        />
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered align-middle">
        <thead class="table-primary text-center">
          <tr>
            <th>No KTP</th>
            <th>Nama</th>
            <th>Alamat</th>
            <th>Tanggal Lahir</th>
            <th>Aksi</th>
            <th>Riwayat</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.no_ktp }}</td>
            <td>{{ user.nama }}</td>
            <td>{{ user.alamat }}</td>
            <td>{{ user.tgl_lahir }}</td>
            <td class="text-center">
              <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-info" @click="showDetail(user)">
                  <i class="bi bi-eye-fill"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" @click="startEdit(user)">
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user.id)">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </td>
            <td class="text-center">
              <router-link
                :to="{ name: 'riwayat-peminjaman', params: { id: user.id } }"
                class="btn btn-sm btn-info"
              >
                Lihat Riwayat
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Detail / Edit Member -->
    <div v-if="selectedUser && !isEditing" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-content p-3">
          <h4>Detail Member</h4>
          <p><strong>No KTP:</strong> {{ selectedUser.no_ktp }}</p>
          <p><strong>Nama:</strong> {{ selectedUser.nama }}</p>
          <p><strong>Alamat:</strong> {{ selectedUser.alamat }}</p>
          <p><strong>Tanggal Lahir:</strong> {{ selectedUser.tgl_lahir }}</p>
          <button class="btn btn-secondary mt-3" @click="closeModal">Tutup</button>
        </div>
      </div>
    </div>

    <div v-if="selectedUser && isEditing" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-content p-3">
          <h4>Edit Member</h4>
          <form @submit.prevent="updateUser">
            <div class="mb-3">
              <label class="form-label">No KTP</label>
              <input v-model="editForm.no_ktp" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Nama</label>
              <input v-model="editForm.nama" type="text" class="form-control" required />
            </div>
            <!-- Email dihapus dari form edit -->
            <div class="mb-3">
              <label class="form-label">Alamat</label>
              <textarea v-model="editForm.alamat" class="form-control" required></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Tanggal Lahir</label>
              <input v-model="editForm.tgl_lahir" type="date" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary me-2">Simpan</button>
            <button type="button" class="btn btn-secondary" @click="cancelEdit">Batal</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const API_BASE_URL = "http://45.64.100.26:88/perpus-api/public/api/member";

export default {
  name: "MemberView",
  data() {
    return {
      users: [],
      searchNama: "",
      selectedUser: null,
      isEditing: false,
      editForm: {
        no_ktp: "",
        nama: "",
        alamat: "",
        tgl_lahir: ""
      }
    };
  },
  mounted() {
    this.fetchUsers();
  },
  watch: {
    '$route'(to) {
      if (to.query.reload) {
        this.fetchUsers();
      }
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user =>
        (user.nama || "")
          .toLowerCase()
          .includes(this.searchNama.toLowerCase())
      );
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
    fetchUsers() {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      axios
        .get(API_BASE_URL, { headers })
        .then((res) => {
          // API response bisa berupa array langsung atau objek data
          const data = Array.isArray(res.data) ? res.data : res.data.data;

          this.users = data.map((u) => ({
            id: u.id,
            no_ktp: u.no_ktp,
            nama: u.nama,
            email: u.email,
            alamat: u.alamat,
            tgl_lahir: u.tgl_lahir
          }));
        })
        .catch((err) => {
          alert("Gagal mengambil data member.");
          console.error(err);
        });
    },
    showDetail(user) {
      this.selectedUser = user;
      this.isEditing = false;
    },
    startEdit(user) {
      this.selectedUser = user;
      this.isEditing = true;
      this.editForm = {
        no_ktp: user.no_ktp,
        nama: user.nama,
        alamat: user.alamat,
        tgl_lahir: user.tgl_lahir
      };
    },
    cancelEdit() {
      this.closeModal();
    },
    closeModal() {
      this.selectedUser = null;
      this.isEditing = false;
      this.editForm = { no_ktp: "", nama: "", alamat: "", tgl_lahir: "" };
    },
    updateUser() {
      const headers = this.getAuthHeaders();
      if (!headers) return;

      const payload = {
        no_ktp: this.editForm.no_ktp,
        nama: this.editForm.nama,
        alamat: this.editForm.alamat,
        tgl_lahir: this.editForm.tgl_lahir
      };

      axios
        .put(`${API_BASE_URL}/${this.selectedUser.id}`, payload, { headers })
        .then(() => {
          alert("Member berhasil diperbarui!");
          this.fetchUsers();
          this.closeModal();
        })
        .catch((err) => {
          alert("Gagal memperbarui member.");
          console.error(err);
        });
    },
    deleteUser(id) {
      if (!confirm("Yakin ingin menghapus member ini?")) return;

      const headers = this.getAuthHeaders();
      if (!headers) return;

      axios
        .delete(`${API_BASE_URL}/${id}`, { headers })
        .then(() => {
          alert("Member berhasil dihapus!");
          this.fetchUsers();
        })
        .catch((err) => {
          alert("Gagal menghapus member.");
          console.error(err);
        });
    }
  }
};
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  padding: 1rem;
  overflow-y: auto;
}

.modal-dialog {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .modal-dialog {
    max-width: 100%;
    padding: 0.5rem;
  }

  .btn-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    justify-content: center;
  }
}
</style>
