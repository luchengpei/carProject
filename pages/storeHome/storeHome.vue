<template>
	<view>
		<view class="storeHomeContaner" v-if="isBrand">
			<view class="head">
				<view class="img">
					<image :src="storeData.imgUrl"></image>
				</view>
				<view class="desc">
					<view class="storeLeft">
						<view>{{ storeData.enterpriseName }}</view>
						<view>{{ storeData.province }}{{ storeData.city }}{{ storeData.area }}{{ storeData.address }}</view>
					</view>
					<view @click="callPhone" class="storeRight">
						<image src="../../static/images/storePhone.png" mode=""></image>
					</view>
				</view>
			</view>
			<!-- 优惠券 -->
			<view class="conponBody" v-if="storeData.coupons.length">
				<view class="conponTitle">
					<view class="conponTitletext">优惠券</view>
					<view class="more" @click="moreConpon">
						查看更多
						<image src="../../static/images/more.png" mode=""></image>
					</view>
				</view>
				<view class="conponContent">
					<view @click="getConpon(item)" class="conponContentItem" v-for="(item, index) in storeData.coupons" :key="index">
						<!-- 1进行中 2未开始  可领取-->
						<image v-if="(item.status == 1 || item.status == 2) && item.userCouponStatus == 2" src="../../static/images/conponReceive.jpg"
						 mode=""></image>
						<!-- 3已领完-->
						<image v-if="item.status == 3" src="../../static/images/conponFinished.jpg" mode=""></image>
						<!-- 1进行中 2未开始 已领取  -->
						<image v-if="(item.status == 1 || item.status == 2) && item.userCouponStatus == 1" src="../../static/images/conponReceived.jpg"
						 mode=""></image>
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
			<!-- 活动 -->
			<view class="conponBody" v-if="storeData.eventInfos.length">
				<view class="conponTitle">
					<view class="conponTitletext">活动</view>
					<view class="more" @click="moreActive">
						查看更多
						<image src="../../static/images/more.png" mode=""></image>
					</view>
				</view>
				<view @click="goToActive(item)" class="activeContent" v-for="(item, index) in storeData.eventInfos" :key="index">
					<view class="activeContentItem">
						<image :src="item.imgUrl"></image>
						<image v-if="item.userEventStatus == 1" class="joined" src="../../static/images/joined.png"></image>
					</view>
					<view class="eventTime" v-if="item.eventCreated">
						活动时间:{{item.eventCreatedTime}}~{{item.eventEndTime}}
					</view>
				</view>
			</view>
		</view>
		<view class="empty" v-else>
			<view class="emptyBox">
				<view class="imgBox">
					<image src="../../static/images/storeEmpty.png" mode=""></image>
				</view>
				<view class="text">
					未关注门店
				</view>
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
				storeData: {},
				scene: {
					enterprise_id: ''
				},
				enterpriseId: '',
				isBrand: false
			};
		},
		async onLoad(ops) {
			//扫码进来 获取最新门店
			if (ops.scene) {
				let scene = util.getScene(ops.scene)
				this.scene.enterprise_id = scene.enterprise_id
			}
			//门店列表进来
			if (ops.enterpriseId) this.enterpriseId = ops.enterpriseId
		},
		async onShow() {
			uni.removeStorageSync("activtyInfo", "");
			this.isBandStore()
			if (this.scene.enterprise_id) { //扫码绑定门店
				await lib.getSessingKeyAndCode({
					enterprise_id: this.scene.enterprise_id
				});
			}
			if (this.enterpriseId) {
				this.currentStoreInfo()
				return false
			} else {
				this.getStoreData()
			}

		},
		methods: {
			//是否已绑定门店
			isBandStore() {
				lib.request(urls.isBandStore).then(res => {
					this.isBrand = res.data
				})
			},
			//指定门店
			async currentStoreInfo(){
				let res = await lib.request(urls.currentEnterprise, {
					enterpriseId: this.enterpriseId
				})
				let data = res.data;
				if (data.eventInfos.length >= 1) {
					data.eventInfos.forEach(item => {
						item.eventCreatedTime = util.timestampToTimeType(item.eventCreated, "day");
						item.eventEndTime = util.timestampToTimeType(item.eventEnd, "day");
					});
					if (data.eventInfos.length >= 2) {
						data.eventInfos = data.eventInfos.slice(0, 2);
					}
				}
				if (data.coupons.length >= 1) {
					data.coupons.forEach(item => {
						item.eventCreated = util.timestampToTimeType(item.eventCreated, "day");
						item.eventEnd = util.timestampToTimeType(item.eventEnd, "day");
					});
					if (data.eventInfos.length >= 2) {
						data.coupons = data.coupons.slice(0, 2);
					}
				}
				this.storeData = data;
			},
			//获取门店信息
			async getStoreData() {
				let res = await lib.request(urls.newStoreInfo);
				let data = res.data;
				this.storeData = res.data;
				if (data.eventInfos.length >= 1) {
					data.eventInfos.forEach(item => {
						item.eventCreatedTime = util.timestampToTimeType(item.eventCreated, "day");
						item.eventEndTime = util.timestampToTimeType(item.eventEnd, "day");
					});
					if (data.eventInfos.length >= 2) {
						data.eventInfos = data.eventInfos.slice(0, 2);
					}
				}
				if (data.coupons.length >= 1) {
					data.coupons.forEach(item => {
						item.eventCreated = util.timestampToTimeType(item.eventCreated, "day");
						item.eventEnd = util.timestampToTimeType(item.eventEnd, "day");
					});
					if (data.eventInfos.length >= 2) {
						data.coupons = data.coupons.slice(0, 2);
					}
				}
				this.storeData = data;
			},
			//获取优惠券信息
			async getConpon(item) {
				let that = this;
				console.log(item, 'item');
				if (item.userCouponStatus === 2) {
					let params = {
						enterpriseId: this.storeData.enterpriseId,
						couponId: item.couponid
					};
					let res = await lib.request(urls.receiveCoupon, params);
					uni.showToast({
						title: '领取成功',
						success() {
							if(that.enterpriseId) {
								that.currentStoreInfo()
							}else{
								that.getStoreData();
							}
						}
					});
				} else {
					uni.showToast({
						title: '该优惠券已领取',
						icon: 'none',
						duration: 1000
					});
				}
			},
			//跳转活动
			goToActive(item) {
				let params = item;
				params.enterpriseId = this.storeData.enterpriseId;
				console.log(params)
				uni.setStorageSync('activtyInfo', params);
				if (item.type == 1) {
					uni.navigateTo({
						url: "/pages/activty/activty?type=" + "2",
					});
				} else if (item.type == 2) {
					uni.navigateTo({
						url: `/pages/newUser/unaccalimed?enterpriseId=${this.storeData.enterpriseId}&eventId=${item.eventId}`
					});
				}

			},
			callPhone() {
				uni.makePhoneCall({
					phoneNumber: this.storeData.customerTel
				});
			},

			moreConpon() {
				uni.navigateTo({
					url: `/pages/coupons/storeCoupon?enterpriseId=${this.storeData.enterpriseId}`
				});
			},
			moreActive() {
				uni.navigateTo({
					url: `/pages/storeHome/activityAll/activityAll?enterpriseId=${this.storeData.enterpriseId}`
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.storeHomeContaner {
		width: 750rpx;
		background-color: #ddd;

		.head {
			padding: 40rpx;
			padding-bottom: 40rpx;
			background-color: #fff;

			.img {
				image {
					width: 670rpx;
					height: 344rpx;
					border-radius: 15rpx;
				}
			}

			.desc {
				display: flex;
				margin-top: 20rpx;

				.storeLeft {
					flex: 1;

					view {
						font-size: 32rpx;
						font-weight: 600;
					}

					view:nth-child(2) {
						margin-top: 8rpx;
						font-weight: 400;
						font-size: 24rpx;
					}
				}

				.storeRight {
					width: 100rpx;
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-left: 1rpx solid #979797;

					image {
						width: 40rpx;
						height: 40rpx;
					}
				}
			}
		}

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

		.conponContent {
			.conponContentItem {
				height: 192rpx;
				margin-top: 40rpx;
				position: relative;
				margin-top: 40rpx;
				display: flex;

				image {
					width: 670rpx;
					height: 192rpx;
					position: absolute;
				}

				.contentDesc {
					left: 20rpx;
					margin-top: 36rpx;
					position: absolute;
					z-index: 1;
					display: flex;

					.itemLeft {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 180rpx;
						font-size: 60rpx;
						font-weight: 600;
						color: #333;

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
	}

	.emptyBox {
		width: 100vw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 250rpx;

		.imgBox {
			width: 80rpx;
			height: 80rpx;
			margin-bottom: 25rpx;

			>image {
				width: 100%;
				height: 100%;
			}
		}

		.text {
			color: #999;
			font-size: 30rpx;
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
