<template>
  <div class="message-bubble" :class="me">
    <!--    <span class="from_username" :class="me">{{ message.user.username }} -</span>-->
    <!--    <span class="from" :class="me">-->
    <!--      {{ new Date(Number.parseInt(message.created_at)).toLocaleString() }}</span-->
    <!--    >-->
    <br :class="me" />
    <span class="message-text pl-5">
      <v-row>
        <span class="pr-3">{{ message.content }}</span>
        <!--        <v-spacer></v-spacer>-->
        <!--        <v-icon-->
        <!--          v-if="isOwnMessageAndNotDeleted"-->
        <!--          @click="showMessageMenu($event, message)"-->
        <!--          left-->
        <!--          >mdi-dots-horizontal</v-icon-->
        <!--        >-->
      </v-row>
    </span>
  </div>
</template>

<script>
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  components: {},
})
export default class MessageBubble extends Vue {
  @Prop() message;
  @Prop() showMessageMenu;
  get me() {
    return this.message.user.id === this.$store.state.user.id ? "me" : "";
  }
  get isOwnMessageAndNotDeleted() {
    return (
      this.message.user.id === this.$store.state.user.id &&
      !this.message.is_deleted
    );
  }
}
</script>

<style scoped>
.message-bubble {
  display: block;
  max-width: 80%;
  margin-bottom: 4px;
  float: left;
  clear: both;
  padding: 0px;
}
.message-text {
  border-radius: 10px;
  background: skyblue;
  box-shadow: 8px 8px 16px #c8cacb, -8px -8px 16px #e6e8e9;
  display: none;
  padding: 8px 15px 8px 25px;
  margin-top: 4px;
  text-align: left;
}
.message-bubble.me {
  float: right;
}
.message-bubble.me .message-text {
  background-color: mistyrose;
}
.from {
  float: left;
  /*margin: 4px;*/
  font-size: 10px;
  color: #9da7af;
}

.from_username {
  float: left;
  /*margin: 4px;*/
  font-size: 12px;
  color: black;
}
.from_username.me {
  display: none;
}
.from.me {
  display: none;
}
.message-bubble span {
  display: block;
}
.message-bubble.me br.me {
  display: none;
}
</style>
