<template>
  <header class="app-header">
    <NuxtLink :to="{ name: 'posts' }">
      <h1>Post da Blog</h1>
    </NuxtLink>
    <NuxtLink
      :to="{ name: 'user' }"
      class="userinfo"
      v-show="userInfo.username"
    >
      <h3>Hello, {{ userInfo.username }}</h3>
    </NuxtLink>
  </header>
</template>

<script>
import { get } from "vuex-pathify";
export default {
  name: "AppHeader",
  computed: {
    userInfo: get("userInfo"),
  },
};
</script>

<style lang="scss" scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px 12px;
  background-color: #a14811;
}
</style>
