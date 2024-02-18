import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    name: "Home",
    path: "/",
    component: () => import("../views/CreateCard.vue")
  },
  {
    name: "ShareCard",
    path: "/share",
    component: () => import("../views/ShareCard.vue")
  },
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
