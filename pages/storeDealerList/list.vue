<template>
	<view class="list">
		<template  v-for="(item,index) in list">
			<view class="listItem" :key="index" @tap="goShop(item.enterpriseType,item.enterpriseId)" v-if="list.length">
				{{item.enterpriseName}}
			</view>
		</template>
		<view v-if="!list.length" class="wrap">
			 <view class="empty">
			 	<image src="../../static/images/empty1.png" ></image>
			 </view>
			 <view class="text">
			 	暂无收藏
			 </view>
		</view>
	</view>
</template>

<script>
	import urls from "../../api/url.js";
	import lib from "api/lib.js";
	export default {
		data() {
			return {
				list: [],
			}
		},
		onLoad(){
			this.getStoreDealerList()
		},
		methods: {
			//获取门店车商列表
			getStoreDealerList(){
				lib.request(urls.getStoreDealerList).then(res=>{
					if(res.errcode===200){
						this.list = res.data
					}
				})
			},
			//跳转对应车商 门店
			goShop(val,enterpriseId) {
				if (val===1) {
					uni.navigateTo({
						url: "/pages/shop/shop?id=" + enterpriseId,
					});
				} 
				if(val==2){
					uni.navigateTo({
						url:`/pages/activty/activtyList?type=2&enterpriseId=${enterpriseId}`
					})
				}
			},
		},
	}
</script>

<style scoped lang="scss">
	.list {
		width: 100vw;
	}

	.listItem {
		width: 670rpx;
		height: 160rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1rpx solid #979797;
		margin: 0 auto;
		margin-top: 20rpx;
		font-size: 45rpx;
		font-weight: 600;
		color:yellowgreen
	}
	.wrap{
		  width: 100vw;
		  display: flex;
		  flex-direction: column;
		  align-items: center;
		  justify-content: center;
		  margin-top: 50%;
		  .empty{
			  width: 300rpx;
			  height: 200rpx;
			  margin-bottom: 20rpx;
			  >image{
				  width: 100%;
				  height: 100%;
			  }
		  }
	}
</style>
