<template>
	<view class="mine">
		<view class="userInfo">
			<view class="avatar">
				<image :src="img" mode=""></image>
			</view>
			<view class="useName" v-if="isLogin">
				{{userName}}
			</view>
			<view class="useName" v-else @tap="toLogin">
				登录
			</view>
		</view>
		<view class="line">
			
		</view>
		<view class="myCoupon cu-list menu">
			<view class="cu-item arrow" @tap="toCoupon(1)">
				<view class="content">
					<image class="contentImg" src="../../static/images/imgimg.png"></image>
					<text class="text-black">优惠券</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="toCoupon(2)">
				<view class="content">
					<image class="contentImg" src="../../static/images/Asked.png"></image>
					<text class="text-black">我的门店</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="toCoupon(3)">
				<view class="content">
					<image class="contentImg" src="../../static/images/activity.png"></image>
					<text class="text-black">我的活动</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="dealerclick">
				<view class="content">
					<image class="contentImg" src="../../static/images/dealer.png"></image>
					<text class="text-black">收藏车商</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="goCollection">
				<view class="content">
					<image class="contentImg" src="../../static/images/vehicle.png"></image>
					<text class="text-black">收藏车辆</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				isLogin: '',
				userName:'杨幂',
				img:require('../../static/images/defaultAvatar.png')
			}
		},
		onShow(){
			this.isLogin = uni.getStorageSync('userToken')
			if(this.isLogin){
				this.img = uni.getStorageSync('userInfo').headimgurl
				this.userName = uni.getStorageSync('userInfo').nickname
			}
		},
		methods: {
			toLogin() {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			},
			toCoupon(e){
				if (!this.$store.state.userToken) {
					uni.navigateTo({
						url: "/pages/login/login"
					})
					return false
				} 
				if(e==1){
					uni.navigateTo({
						url: "/pages/coupons/list"
					})
				}
				if(e==2){
					uni.navigateTo({
						url: "/pages/myAsset/myAsset?type="+ "2"
					})
				}
				if(e==3){
					uni.navigateTo({
						url:'/pages/activty/activtyList'
					})
				}
			},
			goCollection() {
				if (!this.$store.state.userToken) {
					uni.navigateTo({
						url: "/pages/login/login"
					})
					return false
				} 
				uni.navigateTo({
					url: "/pages/user/collectionCar",
				});
			},
			dealerclick(){
				if (!this.$store.state.userToken) {
					uni.navigateTo({
						url: "/pages/login/login"
					})
					return false
				} 
				uni.navigateTo({
					url: "/pages/myAsset/myAsset?type="+ "1"
				});
			},
		},
	}
</script>

<style scoped lang="scss">
	.mine{
		width: 100vw;
		background: rgb(240,242,245);
		.userInfo{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			height: 400rpx;
			background: rgb(240,242,245);
			.avatar{
				width: 120rpx;
				height: 120rpx;
				margin-bottom: 20rpx;
				>image{
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
			.useName{
				color:#060606;
				font-size: 30rpx;
				font-weight:500;
			}
		}
		.cu-item{
			// background: rgb(240,242,245);/
			background-color: #FFFFFF;
			margin-bottom: 20rpx;
			.content{
				.contentImg{
					width: 48rpx;
					height: 32rpx;
					
				}
				.text-black{
					padding-left: 20rpx;
				}
			}
			
		
		}
		.myCoupon{
			background: rgb(240,242,245);
			
		}
		.line{
			width: 100%;
			height: 10rpx;
			background: #F0F0F0;
		}
	}
	
</style>
