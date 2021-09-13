<template>
  <div class="flex-row">
    <div class="flex1">
      <el-tree
        ref="tree"
        :key="treeKey"
        :props="nodeProps"
        :load="handleLoad"
        :expand-on-click-node="false"
        lazy
        @node-click="onNodeClick"
      ></el-tree>
    </div>

    <div class="flex1">
      <el-button @click="onCreateDict">新增</el-button>
      <el-button v-show="currentItem" @click="onDelete">删除</el-button>
      <el-radio-group v-if="currentItem" v-model="optionMode">
        <el-radio label="edit">编辑</el-radio>
        <el-radio label="add">新增下一级</el-radio>
      </el-radio-group>

      <el-form
        ref="form"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="ID" prop="id">
          <el-input v-model="formData.id" readonly></el-input>
        </el-form-item>
        <el-form-item label="父级ID" prop="parentId">
          <el-input v-model="formData.parentId"></el-input>
        </el-form-item>
        <el-form-item label="字典键" prop="dictKey">
          <el-input v-model="formData.dictKey"></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="dictLabel">
          <el-input v-model="formData.dictLabel"></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="dictValue">
          <el-input v-model="formData.dictValue"></el-input>
        </el-form-item>
        <el-form-item label="注释" prop="remark">
          <el-input v-model="formData.remark"></el-input>
        </el-form-item>

        <el-form-item class="align-center">
          <el-button type="primary" @click="onSave">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { apiGetData, apiPostData, apiURL } from "../api";

export default {
  name: "DeptPostManage",

  data() {
    return {
      treeKey: 0,
      optionMode: "edit",
      nodeProps: Object.freeze({
        label: "dictKey",
        children: "children",
      }),

      currentItem: undefined,
      formData: {
        id: "",
        parentId: "",
        dictKey: "",
        dictLabel: "",
        dictValue: "",
        remark: "",
      },
      formRules: {
        parentId: { required: true, message: "PARENT_ID不能为空" },
        dictKey: { required: true, message: "字典键不能为空" },
        dictValue: { required: true, message: "字典值不能为空" },
      },
    };
  },

  watch: {
    optionMode() {
      this.checkOptionMode();
    },
  },

  created() {
    window.deptPostManage = this;
    this.onCreateDict();
  },

  methods: {
    handleLoad(node, resolve) {
      apiGetData(apiURL.dictList, { parentId: node.data.id || -1 })
        .then((resp) => {
          resolve(resp.data);
        })
        .catch(() => {
          resolve([]);
        });
    },
    onNodeClick(data) {
      this.currentItem = data;
      this.checkOptionMode();
    },
    checkOptionMode() {
      if (this.optionMode === "edit") {
        this.onEditDict(this.currentItem);
      } else {
        this.onAddDictChild(this.currentItem);
      }
    },
    onCreateDict() {
      this.currentItem = undefined;
      this.onEditDict({ parentId: -1 });
    },
    onAddDictChild(item = {}) {
      const fData = this.formData;
      for (const key in fData) {
        if (Object.hasOwnProperty.call(fData, key)) {
          fData[key] = "";
        }
      }
      fData.parentId = item.id;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    onEditDict(item = {}) {
      const fData = this.formData;
      for (const key in fData) {
        if (Object.hasOwnProperty.call(fData, key)) {
          fData[key] = item[key];
        }
      }

      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    onSave() {
      this.$refs.form.validate((isOk) => {
        if (!isOk) {
          return;
        }
        const url = this.formData.id ? apiURL.dictUpdate : apiURL.dictCreate;
        apiPostData(url, this.formData).then(() => {
          this.$message.success("保存成功");
          this.treeKey++;
          this.onCreateDict();
        });
      });
    },
    onDelete() {
      this.$confirm("此操作将永久删除该字典及后代字典, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            apiPostData(apiURL.dictDelete, { id: this.currentItem.id }).then(
              () => {
                this.$message.success("删除成功");
                this.treeKey++;
                this.onCreateDict();
                done();
              }
            );
          } else {
            done();
          }
        },
      });
    },
  },
};
</script>

<style>
</style>