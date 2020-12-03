<template>
  <v-col cols="auto" max-width="500">
    <v-card class="pa-5">
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
          <!--          <v-col cols="12">-->
          <!--            <v-text-field-->
          <!--              label="password"-->
          <!--              :rules="[(v) => !!v || 'Password is required']"-->
          <!--              outlined-->
          <!--              required-->
          <!--              type="password"-->
          <!--              v-model="user.password"-->
          <!--              @keyup.enter="login"-->
          <!--            />-->
          <!--          </v-col>-->
          <v-col class="justify-end" cols="auto">
            <v-btn @click="login" class="primary"> Login </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-col>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import gql from "graphql-tag";
import { LOG_IN } from "@/store/mutation-types";

@Component({ components: {} })
export default class Login extends Vue {
  valid = false;
  user = {
    username: null,
  };
  async login() {
    try {
      if ((this.$refs.form as any).validate()) {
        const loginUser = await this.$apollo.mutate({
          mutation: gql`
            mutation($username: String!) {
              loginUser(username: $username) {
                id
                first_name
                last_name
                nickname
                username
                created_at
                updated_at
              }
            }
          `,
          variables: {
            username: this.user.username,
          },
        });
        console.log(loginUser);
        if (loginUser.data.loginUser) {
          const data = loginUser.data.loginUser;
          this.$store.commit(LOG_IN, {
            id: data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            nickname: data.nickname,
            username: data.username,
            created_at: data.created_at,
            updated_at: data.updated_at,
          });
        }
      }
    } catch (e) {
      console.log("error on login", e);
    }
  }
}
</script>

<style scoped></style>
