<template lang="">
  <div class="post-create-page">
    <Loading :active="isLoading" :is-full-page="true"></Loading>
    <button class="backlink" @click="$router.push({ name: 'posts' })">
      <img src="@/assets/images/back-icon.svg" width="24" height="24" alt="" />
      <h2>Go back</h2>
    </button>
    <form class="form">
      <v-select
        :items="authors"
        v-model="authorId"
        filled
        label="Author"
        dense
        @change="$v.authorId.$touch()"
        @blur="$v.authorId.$touch()"
        :error-messages="authorErrors"
      ></v-select>
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
import ky from "@/plugins/ky";
import { dispatch, commit, get } from "vuex-pathify";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
export default {
  name: "PostCreateView",
  data() {
    return {
      authorId: "",
      title: "",
      body: "",
    };
  },
  computed: {
    authors: get("authors"),
    isLoading: get("isLoading"),
    authorErrors() {
      const errors = [];
      if (!this.$v.authorId.$dirty) return errors;
      !this.$v.authorId.required && errors.push("This field is required");
      return errors;
    },
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
    authorId: {
      required,
    },
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
        userId: this.authorId,
      };
      commit("SET_IS_LOADING", true);
      const response = await dispatch("addPost", newPost);
      const author = await ky.get(`users/${this.authorId}`).json();
      response.user = author;
      response.id = Math.ceil(Math.random() * 10000);

      commit("ADD_POST", response);
      commit("SET_IS_LOADING", false);
      this.$router.replace({
        name: "PostDetail",
        params: { postId: response.id },
      });
    },
    onClear() {
      this.$v.$reset();
      this.authorId = "";
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
