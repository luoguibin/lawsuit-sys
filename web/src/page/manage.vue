<template>
  <el-tabs tab-position="right">
    <el-tab-pane label="个人信息">
      <personal-setting></personal-setting>
    </el-tab-pane>
    <el-tab-pane label="用户管理">
      <user-manage></user-manage>
    </el-tab-pane>
    <el-tab-pane label="行政区划">
      <division-manage></division-manage>
    </el-tab-pane>
    <el-tab-pane label="单位部门">
      <dept-post-manage></dept-post-manage>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "Manage",

  components: {
    UserManage: defineAsyncComponent(() => import("../views/user-manage.vue")),
    PersonalSetting: defineAsyncComponent(() =>
      import("../views/personal-setting.vue")
    ),
    DivisionManage: defineAsyncComponent(() =>
      import("../views/division-manage.vue")
    ),
    DeptPostManage: defineAsyncComponent(() =>
      import("../views/dept-post-manage.vue")
    ),
  },
};
</script>

<style>
</style>