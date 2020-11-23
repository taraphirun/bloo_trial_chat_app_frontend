<template>
  <div class="container" ref="container">
    <infinite-loading direction="top" @infinite="infiniteHandler" />
    <MessageBubble
      v-for="message in list"
      :message="message"
      :key="message.id"
    />
    <MessageBubble
      v-if="user_typing.is_show"
      :message="typingMessage"
      :key="'4'"
    />
  </div>
</template>

<script>
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import MessageBubble from "@/components/message/MessageBubble";
import InfiniteLoading from "vue-infinite-loading";
import gql from "graphql-tag";
@Component({
  components: { MessageBubble, InfiniteLoading },
})
export default class Home extends Vue {
  list = [];
  @Prop() user_typing;
  typingMessage = {
    created_at: new Date().getTime(),
    content: " is typing",
    user: {
      id: this.user_typing ? this.user_typing.user.id : 0,
    },
  };
  subscribeMessage() {
    try {
      const subQuery = gql`
        subscription {
          messageCreated {
            id
            content
            created_at
            user {
              id
              username
            }
          }
        }
      `;
      const observer = this.$apollo.subscribe({
        query: subQuery,
      });
      const setList = (msg) => {
        if (msg) {
          if (
            this.user_typing.user &&
            this.user_typing.user.id === msg.user.id
          ) {
            this.user_typing.is_show = false;
          }
          this.list.push(msg);
          this.scrollToEnd();
        }
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
  async loadMessages() {
    await this.$apollo
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
        const data = result.data.messages;
        if (data.length) {
          this.list.unshift(...data.reverse());
          this.scrollToEnd();
        }
      });
  }

  async infiniteHandler($state) {
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
  scrollToEnd() {
    setTimeout(() => {
      window.scrollTo({
        left: 0,
        top: this.$refs.container.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  }
  subscribeUserTyping() {
    try {
      const subQuery = gql`
        subscription($id: ID!) {
          userTyping(id: $id) {
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
      const setUserTyping = (user) => {
        if (user != null) {
          this.user_typing.user = user;
          this.user_typing.is_show = true;
        }
      };
      observer.subscribe({
        next(data) {
          setUserTyping(data.data.userTyping);
        },
        error(error) {
          console.error(error);
        },
      });
    } catch (e) {
      console.log("Error subscribing to user typing", e);
    }
  }
  @Watch("user_typing.is_show")
  set_typing_is_show() {
    if (this.user_typing.is_show) {
      this.scrollToEnd();
      setTimeout(() => {
        this.user_typing.is_show = false;
        // return this.user_typing.is_show;
      }, this.user_typing.timeout);
    }
  }

  async mounted() {
    this.subscribeMessage();
    this.subscribeUserTyping();
    this.scrollToEnd();
  }
}
</script>

<style scoped></style>
