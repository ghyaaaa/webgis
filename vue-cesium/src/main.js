// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui' //element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
import _ from 'lodash'
Vue.use(ElementUI) //使用elementUI

Vue.prototype.axios = axios;
// let Cesium = require('cesium/Cesium');
// Vue.prototype.Cesium = Cesium;
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.prototype._ = _;

import drag from "v-drag";
Vue.use(drag);
// import map from './Map/map'
// Vue.prototype.Map = map
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App } 
})