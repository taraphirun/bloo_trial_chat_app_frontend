<template>
  <v-col cols="auto">
    <v-card class="pa-5" max-width="500">
      <v-card-text class="text-center headline"> Sign Up </v-card-text>
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
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Nickname"
              :rules="[(v) => !!v || 'Nickname is required']"
              outlined
              required
              v-model="user.nickname"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="First Name"
              :rules="[(v) => !!v || 'First name is required']"
              outlined
              required
              v-model="user.first_name"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Last Name"
              :rules="[(v) => !!v || 'Last name is required']"
              outlined
              required
              type="password"
              v-model="user.last_name"
            />
          </v-col>
          <v-col class="justify-end" cols="auto">
            <v-btn :disabled="!valid" @click="signup" class="primary">
              Sign Up
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
export default class SignUp extends Vue {
  valid = true;
  user = {
    username: null,
    password: null,
    nickname: null,
    last_name: null,
    first_name: null,
  };
  async signup() {
    try {
      await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $username: String!
            $password: String!
            $nickname: String!
            $first_name: String!
            $last_name: String!
          ) {
            signUpUser(
              nickname: $nickname
              username: $username
              password: $password
              last_name: $last_name
              first_name: $first_name
            ) {
              username
            }
          }
        `,
        variables: {
          username: this.user.username,
          password: this.user.password,
          nickname: this.user.nickname,
          last_name: this.user.last_name,
          first_name: this.user.first_name,
        },
      });
      this.$router.go(0);
    } catch (e) {
      console.log("error on login", e);
    }
  }
}
</script>

<style scoped></style>
