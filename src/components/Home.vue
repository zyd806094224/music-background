<template>

  <div>
    <the-header></the-header>

    <the-aside></the-aside>

    <div class="content-box" :class="{'content-collapse':collapse}">
      <router-view></router-view>
    </div>
  </div>

</template>

<script>

import TheHeader from "./TheHeader";
import TheAside from "./TheAside";
import bus from "../assets/js/bus";

export default {
  name: "Home",
  components: {TheAside, TheHeader},
  comments: {
    TheHeader,
    TheAside
  },
  data(){
    return {
      collapse: false
    }
  },created() {
    //通过bus进行组件间通信，来折叠隐藏侧边栏
    bus.$on('collapse',msg =>{
      this.collapse = msg;
    })
  }
}
</script>

<style scoped>

</style>
