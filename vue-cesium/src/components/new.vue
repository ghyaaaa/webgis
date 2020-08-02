<template>
  <div>
    <div class="toolBarRight">
        <el-button-group>
			<el-button type="primary" icon="icon iconfont icon-map" @click="openMap">底图</el-button>
			<el-button type="primary" icon="icon iconfont icon-tasks1" @click="loadLayer">图层</el-button>
			<el-dropdown trigger="click" @command="clickDrop">
				<el-button type="primary" icon="icon iconfont icon-cubes-solid">
					工具<i class="el-icon-arrow-down el-icon--right"></i>
				</el-button>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item v-for="(tool, index) of tools" :key="index" :command="tool.name" :icon="tool.icon" >{{tool.name}}</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			
		</el-button-group>
    </div>
	<!-- 底图 -->
	<flybox ref="mapRef" class="flybox" :title="'地图'" :icon="'icon iconfont icon-map'">
		<div slot="content">
			<div style="width: 100%;" class="toolsbar-mappic">
				<ul id="basemaps">
					<li v-for="(item, index) of imgList" :key="index" :class="[item.id === current ? 'active' : '']">
						<div>
							<img :src="item.url" alt="" @click="clickFn(item.id)">
						</div>
						<span>{{item.name}}</span>
					</li>
				</ul>
			</div>
		</div>
	</flybox>
	<!-- 图上量算 -->
	<flybox ref="toolsRef" @closeMap="closeCalculator" class="flybox" :title="'量算工具'">
		<div slot="content">
			<div class="btn-group">
				<div v-for="(btn, index) of calculatorList" :key="index" :id="btn.id" class='tool-btn' >
					<div class="tool-thum" :style="{'background': btn.style}" @click="calculatorClick(btn.title)">
						<img :src="btn.url" alt="">
					</div>
					<span class="btn_none">{{btn.title}}</span>
				</div>
			</div>
		</div>
	</flybox>
  </div>
</template>

<script>
import flybox from './flybox';
export default {
	data(){
		return {
			dialogVisible: true,
			current: 0,
			showCalculator: false,
			imgList: [
				{
					id: 0,
					name: '谷歌地图',
					url: '../../static/image/google_img.png'
				},
				{
					id: 1,
					name: 'ArcGIS卫星',
					url: '../../static/image/esriWorldImagery.png'
				},
				{
					id: 2,
					name: '高德地图',
					url: '../../static/image/bingAerial.png'
				},
				{
					id: 3,
					name: '腾讯地图',
					url: '../../static/image/tdt_img.png'
				},
				{
					id: 4,
					name: '天地图电子',
					url: '../../static/image/tdt_vec.png'
				},
				{
					id: 5,
					name: 'OMS地图',
					url: '../../static/image/osm.png'
				},
				{
					id: 6,
					name: '离线地图',
					url: '../../static/image/google_img.png'
				},
				{
					id: 7,
					name: '单张图片',
					url: '../../static/image/offline.png'
				}
			],
			tools: [
				{
					name: '图上量算',
					icon: 'icon iconfont icon-calculator'
				},
				{
					name: '空间分析',
					icon: 'icon iconfont icon-bar-chart'
				},
				{
					name: '坐标定位',
					icon: 'icon iconfont icon-MAPPIN'
				},
				{
					name: '地区导航',
					icon: 'icon iconfont icon-sendo'
				},
				{
					name: '分屏对比',
					icon: 'icon iconfont icon-windowrestore'
				},
				{
					name: '图上标绘',
					icon: 'icon iconfont icon-object-group'
				},
				{
					name: '飞行漫游',
					icon: 'icon iconfont icon-sendo'
				},
			],
			calculatorList: [
				{
					title: '空间距离',
					id: 'btn_measure_length',
					url: 'http://cesium.marsgis.cn/lib/layer/theme/retina/svg/maximize.svg',
					style: '#dd751b'
				},
				{
					title: '贴地距离',
					id: 'btn_measure_length_td',
					url: 'http://cesium.marsgis.cn/project/jcxm/widgets/measure/image/measure-length2.svg',
					style: '#c092fe'
				},
				{
					title: '水平面积',
					id: 'btn_measure_area',
					url: 'http://cesium.marsgis.cn/project/jcxm/widgets/measure/image/measure-area.svg',
					style: '#3de3f4'
				},
				{
					title: '贴地面积',
					id: 'btn_measure_area_td',
					url: 'http://cesium.marsgis.cn/project/jcxm/widgets/measure/image/measure-area.svg',
					style: '#c092fe'
				},
			]
		}
	},
	components: {
		flybox
	},
	mounted() {
      
        
	},
	methods: {
		handleClose(){

		},
		openMap(){
			this.$refs.mapRef.open();
		},
		closeMap(){
			this.$refs.mapRef.close();
		},
		clickFn(id){
			this.current = id;
			window.Map.changeMap.add(id);
				
		},
		loadLayer(){
			
		},
		clickDrop(name){
			if (name === '图上量算'){
				this.$refs.toolsRef.open();
			}
		},
		closeCalculator(){

		},
		calculatorClick(title){
			switch (title){
				case '空间距离':
					
					break;
				case '贴地距离':
					window.Map.drawTool.startDraw({
						type: 'polyline',
						style: {
							material: Cesium.Color.YELLOW,
							clampToGround: true
						},
						success: function (evt) {

						}	
					});
					break;
			}
		}

	}
	
}
</script>
<style scoped>
	.toolBarRight{
		position: absolute;
		top: 10px;
		right: 20px;
	}
	.flybox{
		position: absolute;
		top: 50px;
		right: 20px;
	}
	.toolsbar-mappic{
		overflow-x: hidden;
		overflow-y: auto;
		padding: 0;
	}
	.toolsbar-mappic ul{
		margin: 0;
    	padding: 0;
	}
	li, ul{
		list-style: none;
	}
	.toolsbar-mappic ul li{
		display: inline-block;
		width: 75px;
		list-style-type: none;
		margin-top: 10px;
		margin-left: 10px;
		float: left;
		text-align: center;
		cursor: pointer;
		font-size: 12px;
		color: #fff;
	}
	.toolsbar-mappic ul li img{
		border: solid 2px #fff;
		width: 75px;
		height: 70px;
	}
	.toolsbar-mappic ul li.active{
		color: #337fe5;
	} 
	.toolsbar-mappic ul li.active img{
		border: solid 2px #337fe5;
	}
	.btn-group{
		display: flex;
		align-content: flex-start;
		flex-wrap: wrap;
		padding-left: 20px;
	}
	.tool-btn {
		cursor: pointer;
		user-select: none;
		min-width: 62px;
		height: 96px;
		box-sizing: border-box;
		margin: 0 30px 10px 0;
		text-align: center;
		padding-top: 12px;
	}
	.tool-thum{
		transition: all .2s ease;
		width: 50px;
		height: 50px;
		margin: 0 auto;
		border-radius: 50%;
		margin-bottom: 10px;
		background: #fd960f;
		cursor: pointer;
	}
	.tool-thum img{
		    width: 24px;
		height: 24px;
		margin: 13px;
	}
</style>
<style>
	.iconfont{
		font-size: 12px;
		padding-left: 5px;
	}
	.el-dialog{
		position: absolute;
		right: 20px;
		margin: 0;
	}
</style>