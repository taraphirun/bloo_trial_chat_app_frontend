<template>
  <div class="container" ref="container">
    <infinite-loading direction="top" @infinite="infiniteHandler" />
    <MessageBubble
      v-for="message in list"
      :message="message"
      :key="message.id"
      :showMessageMenu="showMessageMenu"
    />
    <MessageBubble
      v-if="user_typing.is_show"
      :message="typingMessage"
      :key="'4'"
      :showMessageMenu="showMessageMenu"
    />
    <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-list>
        <v-list-item>
          <v-list-item-title
            style="cursor: pointer"
            @click="dialogEditMessage = true"
            >Edit</v-list-item-title
          >
        </v-list-item>
        <v-list-item>
          <v-list-item-title
            style="cursor: pointer"
            @click="dialogDeleteMessage = true"
            >Delete</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>
    <DialogEditMessage
      :dialog="dialogEditMessage"
      :message="currentMessage"
      @editMessage="dialogEditMessage = false"
      @close="dialogEditMessage = false"
    />
    <DialogDeleteMessage
      :dialog="dialogDeleteMessage"
      :message="currentMessage"
      @deleteMessage="dialogDeleteMessage = false"
      @close="dialogDeleteMessage = false"
    />
  </div>
</template>
<script>
import { Component, Vue, Watch } from "vue-property-decorator";
import MessageBubble from "@/components/message/MessageBubble";
import InfiniteLoading from "vue-infinite-loading";
import gql from "graphql-tag";
import DialogEditMessage from "@/components/dialogs/DialogEditMessage";
import DialogDeleteMessage from "@/components/dialogs/DialogDeleteMessage";
@Component({
  components: {
    DialogDeleteMessage,
    DialogEditMessage,
    MessageBubble,
    InfiniteLoading,
  },
})
export default class Home extends Vue {
  currentMessage = {};
  dialogDeleteMessage = false;
  dialogEditMessage = false;
  user_typing = {
    timeout: 2000,
    user: {},
    is_show: false,
  };
  list = [];
  showMenu = false;
  x = 0;
  y = 0;
  get typingMessage() {
    return {
      created_at: new Date().getTime(),
      content:
        (this.user_typing ? this.user_typing.user.username : "") + " is typing",
      user: {
        id: this.user_typing ? this.user_typing.user.id : 0,
      },
    };
  }
  showMessageMenu(e, message) {
    this.currentMessage = message;
    e.preventDefault();
    this.showMenu = false;
    this.x = e.clientX;
    this.y = e.clientY;
    this.$nextTick(() => {
      this.showMenu = true;
    });
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
              is_deleted
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
    this.$apollo
      .query({
        query: gql`
          query($cursor: Int) {
            messages(limit: 5, cursor: $cursor) {
              id
              content
              created_at
              updated_at
              is_deleted
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
      const setUserTyping = (user) => {
        if (user != null) {
          console.log(user);
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
