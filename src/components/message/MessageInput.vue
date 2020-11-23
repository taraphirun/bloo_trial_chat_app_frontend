<template>
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
        @keyup.enter="submitMessage"
      ></v-text-field>
      <v-icon @click="submitMessage" x-large color="green darken-1">
        mdi-send
      </v-icon>
    </v-row>
  </div>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({
  components: {},
})
export default class MessageInput extends Vue {
  message = "";
  text = "Sample text";
  submitMessage() {
    // const toggle = true;
    this.$emit("submitMessage");
  }
}
</script>

<style scoped></style>
