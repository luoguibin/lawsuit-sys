import { createApp } from 'vue'
import ElementPlus from "element-plus"
import zhCn from "element-plus/lib/locale/lang/zh-cn"
import "element-plus/theme-chalk/index.css"
import "./style/index.css"
import config from "./common/config"
import store from "./store"
import App from './App.vue'
import router from "./router/index"

const app = createApp(App)
app.use(config)
app.use(store)
app.use(ElementPlus, { locale: zhCn })
app.use(router)

app.mount('#app')