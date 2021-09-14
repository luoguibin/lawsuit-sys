<template>
  <div class="user-manage">
    <el-button type="primary" @click="onOpenNewUser">新&nbsp;增</el-button>
    <el-table :data="userList" v-loading="loading" stripe border>
      <el-table-column
        v-for="item in tableColumns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
      ></el-table-column>

      <el-table-column>
        <template #default="{ row }">
          <el-button type="text" @click="onDealRow(row, 'edit')"
            >编辑</el-button
          >
          <el-button type="text" @click="onDealRow(row, 'delete')"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="total"
      :page="page"
      :page-size="size"
      layout="total, prev, pager, next, jumper"
      @current-change="handlePageChange"
    ></el-pagination>

    <el-dialog
      v-model="editVisible"
      :title="formData.id ? '编辑用户信息' : '新增用户信息'"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            :readonly="!!formData.id"
          ></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="formData.realName"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="formData.mobile"></el-input>
        </el-form-item>
        <el-form-item label="账号级别" prop="level">
          <el-input v-model="formData.level"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="deptId">
          <el-select v-model="formData.deptId">
            <el-option
              v-for="item in options.depts"
              :key="item.id"
              :label="item.dictKey"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="postId">
          <el-select v-model="formData.postId">
            <el-option
              v-for="item in options.posts"
              :key="item.id"
              :label="item.dictKey"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="align-center">
          <el-button @click="editVisible = false">取&nbsp;消</el-button>
          <el-button type="primary" :loading="isSaving" @click="onSaveUser"
            >保&nbsp;存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { apiGetData, apiPostData, apiURL } from "../api";
import Config from "../common/config";
import Md5 from "crypto-js/md5";
import Base64 from "crypto-js/enc-base64";

export default {
  name: "UserManage",

  data() {
    return {
      loading: false,
      userList: [],
      total: 0,
      page: 1,
      size: 10,
      tableColumns: Object.freeze([
        { prop: "id", label: "ID" },
        { prop: "username", label: "用户名" },
        { prop: "realName", label: "真实姓名" },
        { prop: "mobile", label: "手机号码" },
        { prop: "level", label: "账号级别" },
        { prop: "createTime", label: "创建时间" },
      ]),

      options: {
        depts: [],
        posts: [],
      },

      editVisible: false,
      formData: {
        id: "",
        username: "",
        realName: "",
        mobile: "",
        level: "",
        deptId: "",
        postId: "",
      },
      formRules: {
        username: { required: true, message: "用户名不能为空" },
        realName: { required: true, message: "真实姓名不能为空" },
        mobile: { required: true, message: "手机号码不能为空" },
        level: { required: true, message: "账号级别不能为空" },
        deptId: { required: true, message: "单位不能为空" },
        postId: { required: true, message: "部门不能为空" },
      },
      isSaving: false,
    };
  },

  created() {
    window.userManage = this;
    this.getUserList();
    this.getOptions();
  },

  methods: {
    async getOptions() {
      await Config.ready();
      this.options.depts = Config.getDepts();
      this.options.posts = Config.getPosts();
    },
    getUserList() {
      this.loading = true;
      apiGetData(apiURL.userList, {
        page: this.page,
        size: this.size,
      })
        .then(({ data }) => {
          this.userList = data.list;
          this.total = data.count;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handlePageChange(val) {
      this.page = val;
      this.getUserList();
    },

    onDealRow(row, key) {
      switch (key) {
        case "edit":
          this.editVisible = true;
          const fData = this.formData;
          for (const key in fData) {
            if (Object.hasOwnProperty.call(fData, key)) {
              fData[key] = row[key];
            }
          }
          this.$nextTick(() => {
            this.$refs.form.clearValidate();
          });
          break;
        case "delete":
          this.$confirm("此操作将永久删除该用户, 是否继续?", "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                apiPostData(apiURL.userDelete, { id: row.id }).then(() => {
                  this.$message.success("删除成功");
                  this.getUserList();
                  done();
                });
              } else {
                done();
              }
            },
          });
          break;
        default:
          break;
      }
    },
    onOpenNewUser() {
      this.editVisible = true;
      const fData = this.formData;
      for (const key in fData) {
        if (Object.hasOwnProperty.call(fData, key)) {
          fData[key] = "";
        }
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },

    onSaveUser() {
      this.$refs.form.validate((isOk) => {
        if (!isOk) {
          return;
        }

        this.isSaving = true;
        let url;
        const params = { ...this.formData };
        if (params.id) {
          url = apiURL.userUpdate;
        } else {
          url = apiURL.register;
          params.password = Base64.stringify(Md5("123456"));
        }

        apiPostData(url, params)
          .then(() => {
            this.$message.success("保存成功");
            this.editVisible = false;
            this.getUserList();
          })
          .finally(() => {
            this.isSaving = false;
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  .el-select {
    width: 100%;
  }
}
</style>