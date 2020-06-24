<template>
	<view class="outBox">
		<image src="http://publickdloanhd1.oss-cn-hangzhou.aliyuncs.com/0fc9b90b87b64323ae699acd73cb3963.png" mode="" class="bgImg"></image>
		<view class="activty">
			<view class="bigTip">
				<view class="title">
					{{ currentActivity.eventName }}
				</view>
				<view class="smTip">
					{{ currentActivity.eventIntro }}
				</view>
			</view>
			<view class="customForm">
				<customForm :list="list" ref="form" @getValue="getValue" @getIsSelect="getIsSelect" @concatCarNo="concatCarNo" />
			</view>
			<view class="form">
				<view class="submit" @tap="submit" v-if="list.length">
					<view class="btnName">{{ title.elementName }}</view>
					<image src="../../static/images/btn.png" mode=""></image>
				</view>
				<view class="rule">
					<image src="../../static/images/line.png" mode=""></image>
				</view>
				<view class="rules">
					<view class="text">
						<rich-text :nodes="currentActivity.rule"></rich-text>
					</view>
					<!-- <rich-text :nodes="currentActivity.rule"></rich-text> -->
				</view>
			</view>
		</view>
		<!-- <view class="demo">
			<view class="headTitle">
				<view class="bTitle">
					{{ currentActivity.eventName }}
				</view>
				<view class="sTitle">
					{{ currentActivity.eventIntro }}
				</view>
			</view>
			<view class="customForm">
				<customForm :list="list" ref="form" @getValue="getValue" @getIsSelect="getIsSelect" @concatCarNo="concatCarNo" />
			</view>
			<view class="submit" @tap="submit" v-if="list.length">
			  <view class="btnName">{{ title.elementName }}</view>
			  <image src="../../static/images/btn.png" mode=""></image>
			</view>
			<view class="rule">
				  <image src="../../static/images/line.png" mode=""></image>
			</view>
			<view class="rules">
			  <rich-text :nodes="currentActivity.rule"></rich-text>
			</view>
		</view> -->
	</view>
</template>

<script>
	import customForm from "./components/customForm.vue";
	import urls from "../../api/url.js";
	import lib from "api/lib.js";
	import util from "@/utils/utils";
	export default {
		components: {
			customForm,
		},
		data() {
			return {
				list: [],
				cloneList: [],
				formInfo: {},
				currentActivity: {
					eventName: "",
					eventIntro: "",
					elementName: "",
				},
				params: {},
				title: {
					elementName: "提交",
				},
				province: "粤",
				isSelect: false,
				carValue: "",
				isSubmit: false,
				type: "", //类型
			};
		},
		async onLoad(ops) {
			this.type = ops.type
			if (ops.scene) {
				let scene = util.getScene(ops.scene);
				this.params = {
					eventId: scene.id,
					enterpriseId: scene.enterprise_id,
				};
				uni.setStorageSync("enterpriseId", this.params.enterpriseId);
			}
		},
		async onShow() {
			if (this.params.enterpriseId) {
				await lib.getSessingKeyAndCode({
					enterprise_id: this.params.enterpriseId
				});
			}
			if (uni.getStorageSync("activtyInfo")) {
				//活动列表进来
				this.getForm();
				return false;
			}
			this.getForm(this.params); //扫码进来
		},
		methods: {
			//获取表单
			async getForm(val) {
				this.formInfo = uni.getStorageSync("activtyInfo");
				//uni.setStorageSync('enterpriseId',this.formInfo.enterpriseId)
				let params = {
					eventId: this.formInfo.eventId,
					enterpriseId: this.formInfo.enterpriseId || uni.getStorageSync("enterpriseId"),
				};
				let data = await lib.request(urls.formElement, val ? val : params);
				this.currentActivity = data.data;
				data.data.formElementVO &&
					data.data.formElementVO.forEach((row) => {
						row.placeholder = `请输入${row.elementName}`;
						row.elementValue = "";
						row.disabled = false;
					});
				this.list = util.deepCopy(data.data.formElementVO);
				this.cloneList = util.deepCopy(data.data.formElementVO);
				this.list ?
					(this.title = this.list.find((row) => row.type === 4) ?
						this.list.find((row) => row.type === 4) : {
							elementName: "提交"
						}) : {
						elementName: "提交"
					};
				if (data.data.userStatus == 1) {
					this.list = JSON.parse(data.data.elementFilled);
					let index = this.list.findIndex((row) => row.type == 2);
					this.isSubmit = true;
					this.title.elementName = "已参与";
					this.list.forEach((row) => {
						this.$set(row, "disabled", true);
					});
					if (index != -1) {
						this.$refs.form.province = this.list[index].elementValue.slice(0, 1);
						let arr = this.list[index].elementValue.split("");
						arr.splice(0, 1);
						this.list[index].elementValue = arr.join("");
					}
					console.log(this.list, "list");
				}
			},
			//表单提交
			async submit() {
				this.$nextTick(() => {
					if (this.isSubmit) return false;
					this.cloneList = this.cloneList.filter((row) => row.type !== 4);
					try {
						//forEach 跳出循环
						this.cloneList.forEach((row) => {
							// delete row.formElementId
							if (row.isRequired === 1 && !row.elementValue) {
								//必填项提示必填
								uni.showToast({
									title: `${row.elementName}必填`,
									duration: 1000,
									icon: "none",
								});
								throw new Error("require");
							}
							if (row.type === 3) {
								//如果是手机，判断是否不是是手机
								if (!/^1[3456789]\d{9}$/.test(row.elementValue)) {
									throw new Error("手机号码有误");
								}
								// if(util.validatePhone(row.elementValue)) throw new Error('手机号码有误')
								//  throw new Error('手机号码有误')
							}
							if (row.type == 2 && !this.isSelect) {
								row.elementValue = "";
								row.elementValue = `${this.province}${this.carValue}`;
							}
							delete row.isRequired;
							delete row.placeholder;
							delete row.serialnumber;
							delete row.options;
							delete row.elementLength;
						});
					} catch (e) {
						//TODO handle the exception
						if (e.message === "require") return false;
						uni.showToast({
							icon: "none",
							title: "手机号有误",
							duration: 1000,
						});
						return false;
					}
					this.cloneList = this.cloneList.filter((row) => row.type !== 4); //过滤按钮项
					let params = {
						formId: this.cloneList[0].formId,
						eventId: this.currentActivity.eventId,
						elementFilled: this.cloneList,
						eventShopId: this.currentActivity.eventShopId,
						enterpriseId: this.currentActivity.enterpriseId,
					};
					lib.request(urls.submitForm, params).then((res) => {
						if (res.errcode === 200) {
							this.list.forEach(row => {
								this.$set(row, "disabled", true);
							})
							uni.showToast({
								title: "提交成功",
								duration: 3000,
								icon: "success",
								success: () => {
									this.isSubmit = true
									if (this.type == 1) {
										let pages = getCurrentPages(); //获取所有页面栈实例列表
										console.log(pages);
										let nowPage = pages[pages.length - 1]; //当前页页面实例
										console.log(nowPage);
										let prevPage = pages[pages.length - 2]; //上一页页面实例
										console.log(prevPage);
										// prevPage.$vm.couponNumber = ;         //修改上一页data里面的couponNumber参数值为value
										prevPage.$vm.enterpriseId = this.formInfo.enterpriseId;
										uni.navigateBack({
											// url: `/pages/storeHome/activityAll/activityAll?enterpriseId=${this.formInfo.enterpriseId}`
											delta: 1,
										});
										return false
									}
									if (this.type == 2) {
										uni.navigateBack({
											delta: 1
										})
										return false
									}
									this.title.elementName = "已参与";
								},
							});
						}
					});
				});
			},
			//获取自定义表单的值
			getValue(index, value, province, type, isSelect) {
				this.cloneList[index]["elementValue"] = value;
				let i = this.cloneList.findIndex((row) => row.type == 2);
				this.carValue = this.cloneList[i].elementValue;
			},
			//
			getIsSelect(val) {
				//但选择未上牌  车牌号非必填
				this.isSelect = val;
				let index = this.cloneList.findIndex((row) => row.type == 2);
				if (val) {
					this.cloneList[index].isRequired = 2;
					this.cloneList[index].isLicense = 3;
					this.cloneList[index].placeholder = "";
					this.cloneList[index]["elementValue"] = "";
				} else {
					this.cloneList[index].isRequired = 1;
					this.cloneList[index].isLicense = 1;
				}
			},
			concatCarNo(val) {
				this.province = val;
			},
		},
	};
</script>

<style scoped lang="scss">
	.demo {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		padding: 60rpx 90rpx 0 90rpx;
		overflow-y: scroll;
		overflow-x: hidden;
		box-sizing: border-box;

		.headTitle {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: #209673;
			height: 200rpx;

			.bTitle {
				font-size: 90rpx;
			}

			.sTitle {
				font-size: 36rpx;
			}
		}

		.customForm {
			width: 100%;
			display: flex;
			justify-content: center;
			position: relative;
			margin-top: 270rpx;
		}

		.submit {
			width: 540rpx;
			height: 90rpx;
			color: white;
			margin-top: 30rpx;
			margin-left: 8rpx;
			// top: 746rpx;
			// left: 98rpx;
			position: absolute;

			>image {
				width: 100%;
				height: 100%;
			}

			>.btnName {
				position: absolute;
				left: 47%;
				top: 30%;
				z-index: 99;
				color: white;
			}
		}

		.rule {
			position: absolute;
			width: 570rpx;
			height: 25rpx;
			top: 886rpx;

			>image {
				width: 100%;
				height: 100%;
			}
		}

		.rules {
			color: white;
			font-size: 20rpx;
			margin-top: 180rpx;
		}
	}

	.outBox {
		// position: relative;
		box-sizing: border-box;
		overflow-y: scroll;
		width: 100vw;
		height: 100vh;
	}

	.bgImg {
		width: 100vw;
		height: 100vh;
		position: relative;
	}

	.activty {
		// padding-top: 20rpx;
		position: absolute;
		top: 0;
		left: 0;
		box-sizing: border-box;
		width: 100vw;

		// background: #00B183;
		.bigTip {
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 664rpx;
			min-height: 297rpx;
			padding: 50rpx 90rpx;
			margin: 0 auto;
			margin-top: 20rpx;
			margin-bottom: 200rpx;
			color: #209673;

			.title {
				font-size: 72rpx;
				font-weight: 600;
			}

			.smTip {
				margin-top: 32rpx;
				font-size: 36rpx;
				font-weight: 600;
				// color: #666;
			}
		}

		.form {
			box-sizing: border-box;
			width: 680rpx;
			padding: 0 20rpx 0 40rpx;
			margin: 0 auto;
			margin-top: 53rpx;

			.form-item {
				display: flex;
				align-items: center;
				height: 90rpx;
				// margin-top: 20rpx;

				>input {
					width: 460rpx;
					height: 100%;
					margin-left: 55rpx;
					border: 1rpx solid #ccc;
				}

				text {
					font-size: 36rpx;
					font-weight: 600;
					color: #000;
				}

				.car {
					width: 120rpx !important;
					margin-left: 0 !important;
				}

				.title {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 90rpx;
					height: 100%;
					margin-left: 20rpx;
					border: 1rpx solid #ccc;
				}
			}

			.submit {
				position: relative;
				width: 540rpx;
				height: 90rpx;
				margin-top: 30rpx;
				margin-left: 35rpx;
				color: white;

				>image {
					width: 100%;
					height: 100%;
				}

				>.btnName {
					position: absolute;
					top: 30%;
					left: 47%;
					z-index: 99;
					color: white;
				}
			}

			.rule {
				width: 620rpx;
				height: 25rpx;
				margin-top: 47rpx;
				margin-bottom: 20rpx;

				>image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.rules {
		font-size: 20rpx;
		color: white;
		position: absolute;
		width: 750rpx;
		padding: 0 70rpx;
		//height: 100vh;
		width: 100%;
		left: 0;
		background: #00B183;

		.text {
			width: 620rpx;
		}
	}
</style>
