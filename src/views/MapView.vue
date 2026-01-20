<template>
  <div class="map-page">
    <div class="card">
      <h2 class="title">📍 Peta Perpustakaan Bogor</h2>

      <!-- PILIH PERPUSTAKAAN -->
      <select v-model="selectedLibrary" class="select">
        <option value="">Pilih Perpustakaan</option>
        <option
          v-for="(lib, i) in libraries"
          :key="i"
          :value="lib"
        >
          {{ lib.name }}
        </option>
      </select>

      <!-- PILIH TRANSPORTASI -->
      <select
        v-if="selectedLibrary"
        v-model="selectedTransport"
        class="select"
      >
        <option value="">Pilih Transportasi</option>
        <option value="walk">🚶 Jalan kaki</option>
        <option value="bike">🚲 Sepeda</option>
        <option value="motor">🏍️ Motor</option>
        <option value="car">🚗 Mobil</option>
      </select>

      <!-- INFO -->
      <div v-if="estimatedTime" class="info">
        <p>📏 Jarak: <b>{{ distance.toFixed(2) }} km</b></p>
        <p>⏱️ Estimasi Waktu: <b>{{ estimatedTime }} menit</b></p>
      </div>
    </div>

    <!-- MAP -->
    <div id="map"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

export default {
  name: "MapView",

  data() {
    return {
      map: null,
      routeControl: null,

      userLocation: {
        lat: null,
        lng: null
      },

      libraries: [
        { name: "Perpustakaan Kota Bogor", lat: -6.5971, lng: 106.8060 },
        { name: "Perpustakaan IPB", lat: -6.5596, lng: 106.7231 },
        { name: "Perpustakaan Balai Kota Bogor", lat: -6.5946, lng: 106.8013 },
        { name: "Perpustakaan Bogor Tengah", lat: -6.5956, lng: 106.7972 }
      ],

      selectedLibrary: "",
      selectedTransport: "",
      distance: null
    };
  },

  mounted() {
    this.getUserLocation();
  },

  computed: {
    estimatedTime() {
      if (!this.distance || !this.selectedTransport) return null;

      const speed = {
        walk: 5,
        bike: 15,
        motor: 30,
        car: 25
      };

      return Math.round((this.distance / speed[this.selectedTransport]) * 60);
    }
  },

  watch: {
    selectedLibrary() {
      this.selectedTransport = "";
      this.distance = null;
    }
  },

  methods: {
    getUserLocation() {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.userLocation.lat = pos.coords.latitude;
          this.userLocation.lng = pos.coords.longitude;
          this.initMap();
        },
        () => alert("Izin lokasi ditolak")
      );
    },

    initMap() {
      this.map = L.map("map").setView(
        [this.userLocation.lat, this.userLocation.lng],
        14
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
      }).addTo(this.map);

      L.marker([this.userLocation.lat, this.userLocation.lng])
        .addTo(this.map)
        .bindPopup("📍 Lokasi Anda")
        .openPopup();
    },

    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
  },

  watch: {
    selectedLibrary(lib) {
      if (!lib || !this.map) return;

      if (this.routeControl) {
        this.map.removeControl(this.routeControl);
      }

      this.distance = this.calculateDistance(
        this.userLocation.lat,
        this.userLocation.lng,
        lib.lat,
        lib.lng
      );

      this.routeControl = L.Routing.control({
        waypoints: [
          L.latLng(this.userLocation.lat, this.userLocation.lng),
          L.latLng(lib.lat, lib.lng)
        ],
        addWaypoints: false,
        draggableWaypoints: false,
        show: false,
        createMarker: () => null
      }).addTo(this.map);
    }
  }
};
</script>

<style scoped>
.map-page {
  max-width: 900px;
  margin: auto;
  font-family: "Segoe UI", sans-serif;
}

.card {
  background: white;
  padding: 16px;
  border-radius: 14px;
  margin-bottom: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.title {
  margin-bottom: 12px;
}

.select {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

.info {
  background: #f3f4f6;
  padding: 12px;
  border-radius: 10px;
  font-weight: 500;
}

#map {
  height: 520px;
  border-radius: 16px;
}
</style>
