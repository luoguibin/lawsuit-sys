import { createRouter, createWebHashHistory } from "vue-router"
import { user } from "../store"
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

router.beforeEach(function (to, from, next) {
  if (to.name === 'login' && user.token) {
    return next(false)
  }
  next()
})

export default router