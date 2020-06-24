<template>
	<view class="storeCoupon">
		<view class="conponContent">
			<view @click="getConpon(item)" class="conponContentItem" v-for="(item, index) in list" :key="index">
				<!-- 1进行中 2未开始  可领取-->
				<image v-if="(item.status == 1 || item.status == 2) && item.userCouponStatus == 2" src="../../static/images/conponReceive.jpg" mode=""></image>
				<!-- 3已领完-->
				<image v-if="item.status == 3" src="../../static/images/conponFinished.jpg" mode=""></image>
				<!-- 1进行中 2未开始 已领取  -->
				<image v-if="(item.status == 1 || item.status == 2) && item.userCouponStatus == 1" src="../../static/images/conponReceived.jpg" mode=""></image>
				<view class="contentDesc">
					<view class="itemLeft">
						<text>¥</text>
						<view>{{ item.money }}</view>
					</view>
					<view class="itemRight">
						<view>{{ item.name }}</view>
						<view>{{ item.eventCreated }} ~ {{ item.eventEnd }}</view>
					</view>
				</view>
				<view class="limit">*仅限{{ storeData.enterpriseName }}使用</view>
			</view>
		</view>
	</view>
</template>

<script>
	import urls from '../../api/url.js';
	import lib from 'api/lib.js';
	import util from '@/utils/utils';
	export default {
		data() {
			return {
				list: [],
				storeData:{
					enterpriseName:''
				},
				enterpriseId:''
			}
		},
		onLoad(ops){
			this.getStoreCouponList(ops.enterpriseId)
			this.enterpriseId = ops.enterpriseId
		},
		methods:{
			getStoreCouponList(enterpriseId){
				lib.request(urls.storeCouponList,{enterpriseId}).then(res=>{
					this.storeData = res.data
					res.data.coupons.forEach(item => {
						item.eventCreated = util.timestampToTimeType(item.eventCreated,"day");
						item.eventEnd = util.timestampToTimeType(item.eventEnd,"day");
					});
					this.list = res.data.coupons
				})
			},
			async getConpon(item) {
				if (item.userCouponStatus === 2) {
					let params = {
						enterpriseId: this.storeData.enterpriseId,
						couponId: item.couponid
					};
					let res = await lib.request(urls.receiveCoupon, params);
					uni.showToast({
						title: '领取成功',
						success:()=> {
							this.getStoreCouponList(this.enterpriseId);
						}
					});
				} else if (item.status === 1) {
					uni.showToast({
						title: '该优惠券已领取',
						icon: 'none',
						duration: 1000
					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.storeCoupon{
		width: 100vw;
		height: 100vh;
		margin: 0 auto;
	}
	.conponContent {
		.conponContentItem {
			height: 192rpx;
			position: relative;
			margin-top: 20rpx;
			display: flex;
			justify-content: center;
			image {
				width: 670rpx;
				height: 192rpx;
				position: absolute;
			}
			.contentDesc {
				left: 80rpx;
				margin-top: 36rpx;
				position: absolute;
				z-index: 1;
				display: flex;
				.itemLeft {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 120rpx;
					font-size: 60rpx;
					font-weight: 600;
					color: #333;
					margin-right: 40rpx;
					text {
						font-weight: 400;
						font-size: 45rpx;
					}
					view {
						margin-left: 8rpx;
					}
				}
				.itemRight {
					flex: 1;
					view {
						font-size: 28rpx;
						font-weight: 500;
						color: #333333;
					}
					view:nth-child(2) {
						margin-top: 10rpx;
						font-size: 20rpx;
						font-weight: 400;
					}
				}
			}
			.limit {
				position: absolute;
				z-index: 1;
				font-size: 20rpx;
				color: #333333;
				bottom: 20rpx;
				left: 100rpx;
			}
		}
	}
</style>
