<template>
  <header class="app-header">
    <NuxtLink :to="{ name: 'posts' }">
      <h1>Post da Blog</h1>
    </NuxtLink>

    <div class="right-navbar">
      <v-btn color="primary" class="newpost-link"
        ><NuxtLink :to="{ name: 'posts-create' }" class=""
          >Create Post</NuxtLink
        ></v-btn
      >
      <v-menu offset-y close-on-content-click v-if="userInfo.id">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on"> Hello, {{ userInfo.username }} </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>
              <NuxtLink :to="{ name: 'user' }">
                <v-icon>mdi-account-circle</v-icon> Account Settings</NuxtLink
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>
              <v-icon>mdi-logout-variant</v-icon> Logout
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </header>
</template>

<script>
import { get, commit } from "vuex-pathify";
import { auth } from "~/plugins/firebase";
import Cookie from "js-cookie";
export default {
  name: "AppHeader",
  computed: {
    userInfo: get("userInfo"),
  },
  methods: {
    async logout() {
      await auth.signOut();
      await Cookie.remove("access_token");
      commit("SET_USER_INFO", {});
      location.href = "/auth";
    },
  },
};
</script>

<style lang="scss" scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px 12px;
  background-color: #ede7e1;
}

::v-deep .newpost-link {
  margin-right: 4px;
  a {
    color: white;
  }
}
</style>
