<template>
  <div class="container mt-4">
    <h2>Lokasi Peminjam & Perpustakaan</h2>

    <div id="map" class="map-container"></div>

    <div class="mt-3">
      <p><strong>Lokasi Anda:</strong> {{ userLat }}, {{ userLng }}</p>
      <p><strong>Perpustakaan:</strong> {{ libraryLat }}, {{ libraryLng }}</p>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "MapView",
  data() {
    return {
      map: null,
      userLat: null,
      userLng: null,

      // 📌 KOORDINAT PERPUSTAKAAN (contoh: SMK Wikrama Bogor)
      libraryLat: -6.6407,
      libraryLng: 106.8231,
    };
  },
  mounted() {
    this.getUserLocation();
  },
  methods: {
    getUserLocation() {
      if (!navigator.geolocation) {
        alert("Browser tidak mendukung GPS.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLat = position.coords.latitude;
          this.userLng = position.coords.longitude;
          this.initMap();
        },
        () => {
          alert("Gagal mengambil lokasi Anda.");
        }
      );
    },

    initMap() {
      this.map = L.map("map").setView(
        [this.userLat, this.userLng],
        14
      );

      // Map tile
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(this.map);

      // Marker user
      L.marker([this.userLat, this.userLng])
        .addTo(this.map)
        .bindPopup("📍 Posisi Anda")
        .openPopup();

      // Marker perpustakaan
      L.marker([this.libraryLat, this.libraryLng])
        .addTo(this.map)
        .bindPopup("🏫 Perpustakaan");

      // Garis antara user & perpustakaan
      L.polyline(
        [
          [this.userLat, this.userLng],
          [this.libraryLat, this.libraryLng],
        ],
        { color: "blue" }
      ).addTo(this.map);
    },
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
  border-radius: 8px;
}
</style>
