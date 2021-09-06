<template>
  <div class="login">
    <el-form :model="formData" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" type="password"></el-input>
      </el-form-item>

      <el-form-item class="align-center">
        <el-button type="primary" @click="onLogin">登&nbsp;录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",

  data() {
    return {
      formData: {
        username: "",
        password: "",
      },
    };
  },

  methods: {
    onLogin() {},
  },
};
</script>

<style scoped>
.el-form {
  width: 500px;
  margin: 50px auto;
}
</style>