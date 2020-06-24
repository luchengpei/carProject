<template>
	<view class="detailed-box">
		<!-- <cu-custom bgColor="bg-white" :isBack="true">
			<block slot="content">车辆配置</block>
		</cu-custom> -->
		<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
			<view @click="goAnchor($event,'#level-'+index)" class="cu-item" :class="index==TabCur?'text-orange':''" v-for="(item,index) in items"
			 :key="index" :data-id="index">
				{{item.title}}
			</view>
		</scroll-view>
		<view class="solid-top">
			<view class="solid-box" id="level-0">
				<view class="basic-tittle" :class="0==TabCur?'text-orange':''">
					基本参数
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">厂商</view>
					<view class="contBox-right">{{dataList.p_changshang}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">级别</view>
					<view class="contBox-right">{{dataList.p_jibie}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">发动机</view>
					<view class="contBox-right">{{dataList.p_fadongji}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">变速箱</view>
					<view class="contBox-right">{{dataList.p_biansuxiang}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">车身结构</view>
					<view class="contBox-right">{{dataList.p_cheshenjiegou}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">长*宽*高(mm)</view>
					<view class="contBox-right">{{dataList.p_zhang_kuan_gao_mm}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">轴距(mm)</view>
					<view class="contBox-right">{{dataList.p_zhouju_mm}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">行李厢容积(L)</view>
					<view class="contBox-right">{{dataList.p_xinglixiangrongji_l}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">整备质量(kg)</view>
					<view class="contBox-right">{{dataList.p_zhengbeizhiliang_kg}}</view>
				</view>
			</view>
			<view class="solid-box" id="level-1">
				<view class="basic-tittle" :class="1==TabCur?'text-orange':''">
					发动机参数
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">排量(mL)</view>
					<view class="contBox-right">{{dataList.p_pailiang_ml}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">进气形式</view>
					<view class="contBox-right">{{dataList.p_jinqixingshi}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">气缸排列形式</view>
					<view class="contBox-right">{{dataList.p_qigangpailiexingshi}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">最大马力(Ps)</view>
					<view class="contBox-right">{{dataList.p_zuidamali_ps}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">最大扭矩(N·m)</view>
					<view class="contBox-right">{{dataList.p_zuidaniuju_n_m}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">燃料形式</view>
					<view class="contBox-right">{{dataList.p_ranliaoxingshi}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">燃油标号</view>
					<view class="contBox-right">{{dataList.p_ranyoubiaohao}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">供油方式</view>
					<view class="contBox-right">{{dataList.p_gongyoufangshi}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">环保标准</view>
					<view class="contBox-right">{{dataList.p_huanbaobiaozhun}}</view>
				</view>
			</view>
			<view class="solid-box" id="level-2">
				<view class="basic-tittle" :class="2==TabCur?'text-orange':''">
					底盘及制动
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">驱动方式</view>
					<view class="contBox-right">{{dataList.p_qudongfangshi}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">助力类型</view>
					<view class="contBox-right">{{dataList.p_zhulileixing}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">前悬架类型</view>
					<view class="contBox-right">{{dataList.p_qianxuanjialeixing}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">后悬架类型</view>
					<view class="contBox-right">{{dataList.p_houxuanjialeixing}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">前制动器类型</view>
					<view class="contBox-right">{{dataList.p_qianzhidongqileixing}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">后制动器类型</view>
					<view class="contBox-right">{{dataList.p_houzhidongqileixing}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">驻车制动类型</view>
					<view class="contBox-right">{{dataList.p_zhuchezhidongleixing}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">前轮胎规格</view>
					<view class="contBox-right">{{dataList.p_qianluntaiguige}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">后轮胎规格</view>
					<view class="contBox-right">{{dataList.p_houluntaiguige}}</view>
				</view>
			</view>
			<view class="solid-box" id="level-3">
				<view class="basic-tittle" :class="3==TabCur?'text-orange':''">
					安全配置
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">主/副驾驶座安全气囊</view>
					<view class="contBox-right">{{dataList.p_zhu_fujiashizuoanquanqinang}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">前/后排侧气囊</view>
					<view class="contBox-right">{{dataList.p_qian_houpaiceqinang}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">前/后排头部气囊(气帘)</view>
					<view class="contBox-right">{{dataList.p_qian_houpaitoubuqinang_qilian}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">胎压监测装置</view>
					<view class="contBox-right">{{dataList.p_taiyajiancezhuangzhi}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">ISOFIX儿童座椅接口</view>
					<view class="contBox-right">{{dataList.p_isofixertongzuoyijiekou}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">ABS防抱死</view>
					<view class="contBox-right">{{dataList.p_absfangbaosi}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">无钥匙启动系统</view>
					<view class="contBox-right">{{dataList.p_wuyaoshiqidongxitong}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">车内中控锁</view>
					<view class="contBox-right">{{dataList.p_cheneizhongkongsuo}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">车身稳定控制(ESC/ESP/DSC等)</view>
					<view class="contBox-right">{{dataList.p_cheshenwendingkongzhi_esc_esp_dscdeng}}</view>
				</view>
			</view>
			<view class="solid-box" id="level-4">
				<view class="basic-tittle" :class="4==TabCur?'text-orange':''">
					外部配置
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">电动天窗</view>
					<view class="contBox-right">{{dataList.p_diandongtianchuang}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">全景天窗</view>
					<view class="contBox-right">{{dataList.p_quanjingtianchuang}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">电动吸合门</view>
					<view class="contBox-right">{{dataList.p_diandongxihemen}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">感应后备厢</view>
					<view class="contBox-right">{{dataList.p_ganyinghoubeixiang}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">后雨刷</view>
					<view class="contBox-right">{{dataList.p_houyushua}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">感应雨刷</view>
					<view class="contBox-right">{{dataList.p_ganyingyushua}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">前/后电动车窗</view>
					<view class="contBox-right">{{dataList.p_qian_houdiandongchechuang}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">后视镜电动调节</view>
					<view class="contBox-right">{{dataList.p_houshijingdiandongtiaojie}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">后视镜加热</view>
					<view class="contBox-right">{{dataList.p_houshijingjiare}}</view>
				</view>
			</view>
			<view class="solid-box" id="level-5">
				<view class="basic-tittle" :class="5==TabCur?'text-orange':''">
					内部配置
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">多功能方向盘</view>
					<view class="contBox-right">{{dataList.p_duogongnengfangxiangpan}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">定速巡航</view>
					<view class="contBox-right">{{dataList.p_dingsuxunhang}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">后排独立空调</view>
					<view class="contBox-right">{{dataList.p_houpaidulikongtiao}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">GPS导航系统</view>
					<view class="contBox-right">{{dataList.p_gpsdaohangxitong}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">前/后驻车雷达</view>
					<view class="contBox-right">{{dataList.p_qian_houzhucheleida}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">倒车视频影像</view>
					<view class="contBox-right">{{dataList.p_daocheshipinyingxiang}}</view>
				</view>
				<view class="basic-contBox">
					<view class="contBox-left">前/后排座椅加热</view>
					<view class="contBox-right">{{dataList.p_qian_houpaizuoyijiare}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import urls from '@/api/url.js';
	import lib from '@/api/lib.js';

	export default {
		data() {
			return {
				TabCur: 0,
				scrollLeft: 0,
				detailQuery: {
					id: undefined,
					enterprise_id: undefined //车商Id
				},
				//判断小程序与H5
				weixinOr: false,
				dataList: {},
				items: [{
						title: "基本参数"
					},
					{
						title: "发动机参数"
					},
					{
						title: "底盘及制动"
					},
					{
						title: "安全配置"
					},
					{
						title: "外部配置"
					},
					{
						title: "内部配置"
					}
				],

			};
		},
		// #ifdef MP-WEIXIN
		async onLoad(options) {
			//获取传过来的参数id
			this.weixinOr = true
			this.detailQuery.id = parseInt(options.id);
			this.detailQuery.enterprise_id = parseInt(options.enterprise_id);
			await this.getList()
		},
		// #endif

		// #ifdef H5
		async onShow() {
			this.detailQuery.id = this.$route.query.id;
			this.detailQuery.enterprise_id = this.$route.query.enterprise_id
			await this.getList()
		},
		// #endif
		methods: {
			goAnchor(e, selector) {
				if (this.weixinOr) {
					this.TabCur = e.currentTarget.dataset.id;
					this.scrollLeft = e.currentTarget.dataset.id * 90;
					let query = wx.createSelectorQuery()//获取点击盒子高度
					query.select('#level-4').boundingClientRect((rect) => {
						wx.pageScrollTo({
							scrollTop: this.TabCur * (rect.height + 10),
							duration: 500,
						})
					}).exec()
					
				} else {
					this.TabCur = e.currentTarget.dataset.id;
					this.scrollLeft = e.currentTarget.dataset.id * 90;
					var anchor = this.$el.querySelector(selector)
					document.documentElement.scrollTop = anchor.offsetTop
				}
			},
			async getList() {
				const res = await lib.request(urls.carConfig, {
					config_car_id: this.detailQuery.id
				}, "", true, true);
				this.dataList = res.data
				let pailiang = this.dataList.p_pailiang_ml
				this.dataList.p_pailiang_ml = Math.ceil(pailiang).toFixed(1)
			}
		}
	}
</script>

<style>
	.item {
		width: 100%;
		height: 200px;
		line-height: 200px;
		text-align: center;
	}

	.nav {
		position: fixed;
		top: 0rpx;
		z-index: 999;
	}

	.solid-top {
		margin-top: 80rpx;
	}

	.detailed-box {
		width: 750rpx;
	}

	.basic-tittle {
		text-align: center;
		font-size: 32rpx;
		padding: 20rpx;
	}

	.solid-box {
		margin-bottom: 20rpx;
	}

	.basic-contBox {
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		border-bottom: 1px solid #ccc;
	}
</style>
