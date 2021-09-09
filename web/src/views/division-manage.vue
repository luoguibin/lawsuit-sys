<template>
  <div>
    <el-tree
      :props="nodeProps"
      :load="handleLoad"
      :expand-on-click-node="false"
      lazy
      @node-click="onNodeClick"
    ></el-tree>
  </div>
</template>

<script>
import { apiGetData, apiURL } from "../api";

export default {
  name: "AdministrativeDivision",

  data() {
    return {
      nodeProps: Object.freeze({
        label: "name",
        children: "children",
      }),
    };
  },

  methods: {
    handleLoad(node, resolve) {
      apiGetData(apiURL.divisionList, { parentId: node.data.id || -1 })
        .then((resp) => {
          resolve(resp.data || {});
        })
        .catch(() => {
          resolve([]);
        });
    },

    onNodeClick(data) {
      console.log(data.id, data.name);
    },
  },
};
</script>

<style>
</style>