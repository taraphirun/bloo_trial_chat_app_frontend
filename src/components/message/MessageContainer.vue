<template>
  <div class="container chat-container">
    <div ref="container">
      <MessageList />
    </div>

    <v-footer
      class="custom-footer"
      app
      height="72"
      v-if="$store.state.isLoggedIn"
    >
      <div style="width: 100%">
        <v-row>
          <v-text-field
            class="input-box"
            dense
            hide-details
            solo
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
import { Component, Vue, Watch } from "vue-property-decorator";
import MessageList from "@/components/message/MessageList";
import gql from "graphql-tag";
import _ from "lodash";
import BadWordsFilter from "bad-words";
@Component({
  components: { MessageList },
})
export default class MessageContainer extends Vue {
  message = "";
  text = "Sample text";
  test = "motherfucker you go eat shit";
  filter = new BadWordsFilter();
  async sendMessage() {
    try {
      if (this.message != null) {
        await this.$apollo.mutate({
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
  scrollToEnd() {
    setTimeout(() => {
      window.scrollTo({
        left: 0,
        top: this.$refs.container.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  }
  mounted() {
    this.scrollToEnd();
  }
}
</script>

<style scoped>
.chat-container {
  display: block;
  width: 100%;
  height: 100%;
  background-color: #d7d9da;
}
.input-box {
  border-radius: 28px;
  background: #cdd9e0;
  box-shadow: inset 14px 14px 28px #81898d, inset -14px -14px 28px #ffffff;
}
.custom-footer {
  background-color: floralwhite !important;
}
</style>
