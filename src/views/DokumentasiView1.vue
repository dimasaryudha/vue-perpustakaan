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

    <div class="gallery">
        <img src="@/assets/doc.jpg" class="g1">
        <img src="@/assets/doc2.jpg" class="g2">
        <img src="@/assets/doc3.jpg" class="g3">
        <img src="@/assets/doc2.jpg" class="g4">
        <img src="@/assets/doc.jpg" class="g5">
        <img src="@/assets/doc3.jpg" class="g6">
        <img src="@/assets/doc.jpg" class="g7">
        <img src="@/assets/doc2.jpg" class="g8">
        <img src="@/assets/doc3.jpg" class="g9">
        <img src="@/assets/doc.jpg" class="g10">
        <img src="@/assets/doc2.jpg" class="g11">
    </div>
</template>

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
  border-radius: 6px;
  font-size: 14px;
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
}

.g1 { grid-column: span 2; }
.g3 { grid-row: span 2; }
.g6 { grid-column: span 2; }
.g8 { grid-row: span 2; }
.g10 { grid-column: span 2; }


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
}
</style>
