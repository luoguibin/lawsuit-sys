<template>
  <el-tabs v-model="activeTab" type="border-card" tab-position="right">
    <el-tab-pane name="personal-setting" label="个人信息">
      <template #label>
        <span><i class="el-icon-s-custom"></i> {{ $user.realName || $user.username }}</span>
      </template>
      <personal-setting v-if="cacheComp['personal-setting']"></personal-setting>
    </el-tab-pane>
    <el-tab-pane name="user-manage" label="用户管理">
      <user-manage v-if="cacheComp['user-manage']"></user-manage>
    </el-tab-pane>
    <el-tab-pane name="division-manage" label="行政区划">
      <division-manage v-if="cacheComp['division-manage']"></division-manage>
    </el-tab-pane>
    <el-tab-pane name="dept-post-manage" label="单位部门">
      <dept-post-manage v-if="cacheComp['dept-post-manage']"></dept-post-manage>
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

  data() {
    return {
      activeTab: "personal-setting",
      cacheComp: {
        "personal-setting": true,
        "user-manage": false,
        "division-manage": false,
        "dept-post-manage": false,
      },
    };
  },

  watch: {
    activeTab: {
      immediate: true,
      handler(v) {
        this.cacheComp[v] = true;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tabs {
  height: 100%;
  box-sizing: border-box;

  :deep(.el-tabs__content) {
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
  }
}
</style>