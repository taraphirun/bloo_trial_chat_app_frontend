<template>
  <div class="home">
    <infinite-loading direction="top" @infinite="infiniteHandler" />
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
    </div>
    <v-footer
      app
      color="transparent"
      height="72"
      inset
      v-if="$store.state.isLoggedIn"
    >
      <v-text-field
        v-model="content"
        background-color="grey lighten-1"
        dense
        flat
        hide-details
        rounded
        solo
        @keyup.enter="sendMessage"
      ></v-text-field>
      <v-icon @click="sendMessage" x-large color="green darken-1">
        mdi-send
      </v-icon>
    </v-footer>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import InfiniteLoading from "vue-infinite-loading";
import gql from "graphql-tag";
@Component({
  components: {
    InfiniteLoading,
  },
})
export default class Home extends Vue {
  content = "";
  page = 1;
  list = [] as any;
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
          query($cursor: Int) {
            messages(limit: 2, cursor: $cursor) {
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
        variables: {
          cursor: this.list.length > 0 ? Number.parseInt(this.list[0].id) : 2,
        },
      })
      .then((result) => {
        console.log("apollo result", result);
        const data = result.data.messages;
        if (data.length) {
          this.page++;
          // @ts-ignore
          this.list.unshift(...data.reverse());
          console.log(
            "last index ",
            this.list.length > 0 ? Number.parseInt(this.list[0].id) : 2
          );
          $state.loaded();
        } else {
          $state.complete();
        }
      });
  }
  async sendMessage() {
    try {
      if (this.content != null) {
        const result = await this.$apollo.mutate({
          mutation: gql`
            mutation($content: String!) {
              createMessage(content: $content) {
                id
                updated_at
                content
                user {
                  nickname
                }
              }
            }
          `,
          variables: {
            content: this.content,
          },
        });
        console.log("send", result);
        this.list.push(result.data.createMessage);
      }
    } catch (e) {
      console.log("Failed to create message", e);
      this.$router.go(0);
    }
  }
}
</script>
