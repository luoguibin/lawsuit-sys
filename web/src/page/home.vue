<template>
  <div>
    <el-dropdown v-if="$user.id" @command="handleCommand">
      <el-button type="text"
        >{{ $user.username }}<i class="el-icon-arrow-down"></i
      ></el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="manage">管理</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-button type="text" v-else @click="onGoLogin">请登录</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",

  created() {
    window.home = this;
  },

  methods: {
    handleCommand(key) {
      switch (key) {
        case "logout":
          this.$commit.setUser();
          break;
        case "manage":
          this.$router.push({ name: "manage" });
          break;
        default:
          break;
      }
    },
    onGoLogin() {
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style>
</style>