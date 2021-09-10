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
import Clipboard from "clipboard";

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

    onNodeClick(data, node, instance) {
      const el = instance.refs.node$ || this.$el;
      const text = data.name + "::" + data.id;
      const clip = new Clipboard(el, {
        text: function () {
          return text;
        },
      });
      clip.on("success", (e) => {
        this.$message.success("行政区划信息复制成功");
        e.clearSelection();
        clip.destroy();
      });
      el.click();
    },
  },
};
</script>

<style>
</style>