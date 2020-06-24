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
		<view class="formBox">
			<view class="formItemBox">
				<input type="text" style="width:90%" v-model="getQuery.receiveTel" maxlength="11" placeholder="请输入手机号" />
			</view>
			<view class="plateBox formItemBox">
				<view class="provinceBox" @tap="showProvince">
					<view style="margin-left: 12rpx;">
						{{ province }}
					</view>
					<text class="cuIcon-unfold" v-if="!isShow"></text>
					<text class="cuIcon-fold" v-else></text>
				</view>
				<input type="text" style="width:90%" v-model="plateNumber" maxlength="8" />
			</view>
			<view class="formItemBox">
				<input type="text" v-model="getQuery.smsCode" maxlength="6" placeholder="请输入验证码" />
				<text class="codeText" @click="getCode()">{{codeText}}</text>
			</view>
			<view class="getBtnBox" style="margin-top:40rpx">
				<image src="../../static/images/getBtn.png" @click="goReceived()"></image>
			</view>
		</view>
		<view class="ruleBox">
			<view class="ruleTitleBox">
				<view class="ruleLine">

				</view>
				<view class="ruleTitle">活动规则</view>
				<view class="ruleLine">

				</view>
			</view>

			<view class="ruleContentBox">
				<view class="">
					1、此券可用户本店洗车消费时出示二维码即可抵扣使用；每次仅限使用1张，不可叠加使用。
				</view>
				<view class="">
					2、此券不可退换现金，不予找零；
				</view>
				<view class="">
					3、活动解释权最终归门店所有，如有疑问联系门店
				</view>
			</view>
		</view>
		<view class="tips">
			温馨提醒：
			使用过程中产生的纠纷库袋不承担任何直接或间接赔偿责任的义务
		</view>
		<view class="storeInfo">
			<view class="">
				门店名称：{{detailData.enterpriseName}}
			</view>
			<view class="">
				门店地址：{{detailData.province}}{{detailData.city}}{{detailData.area}}{{detailData.address}}
			</view>
			<view class="">
				门店电话：{{detailData.customerTel}}
			</view>
		</view>
		<keyWord v-model="isShow" @inputchange="inputchange" :province="province" />
	</view>
</template>

<script>
	import keyWord from "../activty/components/keyword.vue";
	import urls from "../../api/url.js";
	import lib from "api/lib.js";
	import util from '@/utils/utils';
	import rule from '@/utils/rule';

	export default {
		components: {
			keyWord
		},
		data() {
			return {
				isShow: false,
				province: "粤",
				codeText: "获取验证码",
				detailQuery: {
					enterpriseId: "",
					eventId: "",
				},
				errMsg: "",
				detailData: {
					money: "",
					name: "",
					eventCreated: "",
					eventEnd: "",
					enterpriseName: "",
					province: "",
					city: "",
					area: "",
					address: "",
					customerTel: ""
				},
				getQuery: {
					enterpriseId: "",
					eventId: "",
					shareUserId: undefined,
					receiveTel: "",
					receivePlateNumber: "",
					smsCode: ""
				},
				plateNumber: "",
				flag: 0
			};
		},
		onLoad(options) {
			console.log(options);
			console.log(this.$store.state.userInfo.id)

			//获取详情所需参数
			if (options.scene) {
				this.flag = 1; //扫码进来的
				let scene = util.getScene(options.scene)
				console.log(scene)
				this.detailQuery.enterpriseId = scene.enterprise_id;
				this.detailQuery.eventId = scene.id;
			} else {
				this.flag = 0;
				this.detailQuery.enterpriseId = options.enterpriseId;
				this.detailQuery.eventId = options.eventId;
			}
			//获取领取优惠劵所需参数
			this.getQuery.enterpriseId = this.detailQuery.enterpriseId;
			this.getQuery.eventId = this.detailQuery.eventId;
			if (options.shareUserId) {
				this.getQuery.shareUserId = options.shareUserId
			} else {
				this.getQuery.shareUserId = undefined
			}
		},
		async onShow() {
			if (this.detailQuery.enterpriseId) {
				await lib.getSessingKeyAndCode({
					enterprise_id: this.detailQuery.enterpriseId
				});
			}
			await this.getDetail();
			console.log(this.detailData);

			// 扫码进来的用reLaunch
			if (this.flag == 1) {
				//根据状态跳转（用户已参加且有裂变）
				if (this.detailData.userStatus == 1 && this.detailData.isFission == 1) {
					uni.reLaunch({
						url: `/pages/newUser/received?enterpriseId=${this.detailQuery.enterpriseId}&eventId=${this.detailQuery.eventId}`
					})
					//（用户已参加且无裂变）
				} else if (this.detailData.userStatus == 1 && this.detailData.isFission == 2) {
					uni.reLaunch({
						url: `/pages/newUser/noFission?enterpriseId=${this.detailQuery.enterpriseId}&eventId=${this.detailQuery.eventId}`
					})
				}
			} else {
				//根据状态跳转（用户已参加且有裂变）
				if (this.detailData.userStatus == 1 && this.detailData.isFission == 1) {
					uni.redirectTo({
						url: `/pages/newUser/received?enterpriseId=${this.detailQuery.enterpriseId}&eventId=${this.detailQuery.eventId}`
					})
					//（用户已参加且无裂变）
				} else if (this.detailData.userStatus == 1 && this.detailData.isFission == 2) {
					uni.redirectTo({
						url: `/pages/newUser/noFission?enterpriseId=${this.detailQuery.enterpriseId}&eventId=${this.detailQuery.eventId}`
					})
				}
			}
		},
		methods: {
			showProvince() {
				this.isShow = true;
			},
			inputchange(val) {
				this.province = val;
				this.$emit('concatCarNo', val)
			},
			async getDetail() {
				const res = await lib.request(urls.participateEnrollment, this.detailQuery)
				this.detailData = res.data;

				this.detailData.eventCreated = util.timestampToTimeType(this.detailData.eventCreated, "day");
				this.detailData.eventEnd = util.timestampToTimeType(this.detailData.eventEnd, "day");
				if (res.data.errmsg) {
					uni.showModal({
						title: '提示',
						content: res.data.errmsg,
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								uni.reLaunch({
									url: "/pages/index/index"
								})
							}
						}
					});
					return false;
				}
			},
			getCode() {
				if (this.getQuery.receiveTel == "" || !rule.validatePhone(this.getQuery.receiveTel)) {
					uni.showToast({
						icon: "none",
						title: "请输入正确的手机号码",
						duration: 2000
					})
					return false
				}
				if (this.codeText == "获取验证码") {
					lib.request(urls.activitySms, {
						mobile: this.getQuery.receiveTel
					}).then(res => {
						let num = 60;
						this.codeText = num + "秒"
						let timer = setInterval(() => {
							num--;
							this.codeText = num + "秒"
							if (num == 0) {
								clearInterval(timer);
								this.codeText = "获取验证码"
							}
						}, 1000)

					})
				}
			},
			async goReceived() {
				if (this.plateNumber == "") {
					uni.showToast({
						icon: "none",
						title: "请输入车牌号",
						duration: 2000
					})
					return false
				} else if (this.getQuery.receiveTel == "" || !rule.validatePhone(this.getQuery.receiveTel)) {
					uni.showToast({
						icon: "none",
						title: "请输入正确的手机号码",
						duration: 2000
					})
					return false
				} else if (this.getQuery.smsCode == "") {
					uni.showToast({
						icon: "none",
						title: "请输入验证码",
						duration: 2000
					})
					return false
				}
				this.getQuery.receivePlateNumber = this.province + this.plateNumber;
				console.log(this.getQuery);
				if (this.getQuery.enterpriseId) {
					await lib.getSessingKeyAndCode({
						enterprise_id: this.getQuery.enterpriseId
					});
				}
				const res = await lib.request(urls.participateReceive, this.getQuery);
				if (res.data.errmsg) {
					uni.showModal({
						title: '提示',
						content: res.data.errmsg,
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								uni.reLaunch({
									url: "/pages/index/index"
								})
							}
						}
					});
					return false;
				}

				uni.showToast({
					icon: "success",
					title: "提交成功",
					duration: 2000
				})
				if (this.flag == 1) {
					if (this.detailData.isFission == 1) {
						uni.reLaunch({
							url: `/pages/newUser/received?enterpriseId=${this.detailQuery.enterpriseId}&eventId=${this.detailQuery.eventId}`
						})
					} else if (this.detailData.isFission == 2) {
						uni.reLaunch({
							url: `/pages/newUser/noFission?enterpriseId=${this.detailQuery.enterpriseId}&eventId=${this.detailQuery.eventId}`
						})
					}
				} else {
					if (this.detailData.isFission == 1) {
						uni.redirectTo({
							url: `/pages/newUser/received?enterpriseId=${this.detailQuery.enterpriseId}&eventId=${this.detailQuery.eventId}`
						})
					} else if (this.detailData.isFission == 2) {
						uni.redirectTo({
							url: `/pages/newUser/noFission?enterpriseId=${this.detailQuery.enterpriseId}&eventId=${this.detailQuery.eventId}`
						})
					}
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.bodyBox {
		width: 750rpx;
		background-image: url("http://publickdloanhd1.oss-cn-hangzhou.aliyuncs.com/2468395014c74d7ab38d2d59a78a2afb.png");
		background-repeat: no-repeat;
		background-size: 100%;
	}

	.imgBox {
		width: 530rpx;
		height: 167rpx;
		position: relative;
		margin: 450rpx auto 55rpx auto;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.couponBox {
		display: flex;
		position: absolute;
		align-items: center;
		top: 470rpx;
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

	.formBox {
		padding: 10rpx 80rpx;

		.formItemBox {
			display: flex;
			background-color: #FFFFFF;
			border: 1px solid #ccc;
			margin-top: 40rpx;
			padding: 16rpx;
			border-radius: 10rpx;

			.codeText {
				margin: 0px 10rpx;
				color: #FC552C;
				border-left: 1px solid #E5E5E5;
				padding-left: 20rpx;
			}

			input {
				width: 65%;
			}
		}

		.getBtnBox {
			width: 226rpx;
			height: 226rpx;
			margin: 10rpx auto;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}


	.plateBox {
		// display: flex;
		// border: 1px solid #ccc;

		.provinceBox {
			display: flex;
			align-items: center;
			border-right: 1px solid #ccc;
			padding-right: 10rpx;
		}

		input {
			padding: 0px 10rpx;
		}
	}

	.ruleBox {
		.ruleTitleBox {
			display: flex;
			align-items: center;
			margin: 40rpx 0px 70rpx 0px;

			.ruleLine {
				height: 2rpx;
				width: 212rpx;
				background-color: #571B00;
				margin: 0rpx 44rpx;
			}

			.ruleTitle {
				font-size: 36rpx;
				color: #571B00;
			}
		}

		.ruleContentBox {
			padding: 0px 40rpx;
			font-size: 30rpx;
		}

	}

	.tips {
		// margin-top: 20rpx;
		margin: 0px 40rpx;
		padding: 40rpx 0px;
		font-size: 24rpx;
		border-bottom: 1px solid #571B00;
	}

	.storeInfo {
		margin: 20rpx 40rpx;
	}
</style>
