<template>
	<view class="Box">
		<!-- <view class="Boxall"  :key="item.eventId" v-if="list.length">
		  <view class="subpage" @click="activity(item)">
		    <image :src="item.imgUrl ? item.imgUrl : img" ></image>
		    <view class="Text">{{ item.eventName }}</view>
		  </view>
		</view> -->

		<!-- 	<div class="conponBody" v-if="list.length" >
			<div @click="activity(item)" class="activeContent" v-for="(item, index) in list">
				<div class="activeContentItem">
					<image :src="item.imgUrl"></image>
					<image v-if="item.userEventStatus == 1" class="joined" src="../../../static/images/joined.png"></image>
				</div>
			</div>
		</div> -->

		<view class="conponBox" v-for="(items, index) in list" :key="index">
			<view class="storeName">
				{{items.enterpriseName}}
			</view>
			<view class="conponBody">
				<view @click="activity(item)" class="activeContent" v-for="(item, id) in items.userEventInfoVOS" :key="id">
					<view class="activeContentItem">
						<image :src="item.imgUrl"></image>
					</view>
					<view class="eventTime" v-if="item.eventCreated">
						活动时间:{{item.eventCreatedTime}}~{{item.eventEndTime}}
					</view>
				</view>
			</view>
		</view>

		<view v-if="!list.length" class="wrap">
			<view class="empty">
				<image src="../../static/images/empty1.png"></image>
			</view>
			<view class="text">
				暂无活动
			</view>
		</view>
	</view>
</template>

<script>
	import urls from "../../api/url.js";
	import lib from "api/lib.js";
	import util from '@/utils/utils';
	export default {
		data() {
			return {
				list: [],
				img: require("../../static/images/bgimg.jpg"),
				page: 1
			};
		},
		onShow() {
			this.getList()
		},
		onLoad(ops) {
			const {
				type,
				enterpriseId
			} = ops
			this.params = ops
			if (type == 1) {
				this.params.enterpriseId = uni.getStorageSync("enterpriseId")
			}

		},
		methods: {
			//跳转活动保单详情
			activity(e) {
				console.log(e, "e")
				uni.setStorageSync("activtyInfo", e);
				if (e.type == 1) {
					uni.navigateTo({
						url: "/pages/activty/activty?type=" + "2",
					});
				} else if (e.type == 2) {
					uni.navigateTo({
						url: `/pages/newUser/unaccalimed?enterpriseId=${e.enterpriseId}&eventId=${e.eventId}`,
					});
				}
			},
			getList() {
				let {
					enterpriseId
				} = this.params
				lib
					.request(urls.enventInfoV3, {
						enterpriseId
					})
					.then((res) => {
						this.list = res.data;
						this.list.forEach(items => {
							items.userEventInfoVOS.forEach(item => {
								item.eventCreatedTime = util.timestampToTimeType(item.eventCreated, "day");
								item.eventEndTime = util.timestampToTimeType(item.eventEnd, "day");
							})
						})
					});
			},
			//触底加载更多
			onReachBottom() {
				this.page++
			}
		},
	};
</script>

<style lang="scss" scoped>
	.Box {
		width: 750rpx;

		.Boxall {
			display: flex;
			justify-content: center;
			margin-top: 20rpx;

			.subpage {
				width: 670rpx;
				height: 240rpx;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					position: relative;
					width: 670rpx;
					height: 240rpx;
				}

				.Text {
					position: absolute;
					font-size: 48rpx;
					color: #ffffff;
					font-weight: 600;
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
	}

	.storeName {
		margin: 20rpx 40rpx;
		color: #333333;
		font-size: 30rpx;
	}

	.conponBody {
		background-color: #fff;
		padding: 20rpx 40rpx;

		.activeContent {
			position: relative;
			margin-bottom: 20rpx;

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
		}
	}
</style>
