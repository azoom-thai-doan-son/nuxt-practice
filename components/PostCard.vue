<template lang="">
  <NuxtLink
    :to="{ name: 'posts-postId', params: { postId: post?.id } }"
    class="post-card"
  >
    <v-card outline width="450">
      <div class="header">
        <img
          src="@/assets/images/avatar.svg"
          width="40"
          height="40"
          alt=""
          class="avatar"
        />
        <div>
          <h3 class="username">{{ post?.user?.username }}</h3>
          <p class="email">{{ post?.user?.email }}</p>
        </div>
      </div>
      <v-card-title primary-title class="title">
        {{ post?.title }}
      </v-card-title>
      <v-card-text class="body">{{ post?.body }}</v-card-text>
    </v-card>
  </NuxtLink>
</template>
<script>
export default {
  name: "PostCard",
  props: ["post"],
};
</script>
<style lang="scss" scoped>
.post-card {
  text-decoration: none;
  transition: all 0.4s;
  display: flex;
  justify-content: center;
  &:hover {
    transform: scale(1.03);
  }
  .v-card {
    border-radius: 24px;
    margin: 12px;
  }
}
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
  font-size: 2rem;
  padding-top: 8px;
  font-weight: 600;
}
.body {
  font-size: 13px;
}
</style>
