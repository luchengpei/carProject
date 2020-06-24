<template>
	<view>
		<scroll-view scroll-y class="DrawerPage" :class="modalName == 'viewModal' ? 'show' : ''">
			<!-- 	<view class="flex top ORange light">
				<i class="iconfont icon-ren" @tap="showModal" data-target="viewModal"></i>
				<text class="tetxCentered">
					库袋首页
				</text>
			</view> -->
			<view class="map_container">
			4545454545
				<map class="map" id="map" :longitude="longitude" :latitude="latitude" :scale="homeCarInfo.zoomLevel" :show-location="isPromise"
				 :markers="markers" @markertap="makertap" @regionchange="regionchange"></map>
			</view>
			<view class="fixation">
				<image class="headimg" src="../../static/images/headimg.png" @click="my"></image>
				<input class="headInput" placeholder-style="color:#999999;" placeholder="输入车辆名称或品牌" @tap="searchShow"></input>
			</view>
			<view class="live" @click="livelihood" >
				<image class="liveimg" src="../../static/images/live.png"></image>
			</view>
			<view class="comeon" @click="comeonTap">
				<image class="liveimg" src="../../static/images/comeon.png"></image>
			</view>
			<!-- <view class="collect">
				<view class="dealer" @click="dealerclick">
				<image class="dealerimg" src="../../static/images/dealer.png"></image>
				<view class="dealerTetx">
						收藏车商
				</view>
				</view>
				<view class="border"></view>
				<view class="dealer" @click="goCollection()">
				<image class="dealerimg" src="../../static/images/vehicle.png"></image>
				<view class="dealerTetx">
						收藏车辆
				</view>
				</view>
			</view> -->
		</scroll-view>

		<!-- 	<view class="DrawerClose" :class="modalName == 'viewModal' ? 'show' : ''" @tap="hideModal">
			<text class="cuIcon-pullright"></text>
		</view> -->
		<scroll-view scroll-y class="DrawerWindow bg-grey light" :class="modalName == 'viewModal' ? 'show' : ''">
			<view class="wx-head-box">
				<view class="wx-head-img">
					<image :src=userImag mode="widthFix"></image>
				</view>
				<view class="wx-head-name">
					<text>{{userName}}</text>
				</view>
			</view>

			<!-- <view class="wx-head-box" v-if="Object.keys(storeInfo).length">
        <view>
          {{ storeInfo.enterpriseName }}
        </view>
        <view class="wx-head-name">
          <text>{{ storeInfo.address }}</text>
        </view>
      </view> -->
			<view class="cu-list menu sm-border card-menu">
				<view class="cu-item arrow" @click="goCollection()">
					<button class="cu-btn content">
						<text class="cuIcon-favorfill text-orange"></text>
						<text class="text-grey">收藏车辆</text>
					</button>
				</view>
				<view class="cu-item arrow" @click="goShop()">
					<button class="cu-btn content">
						<text class="cuIcon-shopfill text-orange"></text>
						<text class="text-grey">收藏店铺</text>
					</button>
				</view>
				<view class="cu-item arrow" @tap="goActity">
					<button class="cu-btn content">
						<text class="cuIcon-presentfill text-orange"></text>
						<text class="text-grey">活动</text>
					</button>
				</view>
				<view class="cu-item arrow" @tap="toMine">
					<button class="cu-btn content">
						<text class="cuIcon-myfill text-orange"></text>
						<text class="text-grey">我的</text>
					</button>
				</view>
				<!-- <view class="cu-item arrow">
					<button class="cu-btn content">
						<text class="cuIcon-notificationfill text-orange"></text>
						<text class="text-grey">消息通知</text>
					</button>
				</view>
				<view class="cu-item arrow">
					<button class="cu-btn content">
						<text class="cuIcon-infofill text-orange"></text>
						<text class="text-grey">关于我们</text>
					</button>
				</view>-->
			</view>
		</scroll-view>
		<view class="circelWap" @tap="moveTolocation">
			<image src="../../static/images/circle.png" mode=""></image>
		</view>
		<uppon v-model="bottomModal" :detail="carDetail" :isPromise="isPromise" />
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from "vuex";
	import bmap from "@/libs/bmap-wx.min.js";
	import util from "@/utils/utils";
	import appMap from "@/components/appMap.vue";
	import urls from "../../api/url.js";
	import lib from "api/lib.js";
	import uppon from './uppon'
	let timer = null
	export default {
		components: {
			appMap,
			uppon
		},
		computed: {
			mapHeight() {
				//地图自适应
				return `width: ${this.safeArea.width}px;height: ${
        this.safeArea.height - 60
      }px`;
			},
		},
		data() {
			return {
				bottomModal: '',
				searchVisible: false,
				phoneStyle: "",
				userName: "",
				modalName: null,
				userImag: "", //用户头像
				powerMan: "", //头部高度
				dengluMan: "", //登陆人行高
				safeArea: {
					height: 700,
					width: 600,
				},
				markers: [], //地图标点
				latitude: 39.90461888598763, //目标经纬度
				longitude: 116.39893044445799, //目标经纬度
				wxMarkerData: [], //地址数据
				BMap: "", //地图实例，
				storeInfo: {},
				homeCarInfo: {
					zoomLevel: 3
				},
				carDetail: {
					distance: '',
					configCarName: '',
					totalDistance: '',
					registrationDate: '',
					salePrice: ''
				},
				isPromise: false,
				moveLatitude:'',
				moveLongtude:''
			};
		},
		onLoad() {
			this.createMap();
			//this.mapCheck();
			try {
				const res = uni.getSystemInfoSync();
				this.safeArea.height = res.safeArea ?
					res.safeArea.height :
					res.windowHeight;
				this.safeArea.width = res.safeArea ? res.safeArea.width : res.windowWidth;
			} catch (e) {}
			switch (uni.getSystemInfoSync().platform) {
				case "android":
					this.phoneStyle = 1;
					break;
				case "ios":
					this.phoneStyle = 2;
					break;
				default:
					this.phoneStyle = 3;
					break;
			}
		},
		onShow() {
			// console.log(this.$store.state, 'indexv')
			// this.$nextTick(() => {
			// 	this.storeInfo = this.$store.state.enterpriseInfo
			// })
			//更换头像
			uni.removeStorageSync('enterpriseId')
			try {
				const value = uni.getStorageSync("userInfo");
				console.log(value)
				if (value) {
					this.userImag = value.headimgurl;
					this.userName = value.nickname;
				} else {
					this.userImag = "../../static/images/userImage.jpg";
				}
			} catch (e) {
				// error
			}
			uni.removeStorageSync("activtyInfo", "");
		},
		methods: {
			//跳搜索页面
			searchShow() {
				uni.navigateTo({
					url: `/pages/index/search?longitude=${this.longitude}&latitude=${this.latitude}&isPromise=${this.isPromise}`
				})
			},
			//移动时方法
			moveGetHome() {
				let param = {
					longitude:this.moveLongtude,
					latitude:this.moveLatitude
				}
				this.requestHomeCar(param)
				//==>todo
				// lib.request(urls.homeCar, param).then(res => {
				// 	this.markers = res.data.homeCarVOList
				// 	this.homeCarInfo = res.data
				// 	let context = uni.createMapContext('map')
				// 	this.homeCarInfo.zoomLevel = ''
				// 	this.markers.forEach(row => {
				// 		row.iconPath = '../../static/images/carIcon.png'
				// 		row.width = 23
				// 		row.height = 30
				// 	})
				// })
			},
			//获取首页门店
			requestHomeCar(params,level=''){
				lib.request(urls.homeCar, params).then(res => {
					this.markers = res.data.homeCarVOList
					this.homeCarInfo = res.data
					let context = uni.createMapContext('map')
					//this.homeCarInfo.zoomLevel = ''
					if(!level){
						this.homeCarInfo.zoomLevel = ''
					}
					this.markers.forEach(row => {
						row.iconPath = '../../static/images/carIcon.png'
						row.width = 23
						row.height = 30
					})
				})
			},
			//授权或未授权或返回当前位置
			getHomeCar() {
				let params = {
					longitude: this.longitude,
					latitude: this.latitude,
				}
				this.requestHomeCar(params,16)
				//==>todo
				// lib.request(urls.homeCar, params).then(res => {
				// 	this.markers = res.data.homeCarVOList
				// 	this.homeCarInfo = res.data
				// 	let context = uni.createMapContext('map')
				// 	this.markers.forEach(row => {
				// 		row.iconPath = '../../static/images/carIcon.png'
				// 		row.width = 23
				// 		row.height = 30
				// 	})
				// })
			},
			//回到当前位置
			moveTolocation() {
				uni.getSetting({
					success: (res) => {
						if (!res.authSetting["scope.userLocation"]) {
							console.log('未授权')
							uni.authorize({
								scope: 'scope.userLocation',
								success: (result) => {
									wx.getLocation({
										type: 'wgs84', //返回可以用于wx.openLocation的经纬度
										success: (res) => {
											this.latitude = res.latitude
											this.longitude = res.longitude
											let obj = {
												lng: res.longitude,
												lat: res.latitude
											}
											this.getHomeCar()
										}
									})
									this.isPromise = true
								},
								fail: () => {
									uni.showModal({
										title: '提示',
										content: '若点击不授权，将无法使用地图功能',
										cancelText: '不授权',
										cancelColor: '#999',
										confirmText: '授权',
										confirmColor: "#f94218",
										success: (res) => {
											if (res.confirm) {
												uni.openSetting({
													success: (result) => {
														if (result.authSetting["scope.userLocation"]) {
															uni.getLocation({
																type: 'wgs84', //返回可以用于wx.openLocation的经纬度
																success: (res) => {
																	this.latitude = res.latitude
																	this.longitude = res.longitude
																	this.getHomeCar()
																}
															})
															this.isPromise = true
														}
													}
												})
											}
										},
									})
								}
							})
						}
					}
					// },
				})
				if (this.isPromise) {
					let context = uni.createMapContext('map')
					context.moveToLocation()
				}
			},
			dealerclick() {
				uni.navigateTo({
					url: "/pages/myAsset/myAsset?type=" + "1"
				});
			},
			//点击标时触发
			makertap(e) {
				let markId = e.markerId
				let selectCar = this.markers.find(row => row.id == markId)
				let params = {
					id: selectCar.id,
					userLongitude: this.longitude,
					userLatitude: this.latitude,
					carLongitude: selectCar.longitude,
					carLatitude: selectCar.latitude
				}
				lib.request(urls.getCarInfo, params).then(res => {
					this.carDetail = res.data
					this.carDetail.registrationDate = util.timeFormat(new Date(this.carDetail.registrationDate * 1000), "yyyy")
					this.bottomModal = 'bottomModal'
				})
			},
			comeonTap() {
				uni.showModal({
					title: '即将开放',
					content: '敬请期待',
					success: function(res) {
						if (res.confirm) {
							// console.log('用户点击确定');
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},
			//地图发生变化触发
			regionchange(e) {
				if(e.causedBy=='scale' && e.type == 'end') return false
				//改方法会多次触发 具体看业务需求做操作
				let context = uni.createMapContext('map') //获取地图实例
				if (e.type == 'end') {
					context.getScale({ //获取缩放比例
						success: (res) => {
							context.getCenterLocation({
								success: (result) => {
									this.moveLatitude = result.latitude
									this.moveLongtude = result.longitude
									if (timer) clearTimeout(timer)
									timer = setTimeout(() => {
										this.moveGetHome()
									}, 700)
								}
							})
						}
					})
				}
			},
			my() {
				uni.navigateTo({
					url: "/pages/mine/mine"
				});
			},
			async livelihood() {
				if (!this.$store.state.userToken) {
					uni.navigateTo({
						url: "/pages/login/login"
					})
					return false
				}
				uni.navigateTo({
					url: "/pages/storeHome/storeHome"
				});
			},
			//创建地图函数
			createMap() {
				// 新建百度地图对象
				var BMap = new bmap.BMapWX({
					ak: "ZKF7UK3ghVW3iOSmrCQ58mSGQCbV5RFd",
				});
				uni.getLocation({
					type: "wgs84",
					success: async (res) => {
						this.latitude = res.latitude;
						this.longitude = res.longitude;
						let obj = util.wgs84togcj02tobd09(res.longitude, res.latitude);
						this.latitude = obj.lat;
						this.longitude = obj.lng;
						this.isPromise = true
						this.getHomeCar()
					},
					fail: (err) => {
						this.getHomeCar()
					}
				});
				this.BMap = BMap;
			},
			// 发起POI检索请求
			mapCheck() {
				// this.BMap.geocoding({
				// 	address: "",
				// 	fail: fail,
				// 	success: success,
				// });
				this.BMap.search({
					query: "网吧",
					fail: (err) => {
						console.log(err);
					},
					success: (res) => {
						this.wxMarkerData = res.wxMarkerData;
						//this.wxMarkerData = []
						this.markers = this.wxMarkerData;
						this.markers.push({
							longitude: 113.27324,
							latitude: 23.15792,
							id: 99,
							//title:'demo'
						})
						console.log(this.markers, 'marks')
						this.latitude = this.wxMarkerData[0].latitude;
						this.longitude = this.wxMarkerData[0].longitude;
					},
				});
			},
			showModal(e) {
				console.log(e);
				this.modalName = e.currentTarget.dataset.target;
			},
			hideModal(e) {
				this.modalName = null;
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
			},
			goActity() {
				uni.navigateTo({
					url: "/pages/activty/activtyList",
				});
			},
			toMine() {
				uni.navigateTo({
					url: "/pages/mine/mine",
				});
			},
			goShop() {
				uni.navigateTo({
					url: '/pages/storeDealerList/list'
				})
				//if (!this.$store.state.userToken) {
				// 		uni.navigateTo({
				// 			url: "/pages/login/login",
				// 		});
				// 	} else {
				// 		if (uni.getStorageSync('enterpriseId')) {
				// 			uni.navigateTo({
				// 				url: "/pages/shop/shop?id=" + uni.getStorageSync('enterpriseId'),
				// 			});
				// 		} else {
				// 			uni.showToast({
				// 				title: "请收藏店铺",
				// 				icon: "none",
				// 				duration: 2000,
				// 			});
				// 		}
				// 	}
			},
			goCollection() {
				if (!this.$store.state.userToken) {
					uni.navigateTo({
						url: "/pages/login/login",
					});
				} else {
					uni.navigateTo({
						url: "/pages/user/collectionCar",
					});
				}
			},
		},
	};
</script>

<style scoped lang="scss">
	.fixation {
		position: fixed;
		top: 134rpx;
		width: 690rpx;
		height: 90rpx;
		background-color: #FFFFFF;
		left: 34rpx;
		display: flex;
		align-items: center;
		border-radius: 8rpx;
		box-shadow: 0px 2rpx 10rpx 0px rgba(0, 0, 0, 0.4);

		.headimg {
			margin-left: 20rpx;
			width: 50rpx;
			height: 50rpx;
		}

		.headInput {
			padding-left: 20rpx;
			width: 80%;
		}

		.headInput::-ms-input-placeholder {
			/* WebKit browsers */
			color: red;
		}
	}

	.collect {
		position: fixed;
		top: 45%;
		width: 87rpx;
		background-color: #FFFFFF;
		height: 199rpx;
		right: 30rpx;
		text-align: center;
		box-shadow: 0px 2rpx 12rpx 0px rgba(0, 0, 0, 0.4);
		border-radius: 10rpx;

		.dealer {
			text-align: center;
			height: 50%;

			.dealerimg {
				margin-top: 19rpx;
				width: 45rpx;
				height: 37rpx;

			}

			.dealerTetx {
				font-size: 14.4rpx;
			}
		}

		.border {
			margin-left: 16rpx;
			width: 57rpx;
			height: 1px;
			background: rgba(0, 0, 0, 0.1);
		}
	}

	.live {
		position: fixed;
		bottom: 150rpx;
		right: 22rpx;
		width: 120rpx;
		height: 120rpx;

		.liveimg {
			width: 120rpx;
			height: 120rpx;
		}
	}

	.comeon {
		position: fixed;
		bottom: 300rpx;
		right: 22rpx;
		width: 120rpx;
		height: 120rpx;

		.liveimg {
			width: 120rpx;
			height: 120rpx;
		}
	}

	.ORange {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #EDEDED;
	}

	.tetxCentered {
		/* align-items: center; */
		text-align: center;
	}

	.map_container {
		height: 100%;
		width: 100%;
	}

	.map {
		height: 100%;
		width: 100%;
	}

	.top {
		width: 750rpx;
		padding: 20rpx;
		height: 130rpx;
	}

	.icon-ren {
		font-size: 40rpx;
		line-height: 130rpx;
	}

	.area-top {
		font-size: 36rpx;
		flex: 2;
		text-align: center;
	}

	page {
		background-image: var(--gradualBlue);
		width: 100vw;
		overflow: hidden;
	}

	.wx-head-box {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding: 50rpx 0;
	}

	.wx-head-img {
		width: 150rpx;
		height: 150rpx;
		border-radius: 150rpx;
		overflow: hidden;
		margin-bottom: 15rpx;
	}

	.DrawerPage {
		position: fixed;
		width: 100vw;
		height: 100vh;
		left: 0vw;
		background-color: #f1f1f1;
		transition: all 0.4s;
	}

	.DrawerPage.show {
		transform: scale(0.9, 0.9);
		left: 80vw;
		box-shadow: 0 0 60upx rgba(0, 0, 0, 0.2);
		transform-origin: 0;
	}

	.DrawerWindow {
		position: absolute;
		width: 80vw;
		height: 100vh;
		left: 0;
		top: 0;
		transform: scale(0.9, 0.9) translateX(-100%);
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
		padding: 100upx 0;
	}

	.DrawerWindow.show {
		transform: scale(1, 1) translateX(0%);
		opacity: 1;
		pointer-events: all;
	}

	.DrawerClose {
		position: absolute;
		width: 40vw;
		height: 100vh;
		right: 0;
		top: 0;
		color: transparent;
		padding-bottom: 30upx;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		background-image: linear-gradient(90deg,
			rgba(0, 0, 0, 0.01),
			rgba(0, 0, 0, 0.6));
		letter-spacing: 5px;
		font-size: 50upx;
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
	}

	.DrawerClose.show {
		opacity: 1;
		pointer-events: all;
		width: 20vw;
		color: #fff;
	}

	.DrawerPage .cu-bar.tabbar .action button.cuIcon {
		width: 64upx;
		height: 64upx;
		line-height: 64upx;
		margin: 0;
		display: inline-block;
	}

	.DrawerPage .cu-bar.tabbar .action .cu-avatar {
		margin: 0;
	}

	.DrawerPage .nav {
		flex: 1;
	}

	.DrawerPage .nav .cu-item.cur {
		border-bottom: 0;
		position: relative;
	}

	.DrawerPage .nav .cu-item.cur::after {
		content: "";
		width: 10upx;
		height: 10upx;
		background-color: currentColor;
		position: absolute;
		bottom: 10upx;
		border-radius: 10upx;
		left: 0;
		right: 0;
		margin: auto;
	}

	.DrawerPage .cu-bar.tabbar .action {
		flex: initial;
	}

	.wx-head-box {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 50rpx 0;
	}

	.wx-head-img {
		width: 150rpx;
		height: 150rpx;
		border-radius: 150rpx;
		overflow: hidden;
	}

	.circelWap {
		width: 80rpx;
		height: 80rpx;
		position: absolute;
		bottom: 90rpx;
		left: 30rpx;

		>image {
			width: 100%;
			height: 100%;
		}
	}
</style>
