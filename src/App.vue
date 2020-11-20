<template>
  <v-app id="inspire">
    <div class="fill-height">
      <v-app-bar app clipped-right flat height="72">
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        app
        width="300"
        permanent
        v-if="isLoggedIn"
      >
        <v-navigation-drawer
          v-model="drawer"
          absolute
          color="grey lighten-3"
          mini-variant
          permanent
        >
          <v-avatar
            class="d-block text-center mx-auto mt-4"
            color="grey darken-1"
            size="36"
          ></v-avatar>

          <v-divider class="mx-3 my-5"></v-divider>
        </v-navigation-drawer>
        <v-sheet color="grey lighten-5" height="128" width="100%"></v-sheet>
        <v-list class="pl-14" shaped>
          <v-list-item v-for="n in 5" :key="n" link class="justify-center">
            <v-row>
              <v-avatar
                :key="n"
                class="d-block text-center mx-auto mb-9"
                color="grey lighten-1"
                size="28"
              ></v-avatar>
              <v-list-item-content>
                <v-list-item-title>Item {{ n }}</v-list-item-title>
              </v-list-item-content>
            </v-row>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main class="fill-height background">
        <div class="pa-3" v-if="isLoggedIn">
          <router-view />
        </div>
        <!--login function-->
        <v-row class="fill-height justify-center align-center" v-else>
          <Login />
        </v-row>
      </v-main>
      <v-footer app color="transparent" height="72" inset v-if="isLoggedIn">
        <v-text-field
          background-color="grey lighten-1"
          dense
          flat
          hide-details
          rounded
          solo
        ></v-text-field>
      </v-footer>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Login from "@/components/user/Login.vue";
import gql from "graphql-tag";
import { LOG_IN } from "@/store/mutation-types";
@Component({ components: { Login } })
export default class App extends Vue {
  drawer = true;
  get isLoggedIn() {
    // return true;
    console.log("store", this.$store.state.user);
    return this.$store.state.user.id != null;
  }
  async mounted() {
    try {
      // Subscription GraphQL document
      // const TAG_ADDED = gql`
      //   subscription tags($type: String!) {
      //     tagAdded(type: $type) {
      //       id
      //       label
      //       type
      //     }
      //   }
      // `;
      //
      // // SubscribeToMore tags
      // // We have different types of tags
      // // with one subscription 'channel' for each type
      // this.$watch(
      //   () => this.type,
      //   (type, oldType) => {
      //     if (type !== oldType || !this.tagsSub) {
      //       // We need to unsubscribe before re-subscribing
      //       if (this.tagsSub) {
      //         this.tagsSub.unsubscribe();
      //       }
      //       // Subscribe on the query
      //       this.tagsSub = this.$apollo.queries.tags.subscribeToMore({
      //         document: TAG_ADDED,
      //         variables: {
      //           type,
      //         },
      //         // Mutate the previous result
      //         updateQuery: (previousResult, { subscriptionData }) => {
      //           // If we added the tag already don't do anything
      //           // This can be caused by the `updateQuery` of our addTag mutation
      //           if (
      //             previousResult.tags.find(
      //               (tag) => tag.id === subscriptionData.data.tagAdded.id
      //             )
      //           ) {
      //             return previousResult;
      //           }
      //
      //           return {
      //             tags: [
      //               ...previousResult.tags,
      //               // Add the new tag
      //               subscriptionData.data.tagAdded,
      //             ],
      //           };
      //         },
      //       });
      //     }
      //   },
      //   {
      //     immediate: true,
      //   }
      // );

      // const result = await this.$apollo.mutate({
      //   mutation: gql`
      //     mutation {
      //       loginUser(username: "taraphirun", password: "123") {
      //         id
      //         first_name
      //         last_name
      //         nickname
      //         username
      //         created_at
      //         updated_at
      //       }
      //     }
      //   `,
      // });
      const loginUser = await this.$apollo.query({
        query: gql`
          query {
            me {
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
      });
      if (loginUser.data.me) {
        const data = loginUser.data.me;
        // loginUser.data.me
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
      // console.log("resulst", result);
      // const sub_user_login = await this.$apollo.queries.$users({
      //   // GraphQL document
      //   document: gql`
      //     subscription users() {
      // loginUser{
      //       username
      //       id
      //       nickname}
      //     }
      //   `,
      // });
      // console.log("sub", sub_user_login);
    } catch (e) {
      console.log("errrr", e);
    }
  }
}
</script>
