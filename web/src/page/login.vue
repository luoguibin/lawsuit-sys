<template>
  <div class="login">
    <el-form
      ref="form"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item v-if="isRegister" label="用户名" prop="username">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="formData.mobile"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="formData.password"
          type="password"
          @keyup.enter="onEnterPassword"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="isRegister" class="align-center">
        <el-button @click="onGoLogin">取&nbsp;消</el-button>
        <el-button type="primary" @click="onRegister">注&nbsp;册</el-button>
      </el-form-item>
      <el-form-item v-else class="align-center">
        <el-button @click="onGoRegister">账&nbsp;号&nbsp;注&nbsp;册</el-button>
        <el-button type="primary" @click="onLogin">登&nbsp;录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { apiPostData, apiURL } from "../api";
import Md5 from "crypto-js/md5";
import Base64 from "crypto-js/enc-base64";

export default {
  name: "Login",

  data() {
    return {
      isRegister: false,

      formData: {
        username: "",
        password: "",
        mobile: "",
      },
      formRules: {
        username: { required: true, message: "用户名不能为空" },
        password: { required: true, message: "密码不能为空" },
        mobile: { required: true, message: "手机号码不能为空" },
      },
    };
  },

  methods: {
    onLogin() {
      this.$refs.form.validate((isOk) => {
        if (!isOk) {
          return;
        }
        const rand = Math.random().toString().substr(2, 6);
        let password = this.formData.password;
        password = Base64.stringify(Md5(password));
        password = Base64.stringify(Md5(password + "_" + rand));
        apiPostData(apiURL.login, {
          mobile: this.formData.mobile,
          password,
          rand,
        }).then(({ data }) => {
          this.$commit.setUser(data);
          this.$message.success("登录成功");
          this.$router.push({ name: "home" });
        });
      });
    },
    onRegister() {
      this.$refs.form.validate((isOk) => {
        if (!isOk) {
          return;
        }
        apiPostData(apiURL.register, {
          username: this.formData.username,
          mobile: this.formData.mobile,
          password: Base64.stringify(Md5(this.formData.password)),
        }).then(() => {
          this.$message.success("注册成功");
          this.onGoLogin();
        });
      });
    },
    onEnterPassword() {
      if (!this.isRegister) {
        this.onLogin();
      }
    },

    onGoRegister() {
      this.isRegister = true;
      this.formRules.username.required = true;
    },
    onGoLogin() {
      this.isRegister = false;
      this.formRules.username.required = false;
    },
  },
};
</script>

<style scoped>
.el-form {
  width: 500px;
  margin: 50px auto;
}
</style>