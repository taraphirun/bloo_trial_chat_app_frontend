<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Message</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field required v-model="updatedMessage"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="emitClose"> Close </v-btn>
          <v-btn color="blue darken-1" text @click="editMessage"> Save </v-btn>
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
export default class DialogEditMessage extends Vue {
  @Prop() dialog;
  @Prop() message;
  updatedMessage = null;
  async editMessage() {
    try {
      if (this.updatedMessage != null) {
        await this.$apollo.mutate({
          mutation: gql`
            mutation($id: Int!, $content: String!) {
              updateMessage(id: $id, content: $content) {
                id
              }
            }
          `,
          variables: {
            id: Number.parseInt(this.message.id),
            content: this.updatedMessage,
          },
        });
        this.$emit("close");
      }
    } catch (e) {
      console.log("Failed to create message", e);
      // this.$router.go(0);
    }
  }
  emitClose() {
    this.$emit("close");
  }
  mounted() {
    this.updatedMessage = this.message.content;
  }
}
</script>

<style scoped></style>
