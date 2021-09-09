<template>
  <div v-for="item in infoColumns" :key="item.prop">
    <span>{{ item.label }}：</span
    ><span>{{
      item.formatter ? item.formatter($user[item.prop]) : $user[item.prop]
    }}</span>
  </div>
</template>

<script>
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
      ],
    };
  },
};
</script>

<style>
</style>