<template>
  <div id="app">
    <router-view></router-view>
    <div class="footer">Copyright © 2017 Cloudwalk</div>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="scss">
 // @import '~normalize.css/normalize.css';// normalize.css 样式格式化
  @import './styles/index.scss'; // 全局自定义的css样式
.footer{
  position: fixed;
  bottom: 6px;
  text-align: center;
  padding-left: 46%;
  font-size: 14px;
  font-family: 'Microsoft YaHei', 微软雅黑, 'Helvetica Neue', Helvetica, 'PingFang SC' ;
  color: #a2a2a2;
}
</style>
