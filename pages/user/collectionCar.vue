<template>
	<view class="">
		<view class="list-box">
			<view class="list-item padding flex justify-between" v-for="(item,index) in items" :key="index" @click="goCarInfo(item.id)">
				<view class="item-left">
					<image :src="item.headsRight" mode=""></image>
				</view>
				<view class="item-right">
					<view class="item-name">
						{{item.config_car_name}}
					</view>
					<view class="item-time">
						<text>{{item.registration_date}}上牌</text>|<text>{{item.total_distance}}万公里</text>
					</view>
					<view class="">
						<text>￥{{item.sale_price}}万</text><text class="item-highPrice">￥{{item.guide_price}}</text>
					</view>
					<view class="flex justify-between item-last">
						<view class="text-red">首付：￥{{item.min_pay}}万</view>
						<view class="cuIcon-delete" @click.stop="delCar(item.id)"></view>
					</view>
				</view>
			</view>
		</view>
		<p v-show="!hasMore" style="text-align:center;font-size:13px;color:#ccc;padding:10px 0;background:#fff;">暂无更多数据</p>
	</view>
</template>

<script>
	import urls from '@/api/url.js';
	import lib from '@/api/lib.js';
	import util from '@/utils/utils';
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex';

	export default {
		data() {
			return {
				hasMore: false,
				items: [],
				querys: {
					count: 10,
					page: 1
				}
			}
		},
		async onLoad() {
			await this.getList();
		},
		// 上拉加载
		async onReachBottom() {
			if (this.hasMore) {
				this.querys.page++;
				await this.getList();
			}
		},
		//下拉刷新
		async onPullDownRefresh() {
			this.items = [];
			this.querys.page = 1;
			await this.getList();
		},
		methods: {
			async getList() {
				if (this.$store.state.userToken) {
					const res = await lib.request(urls.carStarList, this.querys, "", true, true);
					res.data.items.forEach(item => {
						item['registration_date'] = util.timestampToTimeType(item.registration_date, 'month');
						item['sale_price'] = util.toDecimal(item.sale_price);
						item['min_pay'] = util.toWan(item.min_pay);
						item['headsRight'] = util.getHttps(item.heads_images.headsRight, 2);
					});
					this.items = this.items.concat(res.data.items);
					uni.stopPullDownRefresh();
					if (res.data.page.totalPage > this.querys.page) {
						this.hasMore = true;
					} else {
						this.hasMore = false;
					}

				} else {
					uni.showToast({
						title: "请先登陆",
						icon: "none",
						duration: 1000
					})
				}
			},
			reset() {
				this.items = [];
				this.querys = {
					count: 10,
					page: 1
				}
			},
			delCar(id) {
				var that = this;
				uni.showModal({
					content: "确定要删除吗?",
					success: async function(res) {
						if (res.confirm) {
							const res = await lib.request(urls.carDelStar, {
								id: id
							});
							console.log(res);
							uni.showToast({
								title: "删除成功",
								icon: "none",
								duration: 1000
							})

							that.reset();
							await that.getList();
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			goCarInfo(id) {
				uni.navigateTo({
					url: "/pages/shop/carInfo?id=" + id
				})
			}
		}
	}
</script>

<style scoped>
	.list-item {
		border-bottom: 1px solid #EEEEEE;
	}

	.list-box {
		width: 750rpx;
	}

	.item-left {
		width: 45%;
		margin-right: 20rpx;
	}

	.item-right {
		width: 52%;
	}

	.item-left image {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}

	.item-name {
		font-size: 30rpx;
		font-weight: bold;
	}

	.item-time {
		color: #999999;
		font-size: 24rpx;
	}

	.item-highPrice {
		color: #999999;
		font-size: 24rpx;
		text-decoration: line-through;
		margin-left: 20rpx;
	}

	.item-last {
		line-height: 40rpx;
	}
</style>
