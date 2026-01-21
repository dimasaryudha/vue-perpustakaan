<template>
  <div class="banner full-width">
    <router-link to="/galery" class="back-btn">
      ←
    </router-link>

    <img src="@/assets/doc.jpg" alt="banner" />
  </div>

  <div class="title-container">
    <h1>Rapat Tahunan Perusahaan</h1>
  </div>

  <!-- GALLERY -->
  <div class="gallery">
    <img src="@/assets/doc.jpg" class="g1" @click="openZoom($event)">
    <img src="@/assets/doc2.jpg" class="g2" @click="openZoom($event)">
    <img src="@/assets/doc3.jpg" class="g3" @click="openZoom($event)">
    <img src="@/assets/doc2.jpg" class="g4" @click="openZoom($event)">
    <img src="@/assets/doc.jpg" class="g5" @click="openZoom($event)">
    <img src="@/assets/doc3.jpg" class="g6" @click="openZoom($event)">
    <img src="@/assets/doc.jpg" class="g7" @click="openZoom($event)">
    <img src="@/assets/doc2.jpg" class="g8" @click="openZoom($event)">
    <img src="@/assets/doc3.jpg" class="g9" @click="openZoom($event)">
    <img src="@/assets/doc.jpg" class="g10" @click="openZoom($event)">
    <img src="@/assets/doc2.jpg" class="g11" @click="openZoom($event)">
  </div>

  <!-- ZOOM MODAL -->
  <div v-if="isZoom" class="zoom-overlay" @click.self="closeZoom">
    <div class="zoom-box">
      <button class="close-btn" @click="closeZoom">✕</button>
      <img :src="zoomImage" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isZoom = ref(false)
const zoomImage = ref('')

const openZoom = (event) => {
  zoomImage.value = event.target.src
  isZoom.value = true
}

const closeZoom = () => {
  isZoom.value = false
}
</script>

<style>
body {
  margin: 0;
  overflow-x: hidden;
}

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
  padding: 8px 14px;
  color: #fff;
  text-decoration: none;
  font-size: 20px;
}

.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title-container {
  text-align: center;
  margin: 20px 0;
}

.title-container h1 {
  display: inline-block;
  font-size: 24px;
  padding-bottom: 5px;
  border-bottom: 2px solid #000;
}

/* GALLERY */
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
  transition: transform 0.3s;
}

.gallery img:hover {
  transform: scale(1.05);
}

.g1 { grid-column: span 2; }
.g3 { grid-row: span 2; }
.g6 { grid-column: span 2; }
.g8 { grid-row: span 2; }
.g10 { grid-column: span 2; }

/* ZOOM */
.zoom-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.zoom-box {
  position: relative;
  background: #fff;
  padding: 12px;
  border-radius: 10px;
  max-width: 70%;
  max-height: 80%;
  animation: zoomIn 0.25s ease;
}

.zoom-box img {
  max-width: 100%;
  max-height: 60vh;
  border-radius: 6px;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  font-size: 26px;
  cursor: pointer;
}

/* Animasi */
@keyframes zoomIn {
  from {
    transform: scale(0.85);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .banner {
    height: 120px;
  }

  .gallery {
    grid-template-columns: 1fr;
    grid-auto-rows: 180px;
  }

  .g1, .g3, .g6, .g8, .g10 {
    grid-column: span 1;
    grid-row: span 1;
  }

  .zoom-box {
    max-width: 90%;
  }
}
</style>
