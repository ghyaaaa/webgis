<template>
    <div class="btnStyle">
      <!-- <el-button @click="clickFuzzy">粒子</el-button> -->

	  <div id="menu">
        <p>
            <button @click="setvisible('position')">定位</button>
            <button @click="setvisible('add')">添加</button>
            <button @click="setvisible('del')">删除</button>
			<button @click="iserver()">搜索</button>
			<button @click="addCircleRipple()">圆形波纹</button>
			<button @click="addModel()">模型</button>
        </p>
    </div>
    </div>
</template>

<script>
export default {
	methods: {
		clickFuzzy(){
			window.Map.particleSystem();
		},
		setvisible(type){
			// window.Map.setvisible(type);
			window.Map.setvisible_path(type);
		},
		iserver(){
			  
		},
		addCircleRipple(){
			window.Map.addCircleRipple();
		},
		addModel(){
			
		}
	}
}
</script>

<style>
.btnStyle{
	position: absolute;
	top: 10%;
	right: 10%;
	color: #fff;
}
</style>