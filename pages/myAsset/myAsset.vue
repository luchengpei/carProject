<template>
	<view class="page">
		<view v-if="!(list==[])">
		<view class="all" v-for="(tiem,index) in list" :key="tiem.enterpriseId" @click="skip(tiem.enterpriseType,tiem.enterpriseId)">
			<view class="allImg"> 
			
			<image v-if="tpye==1" class="Imgimg" src="../../static/images/chelian.png"></image>
			<image v-if="tpye==2" class="Imgimg" src="../../static/images/Asked.png"></image>
			</view>
			<view class="content">
				<view>
					{{tiem.enterpriseName}}
				</view>
				<view>
					{{tiem.province}}{{tiem.city}}{{tiem.area}}{{tiem.enterpriseAddress}}
				</view>
			</view>
		</view>
		</view>
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
	import url from "../../api/url.js"
	import lib from "../../api/lib.js"
	export default {
		data() {
			return {
				tpye:null,
				list:[]
				
			};
		},
		mounted() {
			
		},
		methods:{
			async getlist(e){
				let data={
					enterpriseType:e
				}
			let	res= await lib.request(url.getStoreDealerList,data)
				console.log(res)
				this.list=res.data
			},
			async skip(Type,enterpriseId){
				if (Type===1) {
					uni.navigateTo({
						url: "/pages/shop/shop?id=" + enterpriseId,
					});
				} 
				if(Type==2){
					uni.navigateTo({
						url:`/pages/storeHome/storeHome?enterpriseId=${enterpriseId}`
					})
				}
			}
			
		},
		onLoad(e) {
			//车商是1 门店2
			if(e.type=="1"){
				this.tpye=+e.type
				uni.setNavigationBarTitle({
				       title: "我的车商"
				 });
				 this.getlist(+e.type)
			}
			if(e.type=="2"){
				this.tpye=+e.type
				uni.setNavigationBarTitle({
				       title: "我的门店"
				 });
				  this.getlist(+e.type)
			}
		
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		width: 750rpx;
		background-color: #F5F5F5;
	}
	.all{
		background-color: #FFFFFF;
		display: flex;
		height: 160rpx;
		width: 100%;
		align-items: center;
		margin-top:20rpx;
		.allImg{
			display: flex;
			height: 100%;
			justify-content: center;
			align-items: center;
			width: 130rpx;
			.Imgimg{
				width: 48rpx;
				height: 32rpx;
			}
		}
		.content{
			width: 658rpx;
		}
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
