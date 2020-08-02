<style>
.btnStyle{
	position: absolute;
	top: 10%;
	right: 10%;
	color: #fff;
}
</style>

<template>
    <div id="toolbar" class="param-container tool-bar btnStyle">
        <button type="button" id="point" class="button black" @click="DrawTool('polyline')">绘制线</button>
        <button type="button" id="polyline" class="button black">绘制多边形</button>
        <button type="button" id="polygon" class="button black">绘制图片</button>
        <button type="button" id="marker" class="button black">绘制圆</button>
		<button type="button" id="marker" class="button black">绘制矩形</button>
        <button type="button" id="clear" class="button black">清除</button>
    </div>
</template>

<script>
export default {
	data(){
		return {

		}
	},
	methods: {
		// drawPoint(){
		// 	//量算工具
		// 	var html = '<div id="toolTip" class="measure-mouse-tip" style="display:none;color:rgb(236, 159, 30);border: 1px solid rgb(236, 159, 30);position:absolute;font-size:12px;color:#fff">单击开始，双击结束</div>';
		// 	$('.cesium-viewer').append(html);
		// 	window.Map.measureDistance();
		// }
		DrawTool(){
			window.Map.DrawTool();
		}
	}
}
</script>

