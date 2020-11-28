<template>
  <v-app id="inspire">
    <div class="" style="max-height: 100%">
      <v-app-bar app clipped-right flat height="72">
        <v-icon v-if="$store.state.isLoggedIn" @click="drawer = !drawer" left
          >mdi-menu</v-icon
        >
        Bloo Trial Chat App
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        app
        width="300"
        v-if="$store.state.isLoggedIn"
      >
        <v-list class="pl-14" shaped>
          <h1>Users Online</h1>
          <v-list-item v-if="usersOnline.length === 0">
            You are alone
          </v-list-item>
          <v-list-item
            v-for="n in usersOnline"
            :key="n.id"
            link
            class="justify-center"
          >
            <v-row>
              <v-avatar
                :key="n.id"
                class="d-block text-center mx-auto mb-9"
                color="green lighten-1"
                size="28"
              ></v-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ n.username }}</v-list-item-title>
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
  usersOnline = [];
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
      this.$router.go(0);
    }
  }
  async getSession() {
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
      // this.$router.go(0);
    }
  }
  updateUserOnline() {
    const inter = window.setInterval(async () => {
      try {
        if (this.$store.state.user.id == null) return;
        await this.$apollo.mutate({
          mutation: gql`
            mutation {
              updateUserOnline
            }
          `,
        });
      } catch (e) {
        console.log("Failed to update user online", e);
        window.clearInterval(inter);
      }
    }, 5000);
  }
  subscribeUserOnline() {
    try {
      if (this.$store.state.user.id == null) return;
      const subQuery = gql`
        subscription($id: ID!) {
          userOnline(id: $id) {
            id
            username
          }
        }
      `;
      const observer = this.$apollo.subscribe({
        query: subQuery,
        variables: {
          id: this.$store.state.user.id,
        },
      });
      const setUserOnline = (users: any) => {
        this.usersOnline = users;
      };
      observer.subscribe({
        next(data) {
          // console.log(data);
          setUserOnline(data.data.userOnline);
        },
        error(error) {
          console.error(error);
        },
      });
    } catch (e) {
      console.log("Error subscribing to user login", e);
    }
  }

  async mounted() {
    this.getSession().then(() => {
      this.updateUserOnline();
      this.subscribeUserOnline();
    });
  }
}
</script>
