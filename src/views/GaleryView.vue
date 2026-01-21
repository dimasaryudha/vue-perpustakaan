<template>
    <div class="banner full-width">
        <img src="@/assets/doc.jpg" alt="banner" />
    </div>

    <div class="title-container">
        <h1>Dokumentasi Perusahaan BPR Mitra Daya Mandiri</h1>
    </div>

    <div class="image-grid">
        <div class="item img1">
            <img src="@/assets/doc.jpg">
            <span>Rapat Tahunan Perusahaan</span>
        </div>

        <div class="item img2">
            <img src="@/assets/doc2.jpg">
            <span>Sosialisasi Produk</span>
        </div>

        <div class="item img3">
            <img src="@/assets/doc3.jpg">
            <span>Kegiatan CSR</span>
        </div>

        <div class="item img4">
            <img src="@/assets/doc2.jpg">
            <span>Pelatihan Karyawan</span>
        </div>

        <div class="item img5">
            <img src="@/assets/doc.jpg">
            <span>Monitoring Cabang</span>
        </div>

        <div class="item img6">
            <img src="@/assets/doc3.jpg">
            <span>Audit Internal</span>
        </div>

        <div class="item img7">
            <img src="@/assets/doc3.jpg">
            <span>Perayaan HUT Perusahaan</span>
        </div>

        <div class="item img8">
            <img src="@/assets/doc.jpg">
            <span>Kunjungan Nasabah</span>
        </div>

        <div class="item img9">
            <img src="@/assets/doc2.jpg">
            <span>Kerja Sama Mitra</span>
        </div>
    </div>
</template>

<style>
body {
  margin: 0;
  overflow-x: hidden;
}

.banner {
  width: 1456px;
  height: 300px;
  overflow: hidden;
}

.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.full-width {
  margin-left: -16px;
  margin-right: -56px;
  margin-top: -16px;
}

.title-container {
  text-align: center;
  margin-top: 20px;
}

.title-container h1 {
  display: inline-block;
  font-size: 24px;
  padding-bottom: 5px;
  border-bottom: 2px solid #000;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 150px;
  gap: 10px;
  padding: 20px;
}

.item {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.item span {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px;
  font-size: 14px;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  text-align: center;
}

.img1 {
  grid-column: span 2;
}

.img3 {
  grid-row: span 2;
}

.img4 {
  grid-row: span 2;
}

.img2,
.img5,
.img6,
.img7,
.img8,
.img9 {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .banner {
    height: 120px;
  }

  .title-container h1 {
    font-size: 18px;
  }

  .image-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: 150px;
  }

  .img1,
  .img3,
  .img4 {
    grid-column: span 1;
    grid-row: span 1;
  }
}
</style>
