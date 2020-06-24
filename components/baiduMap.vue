<template>
	<div style="height:100%;">
		<div class="map" id="Map">
		</div>
	</div>
</template>

<script type="text/javascript" src="http://api.map.baidu.com/api?key=&v=1.1&services=true"></script>
<script>
	export default {
		name: "bdMap",
		components: {},
		data() {
			return {};
		},
		mounted() {
			// const map = new BMap.Map("Map");
			// // 创建地图实例
			// const point = new BMap.Point(116.404, 39.915);
			// // 创建点坐标
			// map.centerAndZoom(point, 15);
			// // 初始化地图，设置中心点坐标和地图级别
			
			
			//创建和初始化地图函数：
			function initMap(){
			    createMap();//创建地图
			    setMapEvent();//设置地图事件
			    addMapControl();//向地图添加控件
			}
			
			//创建地图函数：
			function createMap(){
			    var map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
			    var point = new BMap.Point(114.066112,22.548515);//定义一个中心点坐标
			    map.centerAndZoom(point,12);//设定地图的中心点和坐标并将地图显示在地图容器中
			    window.map = map;//将map变量存储在全局
			}
			
			//地图事件设置函数：
			function setMapEvent(){
			    map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
			    map.enableScrollWheelZoom();//启用地图滚轮放大缩小
			    map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
			    map.enableKeyboard();//启用键盘上下左右键移动地图
			}
			
			//地图控件添加函数：
			function addMapControl(){
			    //向地图中添加缩放控件
			var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
			map.addControl(ctrl_nav);
			    //向地图中添加缩略图控件
			var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
			map.addControl(ctrl_ove);
			    //向地图中添加比例尺控件
			var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
			map.addControl(ctrl_sca);
			}
			
			
			initMap();//创建和初始化地图
		}
	};
</script>

<style scoped>
	.map {
		width: 100%;
		height: 500px;
	}
</style>

