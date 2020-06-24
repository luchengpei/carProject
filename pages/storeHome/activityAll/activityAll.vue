<template>
	<view>
		<view class="conponBody" v-if="storeData.eventInfos.length">
			<!-- 	<view class="conponTitle">
				<view class="conponTitletext">活动</view>
				<view class="more" @click="moreActive">
					查看更多
					<image src="../../static/images/more.png" mode=""></image>
				</view>
			</view> -->
			<view @click="goToActive(item)" class="activeContent" v-for="(item, index) in storeData.eventInfos" :key="index">
				<view class="activeContentItem">
					<image :src="item.imgUrl"></image>
					<image v-if="item.userEventStatus == 1" class="joined" src="../../../static/images/joined.png"></image>
				</view>
				<view class="eventTime" v-if="item.eventCreated">
					活动时间:{{item.eventCreatedTime}}~{{item.eventEndTime}}
				</view>
			</view>
		</view>
		<view v-if="!storeData.eventInfos.length" class="wrap">
			<view class="empty">
				<image src="../../../static/images/empty1.png"></image>
			</view>
			<view class="text">
				暂无数据
			</view>
		</view>
	</view>
</template>

<script>
	import urls from '../../../api/url.js';
	import lib from '../../../api/lib.js';
	import util from '@/utils/utils';
	export default {
		data() {
			return {
				storeData: {},
				enterpriseId: ""
			};
		},
		methods: {
			async getlist(e) {
				console.log(this.enterpriseId)
				let res = await lib.request(urls.enterpriseList, e)
				this.storeData = res.data
				this.storeData.eventInfos.forEach(item => {
					item.eventCreatedTime = util.timestampToTimeType(item.eventCreated, "day");
					item.eventEndTime = util.timestampToTimeType(item.eventEnd, "day");
				});
				console.log(this.storeData)
			},
			goToActive(item) {
				let params = item;
				params.enterpriseId = this.storeData.enterpriseId;
				uni.setStorageSync('activtyInfo', params);
				if (item.type == 1) {
					uni.navigateTo({
						url: '/pages/activty/activty?type=' + "1"
					});
				} else if (item.type == 2) {
					uni.navigateTo({
						url: `/pages/newUser/unaccalimed?enterpriseId=${this.storeData.enterpriseId}&eventId=${item.eventId}`
					});
				}

			},
		},
		onLoad(e) {
			console.log(e)
			if (this.enterpriseId == "") {
				this.getlist(e)
			} else {
				console.log(this.enterpriseId)
				this.getlist({
					enterpriseId: this.enterpriseId
				})
			}

		},
		onShow() {
			// console.log(this.enterpriseId)
			if (this.enterpriseId == "") {

			} else {
				this.getlist({
					enterpriseId: this.enterpriseId
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.conponBody {
		margin-top: 8rpx;
		background-color: #fff;
		padding: 40rpx;

		.conponTitle {
			display: flex;

			.conponTitletext {
				font-size: 32rpx;
				font-weight: 600;
				flex: 1;
			}

			.more {
				width: 130rpx;
				font-size: 24rpx;
				color: #999999;

				// vertical-align: top;
				image {
					vertical-align: baseline;
					margin-left: 10rpx;
					width: 12rpx;
					height: 24rpx;
				}
			}
		}
	}

	.activeContent {
		margin-top: 20rpx;
		position: relative;

		.activeContentItem {
			position: relative;
			width: 689rpx;
			height: 240rpx;
			image {
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}

			.joined {
				border-radius: 0rpx;
				position: absolute;
				width: 180rpx;
				height: 50rpx;
				left: 0rpx;
				top: 0rpx;
			}
		}
	}

	.wrap {
		width: 100vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 50%;

		.empty {
			width: 300rpx;
			height: 200rpx;
			margin-bottom: 20rpx;

			>image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.eventTime {
		position: absolute;
		bottom: 0px;
		right: 0px;
		background-color: rgba($color: #000000, $alpha: 0.48);
		color: #FFFEFE;
		padding: 14rpx 20rpx;
		border-radius: 30rpx 0px 10rpx 0px;
		font-size: 20rpx;
	}
</style>
