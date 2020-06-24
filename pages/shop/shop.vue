<template>
	<view class="shopping">
		<view class="shop-box">
			<view class="shop-box-left">
				<view class="shop-box-top">
					<view class="shopName" :class="{'changeSize':isOver}">
						{{shop.name}}
					</view>
					<view class="havingCar">
						拥有车辆：{{shop.totalCar}}台
					</view>
				</view>
				<view class="carUser">
					联系人：{{shop.customer}}
				</view>
			</view>
			<!-- <view class="shop-box-right">
				<text class="cuIcon-favorfill text-orange keepShop"></text>
				<text>收藏</text>
			</view> -->
		</view>
		<view class="screen-box">
			<view class="screen-item" @click="isOpen">
				<text>品牌</text><text class="cuIcon-unfold"></text>
			</view>
			<view class="screen-item" @click="seriesOpen">
				<text>价格</text><text class="cuIcon-unfold"></text>
			</view>
			<view class="screen-item" @click="paymentOpen">
				<text>首付</text><text class="cuIcon-unfold"></text>
			</view>
		</view>
		<view class="recommend">
			<view class="flex flex-wrap justify-between">
				<view class="recommend-item shadow-warp bg-white" @click="goCar(car.id)" v-for="(car,index) in cars" :key="index">
					<view class="recommendImg">
						<image :src="car.headsFace" lazy-load=true></image>
					</view>
					<view class="recommend-box">
						<view class="recommend-name text-sm">
							{{car.config_car_name}}
						</view>
						<view class="recommend-price text-red">
							<text class="text-bold">{{car.sale_price}}万</text> <text style="margin-left: 20rpx;">首付{{car.min_pay}}万</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<p v-show="!hasMore" style="text-align:center;font-size:13px;color:#ccc;padding:10px 0;background:#fff;">暂无更多数据</p>
		<!-- 车辆型号 -->
		<carModel :showCarModel.sync="isShowCarModel" @sendCarModel="getCarModel" @tellParentChangeModel="getChildChangeModel"
		 ref="carPP"></carModel>
		<carSeries v-if="seriesOr" :showcarSeries='commomSend' @closeCar='seriesOr=false' @comfirm-data='sumbitData'></carSeries>
	</view>
</template>

<script>
	import urls from '@/api/url';
	import lib from '@/api/lib';
	import util from '@/utils/utils';
	import carModel from '@/components/carModel';
	import carSeries from '@/components/carSeries';

	export default {
		components: {
			carModel,
			carSeries
		},
		data() {
			return {
				isOver: false,
				//车牌型号
				carModel: '',
				//判断首付或价格
				seriesOr: false,
				//判断是否选择
				commomSend: {},
				//价格显示
				isShowcarSeries: {
					isShow: true, //判断是价格还是首付
					keepSeriesId: 0,
					seriesList: [{
							name: '不限价格',
							id: undefined
						},
						{
							name: '5万以下',
							id: 1
						}, {
							name: '5-10万',
							id: 2
						}, {
							name: '10-15万',
							id: 3
						}, {
							name: '15-20万',
							id: 4
						}, {
							name: '20-30万',
							id: 5
						}, {
							name: '30-50万',
							id: 6
						}, {
							name: '50万以上',
							id: 7
						}
					],
				},
				//首付显示
				isShowcarpayment: {
					isShow: false,
					keepPaymentId: 0,
					seriesList: [{
							name: '不限首付',
							id: undefined
						},
						{
							name: '0-1万',
							id: 1
						}, {
							name: '1-3万',
							id: 2
						}, {
							name: '3-5万',
							id: 3
						}, {
							name: '5-10万',
							id: 4
						}, {
							name: '10万以上',
							id: 5
						}
					]
				},
				isShowCarModel: false, //品牌显示
				carInfo: {},
				shop: {
					name: "",
					info: "",
					customer: "",
					totalCar: ""
				},
				cars: [],
				querys: {
					count: 10,
					page: 1,
					province_id: undefined,
					city_id: undefined,
					config_brands_id: undefined,
					p_chexi_id: undefined,
					enterprise_id: undefined,
					type: undefined,
					priceType: undefined,
					loanType: undefined
				}
			};
		},
		async onLoad(options) {
			this.querys.enterprise_id = Number(options.id)
			await lib.getSessingKeyAndCode({
				enterprise_id: this.querys.enterprise_id
			});
			//await this.getShop();
			await this.getCarList();
		},
		// 上拉加载
		async onReachBottom() {
			if (this.hasMore) {
				this.querys.page++;
				await this.getCarList();
			}
		},
		//下拉刷新
		async onPullDownRefresh() {
			this.cars = [];
			this.querys.page = 1;
			await this.getCarList();
		},
		methods: {
			//获取价格和首付参数
			sumbitData(val) {
				if (val.check) {
					this.querys.priceType = val.id
					this.isShowcarSeries.keepSeriesId = val.keepId
					this.cars = []
					this.getCarList();
				} else {
					this.querys.loanType = val.id
					this.isShowcarpayment.keepPaymentId = val.keepId
					this.cars = []
					this.getCarList();
				}
				this.seriesOr = false;
			},
			//车辆品牌打开
			isOpen() {
				this.isShowCarModel = true;
				this.$refs.carPP.getCarPP();
			},

			//价格打开
			seriesOpen() {
				this.seriesOr = !this.seriesOr;
				this.commomSend = JSON.parse(JSON.stringify(this.isShowcarSeries));
			},

			//首付打开
			paymentOpen() {
				this.seriesOr = !this.seriesOr;
				this.commomSend = JSON.parse(JSON.stringify(this.isShowcarpayment));
			},

			goCar(id) {
				uni.navigateTo({
					url: `/pages/shop/carInfo?id=${id} &enterprise_id = ${this.querys.enterprise_id}`
				});
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			getChildChangeModel(e) {
				//不限品牌
				this.querys.config_brands_id = undefined
				this.cars = []
				this.getCarList();
			},
			getCarModel(e) {
				//获取车型
				this.carInfo = e;
				this.querys.config_brands_id = e.config_brands_id
				this.carModel = e.config_car_name;
				this.cars = []
				this.getCarList();
			},
			// 获取车商信息
			async getShop() {
				const res = await lib.request(urls.enterpriseInfo, {
					id: this.querys.enterprise_id
				});
				if (res.data.name.length > 7) {
					this.isOver = true
				}
				this.shop.name = res.data.name;
				this.shop.customer = res.data.customer;
				this.shop.totalCar = res.data.totalCar;
			},
			// 获取车辆列表
			async getCarList() {
				const ress = await lib.request(urls.carList, this.querys, "", true, true);
				console.log(ress);
				this.shop.totalCar = ress.data.page.totalCount
				ress.data.items.forEach(item => {
					item['sale_price'] = util.toDecimal(item.sale_price);
					item['min_pay'] = util.toWan(item.min_pay);
					item['headsFace'] = util.getHttps(item.heads_images.headsFace, 2);
				});
				this.cars = this.cars.concat(ress.data.items);
				uni.stopPullDownRefresh();
				if (ress.data.page.totalPage > this.querys.page) {
					this.hasMore = true;
				} else {
					this.hasMore = false;
				}
			}
		}
	}
</script>

<style scoped>
	.changeSize {
		font-size: 36rpx!important;
		max-width: 414rpx;
	}

	.shopping {
		width: 100%;
	}

	.nav {
		display: flex;
		padding: 20rpx;
		font-size: 32rpx;
		width: 750rpx;
	}

	.nav-back {
		font-size: 40rpx;
	}

	.nav-title {
		flex: 2;
		text-align: center;
	}

	.shop-box {
		width: 750rpx;
		height: 200rpx;
		background-color: #ffffff;
		box-shadow: 0rpx 1rpx 22rpx 0rpx rgba(204, 204, 204, 0.5);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 47rpx;
	}

	.shop-box-top {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 23rpx;
	}

	.carUser {
		color: #9094a4;
		font-size: 30rpx;
	}

	.shop-box-right {
		width: 60rpx;
		height: 60rpx;
		border-radius: 60rpx;
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.shopName {
		font-size: 54rpx;
		color: #171e3f;
		margin-right: 9rpx;
	}

	.havingCar {
		height: 36rpx;
		background-color: #ff5501;
		border-radius: 18rpx;
		font-size: 24rpx;
		color: #ffffff;
		align-self: flex-end;
		padding: 6rpx 20rpx;
		line-height: 36rpx;
		display: flex;
		align-items: center;
	}

	.screen-box {
		padding: 15rpx 30rpx;
		display: flex;
		justify-content: space-between;
		position: relative;
		margin-top: 20rpx;
	}

	.recommend {
		padding: 0px 30rpx 30rpx 30rpx;
	}

	.recommend-item {
		width: 337rpx;
		height: 328rpx;
		box-shadow: 0rpx 1rpx 24rpx 1rpx rgba(204, 204, 204, 0.35);
		margin-top: 25rpx;
		border-radius: 20rpx;
	}

	.recommendImg {
		width: 100%;
		height: 200rpx;
		position: relative;
	}

	.recommendImg image {
		width: 100%;
		height: 100%;
		border-radius: 20rpx 20rpx 0 0;
	}

	.screen-item {
		font-size: 26rpx;
		color: #333333;
	}

	.recommend-box {
		padding: 10rpx;
	}
</style>
