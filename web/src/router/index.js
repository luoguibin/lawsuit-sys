import { createRouter, createWebHashHistory } from "vue-router"
import { user } from "../store"
import PageHome from "../page/home.vue"
import PageLogin from "../page/login.vue"
import Manage from "../page/manage.vue"

const routes = [
  { path: '/home', name: 'home', component: PageHome },
  { path: '/login', name: 'login', component: PageLogin },
  { path: '/manage', name: 'manage', component: Manage },
  { path: '/:catchAll(.*)', redirect: 'home' },
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