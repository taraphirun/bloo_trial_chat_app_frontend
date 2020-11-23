<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> Delete this message? </v-card-title>

        <v-card-text style="font-style: italic"
          >"{{ message.content }}"</v-card-text
        >
        <v-card-text>This action cannot be undo.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="emitClose"> Cancel </v-btn>
          <v-btn color="red darken-1" text @click="deleteMessage">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { Component, Prop, Vue } from "vue-property-decorator";
import gql from "graphql-tag";
@Component({
  components: {},
})
export default class DialogDeleteMessage extends Vue {
  @Prop() dialog;
  @Prop() message;
  async deleteMessage() {
    try {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($id: Int!) {
            deleteMessage(id: $id)
          }
        `,
        variables: {
          id: Number.parseInt(this.message.id),
        },
      });
      this.$emit("close");
    } catch (e) {
      console.log("Failed to create message", e);
      // this.$router.go(0);
    }
  }
  emitClose() {
    this.$emit("close");
  }
}
</script>

<style scoped></style>
