<template lang="">
  <div class="post-detail-page">
    <Loading :active="isLoading" :is-full-page="true"></Loading>
    <button class="backlink" @click="$router.push({ name: 'posts' })">
      <img src="@/assets/images/back-icon.svg" width="24" height="24" alt="" />
      <h2>Go back</h2>
    </button>

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

    <div class="comment-section">
      <h1 class="title">Top Comments ({{ comments.length }})</h1>

      <!-- Add new comment -->
      <div class="new-comment-section">
        <div class="input">
          <img
            src="@/assets/images/avatar.svg"
            alt=""
            width="30"
            height="30"
            class="avatar"
          />
          <v-textarea
            background-color="grey lighten-2"
            auto-grow
            rows="3"
            v-model="comment"
            @blur="$v.comment.$touch()"
            @click="isShowSubmitBtn = true"
            :error-messages="commentErrors"
            class="textarea"
            placeholder="Add to the discussion"
          ></v-textarea>
        </div>
        <v-btn
          color="primary"
          class="submitbtn"
          :disabled="$v.comment.$invalid || $v.comment.$error"
          v-show="isShowSubmitBtn"
          @click="addNewComment"
          >Submit</v-btn
        >
        <v-btn @click="cancel" v-show="isShowSubmitBtn">Cancel</v-btn>
      </div>

      <!-- List of comments -->
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
import { requiredError, maxLengthError } from "@/utils/errorMessages";
import { required, maxLength } from "vuelidate/lib/validators";
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
      comment: "",
      isShowSubmitBtn: false,
    };
  },
  validations: {
    comment: {
      required,
      maxLength: maxLength(999),
    },
  },
  computed: {
    isLoading: get("isLoading"),
    userInfo: get("userInfo"),
    commentErrors() {
      const errors = [];
      if (!this.$v.comment.$dirty) return errors;
      !this.$v.comment.required && errors.push(requiredError);
      !this.$v.comment.maxLength && errors.push(maxLengthError(999));
      return errors;
    },
  },
  methods: {
    async addNewComment() {
      const newComment = {
        postId: this.$route.params.postId,
        userId: this.userInfo.id,
        body: this.comment,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      };
      try {
        await commentsCollection.add(newComment);
        this.comments.push({ ...newComment, user: { ...this.userInfo } });
        this.$v.$reset();
        this.comment = "";
        this.isShowSubmitBtn = false;
        this.$notify({ type: "success", text: "Comment added successfully" });
      } catch (error) {
        this.$notify({ type: "error", text: error });
      }
    },
    cancel() {
      this.$v.$reset();
      this.comment = "";
      this.isShowSubmitBtn = false;
    },
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
      snapshots.forEach(async (doc) => {
        const userRef = await usersCollection.doc(doc.data().userId).get();
        comments.push({
          ...doc.data(),
          id: doc.id,
          user: { ...userRef.data() },
        });
      });
    } catch (error) {
      this.$notify({ type: "error", text: error });
    }
    commit("SET_IS_LOADING", false);
    console.log(comments);
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
::v-deep .post-card {
  border-radius: 12px;
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
.new-comment-section {
  width: 777px;
  margin-bottom: 24px;
  > .input {
    display: flex;
    > .textarea {
      max-height: 200px;
      overflow: auto;
      ::v-deep textarea {
        padding: 16px;
      }
    }

    ::v-deep .v-input {
      padding: 0;
    }
  }
  > ::v-deep .submitbtn {
    margin-left: 36px;
    margin-right: 8px;
  }
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
}
</style>
