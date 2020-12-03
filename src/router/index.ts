import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import MessageContainer from "@/components/message/MessageContainer.vue";
const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: MessageContainer,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
Vue.use(VueRouter);
export default router;
