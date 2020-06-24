<script>
	import lib from 'api/lib.js';
	import Vue from 'vue'
	import util from 'utils/utils.js'

	export default {
		onLaunch: async function(data) {
			// #ifdef MP-WEIXIN
			//微信强制升级

			if (wx.canIUse('getUpdateManager')) {
				const updateManager = wx.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function() {
							wx.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: function(res) {
									if (res.confirm) {
										// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate();
									}
								}
							});
						});
						updateManager.onUpdateFailed(function() {
							// 新的版本下载失败
							wx.showModal({
								title: '升级失败',
								content: '新版本下载失败，请您删除当前小程序，重新搜索打开'
							});
						});
					}
				});
			} else {
				// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
				wx.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				});
			};
			console.log(data);

			let params = {}
			if (data.query.scene) {
				const code = util.getScene(data.query.scene);
				if (code.enterprise_id) {
					params.enterprise_id = code.enterprise_id
				}
			}else if(uni.getStorageSync('enterpriseId')){
				params.enterprise_id = uni.getStorageSync('enterpriseId')
			}
			await lib.getSessingKeyAndCode(params);

			// #endif
			console.log('App Launch');
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import './iconfont/iconfont.css';

	/*每个页面公共css */
	/* uni-app默认全局使用flex布局。因为flex布局有利于跨更多平台，尤其是采用原生渲染的平台。如不了解flex布局，请参考http://www.w3.org/TR/css3-flexbox/。如不使用flex布局，请删除或注释掉本行。*/
	body,
	page {
		width: 100%;
		min-height: 100%;
		display: flex;
		background-color: #ffffff;
	}
</style>
