<template>
	<view class="bodyBox">
		<view class="imgBox">
			<image src="../../static/images/conpon.png" mode=""></image>
		</view>
		<view class="couponBox">
			<view class="couponLeft">
				<text style="font-size: 40rpx;">￥</text>
				<text style="font-size: 56rpx;">{{detailData.money}}</text>
			</view>
			<view class="couponRight">
				<view style="font-size: 36rpx;">
					{{detailData.name}}
				</view>
				<view class="dateBox">
					{{detailData.eventCreated}}~{{detailData.eventEnd}}
				</view>
			</view>
		</view>

		<view style="margin:10rpx auto; text-align: center; color: #B83900;font-size: 48rpx;">
			恭喜你,领取成功~
		</view>
		<view style="text-align: center;color: #666666;font-size: 22rpx;">
			*进入车与车寻小程序，点击我的 > 我的优惠券查看
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
				detailData: {},
			};
		},
		onLoad(options) {
			this.detailQuery = options;
			this.getDetail();
			console.log(this.detailQuery);
		},
		methods: {
			getDetail() {
				lib.request(urls.participateEnrollment, this.detailQuery).then(res => {
					console.log(res);
					this.detailData = res.data;
					this.detailData.eventCreated = util.timestampToTimeType(this.detailData.eventCreated, "day");
					this.detailData.eventEnd = util.timestampToTimeType(this.detailData.eventEnd, "day");
				})
			},
		}
	}
</script>

<style lang="scss">
	.bodyBox {
		width: 750rpx;
		background-image: url("http://publickdloanhd1.oss-cn-hangzhou.aliyuncs.com/2af9ab9d8fc24c7f9b16e03fc7e510a6.png");
		background-repeat: no-repeat;
		background-size: 100%;
	}

	.imgBox {
		width: 530rpx;
		height: 167rpx;
		position: relative;
		margin: 580rpx auto 55rpx auto;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.couponBox {
		display: flex;
		position: absolute;
		align-items: center;
		top: 606rpx;
		left: 140rpx;
		color: #FFFFFF;

		.couponLeft {
			display: flex;
			align-items: center;
			margin-top: 28rpx;
		}

		.couponRight {
			padding: 10rpx;
			text-align: center;
			position: absolute;
			top: 0px;
			left: 160rpx;
			width: 320rpx;


			.dateBox {
				margin-top: 10rpx;
				background-color: #FFFFFF;
				color: #7D1200;
				font-size: 24rpx;
				border-radius: 20rpx;
				padding: 4rpx 15rpx;
			}
		}
	}
</style>
