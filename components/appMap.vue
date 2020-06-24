<template>
	<view class="mapBox">
		<!-- <web-view src="/hybrid/html/local.html"></web-view> -->
	</view>
</template>

<script>
	var wv;
	export default {
		onReady() {
			// #ifdef APP-PLUS
			wv = plus.webview.create("", "custom-webview", {
				plusrequire: "none", //禁止远程网页使用plus的API，有些使用mui制作的网页可能会监听plus.key，造成关闭页面混乱，可以通过这种方式禁止
				'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
				top: uni.getSystemInfoSync().statusBarHeight + 44 //放置在titleNView下方。如果还想在webview上方加个地址栏的什么的，可以继续降低TOP值
			})
			wv.loadURL("/hybrid/html/local.html")
			// var currentWebview = this.$mp.page.$getAppWebview()
			console.log(this)
			//获取当前页面的webview对象
			// currentWebview.append(wv); //一定要append到当前的页面里！！！才能跟随当前页面一起做动画，一起关闭
			// setTimeout(function() {
			// 	// console.log(wv.getStyle())
			// }, 1000); //如果是首页的onload调用时需要延时一下，二级页面无需延时，可直接获取
			// #endif
		},

		data() {
			return {

			};
		}
	}
</script>

<style scoped>
	.mapBox {
		padding: 50rpx;
	}
</style>
