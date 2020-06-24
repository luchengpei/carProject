<template>
	<view class="car">
		<view class="car-top">
			<!-- <view class="homeIcon" @click="goHome()">
				<text class="cuIcon-homefill text-orange"></text>
			</view> -->
			<swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
			 duration="500">
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<image :src="item" mode="scaleToFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="car-name-box flex ">
			<view>
				<text class="license_area">上牌地区:</text>
				<text class="cu-tag bg-white radius sm licenseBox">{{carInfo.city}}</text>
			</view>
			<view class="car-name">
				{{carInfo.name}}
			</view>
			<view class="">
				<view class="finance bg-gradual-orange">
					<view class="text-lg">首付：{{carInfo.min_pay}}万</view>
				</view>
			</view>
		</view>
		<view class="carFlies">
			<view class="common-title-box">
				<view class="common-title-left">
				</view>
				<view class="common-title text-bold">
					车辆档案
				</view>
			</view>
			<view class="carArchives-main-box bg-grey light">
				<view class="detailBox">
					<view class="carData">{{carInfo.total_distance}}万公里</view>
					<view class="carOption">
						里程
					</view>
				</view>
				<view class="detailBox">
					<view class="carData">
						{{carInfo.registration_date}}
					</view>
					<view class="carOption">
						上牌
					</view>
				</view>
				<view class="detailBox">
					<view class="carData">
						{{carInfo.discharge}}
					</view>
					<view class="carOption">
						排放
					</view>
				</view>
				<view class="detailBox">
					<view class="carData">
						{{carInfo.guide_price}}
					</view>
					<view class="carOption">
						原价
					</view>
				</view>
				<view class="detailBox">
					<view class="carData">
						{{carInfo.sale_price}}万
					</view>
					<view class="carOption">
						售价
					</view>
				</view>
			</view>
			<view class="carArchives-more" @click="goDetail(detailQuery.id)">
				<text class="deteildText">详细配置 ></text>
			</view>
		</view>
		<view class="carShopBox">
			<view class="common-title-box">
				<view class="common-title-left">
				</view>
				<view class="common-title-right">
					<view class="common-title text-bold">
						{{shopInfo.name}}
					</view>
					<view class="sellCar">
						{{shopInfo.totalCar}}辆在售车
					</view>
				</view>
			</view>

			<view class="shop-box flex justify-between">
				<view class="shopImg">
					<image :src="shopInfo.img"></image>
				</view>
				<view class="goShop">
					<view class="">
						<text class="cuIcon-locationfill" @click="mapLocation"></text>
						<text style="margin-left: 10rpx;">
							{{shopInfo.area}}
						</text>
					</view>
					<view class="marginTop10">
						联系人：{{shopInfo.customer}}
					</view>
					<view class="shop-btn" @click="goShop(shopInfo.id)">
						<text class="deteildText"> 进店看看 ></text>
					</view>
				</view>
			</view>
		</view>
		<view class="recommend">
			<view class="common-title-box">
				<view class="common-title-left">
				</view>
				<view class="common-title text-bold">
					为你推荐
				</view>
			</view>
			<view class="recommendBox flex flex-wrap justify-between">
				<view class="recommend-item" v-for="(car,index) in cars" :key="index" @click="goCarInfo(car.id)">
					<view class="recommendImg">
						<image :src="car.headsFace"></image>
					</view>
					<view class="recommend-box">
						<view class="recommend-name text-black">
							{{car.config_car_name}}
						</view>
						<view class="recommend-price text-red">
							<text class="text-bold">{{car.sale_price}}万</text> <text style="margin-left: 20rpx;font-size: 24rpx;">首付{{car.min_pay}}万</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="  bg-white nav-bottom ">
			<view class="action" @click="collection()">
				<view class="cuIcon-cu-image">
					<view class="text-orange" :class="isFavor?'cuIcon-favorfill':'cuIcon-favor'"></view>
				</view>
				<text>收藏</text>
			</view>
			<button class="action wxbtn" open-type="share">
				<view class="cuIcon-cu-image">
					<view class="cuIcon-forward text-orange"></view>
				</view>
				<text class="shareBtn ">分享</text>
			</button>
			<view class="action callMan" @click="call()">
				<text>咨询</text>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import urls from '@/api/url';
	import lib from '@/api/lib';
	import util from '@/utils/utils';
	import store from "@/store/index.js";
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex';
	export default {
		data() {
			return {
				detailQuery: {
					id: undefined,
				},
				isFavor: false,
				swiperList: [],
				cars: [],
				carInfo: {
					name: "",
					city: "",
					min_pay: "",
					total_distance: "",
					registration_date: "",
					discharge: "",
					guide_price: "",
					sale_price: ""
				},
				shopInfo: {
					id: "",
					name: "",
					customer: "",
					totalCar: "",
					area: "",
					img: "",
					phone: "",
					latitude: '',
					longitude: ''
				},
				querys: {
					count: 10,
					page: 1,
					province_id: undefined,
					city_id: undefined,
					config_brands_id: undefined,
					p_chexi_id: undefined,
					enterprise_id: undefined,
					type: undefined
				},
				params: {},
				markers: [],
				latitude: '',
				longitude: '',
				placeData: {}
			};
		},
		// #ifdef MP-WEIXIN
		async onLoad(options) {
			// 是通过二维码进入的
			if (options.scene) {
				Object.assign(this.detailQuery, util.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
			}
			// 不是通过二维码进入的
			else {
				this.detailQuery.id = parseInt(options.id);
			}
			this.reset();
			await this.getCarInfo();
			await this.getShop();
			await this.getCarList();
		},
		// #endif

		// #ifdef H5
		async onShow() {
			this.detailQuery.id = this.$route.query.id;
			this.querys.enterprise_id = this.$route.query.enterprise_id;
			this.reset();
			await this.getCarInfo();
			await this.getShop();
			await this.getCarList();
		},
		// #endif
		//点击分享传递参数
		onShareAppMessage: function(res) {
			return {
				title: this.carInfo.name,
				path: `/pages/shop/carInfo?id= ${this.detailQuery.id} &enterprise_id = ${this.querys.enterprise_id}`,
			}
		},
		methods: {
			//根据查询目标经纬度打开地图
			mapLocation() {
				wx.openLocation({
					latitude: Number(this.shopInfo.latitude),
					longitude: Number(this.shopInfo.longitude),
					scale: 28,
					name: this.shopInfo.area, //打开后显示的地址名称
				})
			},
			goCarInfo(id) {
				uni.navigateTo({
					url: `/pages/shop/carInfo?id= ${id} &enterprise_id = ${this.querys.enterprise_id}`
				})
			},
			goShop(id) {
				uni.navigateTo({
					url: "/pages/shop/shop?id= " + id
				})
			},
			goHome() {
				uni.navigateTo({
					url: "../index/index"
				})
			},
			goDetail(id) {
				uni.navigateTo({
					url: `/pages/shop/detailConfig?id=  ${id} &enterprise_id = ${this.querys.enterprise_id}`
				})
			},
			call() {
				uni.makePhoneCall({
					phoneNumber: this.shopInfo.phone
				});
			},
			// 收藏
			async collection() {
				if (this.$store.state.userToken) {
					if (this.isFavor) {
						uni.showToast({
							title: "您已经收藏了哦",
							icon: "none",
							duration: 1000
						})
						return false;
					}
					const res = await lib.request(urls.carStar, this.detailQuery);
					this.isFavor = true;
					uni.showToast({
						title: "收藏成功",
						icon: "none",
						duration: 1000
					})
				} else {
					uni.showToast({
						title: "请先登陆",
						icon: "none",
						duration: 1000
					})
					uni.navigateTo({
						url: "/pages/login/login"
					})
				}
			},
			reset() {
				this.cars = [];
				this.carInfo = {
					name: "",
					city: "",
					min_pay: "",
					total_distance: "",
					registration_date: "",
					discharge: "",
					guide_price: "",
					sale_price: ""
				};
				this.shopInfo = {
					id: "",
					name: "",
					customer: "",
					totalCar: "",
					area: "",
					img: "",
					phone: "",
					latitude: '',
					longitude: ''
				};
				this.querys = {
					count: 10,
					page: 1,
					province_id: undefined,
					city_id: undefined,
					config_brands_id: undefined,
					p_chexi_id: undefined,
					enterprise_id: undefined,
					type: undefined
				}
			},
			// 获取车辆信息
			async getCarInfo() {
				const res = await lib.request(urls.carDetail, {
					id: this.detailQuery.id,
				});
				this.isFavor = res.data.isStar;
				this.querys.enterprise_id = res.data.enterprise_id;
				this.carInfo.name = res.data.config_car_name;
				this.carInfo.city = res.data.license_area;
				this.carInfo.min_pay = util.toWan(res.data.min_pay);
				this.carInfo.total_distance = res.data.total_distance;
				this.carInfo.registration_date = util.timestampToTimeType(res.data.registration_date, 'month');
				this.carInfo.discharge = res.data.config_car_en.p_huanbaobiaozhun;
				this.carInfo.guide_price = res.data.guide_price;
				this.carInfo.sale_price = util.toDecimal(res.data.sale_price);
				this.swiperList[0] = util.getHttps(res.data.heads_images.headsFace, 1);
				this.swiperList[1] = util.getHttps(res.data.heads_images.headsLeft, 1);
				this.swiperList[2] = util.getHttps(res.data.heads_images.headsEnd, 1);
				if (res.data.heads_images.headsRight) {
					this.swiperList[3] = util.getHttps(res.data.heads_images.headsRight, 1);
				}
				if (res.data.heads_images.attach) {
					if (res.data.heads_images.attach.length > 0) {
						for (var i = 0; i < res.data.heads_images.attach.length; i++) {
							this.swiperList[4 + i] = util.getHttps(res.data.heads_images.attach[i], 1);
						}
					}
				}

			},
			// 获取商家信息
			async getShop() {
				const shop = await lib.request(urls.enterpriseInfo, {
					id: this.querys.enterprise_id
				});
				this.shopInfo.id = shop.data.id;
				this.shopInfo.name = shop.data.name;
				this.shopInfo.totalCar = shop.data.totalCar;
				this.shopInfo.area = shop.data.province + shop.data.city + shop.data.area + shop.data.address;
				this.shopInfo.customer = shop.data.customer;
				this.shopInfo.phone = shop.data.customer_tel;
				let obj = util.bMapTransWXMap(shop.data.longitude, shop.data.latitude)
				this.shopInfo.longitude = obj.lng
				this.shopInfo.latitude = obj.lat
				if (shop.data.enterprise_pic.signboard != "") {
					this.shopInfo.img = await lib.aliyunOOS(shop.data.enterprise_pic.signboard);
				} else {
					this.shopInfo.img = "/static/images/nopic.jpg"
				}

			},
			// 获取推荐车辆列表
			async getCarList() {
				const carList = await lib.request(urls.carList, this.querys, "", true, true);
				carList.data.items.forEach(item => {
					item['sale_price'] = util.toDecimal(item.sale_price);
					item['min_pay'] = util.toWan(item.min_pay);
					item['headsFace'] = util.getHttps(item.heads_images.headsFace, 2);
				});
				this.cars = this.cars.concat(carList.data.items);
			}
		}
	}
</script>

<style scoped>
	.screen-swiper {
		height: 400rpx;
	}

	.shareBtn {
		color: #666666;
		font-size: 20rpx;
	}

	.car {
		overflow-x: hidden;
		background-color: #f9f9f8;
	}

	.marginTop10 {
		margin-top: 10rpx;
		margin-bottom: 10rpx;
	}

	.car {
		width: 750rpx;
	}

	.car-top {
		position: relative;
	}

	.homeIcon {
		position: absolute;
		right: 40rpx;
		top: 40rpx;
		z-index: 999;
		font-size: 44rpx;
	}

	.finance {
		width: 660rpx;
		height: 80rpx;
		border-radius: 10rpx;
		font-size: 32rpx;
		line-height: 31rpx;
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.car-name-box {
		flex-direction: column;
		padding: 30rpx 45rpx;
		background-color: #ffffff;
	}

	.license_area {
		font-size: 24rpx;
		color: #000000;
		margin-right: 10rpx;
	}

	.licenseBox {
		height: 30rpx;
		line-height: 30rpx;
		border-radius: 11rpx;
		border: solid 1rpx #ff5501;
		background-color: #FFFFFF;
		font-size: 22rpx;
		color: #ff5501;
	}

	.car-name {
		font-size: 36rpx;
		color: #000000;
		margin-top: 27rpx;
		margin-bottom: 23rpx;

	}

	.car-price {
		font-size: 32rpx;
		margin-right: 20rpx;
	}

	.car-price-high {
		text-decoration: line-through;
	}

	.common-title {
		font-size: 32rpx;
		color: #333333;
		padding-top: 6rpx;
	}

	.common-title-left {
		width: 6rpx;
		height: 60rpx;
		background-color: #ff5501;
		margin-right: 24rpx;
	}

	.cuIcon-locationfill {
		color: #ff5501;
	}

	.common-title-right {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.sellCar {
		font-size: 22rpx;
		line-height: 31rpx;
		color: #999999;
	}

	.carFlies {
		margin-top: 20rpx;
		height: 463rpx;
		background-color: #ffffff;
		box-shadow: 0rpx 11rpx 64rpx 6rpx rgba(153, 153, 153, 0.15);
		position: relative;
	}

	.common-title-box {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
		background-color: #ffffff;
	}

	.carArchives-main-box {
		width: 690rpx;
		height: 253rpx;
		background-color: #fff4e8;
		border-radius: 10rpx;
		margin-left: 30rpx;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	.detailBox {
		width: 30%;
		text-align: center;
		margin-left: 23rpx;
	}

	.carData {
		font-size: 30rpx;
		line-height: 29rpx;
		color: #ff5501;
		margin-bottom: 27rpx;
		font-weight: bold;
	}

	.carOption {
		font-size: 22rpx;
		line-height: 29rpx;
		color: #666666;
	}

	.carShopBox {
		width: 750rpx;
		height: 301rpx;
		padding-right: 31rpx;
		background-color: #ffffff;
		box-shadow: 0rpx 11rpx 64rpx 6rpx rgba(153, 153, 153, 0.15);
		margin: 19rpx 0;
	}

	.sellCar {
		content-self: flex-end;
	}

	.carArchives-parameter-box {
		margin-top: 30rpx;
	}

	.carArchives-parameter {
		width: 48%;
		margin-bottom: 20rpx;
	}

	.carArchives-more {
		width: 670rpx;
		height: 80rpx;
		background-color: #f9f9f8;
		border-radius: 10rpx;
		text-align: center;
		margin-top: 20rpx;
		margin-left: 40rpx;
		font-size: 26rpx;
		line-height: 31rpx;
		color: #ff5501;
		line-height: 80rpx;
	}

	.shop-box {
		position: relative;
		margin-left: 31rpx;
	}

	.shopImg {
		border-radius: 10rpx;
		width: 250rpx;
		height: 191rpx;
		margin-right: 24rpx;
	}

	.shopImg image {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}

	.goShop {
		flex: 1;
		position: relative;
	}

	.shop-btn {
		width: 424rpx;
		height: 67rpx;
		background-color: #f9f9f8;
		border-radius: 10rpx;
		text-align: center;
		line-height: 67rpx;
		color: #ff5501;
		position: absolute;
		bottom: 0;
		right: 0;
	}

	.shop-btn .cu-btn {
		width: 100%;
	}

	.recommend {
		margin-bottom: 109rpx;
		background-image: linear-gradient(#ffffff, #f7f7f7);
	}

	.recommend-item {
		margin-top: 20rpx;
		border-radius: 10rpx;
		width: 48%;
		background-color: #ffffff;
		box-shadow: 0rpx 1rpx 24rpx 1rpx rgba(204, 204, 204, 0.35);
		border-radius: 10rpx;
	}

	.recommendBox {
		padding: 0 30rpx 20rpx 30rpx;
	}

	.recommend-box {
		padding: 10rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
	}

	.recommendImg {
		border-radius: 10rpx;
		width: 100%;
		height: 200rpx;
	}

	.recommendImg image {
		width: 100%;
		height: 100%;
		border-radius: 10rpx 10rpx 0 0;
	}

	.nav-bottom {
		width: 100%;
		height: 106rpx;
		position: fixed;
		bottom: 0px;
		z-index: 999;
		display: flex;
		font-size: 20rpx;
		color: #666666;
		padding: 20rpx 40rpx 0 40rpx;
	}

	.action {
		height: 72rpx;
	}

	.cuIcon-cu-image {
		font-size: 44rpx;
	}

	.wxbtn {
		height: 72rpx;
		border: none;
		line-height: 1;
		font-size: 20rpx;
		background-color: #FFFFFF;
	}

	.wxbtn::after {
		border: none;
	}

	.cuIcon-forward {
		margin-bottom: 8rpx;
	}

	.cu-list.grid.no-border {
		padding: 0px !important;
	}

	.callMan {
		width: 531rpx;
		height: 66rpx;
		background-color: #ff5501;
		border-radius: 10rpx;
		color: #ffffff;
		font-size: 30rpx;
		text-align: center;
		line-height: 66rpx;
		margin-top: 6rpx;
	}
</style>
