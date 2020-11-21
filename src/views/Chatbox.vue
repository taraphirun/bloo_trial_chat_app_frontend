<template>
  <div class="home">
    <infinite-loading direction="top" @infinite="infiniteHandler" />
    <div v-for="(item, $index) in list" :key="$index">
      <v-card
        class="my-3"
        max-width="60%"
        :color="$store.state.user.id == item.user.id ? 'grey' : 'green'"
      >
        <v-row>
          <v-avatar
            :key="$index"
            class="d-block text-center mx-auto mb-9"
            :color="getColor()"
            size="28"
          ></v-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ item.id }}</v-list-item-title>
            <v-list-item-content>{{ item.content }}</v-list-item-content>
            <v-list-item-subtitle>{{
              new Date(Number.parseInt(item.created_at))
            }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{
              $store.state.user.id == item.user.id ? true : false
            }}</v-list-item-subtitle>
            user: {{ item.user.username }}
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
      TYPING>>>>{{ getUserTyping() }}
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
import _ from "lodash";
import { Message, User } from "@/generated/graphql";
@Component({
  components: {
    InfiniteLoading,
  },
})
export default class Home extends Vue {
  content = "";
  page = 1;
  list = [] as any;
  list2D = [] as any;
  userTyping = {} as User;
  @Watch("userTyping")
  getUserTyping() {
    return this.userTyping;
  }

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
    // console.log(
    //   "index",
    //   this.list.length > 0 ? Number.parseInt(this.list[0].id) : 0
    // );
    this.$apollo
      .query({
        query: gql`
          query($cursor: Int) {
            messages(limit: 5, cursor: $cursor) {
              id
              content
              created_at
              updated_at
              user {
                username
                id
              }
            }
          }
        `,
        variables: {
          cursor: this.list.length > 0 ? Number.parseInt(this.list[0].id) : 0,
        },
      })
      .then((result) => {
        console.log("apollo result", result.data.messages);
        const data = result.data.messages;
        if (data.length) {
          this.page++;
          // @ts-ignore
          this.list.unshift(...data.reverse());
          // this.list.push(...data.reverse());
          // this.list2D.push(...data.reverse());
          // console.log("list2D", this.list2D);
          // console.log("listlistlist", [...this.list]);
          // console.log(
          //   "last index ",
          //   this.list.length > 0 ? Number.parseInt(this.list[0].id) : 2
          // );
          $state.loaded();
        } else {
          $state.complete();
        }
      });
  }
  debouncedUserTyping = _.debounce(this.updateUserTyping, 500);
  @Watch("content")
  async onTypeUpdateUserTyping(v: number) {
    if (v !== null) {
      v && v.toString().length > 1 && this.debouncedUserTyping();
    }
  }
  async updateUserTyping() {
    try {
      if (this.content != null) {
        const updateUserTyping = await this.$apollo.mutate({
          mutation: gql`
            mutation {
              updateUserTyping
            }
          `,
        });
        console.log("updateUserTyping", updateUserTyping);
      }
    } catch (e) {
      console.log("Failed to update user typing", e);
      this.$router.go(0);
    }
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
                created_at
                content
                user {
                  id
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
        // this.list.push(result.data.createMessage);
        this.content = "";
      }
    } catch (e) {
      console.log("Failed to create message", e);
      this.$router.go(0);
    }
  }
  subscribeMessage() {
    try {
      const subQuery = gql`
        subscription {
          messageCreated {
            id
            content
            created_at
            user {
              username
            }
          }
        }
      `;
      const observer = this.$apollo.subscribe({
        query: subQuery,
      });
      const setList = (msg: Message) => {
        this.list.push(msg);
      };
      observer.subscribe({
        next(data) {
          setList(data.data.messageCreated);
        },
        error(error) {
          console.error(error);
        },
      });
    } catch (e) {
      console.log("Error subscribing to user login", e);
    }
  }
  subscribeUserTyping() {
    try {
      const subQuery = gql`
        subscription {
          userTyping {
            username
          }
        }
      `;
      const observer = this.$apollo.subscribe({
        query: subQuery,
      });
      const setUserTyping = (user: User) => {
        this.userTyping = user;
        console.log("this is user", user);
      };
      observer.subscribe({
        next(data) {
          setUserTyping(data.data.userTyping);
          console.log("typing", data);
        },
        error(error) {
          console.error(error);
        },
      });
    } catch (e) {
      console.log("Error subscribing to user login", e);
    }
  }
  mounted() {
    this.subscribeMessage();
    this.subscribeUserTyping();
  }
}
</script>
