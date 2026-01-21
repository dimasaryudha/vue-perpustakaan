<template>
  <!-- BANNER -->
  <div class="banner">
    <img :src="doc1" alt="banner" />
  </div>

  <!-- TITLE -->
  <div class="title-container">
    <h1>Dokumentasi Perusahaan BPR Mitra Daya Mandiri</h1>
  </div>

  <!-- IMAGE GRID -->
  <div class="image-grid">
    <div
      class="image-wrapper"
      v-for="(event, index) in events"
      :key="index"
      @click="openModal(event)"
    >
      <img :src="event.cover" :alt="event.title" />
      <div class="overlay">{{ event.title }}</div>
    </div>
  </div>

  <!-- MODAL -->
  <div v-if="showModal" class="modal" @click.self="closeModal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>

      <h3 class="modal-title">{{ activeEvent.title }}</h3>

      <div class="modal-grid">
        <img
          v-for="(img, i) in activeEvent.photos"
          :key="i"
          :src="img"
        />
      </div>
    </div>
  </div>
</template>

<script>
// IMPORT GAMBAR (INI YANG BIKIN PASTI JALAN)
import doc1 from "@/assets/doc.jpg";
import doc2 from "@/assets/doc2.jpg";
import doc3 from "@/assets/doc3.jpg";

export default {
  name: "Dokumentasi",
  data() {
    return {
      doc1,
      doc2,
      doc3,

      showModal: false,
      activeEvent: {},

      // TIAP FOTO = 1 EVENT
      events: [
        {
          title: "Kunjungan Kantor",
          cover: doc1,
          photos: [doc1, doc2, doc3]
        },
        {
          title: "Rapat Internal",
          cover: doc2,
          photos: [doc2, doc3]
        },
        {
          title: "Pelatihan Pegawai",
          cover: doc3,
          photos: [doc3, doc1]
        },
        {
          title: "Sosialisasi Produk",
          cover: doc2,
          photos: [doc2, doc1]
        },
        {
          title: "Audit Tahunan",
          cover: doc1,
          photos: [doc1, doc3]
        },
        {
          title: "Kegiatan Sosial",
          cover: doc3,
          photos: [doc3, doc2]
        }
      ]
    };
  },
  methods: {
    openModal(event) {
      this.activeEvent = event;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  }
};
</script>

<style scoped>
/* BANNER */
.banner {
  width: 100%;
  height: 300px;
  overflow: hidden;
}
.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* TITLE */
.title-container {
  text-align: center;
  margin: 20px 0;
}
.title-container h1 {
  font-size: 24px;
  border-bottom: 2px solid #000;
  display: inline-block;
  padding-bottom: 5px;
}

/* GRID */
.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 20px;
}

.image-wrapper {
  position: relative;
  height: 180px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 8px;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.3s;
}

.image-wrapper:hover img {
  transform: scale(1.1);
}

/* OVERLAY */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: 0.3s;
  font-weight: bold;
}
.image-wrapper:hover .overlay {
  opacity: 1;
}

/* MODAL */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 20px;
  width: 90%;
  max-height: 90%;
  overflow-y: auto;
  border-radius: 10px;
}

.close {
  font-size: 26px;
  cursor: pointer;
  float: right;
}

.modal-title {
  text-align: center;
  margin-bottom: 15px;
}

/* MODAL GRID */
.modal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.modal-grid img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: 1fr;
  }
  .banner {
    height: 150px;
  }
}
</style>
