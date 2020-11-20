import Vue from "vue";
import Vuex from "vuex";
import { LOG_IN, LOG_OUT } from "@/store/mutation-types";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      id: null,
      username: "",
      first_name: "",
      last_name: "",
      nickname: "",
      createdAt: "",
      updatedAt: "",
    },
  },
  mutations: {
    [LOG_IN](state, user) {
      (state.user.id = user.id),
        (state.user.username = user.username),
        (state.user.first_name = user.first_name),
        (state.user.last_name = user.last_name),
        (state.user.nickname = user.nickname),
        (state.user.createdAt = user.createdAt),
        (state.user.updatedAt = user.updatedAt);
    },
    [LOG_OUT](state) {
      (state.user.id = null),
        (state.user.username = ""),
        (state.user.first_name = ""),
        (state.user.last_name = ""),
        (state.user.nickname = ""),
        (state.user.createdAt = ""),
        (state.user.updatedAt = "");
    },
  },
  actions: {},
  modules: {},
});
