<template lang="">
  <div class="post-detail-page">
    <Loading :active="isLoading" :is-full-page="true"></Loading>
    <button class="backlink" @click="$router.push({ name: 'posts' })">
      <img src="@/assets/images/back-icon.svg" width="24" height="24" alt="" />
      <h2>Go back</h2>
    </button>
    <PostCard :post="currentPost" />
    <v-divider dark></v-divider>
    <div class="comment-section">
      <h1 class="title">Top Comments ({{ comments.length }})</h1>
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
      />
    </div>
  </div>
</template>
<script>
import { get, commit } from "vuex-pathify";
import PostCard from "@/components/PostCard.vue";
import CommentItem from "@/components/CommentItem.vue";
import ky from "@/plugins/ky";

export default {
  name: "PostDetailView",
  components: {
    PostCard,
    CommentItem,
  },
  data() {
    return {
      comments: [],
    };
  },
  computed: {
    allPosts: get("allPosts"),
    isLoading: get("isLoading"),
    currentPost() {
      return this.allPosts.find(
        (post) => post.id === +this.$route.params.postId
      );
    },
  },
  async created() {
    commit("SET_IS_LOADING", true);
    const comments = await ky
      .get(`posts/${this.currentPost?.id}/comments`)
      .json();
    this.comments = comments;
    commit("SET_IS_LOADING", false);
  },
};
</script>
<style lang="scss" scoped>
.post-detail-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 16px 32px;
  min-width: 555px;
  > .backlink {
    display: flex;
    align-items: center;
    align-self: flex-start;
  }
  > .comment-section {
    width: 100%;
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      align-self: flex-start;
      margin-bottom: 16px;
    }
  }
}
</style>
