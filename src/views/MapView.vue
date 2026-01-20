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

export default {
  name: "MapView",

  data() {
    return {
      map: null,
      userLocation: {
        lat: -6.6017,
        lng: 106.8050
      },
      libraries: [
        { name: "Perpustakaan Kota Bogor", lat: -6.5971, lng: 106.8060 },
        { name: "Perpustakaan IPB", lat: -6.5596, lng: 106.7231 }
      ],
      selectedLibrary: "",
      distance: null,
      libraryMarker: null
    };
  },

  mounted() {
    this.map = L.map("map").setView(
      [this.userLocation.lat, this.userLocation.lng],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(this.map);

    L.marker([this.userLocation.lat, this.userLocation.lng])
      .addTo(this.map)
      .bindPopup("Posisi Anda");
  },

  watch: {
    selectedLibrary(lib) {
      if (!lib) return;

      if (this.libraryMarker) {
        this.map.removeLayer(this.libraryMarker);
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

      this.map.setView([lib.lat, lib.lng], 14);
    }
  },

  methods: {
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
  }
};
</script>

<style>
#map {
  height: 500px;
  margin-top: 10px;
}
</style>
