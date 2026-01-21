<template>
  <div class="banner full-width">
    <router-link to="/galery" class="back-btn">←</router-link>
    <img src="@/assets/doc.jpg" alt="banner" />
  </div>

  <div class="title-container">
    <h1>Rapat Tahunan Perusahaan</h1>
  </div>

  <!-- GALLERY -->
  <div class="gallery">
    <img src="@/assets/doc.jpg" class="g1" data-title="Rapat Tahunan" @click="openZoom">
    <img src="@/assets/doc2.jpg" class="g2" data-title="Sosialisasi Produk" @click="openZoom">
    <img src="@/assets/doc3.jpg" class="g3" data-title="Kegiatan CSR" @click="openZoom">
    <img src="@/assets/doc2.jpg" class="g4" data-title="Pelatihan Karyawan" @click="openZoom">
    <img src="@/assets/doc.jpg" class="g5" data-title="Monitoring Cabang" @click="openZoom">
    <img src="@/assets/doc3.jpg" class="g6" data-title="Audit Internal" @click="openZoom">
    <img src="@/assets/doc.jpg" class="g7" data-title="Kunjungan Nasabah" @click="openZoom">
    <img src="@/assets/doc2.jpg" class="g8" data-title="Kerja Sama Mitra" @click="openZoom">
    <img src="@/assets/doc3.jpg" class="g9" data-title="Perayaan HUT" @click="openZoom">
    <img src="@/assets/doc.jpg" class="g10" data-title="Rapat Evaluasi" @click="openZoom">
    <img src="@/assets/doc2.jpg" class="g11" data-title="Diskusi Tim" @click="openZoom">
  </div>

  <!-- ZOOM MODAL -->
  <div v-if="isZoom" class="zoom-overlay" @click.self="closeZoom">
    <div class="zoom-box">
      <!-- TOMBOL BACK / CLOSE -->
      <button class="close-btn" @click="closeZoom">✕</button>

      <div class="zoom-image-wrapper">
        <img :src="zoomImage" />
        <div class="zoom-caption">{{ zoomTitle }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isZoom = ref(false)
const zoomImage = ref('')
const zoomTitle = ref('')

const openZoom = (e) => {
  zoomImage.value = e.target.src
  zoomTitle.value = e.target.dataset.title
  isZoom.value = true
}

const closeZoom = () => {
  isZoom.value = false
}
</script>

<style>
/* ==== UMUM ==== */
body {
  margin: 0;
  overflow-x: hidden;
}

/* ==== BANNER ==== */
.banner {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  color: #fff;
  font-size: 20px;
  text-decoration: none;
}

.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ==== TITLE ==== */
.title-container {
  text-align: center;
  margin: 20px 0;
}

.title-container h1 {
  font-size: 24px;
  border-bottom: 2px solid #000;
  display: inline-block;
}

/* ==== GALLERY ==== */
.gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 160px;
  gap: 12px;
  padding: 20px;
  grid-auto-flow: dense;
}

.gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
}

.g1 { grid-column: span 2; }
.g3 { grid-row: span 2; }
.g6 { grid-column: span 2; }
.g8 { grid-row: span 2; }
.g10 { grid-column: span 2; }

/* ==== ZOOM ==== */
.zoom-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* FRAME DIHILANGKAN */
.zoom-box {
  position: relative;
  background: transparent;
  padding: 0;
  width: 90vw;
  height: 90vh;
}

/* FOTO LEBIH GEDE */
.zoom-image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.zoom-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* JUDUL FOTO */
.zoom-caption {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 12px;
  font-size: 16px;
  color: #fff;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  text-align: center;
}

/* TOMBOL CLOSE */
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  font-size: 22px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  cursor: pointer;
  z-index: 1000;
}

.close-btn:hover {
  background: rgba(0,0,0,0.85);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .banner {
    height: 120px;
  }

  .gallery {
    grid-template-columns: 1fr;
  }

  .zoom-box {
    width: 100vw;
    height: 85vh;
  }
}

</style>
