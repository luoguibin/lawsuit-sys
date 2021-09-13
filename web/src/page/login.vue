<template>
  <div class="login">
    <h3>{{$config.sysTitle}}</h3>

    <el-tabs v-model="activeTab" type="border-card" :stretch="true">
      <el-tab-pane name="login" label="登&nbsp;录">
        <comp-login @login="handleLogin"></comp-login>
      </el-tab-pane>
      <el-tab-pane name="register" label="注&nbsp;册">
        <comp-register @register="handleRegister"></comp-register>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CompLogin from "../components/login.vue";
import CompRegister from "../components/register.vue";

export default {
  name: "Login",

  components: {
    CompLogin,
    CompRegister,
  },

  data() {
    return {
      activeTab: "login",
    };
  },

  created() {
    window.login = this
  },

  methods: {
    handleLogin(data) {
      this.$commit.setUser(data);
      this.$message.success("登录成功");
      this.$router.push({ name: "home" });
    },
    handleRegister() {
      this.$message.success("注册成功");
      this.activeTab = "login";
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 400px;
  transform: translate(-50%, -50%);

  h3 {
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>