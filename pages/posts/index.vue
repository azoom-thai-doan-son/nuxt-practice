<template lang="">
  <div class="post-page">
    <Loading :active="isLoading" :is-full-page="true"></Loading>
    <div class="head">
      <button class="button -primary" @click="onClickNewPost">New Post</button>
      <div class="search-form">
        <v-text-field
          clearable
          placeholder="Find a post..."
          v-model.trim="search"
          outlined
        ></v-text-field>
        <v-select
          clearable
          :items="authorsDropdown"
          label="Select author"
          v-model="authorId"
          class="author"
          outlined
        ></v-select>
        <v-btn @click="onSearch">Search</v-btn>
      </div>
    </div>

    <div class="no-posts-error" v-if="!currentPosts.length && !isLoading">
      <h1>
        Oops! No Posts Found. Click
        <span class="get-btn" @click="getAllPosts">here </span> to get all
        posts.
      </h1>
    </div>
    <template v-else>
      <div class="body">
        <PostCard v-for="post in currentPosts" :key="post.id" :post="post" />
      </div>
      <div class="footer">
        <v-pagination
          v-if="currentPosts.length"
          :length="pageTotal"
          v-model="page"
          @input="onChangePage"
          color="#323232"
        ></v-pagination>
      </div>
    </template>
  </div>
</template>
<script>
import { dispatch, get, commit } from "vuex-pathify";
import { DEFAULT_LIMIT } from "@/utils/constansts";

export default {
  name: "PostView",
  data() {
    return {
      page: 1,
      search: "",
      authorId: null,
    };
  },
  computed: {
    currentPosts: get("currentPosts"),
    authors: get("authors"),
    authorsDropdown() {
      return this.authors.map((author) => ({
        value: author.id,
        text: author.username,
      }));
    },
    allPosts: get("allPosts"),
    pageTotal() {
      return Math.ceil(this.allPosts.length / DEFAULT_LIMIT);
    },
    isLoading: get("isLoading"),
  },
  methods: {
    async onChangePage() {
      commit("SET_IS_LOADING", true);
      await dispatch("getCurrentPosts", this.page);
      window.scrollTo({ top: 0, behavior: "smooth" });
      commit("SET_IS_LOADING", false);
    },
    onClickNewPost() {
      this.$router.push({ name: "posts-create" });
    },
    async onSearch() {
      this.page = 1;
      const query = { search: this.search, authorId: this.authorId };
      commit("SET_IS_LOADING", true);
      await dispatch("searchPosts", query);
      window.scrollTo({ top: 0, behavior: "smooth" });
      commit("SET_IS_LOADING", false);
    },
    async getAllPosts() {
      commit("SET_IS_LOADING", true);
      await dispatch("getAllPosts");
      await dispatch("getCurrentPosts", this.page);
      commit("SET_IS_LOADING", false);
    },
  },
  async created() {
    await this.getAllPosts();
  },
};
</script>
<style lang="scss" scoped>
.post-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 0;
  height: 100%;
  padding-bottom: 16px;

  .no-posts-error {
    margin-top: 32px;
  }
  > .head {
    position: sticky;
    top: -4px;
    z-index: 10;
    width: 100%;
    padding-bottom: 12px;

    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ddd0c8;
  }
  > .body {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
  }
  > .footer {
    width: 400px;
    margin: auto auto 0;
  }
}
//Colours
$red: #e74c3c;
$blue: #3498db;
.get-btn {
  cursor: pointer;
  &:hover {
    color: $blue;
  }
}

.button {
  appearance: none;
  background-color: transparent;
  border: 2px solid $red;
  border-radius: 0.6em;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  align-self: center;
  line-height: 1;
  margin: 20px;
  padding: 1.2em 2.8em;
  text-decoration: none;
  text-align: center;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 20px;

  &:hover,
  &:focus {
    outline: 0;
  }
}

.button.-primary {
  border-color: $blue;
  color: #fff;
  box-shadow: 0 0 40px 40px $blue inset, 0 0 0 0 $blue;
  transition: all 150ms ease-in-out;

  &:hover {
    box-shadow: 0 0 10px 0 $blue inset, 0 0 20px 0px $blue;
    color: black;
  }
}

.search-form {
  display: flex;
  align-items: center;
  gap: 12px;
  > .author {
    width: 180px;
  }
  ::v-deep .v-input__slot {
    margin: 0;
  }
  ::v-deep .v-text-field__details {
    display: none;
  }
}
</style>
