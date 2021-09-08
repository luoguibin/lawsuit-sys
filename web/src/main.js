import { createApp } from 'vue'
import ElementPlus from "element-plus"
import "element-plus/theme-chalk/index.css"
import "./style/index.css"
import store from "./store";
import App from './App.vue'
import router from "./router/index"

const app = createApp(App)
app.use(store)
app.use(ElementPlus)
app.use(router)

app.mount('#app')