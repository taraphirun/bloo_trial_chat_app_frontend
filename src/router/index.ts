import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Chatbox from "../views/Chatbox.vue";
import Home from "../views/Home.vue";
// import { createProvider } from "../vue-apollo";
// const apolloProvider: createProvider();
const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Chat",
    component: Chatbox,
  },
  {
    path: "/testing",
    name: "Home",
    component: Home,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
// function login() {
//   return new Promise(async (resolve) => {
//     if (!store.state.user.id) {
//       try {
//         console.log("before each");
//         // apolloProvider: {
//         //   // Query with parameters
//         //   ping: {
//         //     // gql query
//         //     query: gql`
//         //       query PingMessage($message: String!) {
//         //         ping(message: $message)
//         //       }
//         //     `;
//         //     // Static parameters
//         //     variables: {
//         //       message: "Meow";
//         //     }
//         //   }
//         // }
//         // apolloProvider.mutate;
//         // @ts-ignore
//         // this.$root.$apollo.
//         // const GET_ROCKET_INVENTORY = gql`
//         //   query me() {
//         //     username
//         //   }
//         // `;
//         // const data = useQuery<any>(GET_ROCKET_INVENTORY, {
//         //   variables: { year: 2019 },
//         // });
//         // const result = await useQuery({
//         //   gql`
//         //     mutation($username: String!, $password: String!) {
//         //       loginUser(username: $username, password: $password) {
//         //         username
//         //       }
//         //     }
//         //   `,
//         // {variables: {},}
//         // });
//         // console.log("resulst before", data);
//       } catch (e) {
//         console.log("e", e);
//       }
//     } else {
//       resolve(true);
//     }
//   });
// }
// router.beforeEach(async (to, from, next) => {
//   await login().then((result: any) => {
//     console.log("login", result);
//     if (result) {
//       console.log("try login");
//       next();
//       console.log("after next");
//     } else if (to.meta.needLogin) {
//       next({ path: "/login" });
//     } else {
//       next();
//     }
//   });
// });
Vue.use(VueRouter);
export default router;
