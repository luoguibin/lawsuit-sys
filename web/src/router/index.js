import { createRouter, createWebHashHistory } from "vue-router"
import PageHome from "../page/home.vue"
import PageLogin from "../page/login.vue"

const routes = [
  { path: '/home', name: 'home', component: PageHome },
  { path: '/login', name: 'login', component: PageLogin }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router