<template>
  <div id="app">
    <!-- 地球 -->
    <div id="cesiumContainer"></div>
    <router-view></router-view>
  </div>
</template>

<script>
const map = require('./Map/map');
import '../node_modules/cesium/Build/Cesium/Widgets/widgets.css';
export default {
  name: 'app',
  mounted(){
    window["Map"] = map.init("cesiumContainer");
  }
}
</script>

<style>
html, body, #cesiumContainer {
  width: 100%; height: 100%; margin: 0; padding: 0;;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: relative;
}
</style>