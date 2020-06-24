<template>
	<view style="background-color: #F5F5F5; width:750rpx">
		<view class="fixedBox">
			<view class="fixation">
				<!-- <image class="headimg" src="../../static/images/headimg.png" @click="goMy()"></image> -->
				<input @input="search" v-model="name" class="headInput" placeholder-style="color:#999999;" placeholder="输入车辆名称或品牌"></input>
				<text style="color: #ccc;font-size: 40rpx;" class="cuIcon-roundclosefill" v-show="closeVisb" @click="deleteText()"></text>
			</view>
		</view>

		<view class="carItems">
			<view class="carItem" @click="goCarInfo(item.id)" v-for="(item,index) in listData" :key="index">
				<view class="imgBox">
					<image :src="item.headsLeft" mode=""></image>
				</view>
				<view class="carItemRight">
					<view class="carName">
						{{item.configCarName}}
					</view>
					<view class="carYear">
						<text>{{item.totalDistance}}公里</text> <text style="margin:0px 10rpx">/</text> <text>{{item.registrationDate}}年</text>
					</view>
					<view class="carItemMoney">
						<view class="carMoney">
							{{item.salePrice}}万
						</view>
						<view class="carDistance" v-if="isPromise=='true'&&item.distance">
							距离你{{item.distance}}公里
						</view>
						<view class="carDistance" v-else>
							无法获取距离
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import urls from '@/api/url.js';
	import lib from '@/api/lib.js';
	import utils from "../../utils/utils.js";
	let timer = null;

	export default {
		data() {
			return {
				listQuery: {
					page: 1,
					count: 10,
					key: "",
					longitude: "",
					latitude: ""
				},
				name: "",
				listData: [],
				hasMore: false,
				isPromise:false
			};
		},
		computed: {
			closeVisb() {
				return this.name;
			}
		},
		onLoad(option) {
			console.log(option, "option")
			this.listQuery.latitude = option.latitude
			this.listQuery.longitude = option.longitude
			this.isPromise = option.isPromise
		},
		methods: {
			deleteText() {
				this.listQuery.key = "";
				this.name = "";
				this.listQuery.page = 1;
				this.listData = [];
			},
			goMy() {
				uni.navigateTo({
					url: "/pages/mine/mine"
				});
			},
			goCarInfo(id) {
				uni.navigateTo({
					url: "/pages/shop/carInfo?id=" + id
				})
			},
			getList() {
				lib.request(urls.homeLikeCar, this.listQuery).then(res => {
					res.data.items.forEach(item => {
						item.registrationDate = utils.timestampToTimeType(item.registrationDate, "year");
						if (item.distance) {
							item.distance = (item.distance / 1000).toFixed(2);
						}
					});
					this.listData = this.listData.concat(res.data.items);
					uni.stopPullDownRefresh();
					if (res.data.page.totalPage > this.listQuery.page) {
						this.hasMore = true;
					} else {
						this.hasMore = false;
					}
				})
			},
			search(e) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(async () => {
					this.listQuery.key = e.detail.value.trim();
					if (this.listQuery.key) {
						this.listQuery.page = 1;
						this.listData = [];
						await this.getList();
					} else {
						this.listQuery.page = 1;
						this.listData = [];
					}
				}, 300)

			},
			// 上拉加载
			async onReachBottom() {
				if (this.hasMore) {
					this.listQuery.page++;
					await this.getList();
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.fixedBox {
		z-index: 9999;
		position: fixed;
		top: 0px;
		width: 100%;
		background-color: #F5F5F5;
		height: 130rpx;
	}

	.fixation {
		position: fixed;
		top: 20rpx;
		width: 690rpx;
		height: 90rpx;
		background-color: #FFFFFF;
		left: 34rpx;
		display: flex;
		align-items: center;
		border-radius: 8rpx;
		box-shadow: 0px 2rpx 10rpx 0px rgba(0, 0, 0, 0.2);

		.headimg {
			margin-left: 20rpx;
			width: 50rpx;
			height: 50rpx;
		}

		.headInput {
			padding: 0px 20rpx;
			width: 90%;
		}
	}


	.carItems {
		// box-shadow: 0px 2rpx 10rpx 0px rgba(0, 0, 0, 0.4);
		// background-color: #fff;
		margin: 130rpx 30rpx 30rpx 30rpx;
		overflow: hidden;

		.carItem {
			border-radius: 8rpx;
			display: flex;
			margin: 15rpx 0px;
			padding: 26rpx 20rpx;
			background-color: #FFFFFF;
			// background-color: #F5F5F5;

			.imgBox {
				width: 268rpx;
				height: 188rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.carItemRight {
				padding-left: 20rpx;
				width: 360rpx;

				.carName {
					margin-bottom: 10rpx;
					display: -webkit-box;
					word-break: break-all;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.carYear {
					color: #666666;
					font-size: 24rpx;
					margin-bottom: 20rpx;
				}

				.carItemMoney {
					display: flex;
					justify-content: space-between;
					align-items: baseline;

					.carMoney {
						color: #E34F5B;
						font-size: 36rpx;
					}

					.carDistance {
						font-size: 24rpx;
					}
				}
			}
		}
	}
</style>
