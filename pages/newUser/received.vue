<template>
	<view class="invitePage">
		<view class="couponCar">
			<view class="imgBox">
				<image src="../../static/images/userCoupon.png" mode=""></image>
			</view>
			<view class="couponInfo">
				<view class="leftInfo">
					<text style="font-size: 40rpx;">￥</text>
					<text style="font-size: 56rpx;">{{detailData.money}}</text>
				</view>
				<view class="rightInfo">
					<view style="font-size: 36rpx;">
						{{detailData.name}}
					</view>
					<view class="time">
						{{detailData.eventCreated}}~{{detailData.eventEnd}}
					</view>
				</view>
			</view>
		</view>
		<view style="margin:10rpx auto; text-align: center; color: #B83900;font-size: 48rpx;">
			恭喜你,领取成功~
		</view>
		<view style="text-align: center;color: #666666;font-size: 22rpx;">
			*进入车与车寻小程序，点击我的 > 我的优惠券查看
		</view>
		<view class="inviteInfo">
			<view class="title">
				邀请好友领券
			</view>
			<view class="smTip">
				邀请{{detailData.inviteNum}}个新用户领取，即可得到1张{{detailData.fissionCouponMoney}}元券
			</view>
			<view class="time">
				{{detailData.startTime}}~{{detailData.endTime}}
			</view>
		</view>
		<view class="inviteNum">
			<view class="isInvite">
				<text>已邀请</text>
				<text class="inviteNumber">{{detailData.count}}</text> 人
			</view>
			<view class="smTip" v-if="isShowGet">
				你已达成目标，点击下方领取奖励
			</view>
			<view class="smTip" v-else>
				还差{{difference}}人即可达成目标，先到先得
			</view>

			<view class="reBox">
				<view class="imgBox">
					<image src="../../static/images/coupon1.png" mode=""></image>
				</view>
				<view class="couponBox" v-if="detailData.fissionCouponCountStatus==1&&detailData.usercouponStatus==2" style="font-size: 36rpx; margin:30rpx 0px 0px 20rpx">
					很遗憾~优惠劵已领完~
				</view>

				<view class="couponBox" v-else>
					<view class="couponLeft">
						<text style="font-size: 40rpx;">￥</text>
						<text style="font-size: 56rpx;">{{detailData.fissionCouponMoney}}</text>
					</view>
					<view class="couponRight">
						<view style="font-size: 28rpx;">
							{{detailData.fissionCouponName}}
						</view>
						<view class="dateBox">
							{{detailData.fissionCouponCreated}}~{{detailData.fissionCouponEnd}}
						</view>
					</view>
					<view class="imgBtnBox" v-if="isShowGet">
						<image v-if="detailData.usercouponStatus==2" @click="goGet()" src="../../static/images/getBtn1.png" mode=""></image>
						<image v-if="detailData.usercouponStatus==1" src="../../static/images/getBtn2.png" mode=""></image>
					</view>
				</view>

			</view>
			<view class="inviteBox">
				<image src="../../static/images/invite.png" mode=""></image>
				<button class="hiddenBtn" open-type="share">转发</button>
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
				detailQuery: {
					enterpriseId: "",
					eventId: "",
					receiveCouponId: ""
				},
				getQuery: {
					enterpriseId: "",
					activityId: ""
				},
				detailData: {
					usercouponStatus: "",
					money: "",
					name: "",
					eventCreated: "",
					eventEnd: "",
					inviteNum: "",
					fissionCouponMoney: "",
					startTime: "",
					endTime: "",
					count: "",
					fissionCouponCountStatus: "",
					fissionCouponMoney: "",
					fissionCouponName: "",
					fissionCouponCreated: "",
					fissionCouponEnd: ""
				},
				difference: "",
				isShowGet: false,
			};
		},
		onLoad(options) {
			this.detailQuery = options;
			this.getQuery.enterpriseId = options.enterpriseId;
			this.getQuery.activityId = options.eventId;
			this.getDetail();
			console.log(this.detailQuery);
		},
		methods: {
			getDetail() {
				lib.request(urls.participateEnrollment, this.detailQuery).then(res => {
					this.detailData = res.data;
					this.detailData.eventCreated = util.timestampToTimeType(this.detailData.eventCreated, "day");
					this.detailData.eventEnd = util.timestampToTimeType(this.detailData.eventEnd, "day");
					this.detailData.startTime = util.timestampToTimeType(this.detailData.startTime, "day");
					this.detailData.endTime = util.timestampToTimeType(this.detailData.endTime, "day");
					this.detailData.fissionCouponCreated = util.timestampToTimeType(this.detailData.fissionCouponCreated, "day");
					this.detailData.fissionCouponEnd = util.timestampToTimeType(this.detailData.fissionCouponEnd, "day");
					this.difference = this.detailData.inviteNum - this.detailData.count;
					if (this.detailData.count >= this.detailData.inviteNum) {
						this.isShowGet = true;
					}
				})
			},
			goGet() {
				lib.request(urls.getFissionCoupon, this.getQuery).then(res => {
					console.log(res);
					uni.showToast({
						title: "领取成功",
						duration: 2000,
						icon: "success"
					})
					this.getDetail();
				});
			},
			share() {

			}
		},
		onShareAppMessage: function() {
			console.log(this.detailQuery.enterpriseId, this.detailQuery.eventId, this.$store.state.userInfo.id);
			return {
				path: `/pages/newUser/unaccalimed?enterpriseId=${this.detailQuery.enterpriseId}&eventId=${this.detailQuery.eventId}&shareUserId=${this.$store.state.userInfo.id}`,
				imageUrl: "/static/images/share.jpg"
			}
		},
	}
</script>

<style scoped lang="scss">
	.invitePage {
		width: 100%;
		// height: 100vh;
		// box-sizing: border-box;
		background-image: url('http://publickdloanhd1.oss-cn-hangzhou.aliyuncs.com/4707951211ba495e91ab1a96bd0db1ab.png');
		background-repeat: no-repeat;

		background-size: 100%;

		.couponCar {
			width: 530rpx;
			display: flex;
			margin: 460rpx auto 0 auto;
			position: relative;

			>.imgBox {
				width: 100%;
				height: 167rpx;

				>image {
					width: 100%;
					height: 100%;
				}
			}

			.couponInfo {
				display: flex;
				position: absolute;
				align-items: center;
				top: 24rpx;
				left: 33rpx;
				color: #FFFFFF;

				.leftInfo {
					display: flex;
					align-items: center;
					margin-top: 28rpx;
				}

				.rightInfo {
					padding: 10rpx;
					text-align: center;
					position: absolute;
					top: 0px;
					left: 160rpx;
					width: 320rpx;


					.time {
						margin-top: 10rpx;
						background-color: #FFFFFF;
						color: #7D1200;
						font-size: 24rpx;
						border-radius: 20rpx;
						padding: 4rpx 15rpx;
					}
				}
			}
		}

		.inviteInfo {
			// width: 640rpx;
			// background: #ccc;
			// display: flex;
			// flex-direction: column;
			// justify-content: center;
			// align-items: center;
			// height: 300rpx;
			box-sizing: border-box;
			text-align: center;
			padding-top: 0rpx;
			margin: 120rpx auto 0 auto;
			color: #571B00;

			.title {
				font-size: 60rpx;
				margin: 0 auto;
			}

			.smTip {
				margin: 20rpx auto;
				font-size: 30rpx;
			}

			.time {
				width: 400rpx;
				height: 48rpx;
				border-radius: 24rpx;
				background: #FD3C38;
				color: white;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 0 auto;
			}
		}

		.inviteNum {
			display: flex;
			flex-direction: column;
			// justify-content: center;
			align-items: center;
			justify-content: center;
			margin-top: 50rpx;

			.inviteNumber {
				font-size: 120rpx;
				margin: 0px 20rpx;
			}

			.smTip {
				margin: 40rpx auto 20rpx auto;
				text-align: center;
			}
		}
	}

	.reBox {
		position: relative;

		.imgBox {
			width: 540rpx;
			height: 190rpx;
			position: relative;
			margin: 50rpx auto 55rpx auto;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.couponBox {
			display: flex;
			position: absolute;
			align-items: center;
			top: 88rpx;
			left: 12rpx;
			color: #333333;

			.couponLeft {
				display: flex;
				align-items: center;
				margin-top: 28rpx;
			}

			.couponRight {
				padding: 10rpx;
				text-align: center;
				position: absolute;
				top: 6rpx;
				left: 120rpx;
				width: 274rpx;

				.dateBox {
					margin-top: 10rpx;
					background-color: #FFC000;
					color: #FFFFFF;
					font-size: 20rpx;
					border-radius: 20rpx;
					padding: 4rpx 15rpx;
				}
			}

			.imgBtnBox {
				width: 110rpx;
				height: 110rpx;
				position: absolute;
				left: 376rpx;
				top: 0px;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.inviteBox {
		width: 420rpx;
		height: 74rpx;
		margin-bottom: 188rpx;
		position: relative;

		image {
			width: 100%;
			height: 100%;
		}

		.hiddenBtn {
			position: absolute;
			width: 420rpx;
			top: 0px;
			left: 0px;
			opacity: 0;
		}
	}
</style>
