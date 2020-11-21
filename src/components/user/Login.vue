<template>
  <v-col cols="auto">
    <v-card class="pa-5" max-width="500">
      <v-card-text class="text-center headline"> Login </v-card-text>
      <v-form lazy-validation ref="form" v-model="valid">
        <div class="col-sm-6 offset-sm-3"></div>
        <v-row class="justify-end">
          <v-col cols="12">
            <v-text-field
              label="Username"
              :rules="[(v) => !!v || 'Username is required']"
              outlined
              required
              v-model="user.username"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="password"
              :rules="[(v) => !!v || 'Password is required']"
              outlined
              required
              type="password"
              v-model="user.password"
              @keyup.enter="login"
            />
          </v-col>
          <v-col class="justify-end" cols="auto">
            <v-btn :disabled="!valid" @click="login" class="primary">
              Login
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-col>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import gql from "graphql-tag";

@Component({ components: {} })
export default class Login extends Vue {
  valid = true;
  user = {
    username: null,
    password: null,
  };
  async login() {
    console.log("user", this.user);
    try {
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($username: String!, $password: String!) {
            loginUser(username: $username, password: $password) {
              username
            }
          }
        `,
        variables: {
          username: this.user.username,
          password: this.user.password,
        },
      });
      // this.$router.go(0);
      console.log("resulst", result);
      this.$router.go(0);
    } catch (e) {
      console.log("e", e);
    }
  }
}
</script>

<style scoped></style>
