<template>
  <div class="default-layout">
    <notifications />
    <v-app>
      <AppHeader />
      <Nuxt />
    </v-app>
  </div>
</template>

<script>
export default {
  name: "DefaultLayout",
};
</script>

<style lang="css" scoped>
.default-layout {
  min-height: 100vh;
  background-color: #ddd0c8;
}
::v-deep .v-application {
  background-color: #ddd0c8 !important;
  font-family: "Tilt Neon", sans-serif;
}
</style>
