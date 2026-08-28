import { createApp } from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import App from "./App.vue";
import router from "./router";
import { setupStore } from "@/store";
import { i18n } from "@/locales";
import 'uno.css'


const app = createApp(App);

app.use(router);
setupStore(app);
app.use(Antd);
app.use(i18n);

app.mount("#app");
