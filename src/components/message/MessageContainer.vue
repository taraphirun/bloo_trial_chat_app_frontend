<template>
  <div class="chat-container">
    <div class="body">
      <div class="container" ref="container">
        <MessageList :user_typing="user_typing" />
      </div>
    </div>
    <v-footer
      app
      color="transparent"
      height="72"
      inset
      v-if="$store.state.isLoggedIn"
    >
      <!--      <MessageInput @submitMessage="scrollToEnd" />-->
      <div style="width: 100%">
        <v-row>
          <v-text-field
            background-color="white lighten-1"
            dense
            flat
            hide-details
            solo
            outlined
            v-model="message"
            @keyup.enter="sendMessage"
          ></v-text-field>
          <v-icon @click="sendMessage" x-large color="green darken-1">
            mdi-send
          </v-icon>
        </v-row>
      </div>
    </v-footer>
  </div>
  <!--  </div>-->
</template>

<script>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import MessageList from "@/components/message/MessageList";
import MessageInput from "@/components/message/MessageInput";
import gql from "graphql-tag";
import _ from "lodash";
import BadWordsFilter from "bad-words";
@Component({
  components: { MessageList, MessageInput },
})
export default class MessageContainer extends Vue {
  message = "";
  text = "Sample text";
  user_typing = {
    timeout: 2000,
    user: {},
    is_show: false,
  };
  test = "motherfucker you go eat shit";
  filter = new BadWordsFilter();
  async sendMessage() {
    try {
      if (this.message != null) {
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
            content: this.filter.clean(this.message),
          },
        });
        this.message = "";
      }
      this.scrollToEnd();
    } catch (e) {
      console.log("Failed to create message", e);
      this.$router.go(0);
    }
  }
  //udpate user typing
  debouncedUserTyping = _.debounce(this.updateUserTyping, 500);
  @Watch("message")
  async onTypeUpdateUserTyping(v) {
    if (v !== null) {
      v && v.toString().length > 1 && this.debouncedUserTyping();
    }
  }
  async updateUserTyping() {
    try {
      if (this.message != null) {
        const updateUserTyping = await this.$apollo.mutate({
          mutation: gql`
            mutation {
              updateUserTyping
            }
          `,
        });
        console.log("updated update user typing", updateUserTyping);
      }
    } catch (e) {
      console.log("Failed to update user typing", e);
      this.$router.go(0);
    }
  }

  mounted() {
    this.scrollToEnd();
  }
  scrollToEnd() {
    // console.log("container el", this.$refs.container);
    // console.log("container height", this.$refs.container.scrollHeight);
    setTimeout(() => {
      window.scrollTo({
        left: 0,
        top: this.$refs.container.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  }
}
</script>

<style scoped></style>
