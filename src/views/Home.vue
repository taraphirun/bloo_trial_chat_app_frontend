<template>
  <MessageContainer />
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import MessageContainer from "@/components/message/MessageContainer";
@Component({
  components: { MessageContainer },
})
export default class Home extends Vue {}
</script>

<style scoped></style>
