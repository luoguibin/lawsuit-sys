<template>
  <el-form
    ref="form"
    :model="formData"
    :rules="formRules"
    label-width="150px"
    label-suffix="："
  >
    <el-form-item label="ID">
      <el-input :value="formData.id" readonly></el-input>
    </el-form-item>

    <el-form-item label="用户名">
      <el-input v-model="formData.username" :readonly="!isEdit"></el-input>
    </el-form-item>

    <el-form-item label="手机号码">
      <el-input :value="formData.mobile" readonly></el-input>
    </el-form-item>

    <el-form-item label="密码">
      <el-input
        v-model="formData.password"
        :readonly="!isEdit"
        type="password"
        placeholder="输入字符则进行密码更新"
      ></el-input>
    </el-form-item>

    <el-form-item label="账号级别">
      <el-input :value="formData.level" readonly></el-input>
    </el-form-item>

    <el-form-item label="单位">
      <el-input :value="formData.deptName" readonly></el-input>
    </el-form-item>

    <el-form-item label="部门">
      <el-input :value="formData.postName" readonly></el-input>
    </el-form-item>

    <el-form-item>
      <el-button v-show="!isEdit" type="primary" @click="onToggleEdit"
        >编&nbsp;辑</el-button
      >
      <el-button v-show="isEdit" @click="onToggleEdit()">取&nbsp;消</el-button>
      <el-button
        v-show="isEdit"
        type="primary"
        @click="onSave"
        :loading="loading"
        >保&nbsp;存</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { apiPostData, apiURL } from "../api";
import Config from "../common/config";
import Md5 from "crypto-js/md5";
import Base64 from "crypto-js/enc-base64";

export default {
  name: "PersonalSetting",

  data() {
    return {
      isEdit: false,
      loading: false,

      formData: {
        id: "",
        username: "",
        mobile: "",
        password: "",
        level: "",
        deptName: "",
        postName: "",
      },
      formRules: {
        username: { required: true, message: "用户名不能为空" },
      },
    };
  },

  created() {
    window.personalSetting = this;

    Config.ready().then(() => {
      this.initFromData();
      this.formData.deptName = Config.getDeptName(this.$user.deptId);
      this.formData.postName = Config.getPostName(this.$user.postId);
    });
  },

  methods: {
    initFromData() {
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(this.formData, key)) {
          this.formData[key] = this.$user[key] || "";
        }
      }
      this.formData.password = "******";
    },

    onToggleEdit(v) {
      if (v === undefined) {
        this.isEdit = !this.isEdit;
      } else {
        this.isEdit = v;
      }
      if (this.isEdit) {
        this.formData.password = "";
      } else {
        this.initFromData();
      }
    },
    onSave() {
      this.$refs.form.validate((isOk) => {
        if (!isOk) {
          return;
        }

        this.loading = true;

        const params = {
          username: this.formData.username,
        };
        if (this.formData.password) {
          params.password = Base64.stringify(Md5(this.formData.password));
        }
        apiPostData(apiURL.userUpdateSelf, params)
          .then(({ data }) => {
            this.$message.success("更新成功");
            this.$commit.updateUser({
              username: this.formData.username,
              createTime: data.createTime,
            });
            this.onToggleEdit(false);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-input :deep(input[readonly]) {
  border-color: transparent;
}
</style>