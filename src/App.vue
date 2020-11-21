<template>
  <v-app id="inspire">
    <div class="fill-height">
      <v-app-bar app clipped-right flat height="72">
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        app
        width="300"
        permanent
        v-if="$store.state.isLoggedIn"
      >
        <!--        <v-card>-->
        <v-navigation-drawer
          v-model="drawer_mini"
          :mini-variant.sync="mini"
          permanent
        >
          <v-list-item class="px-2">
            <v-list-item-avatar>
              <v-img
                src="https://randomuser.me/api/portraits/men/85.jpg"
              ></v-img>
            </v-list-item-avatar>

            <v-list-item-title>John Leider</v-list-item-title>

            <v-btn icon @click.stop="mini = !mini">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          </v-list-item>

          <v-divider></v-divider>

          <v-list dense>
            <v-list-item v-for="item in items" :key="item.title" link>
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <!--        </v-card>-->
        <!--        <v-sheet color="grey lighten-5" height="128" width="100%"></v-sheet>-->
        <v-list class="pl-14" shaped>
          <v-list-item v-for="n in 5" :key="n" link class="justify-center">
            <v-row>
              <v-avatar
                :key="n"
                class="d-block text-center mx-auto mb-9"
                color="grey lighten-1"
                size="28"
              ></v-avatar>
              <v-list-item-content>
                <v-list-item-title>Item {{ n }}</v-list-item-title>
              </v-list-item-content>
            </v-row>
          </v-list-item>
          <v-list-item>
            <v-btn depressed color="error" @click="logout"> Logout </v-btn>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main class="fill-height background">
        <div class="pa-3" v-if="$store.state.isLoggedIn">
          <router-view />
        </div>
        <!--login function-->
        <v-row class="fill-height justify-center align-center" v-else>
          <Login />
        </v-row>
      </v-main>
      <!--      <v-footer app color="transparent" height="72" inset v-if="isLoggedIn">-->
      <!--        <v-text-field-->
      <!--          background-color="grey lighten-1"-->
      <!--          dense-->
      <!--          flat-->
      <!--          hide-details-->
      <!--          rounded-->
      <!--          solo-->
      <!--        ></v-text-field>-->
      <!--      </v-footer>-->
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Login from "@/components/user/Login.vue";
import gql from "graphql-tag";
import { LOG_IN, LOG_OUT } from "@/store/mutation-types";
@Component({ components: { Login } })
export default class App extends Vue {
  drawer_mini = true;
  drawer = true;
  mini = true;
  items = [
    { title: "Chat", icon: "mdi-chat" },
    { title: "My Account", icon: "mdi-account" },
    { title: "Logout", icon: "mdi-logout" },
  ];
  get isLoggedIn() {
    if (this.$store.state.user && this.$store.state.user.id != null)
      return true;
    else return false;
  }
  async logout() {
    try {
      await this.$apollo.mutate({
        mutation: gql`
          mutation {
            logoutUser
          }
        `,
      });
      this.$store.commit(LOG_OUT);
      this.$router.go(0);
    } catch (e) {
      console.log("Logout error", e);
    }
  }
  async mounted() {
    try {
      const loginUser = await this.$apollo.query({
        query: gql`
          query {
            me {
              id
              first_name
              last_name
              nickname
              username
              created_at
              updated_at
            }
          }
        `,
      });
      if (loginUser.data.me) {
        const data = loginUser.data.me;
        this.$store.commit(LOG_IN, {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          nickname: data.nickname,
          username: data.username,
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
      }
    } catch (e) {
      console.log("Login error", e);
    }
  }
}
</script>
