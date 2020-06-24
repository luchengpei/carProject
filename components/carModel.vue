<template>
	<view class="brand-box" v-show="hzcShow">
		<view class="cu-dialog">
			<view class="cu-bar bg-white">
				<view class="action text-green" :class="{ has_list: hasList }" @click="isOk">确定</view>
				<view class="action text-blue" @click="onClose">取消</view>
			</view>
			<view class="padding-xl">
				<div class="comfire_text">已选: {{ carModel.licensePlate }} {{ carModel.carSystem }} {{ carModel.model }}</div>

				<div class="list_box">
					<scroll-view scroll-x class="bg-white nav">
						<view class="flex text-center" :active="activeNum" @change="changeIndex($event.mp)" @disabled="onClickTabsDisble($event.mp)">
							<view class="cu-item flex-sub" v-for="(item,index) in nav" :key="index" :class="{'tab_choose':tabChoose === index}" @click="tabSelect(index)" :data-id="index">
								{{item.title}}
							</view>
						</view>
					</scroll-view>

					<div class="inner_box" v-show="pinpai" data-xyp="1">
						<div class="box_l">
							<scroll-view scroll-y style="width:100%;height:100%;" scroll-with-animation :scroll-into-view="cityListId">
								<!-- :class="{'is_active': index == nowIndex}" -->
								<!-- <div v-show="licensePlateData.length <= 0" style="text-align:center;margin-top:10px;">
										<van-loading type="spinner" size="25px" />
									</div> -->
								<div v-for="(item, index) in licensePlateData" :key="index">
									<p class="pinpai_title" :id="item.letter">{{ item.letter }}</p>
									<div class="item_list" @click="itemCP(every, i)" v-for="(every, i) in item.list" :key="i">
										<img class="car_img" :src="imgTitle + every.p_pinpai_logo" alt />
										{{ every.p_pinpai }}
									</div>
								</div>
							</scroll-view>
						</div>
					</div>

					<div class="inner_box" v-show="chexi" data-xyp="2">
						<!-- :class="{'is_active': index == nowIndex2}" -->
						<div class="box_l">
							<!-- <div v-show="!hasCX" style="text-align:center;margin-top:10px;">
									<van-loading type="spinner" size="25px" />
								</div> -->
							<p v-show="carSystemData.length == 0 && hasCX" style="margin-top:10px;font-size:12px;color:#999;text-align:center">暂无车系,请选择其他品牌</p>

							<div class="item_list" @click="itemCX(item, index)" v-for="(item, index) in carSystemData" :key="index">
								<img class="car_img car_img_chexi" :src="imgTitle + item.p_chexizhanshitu" @error="errorImg(item)" />
								{{ item.p_chexi }}
							</div>
						</div>
					</div>

					<div class="inner_box" v-show="chexing">
						<div class="box_l">
							<!-- <div v-show="hasCXH" style="text-align:center;margin-top:10px;">
									<van-loading type="spinner" size="25px" />
								</div> -->
							<div v-show="modelData.length <= 0 && !hasCXH" style="text-align:center;margin-top:10px;font-size:12px;color:#999">暂无车型,请选择其他型号</div>
							<div class="item_list" @click="itemCXL(item, index)" :class="{ is_active: index == nowIndex3 }" v-for="(item, index) in modelData"
							 :key="index">
								{{ item.p_chexingmingcheng }}
							</div>
						</div>
					</div>
				</div>

				<!-- 快速入口 -->
				<div class="fast_entry" v-show="showRightCity">
					<div class="fast_entry_item" :data-item="item" @click.stop="fastEntry(item)" v-for="(item, index) in letters" :key="index">{{ item }}</div>
				</div>
			</view>
		</view>
	</view>

	<!-- <van-toast id="van-toast" /> -->
</template>

<script>
	import lib from '@/api/lib.js';
	import urls from '@/api/url.js';
	import util from '@/utils/utils';

	export default {
		components: {

		},
		props: {
			showCarModel: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				nav: [{
					title: "品牌"
				}, {
					title: "车系"
				}, {
					title: "车型"
				}],
				cityListId: '',
				tabChoose : 0,//tab栏选中
				isOpen: '',
				hasList: false,
				modelShow: true,
				pinpai: true,
				chexi: false,
				chexing: false,
				activeNum: 0,
				carModel: {
					licensePlate: '', //车牌
					carSystem: '', //车系
					model: '' //型号
				},
				licensePlateData: [], //车牌
				carSystemData: [], //车系
				modelData: [], //型号
				nowIndex: null,
				nowIndex2: null,
				nowIndex3: null,
				hasCXH: false,
				hasCX: false,
				carInfo: {},
				letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'W', 'X',
					'Y', 'Z'
				],
				imgTitle: 'https://publickdloanhd1.oss-cn-hangzhou.aliyuncs.com/',
				showRightCity: true,
				hzcShow: false, //判断该组件是否显示
			};
		},
		mounted() {
			this.activeNum = 0;
			this.licensePlateData = [];
			this.carSystemData = [];
			this.modelData = [];

		},
		watch: {
			activeNum(newVal, oldVal) {
				this.showRightCity = newVal == 0 ? true : false;
			},
			//监听改变组件显示
			showCarModel: {
				handler(val) {
					this.hzcShow = this.showCarModel;
				},
				deep: true,
				immediate: true,
			},
		},
		methods: {
			//tab栏切换
			tabSelect(index) {
				if (index === 0) {
					this.tabChoose = index
					this.pinpai = true
					this.chexi = false
					this.chexing = false
					this.carModel.licensePlate = ''
					this.carModel.carSystem = ''
					this.carModel.model = ''
					this.carSystemData = []
					this.modelData = []
				} else if (index === 1) {
					if (this.carModel.licensePlate === '') {
						uni.showToast({
							title: '请选择品牌',
							icon: 'none',
							duration: 2000
						})
						return
					} else {
						this.pinpai = false
						this.chexi = true
						this.chexing = false
						this.carModel.model = ''
						this.modelData = []
					}

				} else if (index === 2) {
					if (this.carModel.licensePlate === '') {
						uni.showToast({
							title: '请选择品牌和车型',
							icon: 'none',
							duration: 2000
						})
						return
					} else {
						this.pinpai = false
						this.chexi = false
						this.chexing = true
					}

				}
			},
			errorImg(item) {
				item.p_chexizhanshitu = 'weixin/no.png';
			},
			changeIndex(e) {
				if (e.detail.index == 0) {
					this.activeNum = 0;
				} else if (e.detail.index == 1) {
					this.activeNum = 1;
				} else if (e.detail.index == 2) {
					this.activeNum = 2;
				}
			},
			fastEntry(e) {
				this.cityListId = e;
				uni.showToast({
					title: e,
					icon: "none",
					duration: 3000
				});
			},
			isOk() {
				//提交填写的车辆信息
				if (this.hasList) {
					uni.showToast({
						title: '暂无该车型,请重新选择!',
						icon: 'none',
						duration: 2000
					})
					return;
				}
				if (this.carModel.licensePlate.length <= 0 || this.carModel.carSystem.length <= 0 || this.carModel.model.length <=
					0) {
					uni.showToast({
						title: '请选择完整辆型号',
						icon: 'none',
						duration: 2000
					})
					return;
				}
				// this.showCarModel = false;
				this.activeNum = 0;
				this.nowIndex = null;
				this.nowIndex2 = null;
				this.nowIndex3 = null;
				this.chexi = true;
				this.chexing = true;
				this.$emit('update:showCarModel', false);
				this.hzcShow = false;

				this.$emit('sendCarModel', this.carInfo);
			},
			itemCP(item, index) {
				//点击品牌item
				this.showRightCity = false;
				this.hasCX = false;

				this.nowIndex = index;

				this.carModel.carSystem = '';
				this.carModel.model = '';
				this.chexing = true;
				this.carSystemData = [];
				this.modelData = [];
				this.nowIndex2 = null;
				this.nowIndex3 = null;
				this.pinpai = false;

				this.carModel.licensePlate = item.p_pinpai;
				this.chexi = true;
				this.activeNum = 1;
				this.tabChoose = 1

				this.getSeriesCar(item.p_pinpai_id);
			},
			itemCX(item, index) {
				//车系item
				this.showRightCity = false;

				this.nowIndex2 = index;
				this.nowIndex3 = null;
				this.modelData = [];
				this.carModel.model = '';

				this.carModel.carSystem = item.p_chexi;
				this.chexing = true;
				this.activeNum = 2;
				this.chexi = false;
				this.hasCXH = true;
				this.tabChoose = 2
				this.getCarsCar(item.p_chexi_id);
			},
			itemCXL(item, index) {
				//车型item
				this.nowIndex3 = index;
				this.carModel.model = item.p_chexingmingcheng;

				this.carInfo.config_brands_id = item.p_pinpai_id; //品牌id
				this.carInfo.config_brands_name = this.carModel.licensePlate; //品牌名字
				this.carInfo.config_series_id = item.p_chexi_id; //车系id
				this.carInfo.config_series_name = this.carModel.carSystem; //车系名字
				this.carInfo.config_car_id = item.p_chexing_id; //车型id
				this.carInfo.config_car_name = this.carModel.model; //车型名字
				this.carInfo.p_changshangzhidaojia_yuan = item.p_changshangzhidaojia_yuan; //车子价格
			},
			onClickTabsDisble(e) {
				//点击禁用的标签时
				if (e.detail.index == 1) {
					uni.showToast({
						title: '请先选择品牌',
						icon: 'none',
						duration: 2000
					})
				} else if (e.detail.index == 2) {
					uni.showToast({
						title: '请先选择品牌或车系',
						icon: 'none',
						duration: 2000
					})
				}
			},
			onClose() {

				this.carInfo = {};
				this.carModel.licensePlate = '';
				this.carModel.carSystem = '';
				this.carModel.carModel = '';
				this.carSystemData = [];
				this.carSystemData = [];
				this.modelData = [];
				this.activeNum = 0;
				this.nowIndex = null;
				this.nowIndex2 = null;
				this.nowIndex3 = null;
				this.chexi = true;
				this.chexing = true;
				//与.sync配合使用修改组件隐藏
				this.$emit('update:showCarModel', false);
				this.hzcShow = false;
				this.$emit('tellParentChangeModel', this.carInfo);
			},
			async getCarPP() {
				//品牌
				//初始化品牌数据
				this.tabChoose = 0
				this.carModel.licensePlate = ''
				this.carModel.carSystem = ''
				this.carModel.model = ''
				this.carSystemData = []
				this.modelData = []
				this.pinpai = true
				this.chexi = false
				this.chexing = false
				const datas = await lib.request(urls.brandsCar, {}, '', true, true);
				this.licensePlateData = util.sortLetter(datas.data);
			},
			async getSeriesCar(id) {
				//车系
				const datas = await lib.request(urls.seriesCar, {
					p_pinpai_id: id
				}, '', true, true);
				this.carSystemData = datas.data;
				this.hasCX = true;
			},
			async getCarsCar(id) {
				//型号
				const datas = await lib.request(urls.carsCar, {
					p_chexi_id: id
				}, '');
				this.modelData = datas.data;
				this.hasCXH = false;
				this.hasList = this.modelData.length == 0 ? true : false;

			}
		}
	};
</script>

<style scoped>
	* {
		box-sizing: border-box;
	}

	.brand-box {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 199999;
	}

	.cu-dialog {
		width: 100%;
		border-radius: 0;
	}


	.car_wrapper {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
	}

	.comfire_box {
		/* position: absolute;
    top: 0vh;
    left: 0; */
		width: 100%;
		height: 10vh;
		/* z-index: 999; */
	}
	
	.tab_choose {
		color: #F37B1D;
	}
	
	.comfire_text {
		/* position: absolute;
    top: 8vh;
    left: 0; */
		width: 100%;
		height: 5vh;
		line-height: 5vh;
		/* z-index: 999; */
		background: #f1f1f1;
		text-align: center;
		font-size: 30upx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.titles_list {
		text-align: center;
		color: #3277bf;
		font-size: 15px;
		height: 10vh;
		line-height: 10vh;
	}

	.list_box {
		/* position: absolute;
    top:13vh;
    left: 0; */
		width: 100%;
		height: 85vh;
		/* z-index: 999; */
		overflow: hidden;
	}

	.inner_box {
		width: 100%;
		height: 75vh;
		overflow: hidden;
	}

	.box_l {
		height: 100%;
		overflow-y: auto;
	}

	.item_list {
		padding: 15px 10px;
		font-size: 32upx;
		color: #333;
		border-bottom: 1px solid #f1f1f1;
	}

	.is_active {
		color: #3277bf;
	}

	.has_list {
		color: #ccc;
	}

	.pinpai_title {
		padding: 3px 10px;
		background: #f1f1f1;
		font-size: 36upx;
		color: #3277bf;
	}

	.fast_entry {
		width: 65rpx;
		position: absolute;
		top: 15%;
		right: 0;
		/* background: #fff; */
		overflow: hidden;
		z-index: 999;
	}

	.fast_entry_item {
		width: 100%;
		font-size: 14px;
		padding: 4rpx 0;
		text-align: center;
	}

	.car_img {
		width: 50px;
		height: 50px;
		margin-right: 20rpx;
		vertical-align: middle;
	}

	.car_img_chexi {
		width: 120px;
		height: 80px;
		border-radius: 4px;
	}

	.van-popup--safe {
		padding-bottom: 0px !important;
	}
</style>
