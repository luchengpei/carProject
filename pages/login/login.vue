<template>
	<view class="content">
		<view class="logo">
			<image src="../../static/images/logo.jpg" mode=""></image>
		</view>
		<view class="text-center">
			登陆车与车寻
		</view>
		<view>
			<button class="cu-btn round bg-orange login-btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="wxLogin">微信授权登陆</button>
		</view>
	</view>
</template>

<script>
	import urls from '@/api/url.js';
	import lib from '@/api/lib.js';
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex';

	export default {
		data() {
			return {

			}
		},
		onReady() {
			//微信平台才要判断是否授权过
			//#ifdef MP-WEIXIN
			this.isAuthSetting();
			//#endif
			//#ifndef MP-WEIXIN
			this.$store.dispatch('setFirstLogin', false);
			//#endif
		},
		methods: {
			// async wxLogin() {
			// 	const res = await lib.wxGetUserInfo();
			// 	console.log(res);
			// },
			//获取门店最新信息
			async getStoreInfo(){
				lib.request(urls.newStoreInfo).then(res=>{
					uni.setStorageSync('enterpriseInfo',res.data)
					this.$store.dispatch('setEnterpriseInfo',res.data)
				})
			},
			async goLogin() {

				//小程序登陆
				// #ifdef MP-WEIXIN
				let params = {};
				let wxUserInfo = await lib.wxGetUserInfo();
				params.iv = wxUserInfo.iv;
				params.encryptedData = wxUserInfo.encryptedData;
				// params.sessionKey = uni.getStorageSync('sessionKey')
				let login = await lib.request(urls.wxLogin, params);
				this.$store.dispatch('login', login.data);
			    //await this.getStoreInfo()
				uni.navigateBack({
					delta: 1,
					success(){
						console.log('success')
					},
					fail(err){
						console.log(err,'err')
					}
				})
				// #endif					
			},

			// #ifdef MP-WEIXIN
			isAuthSetting() {
				//是否授权获取用户信息
				let that = this;
				wx.getSetting({
					success: res => {
						if (res.authSetting['scope.userInfo']) {
							//true代表授权过    false代表未授权过
							that.$store.dispatch('setFirstLogin', false);
						} else {
							that.$store.dispatch('setFirstLogin', true);
						}
					}
				});
			},
			wxLogin(e) {
				//微信授权
				let userinfo = e.mp.detail.userInfo;

				let that = this;
				if (e.mp.detail.userInfo) {
					//用户按了允许授权按钮
					uni.showToast({
						title: '授权成功',
						duration: 1000
					});
					that.$store.dispatch('setFirstLogin', false); //用户允许授权成功，则隐藏授权按钮
					that.goLogin();
				} else {
					//用户按了拒绝授权的按钮
					uni.navigateTo({
						url:'/pages/index/index'
					})
				}
			},
			// #endif
		},
	}
</script>

<style scoped>
	.logo {
		width: 200rpx;
		height: 200rpx;
		margin: 80rpx auto 0 auto;
	}

	.logo image {
		width: 100%;
		height: 100%;
	}

	.content {
		padding: 40rpx;
		width: 750rpx;
	}

	.login-btn {
		width: 100%;
		margin-top: 80rpx;
	}
</style>
