<template lang="">
  <div class="post-detail-page">
    <Loading :active="isLoading" :is-full-page="true"></Loading>
    <button class="backlink" @click="$router.push({ name: 'posts' })">
      <img src="@/assets/images/back-icon.svg" width="24" height="24" alt="" />
      <h2>Go back</h2>
    </button>
    <!-- <PostCard :post="post" /> -->
    <v-card outline width="850" class="post-card">
      <div class="header">
        <img
          src="@/assets/images/avatar.svg"
          width="40"
          height="40"
          alt=""
          class="avatar"
        />
        <div>
          <h3 class="username">{{ post?.author?.username }}</h3>
          <p class="email">{{ post?.author?.email }}</p>
        </div>
      </div>
      <v-card-title primary-title class="title">
        {{ post?.title }}
      </v-card-title>
      <v-card-text class="body">{{ post?.body }}</v-card-text>
    </v-card>
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
import {
  commentsCollection,
  postsCollection,
  usersCollection,
} from "~/plugins/firebase";

export default {
  name: "PostDetailView",
  components: {
    PostCard,
    CommentItem,
  },
  data() {
    return {
      comments: [],
      post: {},
    };
  },
  computed: {
    isLoading: get("isLoading"),
  },

  async asyncData({ params }) {
    commit("SET_IS_LOADING", true);
    let post;
    let comments = [];
    try {
      const postRef = await postsCollection.doc(params.postId).get();
      post = { ...postRef.data(), id: postRef.id };
      const userRef = await usersCollection.doc(post.authorId).get();
      post.author = { ...userRef.data() };
      const snapshots = await commentsCollection
        .where("postId", "==", postRef.id)
        .get();
      snapshots.forEach((doc) => {
        comments.push({
          ...doc.data(),
          id: doc.id,
        });
      });
    } catch (error) {
      console.error(error);
    }
    commit("SET_IS_LOADING", false);
    console.log(post);
    return { post, comments };
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
::v-deep .v-card {
  border-radius: 24px;
  margin: 12px;
  .header {
    display: flex;
    align-items: center;
    padding: 8px;
    .avatar {
      padding: 6px 4px;
      margin-right: 10px;
      background-color: gainsboro;
      border-radius: 100%;
    }
    .username {
      font-size: 17px;
      font-weight: 600;
    }
    .email {
      font-size: 15px;
      margin: 0;
    }
  }
  .title {
    font-size: 1.6rem !important;
    padding-top: 0px;
    padding-bottom: 8px;
    font-weight: 600;
  }
  .body {
    font-size: 14px;
  }
}
</style>
