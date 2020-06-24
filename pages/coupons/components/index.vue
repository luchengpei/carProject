<template>
	<view class="outwap">
		<div class="conponContent">
			<div @click="toDetail(item)" class="conponContentItem" v-for="(item, index) in list" :key="index">
				<!-- 0未使用-->
				<image src="../../../static/images/canUse.jpg" mode="" v-if="type===0"></image>
				<!-- 1已适用-->
				<image v-if="type === 1" src="../../../static/images/isUse.png" mode=""></image>
				<!-- 2过期  -->
				<image v-if="type === 2" src="../../../static/images/isdied.png"
				 mode=""></image>
				<div class="contentDesc">
					<div class="itemLeft">
						<text>¥</text>
						<view>{{ item.money }}</view>
					</div>
					<div class="itemRight">
						<view>{{ item.couponName }}</view>
						<view>{{ item.eventCreated }} ~ {{ item.eventEnd }}</view>
					</div>
				</div>
				<div class="limit">*仅限{{ item.enterpriseName }}使用</div>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
			},
			type: {},
		},
		methods: {
			toDetail(item) {
				uni.setStorageSync("couponInfo", item);
				uni.navigateTo({
					url: `/pages/coupons/detail?type=${this.type}`,
				});
			},
		},
	};
</script>

<style scoped lang="scss">
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
