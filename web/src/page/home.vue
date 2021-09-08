<template>
  <div>
    <span v-if="$user.id" @click="onLogout">{{ $user.username }}</span>
    <span v-else @click="onGoLogin">请登录</span>
  </div>
</template>

<script>
import { apiGetData, apiURL } from "../api";

export default {
  name: "Home",

  created() {
    window.home = this;
  },

  methods: {
    onLogout() {
      this.$commit.setUser();
    },
    onGoLogin() {
      this.$router.push({ name: "login" });
    },
    test() {
      if (this.$user.id) {
        apiGetData(apiURL.userList).then((resp) => {
          console.log(resp.data);
        });
      }
    },
  },
};
</script>

<style>
</style>