<template>
  <router-view></router-view>
</template>

<script>
import Config from "./common/config";

export default {
  name: "App",

  created() {
    window.app = this;
    Config.ready().then((data) => {
      document.title = data.sysTitle || "管理系统";
    });
  },
};
</script>

<style>
#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
