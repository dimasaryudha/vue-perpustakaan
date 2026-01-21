<template>
  <div class="map-page">
    <!-- HEADER -->
    <div class="header">
      <h1 class="title">📍 Peta Perpustakaan Bogor</h1>
      <p class="subtitle">Temukan perpustakaan terdekat dari lokasi Anda</p>
    </div>

    <!-- CONTROL CARD -->
    <div class="card">
      <div class="form-group">
        <label class="label">Pilih Perpustakaan</label>
        <select v-model="selectedLibrary" class="select">
          <option value="">-- Pilih Perpustakaan --</option>
          <option v-for="(lib, i) in libraries" :key="i" :value="lib">
            {{ lib.name }}
          </option>
        </select>
      </div>

      <div v-if="selectedLibrary" class="form-group">
        <label class="label">Pilih Transportasi</label>
        <div class="transport-options">
          <button
            v-for="transport in transportOptions"
            :key="transport.value"
            @click="selectedTransport = transport.value"
            :class="['transport-btn', { active: selectedTransport === transport.value }]"
          >
            {{ transport.icon }} {{ transport.name }}
          </button>
        </div>
      </div>

      <!-- INFO -->
      <div v-if="estimatedTime && selectedLibrary" class="info-box">
        <div class="info-item">
          <span>📏 Jarak:</span>
          <strong>{{ distance.toFixed(2) }} km</strong>
        </div>
        <div class="info-item">
          <span>⏱️ Waktu:</span>
          <strong>{{ estimatedTime }} menit</strong>
        </div>
      </div>
    </div>

    <!-- MAP -->
    <div class="map-container">
      <div id="map"></div>
    </div>

    <!-- LIBRARY LIST -->
    <div class="card">
      <h3 class="section-title">Daftar Perpustakaan</h3>
      <div class="library-list">
        <div
          v-for="(lib, i) in libraries"
          :key="i"
          @click="selectedLibrary = lib"
          :class="['library-item', { active: selectedLibrary === lib }]"
        >
          <div class="library-content">
            <h4>{{ lib.name }}</h4>
            <p class="address">{{ lib.address }}</p>
            <p v-if="userLocation.lat" class="distance">
              {{ calculateDistance(userLocation.lat, userLocation.lng, lib.lat, lib.lng).toFixed(2) }} km dari Anda
            </p>
          </div>
        </div>
      </div>
    </div>
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
      libraryMarker: null,

      userLocation: {
        lat: null,
        lng: null,
      },

      libraries: [
        {
          name: "Perpustakaan Kota Bogor",
          lat: -6.5971,
          lng: 106.806,
          address: "Jl. Ir. H. Juanda No.10, Paledang, Bogor Tengah",
        },
        {
          name: "Perpustakaan IPB",
          lat: -6.5596,
          lng: 106.7231,
          address: "Kampus IPB Dramaga, Bogor",
        },
        {
          name: "Perpustakaan Balai Kota Bogor",
          lat: -6.5946,
          lng: 106.8013,
          address: "Jl. Ir. H. Juanda No.10, Bogor",
        },
        {
          name: "Perpustakaan Bogor Tengah",
          lat: -6.5956,
          lng: 106.7972,
          address: "Jl. Veteran, Bogor Tengah",
        },
      ],

      transportOptions: [
        { value: "walk", icon: "🚶", name: "Jalan Kaki" },
        { value: "bike", icon: "🚲", name: "Sepeda" },
        { value: "motor", icon: "🏍️", name: "Motor" },
        { value: "car", icon: "🚗", name: "Mobil" },
      ],

      selectedLibrary: "",
      selectedTransport: "",
      distance: null,
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
        car: 25,
      };

      return Math.round((this.distance / speed[this.selectedTransport]) * 60);
    },
  },

  methods: {
    getUserLocation() {
      if (!navigator.geolocation) {
        alert("Geolokasi tidak didukung oleh browser Anda");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.userLocation.lat = pos.coords.latitude;
          this.userLocation.lng = pos.coords.longitude;
          this.initMap();
        },
        () => {
          alert("Izin lokasi ditolak. Menggunakan lokasi default Bogor.");
          this.userLocation.lat = -6.5971;
          this.userLocation.lng = 106.806;
          this.initMap();
        }
      );
    },

    initMap() {
      this.map = L.map("map").setView([this.userLocation.lat, this.userLocation.lng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(this.map);

      // User marker
      const userIcon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      L.marker([this.userLocation.lat, this.userLocation.lng], {
        icon: userIcon,
      })
        .addTo(this.map)
        .bindPopup("📍 Lokasi Anda")
        .openPopup();
    },

    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;

      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    },
  },

  watch: {
    selectedLibrary(lib) {
      if (!lib || !this.map) return;

      // Hapus route lama
      if (this.routeControl) {
        this.map.removeControl(this.routeControl);
      }

      // Hapus marker lama
      if (this.libraryMarker) {
        this.map.removeLayer(this.libraryMarker);
      }

      // Hitung jarak
      this.distance = this.calculateDistance(this.userLocation.lat, this.userLocation.lng, lib.lat, lib.lng);

      // Icon perpustakaan
      const libraryIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // Marker perpustakaan
      this.libraryMarker = L.marker([lib.lat, lib.lng], {
        icon: libraryIcon,
      })
        .addTo(this.map)
        .bindPopup(`📚 ${lib.name}`)
        .openPopup();

      // Route
      this.routeControl = L.Routing.control({
        waypoints: [L.latLng(this.userLocation.lat, this.userLocation.lng), L.latLng(lib.lat, lib.lng)],
        addWaypoints: false,
        draggableWaypoints: false,
        show: false,
        createMarker: () => null,
      }).addTo(this.map);

      // Fit bounds
      this.map.fitBounds(
        [
          [this.userLocation.lat, this.userLocation.lng],
          [lib.lat, lib.lng],
        ],
        { padding: [50, 50] }
      );
    },
  },
};
</script>

<style scoped>
.map-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

/* HEADER */
.header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 2rem;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 1rem;
}

/* CARD */
.card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

/* FORM */
.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.select {
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.select:hover {
  border-color: #9ca3af;
}

.select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* TRANSPORT */
.transport-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px;
}

.transport-btn {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
  font-family: inherit;
}

.transport-btn:hover {
  border-color: #3b82f6;
  background: #f9fafb;
}

.transport-btn.active {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
}

/* INFO BOX */
.info-box {
  display: flex;
  gap: 20px;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 8px;
  margin-top: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item span {
  font-size: 0.9rem;
  color: #6b7280;
}

.info-item strong {
  font-size: 1.1rem;
  color: #1f2937;
}

/* MAP */
.map-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

#map {
  height: 500px;
  width: 100%;
}

/* LIBRARY LIST */
.section-title {
  font-size: 1.25rem;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.library-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.library-item {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.library-item:hover {
  border-color: #3b82f6;
  background: #f9fafb;
}

.library-item.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.library-content h4 {
  margin: 0 0 6px 0;
  font-size: 1.05rem;
  color: #1f2937;
}

.library-content .address {
  margin: 0 0 4px 0;
  font-size: 0.9rem;
  color: #6b7280;
}

.library-content .distance {
  margin: 0;
  font-size: 0.85rem;
  color: #3b82f6;
  font-weight: 500;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .map-page {
    padding: 15px;
  }

  .title {
    font-size: 1.5rem;
  }

  .card {
    padding: 20px;
  }

  #map {
    height: 400px;
  }

  .transport-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-box {
    flex-direction: column;
    gap: 12px;
  }
}
</style>