<template>
    <div class="banner full-width">
        <img src="@/assets/doc.jpg" alt="banner" />
    </div>
  
    <div class="title-container">
        <h1>Dokumentasi Perusahaan BPR Mitra Daya Mandiri</h1>
    </div>

    <div class="image-grid">
        <img src="@/assets/doc.jpg" alt="img1" class="img1">
        <img src="@/assets/doc2.jpg" alt="img2" class="img2">
        <img src="@/assets/doc3.jpg" alt="img3" class="img3">
        <img src="@/assets/doc2.jpg" alt="img4" class="img4">
        <img src="@/assets/doc.jpg" alt="img5" class="img5">
        <img src="@/assets/doc3.jpg" alt="img6" class="img6">
        <img src="@/assets/doc3.jpg" alt="img7" class="img7">
        <img src="@/assets/doc.jpg" alt="img8" class="img8">
        <img src="@/assets/doc2.jpg" alt="img9" class="img9">
    </div>
</template>

<style>
body {
  margin: 0;
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

.img1 {
  grid-column: span 2; 
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.img2 {
  object-fit: cover;   
  width: 100%;
  height: 100%;
}

.img3 {
  grid-row: span 2;      
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.img4 {
  grid-row: span 2;     
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.img5 {
  object-fit: cover;    
  width: 100%;
  height: 100%;
}

.img6 {
  object-fit: cover;     
  width: 100%;
  height: 100%;
}

.img7 {
  object-fit: cover;     
  width: 100%;
  height: 100%;
}

.img8, .img9 {
  object-fit: cover;     
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

  .img1, .img3, .img4, .img7 {
    grid-column: span 1;
    grid-row: span 1;
  }
}
</style>
