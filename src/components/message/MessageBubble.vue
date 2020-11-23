<template>
  <div class="message-bubble" :class="me">
    <span class="from" :class="me">{{
      new Date(Number.parseInt(message.created_at))
    }}</span>
    <br :class="me" />
    <span class="message-text">{{ message.content }}</span>
  </div>
</template>

<script>
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  components: {},
})
export default class MessageBubble extends Vue {
  @Prop() message;
  text = "Sample text";
  get me() {
    // const toggle = true;
    // console.log("me message", this.message.user.id);
    // console.log("me store", this.$store.state.user.id);
    return this.message.user.id === this.$store.state.user.id ? "me" : "";
  }
}
</script>

<style scoped>
.message-bubble {
  display: block;
  max-width: 50%;
  margin-bottom: 4px;
  float: left;
  clear: both;
}
.message-text {
  padding: 8px;
  margin: 4px;
  text-align: left;
  background-color: #dfdfdf;
  border-radius: 4px;
}
.message-bubble.me {
  float: right;
}
.message-bubble.me .message-text {
  background-color: #9ec6f5;
}
.from {
  float: left;
  margin: 4px;
  font-size: 10px;
  color: #9da7af;
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
