import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import MemberView from "../views/MemberView.vue";
import TambahMemberView from "../views/TambahMemberView.vue";
import DataBukuView from "../views/DataBukuView.vue";
import TambahBukuView from "../views/TambahBukuView.vue";
import PeminjamanBukuView from "../views/PeminjamanBukuView.vue";
import TambahPeminjamanView from "../views/TambahPeminjamanView.vue";
import RiwayatPeminjamanView from "../views/RiwayatPeminjamanView.vue";
import DendaView from "../views/DendaView.vue";
import TambahDendaView from "../views/TambahDendaView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
  },
  {
    path: "/members",
    name: "members",
    component: MemberView,
  },
  {
    path: "/members/:id/riwayat-peminjaman",
    name: "riwayat-peminjaman",
    component: RiwayatPeminjamanView,
    props: true,
  },
  {
    path: "/members/tambah",
    name: "tambah-member",
    component: TambahMemberView,
  },
  {
    path: "/buku",
    name: "data-buku",
    component: DataBukuView,
  },
  {
    path: "/buku/tambah",
    name: "tambah-buku",
    component: TambahBukuView,
  },
  {
    path: "/peminjaman",
    name: "peminjaman",
    component: PeminjamanBukuView,
  },
  {
    path: "/peminjaman/tambah",
    name: "tambah-peminjaman",
    component: TambahPeminjamanView,
  },
  {
    path: "/denda",
    name: "denda",
    component: DendaView,
  },
  {
    path: "/tambah-denda",
    name: "tambah-denda",
    component: TambahDendaView,
  },
  {
    path: "/maps",
    name: "maps",
    component: () => import("@/views/MapView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
