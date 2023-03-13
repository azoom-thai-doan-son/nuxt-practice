<template lang="">
  <div class="comment">
    <img src="@/assets/images/avatar.svg" alt="" class="avatar" />
    <v-card>
      <v-card-title primary-title
        >{{ comment.user?.username }}
        <p class="date">{{ date }}</p></v-card-title
      >
      <v-card-text>{{ comment.body }}</v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "CommentItem",
  props: ["comment"],
  computed: {
    date() {
      return new Date(this.comment.updatedAt).toDateString();
    },
  },
};
</script>
<style lang="scss" scoped>
.avatar {
  width: 30px;
  height: 30px;
  padding: 6px 4px;
  border-radius: 100%;
  margin-right: 6px;
  background-color: gainsboro;
  position: relative;
  top: 12px;
}
.comment {
  display: flex;
  margin-bottom: 24px;
  width: 777px;

  .v-card {
    flex-grow: 1;
    min-height: 99px;
    border-radius: 12px;
  }
  .v-card__title {
    > ::v-deep .date {
      margin: 0 12px;
      color: grey;
      font-weight: 400;
      font-size: 14px;
    }
    font-weight: 600;
    font-size: 17.5px;
    padding-bottom: 10px;
    align-items: baseline;
  }
  .v-card__text {
    font-size: 15.5px;
  }
}
</style>
