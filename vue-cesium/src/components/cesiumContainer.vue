<template>
	<div>
		<div class="btnStyle" >
			<el-button type="primary" @click="onClick" round>闪烁点</el-button>
			<el-button type="primary" @click="onClick1" round>目标</el-button>
			<el-button type="primary" @click="onClick2" round>热力图</el-button>
			<el-button type="primary" @click="clickDistance">测距</el-button>
		</div>

		<div ref="chart1" id="chart1" style="position: absolute; top:100px; left:100px; width:300px;height:376px"></div>
		
	</div>
  
</template>

<script>

import $ from 'jquery'
export default {
  name: 'cesiumContainer',
  data() {
    return {
      data1: {
        id: 1,
        name: "dfsdf",
        jid: 123
      },
      isShow: false,
    }
    
  },
  components: {},
  mounted(){
      // this.getEchartData1();
  },
  methods: {
    onClick(){
      let _this = this;
      _this.points();
    },
    onClick1(){
		let _this = this;
		window.Map.cBillboard.init({
			id: 'uniqueId',
			img: '/static/image/2.png',
			event: {
				click: function (){
					let chart1 = _this.$echarts.init(_this.$refs.chart1);
					let option = {
						tooltip: {
							trigger: 'item',
							formatter: '{a} <br/>{b}: {c} ({d}%)'
						},
						series: [
							{
								name: '访问来源',
								type: 'pie',
								radius: ['50%', '70%'],
								avoidLabelOverlap: false,
								label: {
									show: false,
									position: 'center'
								},
								emphasis: {
									label: {
										show: true,
										fontSize: '30',
										fontWeight: 'bold'
									}
								},
								labelLine: {
									show: false
								},
								data: [
									{value: 335, name: '直接访问'},
									{value: 310, name: '邮件营销'},
									{value: 234, name: '联盟广告'},
									{value: 135, name: '视频广告'},
									{value: 1548, name: '搜索引擎'}
								]
							}
						]
					}
					chart1.setOption(option);
					
				}
			}
		});
    },
    onClick2(){
      window.Map.hotMap();
    },
    points () {
      window.Map.point.Init();
    },
    cBillboard(){
      window.Map.cBillboard(dataList);
    },
    clickDistance(){
        //量算工具
        // window.Map.measureDistance();
        window.Map.primitiveLine();
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.cesium-widget-credits{ 
  display: none!important; 
  visibility: hide!important; 
} 
.point{
  position: fixed;
  top: 10%;
  left: 10%;
}
.btnStyle{
  position: absolute;
  top: 10%;
  right: 10%;
  color: #fff;
}

.leaflet-popup {
    position: absolute;
    text-align: center;
}
.leaflet-popup-close-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 4px 4px 0 0;
    text-align: center;
    width: 18px;
    height: 14px;
    font: 16px/14px Tahoma, Verdana, sans-serif;
    color: #c3c3c3;
    text-decoration: none;
    font-weight: bold;
    background: transparent;
}
.leaflet-popup-content-wrapper {
    text-align: center;
    max-height: 200px;
    overflow-y: auto;
    background: white;
    box-shadow: 0 3px 14px rgba(0,0,0,0.4);
    padding: 1px;
    text-align: left;
    border-radius: 12px;
}
.leaflet-popup-content {
    margin: 13px 19px;
    line-height: 1.4;
}
.leaflet-popup-tip-container {
    margin: 0 auto;
    width: 200px;
    height: 100px;
    position: relative;
    overflow: hidden;
}
.leaflet-popup-tip {
    background: white;
    box-shadow: 0 3px 14px rgba(0,0,0,0.4);
    width: 17px;
    height: 17px;
    padding: 1px;
    margin: -10px auto 0;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
}
 
/*按钮样式*/
.add-button{
	
}

</style>