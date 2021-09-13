<template>
  <div v-for="item in infoColumns" :key="item.prop">
    <span>{{ item.label }}：</span
    ><span>{{
      item.formatter ? item.formatter($user[item.prop]) : $user[item.prop]
    }}</span>
  </div>
</template>

<script>
import Config from "../common/config";

export default {
  name: "PersonalSetting",

  data() {
    return {
      infoColumns: [
        { prop: "id", label: "ID" },
        { prop: "username", label: "用户名" },
        {
          prop: "mobile",
          label: "手机号码",
          formatter: function (v) {
            const nums = v.split("");
            for (let i = 3; i < 7; i++) {
              nums[i] = "*";
            }
            return nums.join("");
          },
        },
        { prop: "level", label: "账号级别" },
        { prop: "deptName", label: "单位" },
        { prop: "postName", label: "部门" },
      ],
    };
  },

  created() {
    Config.ready().then(() => {
      const user = this.$user;
      user.deptName = Config.getDeptName(user.deptId);
      user.postName = Config.getPostName(user.postId);
    });
  },
};
</script>

<style>
</style>