<template>
  <v-app id="inspire">
    <v-app-bar app clipped-right flat height="72">
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app width="300" permanent>
      <v-navigation-drawer
        v-model="drawer"
        absolute
        color="grey lighten-3"
        mini-variant
        permanent
      >
        <v-avatar
          class="d-block text-center mx-auto mt-4"
          color="grey darken-1"
          size="36"
        ></v-avatar>

        <v-divider class="mx-3 my-5"></v-divider>
      </v-navigation-drawer>
      <v-sheet color="grey lighten-5" height="128" width="100%"></v-sheet>
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
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <HelloWorld />
    </v-main>

    <v-footer app color="transparent" height="72" inset>
      <v-text-field
        background-color="grey lighten-1"
        dense
        flat
        hide-details
        rounded
        solo
      ></v-text-field>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import gql from "graphql-tag";
@Component({ components: { HelloWorld } })
export default class App extends Vue {
  drawer = true;
  async mounted() {
    const result = await this.$apollo.mutate({
      mutation: gql`
        mutation {
          loginUser(username: "taraphirun", password: "123") {
            token
          }
        }
      `,
    });
    console.log("resulst", result);
  }
}
</script>
