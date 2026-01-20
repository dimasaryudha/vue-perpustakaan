<template>
  <div>
    <h2>Peta Perpustakaan Bogor</h2>

    <select v-model="selectedLibrary">
      <option value="">Pilih Perpustakaan</option>
      <option
        v-for="(lib, index) in libraries"
        :key="index"
        :value="lib"
      >
        {{ lib.name }}
      </option>
    </select>

    <p v-if="distance">
      Jarak: {{ distance.toFixed(2) }} km
    </p>

    <div id="map"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
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

      userAddress: "Mengambil alamat...",

      libraries: [
        { name: "Perpustakaan Kota Bogor", lat: -6.5971, lng: 106.8060 },
        { name: "Perpustakaan IPB", lat: -6.5596, lng: 106.7231 },
        { name: "Perpustakaan Umum Bogor Tengah", lat: -6.5956, lng: 106.7972 },
        { name: "Perpustakaan Balai Kota Bogor", lat: -6.5946, lng: 106.8013 },
        { name: "Perpustakaan Pusat Dokumentasi dan Informasi Bogor", lat: -6.5939, lng: 106.8085 }
      ],

      selectedLibrary: "",
      distance: null,
      libraryMarker: null,
      userMarker: null
    };
  },

  mounted() {
    this.getUserLocation();
  },

  methods: {
    getUserLocation() {
      if (!navigator.geolocation) {
        alert("Browser tidak mendukung GPS");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation.lat = position.coords.latitude;
          this.userLocation.lng = position.coords.longitude;

          this.initMap();
          this.getUserAddress();
        },
        () => {
          alert("Izin lokasi ditolak");
        }
      );
    },

    initMap() {
      this.map = L.map("map").setView(
        [this.userLocation.lat, this.userLocation.lng],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
      }).addTo(this.map);

      this.userMarker = L.marker([
        this.userLocation.lat,
        this.userLocation.lng
      ])
        .addTo(this.map)
        .bindPopup(`
          <b>📍 Lokasi Anda</b><br/>
          ${this.userAddress}
        `);
    },

    getUserAddress() {
      axios
        .get("https://nominatim.openstreetmap.org/reverse", {
          params: {
            format: "json",
            lat: this.userLocation.lat,
            lon: this.userLocation.lng
          }
        })
        .then((res) => {
          this.userAddress = res.data.display_name;

          if (this.userMarker) {
            this.userMarker.setPopupContent(`
              <b>📍 Lokasi Anda</b><br/>
              ${this.userAddress}
            `);
          }
        })
        .catch(() => {
          this.userAddress = "Alamat tidak ditemukan";
        });
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

      if (this.libraryMarker) {
        this.map.removeLayer(this.libraryMarker);
      }

      if (this.routeControl) {
        this.map.removeControl(this.routeControl);
      }

      this.libraryMarker = L.marker([lib.lat, lib.lng])
        .addTo(this.map)
        .bindPopup(lib.name)
        .openPopup();

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
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        show: false,
        createMarker: () => null,
        lineOptions: {
          styles: [{ weight: 5 }]
        }
      }).addTo(this.map);
    }
  }
};
</script>

<style>
#map {
  height: 500px;
  margin-top: 10px;
}
</style>
