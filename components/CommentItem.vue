<template lang="">
  <div class="comment">
    <img src="@/assets/images/avatar.svg" alt="" class="avatar" />
    <v-card>
      <v-card-title primary-title>{{ comment.email }}</v-card-title>
      <v-card-text>{{ comment.body }}</v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "CommentItem",
  props: ["comment"],
};
</script>
<style lang="scss" scoped>
.avatar {
  width: 30px;
  height: 30px;
  padding: 6px 4px;
  border-radius: 100%;
  margin-right: 10px;
  background-color: gainsboro;
  position: relative;
  top: 12px;
}
.comment {
  display: flex;
  margin-bottom: 24px;
  max-width: 888px;

  .v-card__title {
    font-weight: 600;
    font-size: 17.5px;
    padding-bottom: 10px;
  }
  .v-card__text {
    font-size: 15.5px;
  }
}
</style>
