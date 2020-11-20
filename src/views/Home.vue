<template>
  <div class="home">
    <infinite-loading direction="top" @infinite="infiniteHandler" />
    <!--    <InfiniteLoading direction="top" @infinite=""/>-->
    <!--    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />-->
    <div v-for="(item, $index) in list" :key="$index">
      <v-card class="my-3" max-width="60%">
        <v-row>
          <v-avatar
            :key="$index"
            class="d-block text-center mx-auto mb-9"
            :color="getColor()"
            size="28"
          ></v-avatar>
          <v-list-item-content>
            <v-list-item-content>{{ item.content }}</v-list-item-content>
          </v-list-item-content>
        </v-row>
      </v-card>

      <!-- Hacker News item loop -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import InfiniteLoading from "vue-infinite-loading";
import axios from "axios";
import gql from "graphql-tag";
@Component({
  components: {
    HelloWorld,
    InfiniteLoading,
  },
})
export default class Home extends Vue {
  page = 1;
  list = [];
  getColor() {
    const colors = [
      "grey",
      "red",
      "green",
      "yellow",
      "pink",
      "blue",
      "black",
      "orange",
      "purple",
    ];
    const index = Math.floor(Math.random() * 9);
    return `${colors[index]} lighten-1`;
  }

  async infiniteHandler($state: any) {
    this.$apollo
      .query({
        query: gql`
          query {
            messages {
              id
              content
              created_at
              updated_at
              user {
                nickname
              }
            }
          }
        `,
      })
      .then((result) => {
        console.log("apollo result", result);
        const data = result.data.messages;
        if (data.length) {
          this.page++;
          // @ts-ignore
          this.list.unshift(...data.reverse());
          $state.loaded();
        } else {
          $state.complete();
        }
      });
  }
}
</script>
