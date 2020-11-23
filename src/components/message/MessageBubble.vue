<template>
  <div class="message-bubble" :class="me">
    <span class="from" :class="me">{{
      new Date(Number.parseInt(message.created_at))
    }}</span>
    <br :class="me" />
    <span class="message-text pl-5">
      <v-row>
        {{ message.content }}
        <v-spacer></v-spacer>
        <v-icon @click="show" right left>mdi-dots-horizontal</v-icon>
        <v-menu
          v-model="showMenu"
          :position-x="x"
          :position-y="y"
          absolute
          offset-y
        >
          <v-list>
            <v-list-item v-for="(item, index) in items" :key="index">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
  showMenu = false;
  x = 0;
  y = 0;
  items = [
    { title: "Click Me" },
    { title: "Click Me" },
    { title: "Click Me" },
    { title: "Click Me 2" },
  ];
  show(e) {
    e.preventDefault();
    this.showMenu = false;
    this.x = e.clientX;
    this.y = e.clientY;
    this.$nextTick(() => {
      this.showMenu = true;
    });
  }
  get me() {
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
  margin-top: 4px;
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
  /*margin: 4px;*/
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
