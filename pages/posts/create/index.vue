<template lang="">
  <div class="post-create-page">
    <Loading :active="isLoading" :is-full-page="true"></Loading>
    <button class="backlink" @click="$router.push({ name: 'posts' })">
      <img src="@/assets/images/back-icon.svg" width="24" height="24" alt="" />
      <h2>Go back</h2>
    </button>
    <form class="form">
      <v-text-field
        label="Title"
        @blur="$v.title.$touch()"
        v-model.trim="title"
        :error-messages="titleErrors"
        filled
      ></v-text-field>
      <v-textarea
        counter
        v-model.trim="body"
        clearable
        :error-messages="bodyErrors"
        clear-icon="mdi-close-circle"
        rows="3"
        @blur="$v.body.$touch()"
        row-height="25"
        filled
        auto-grow
        label="Body"
      ></v-textarea>
      <div class="footer">
        <v-btn @click="onSubmit" :disabled="$v.$error || $v.$invalid">
          submit
        </v-btn>
        <v-btn @click="onClear"> clear </v-btn>
      </div>
    </form>
  </div>
</template>
<script>
import { dispatch, commit, get } from "vuex-pathify";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { postsCollection } from "~/plugins/firebase";
export default {
  name: "PostCreateView",
  data() {
    return {
      title: "",
      body: "",
    };
  },
  computed: {
    userInfo: get("userInfo"),
    isLoading: get("isLoading"),
    titleErrors() {
      const errors = [];
      if (!this.$v.title.$dirty) return errors;
      !this.$v.title.required && errors.push("This field is required");
      !this.$v.title.minLength &&
        errors.push("Title must be at least 10 characters");
      !this.$v.title.maxLength &&
        errors.push("Title must be at most 255 characters");
      return errors;
    },
    bodyErrors() {
      const errors = [];
      if (!this.$v.body.$dirty) return errors;
      !this.$v.body.required && errors.push("This field is required");
      !this.$v.body.minLength &&
        errors.push("Body must be at least 10 characters");
      !this.$v.title.maxLength &&
        errors.push("Body must be at most 255 characters");
      return errors;
    },
  },
  validations: {
    title: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(255),
    },
    body: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(999),
    },
  },
  methods: {
    async onSubmit() {
      const newPost = {
        title: this.title,
        body: this.body,
        authorId: this.userInfo.id,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      };
      commit("SET_IS_LOADING", true);
      try {
        const postRef = await postsCollection.add({ ...newPost });
        console.log("author", this.userInfo);
        commit("ADD_POST", {
          id: postRef.id,
          ...newPost,
          author: this.$store.copy("userInfo"),
        });
        this.$router.replace({
          name: "posts-postId",
          params: { postId: postRef.id },
        });
        this.$notify({ type: "success", text: "New post added successfully" });
      } catch (error) {
        this.$notify({ type: "error", text: error });
      }

      commit("SET_IS_LOADING", false);
    },
    onClear() {
      this.$v.$reset();
      this.title = "";
      this.body = "";
    },
  },

  async created() {
    commit("SET_IS_LOADING", true);
    await dispatch("getAuthors");
    commit("SET_IS_LOADING", false);
  },
};
</script>
<style lang="scss" scoped>
.post-create-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  > .backlink {
    display: flex;
    align-items: center;
    align-self: flex-start;
    margin-bottom: 12px;
  }
  > .form {
    max-width: 888px;
    min-width: 555px;
    > .footer {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
  }
}
</style>
