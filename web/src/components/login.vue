<template>
  <el-form ref="form" :model="formData" :rules="formRules" label-width="100px">
    <!-- <el-form-item label="手机号码" prop="mobile">
      <el-input v-model="formData.mobile"></el-input>
    </el-form-item> -->
    <el-form-item label="用户名" prop="username">
      <el-input v-model="formData.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        v-model="formData.password"
        type="password"
        @keyup.enter="onLogin()"
      ></el-input>
    </el-form-item>
    <el-form-item class="align-center" label-width="0">
      <el-button type="primary" @click="onLogin" :loading="loading"
        >确&nbsp;定</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { apiPostData, apiURL } from "../api";
import Md5 from "crypto-js/md5";
import Base64 from "crypto-js/enc-base64";

export default {
  name: "CompLogin",

  data() {
    return {
      loading: false,
      formData: {
        // mobile: "",
        username: "",
        password: "",
      },
      formRules: {
        // mobile: { required: true, message: "手机号码不能为空" },
        username: { required: true, message: "用户不能为空" },
        password: { required: true, message: "密码不能为空" },
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

        this.loading = true;
        apiPostData(apiURL.login, {
          // mobile: this.formData.mobile,
          username: this.formData.username,
          password,
          rand,
        })
          .then(({ data }) => {
            this.$emit("login", data);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
  },
};
</script>

<style>
</style>