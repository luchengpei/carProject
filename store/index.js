import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		//小程序相关
		sessionKey: uni.getStorageSync('sessionKey'),
		avatarUrl: uni.getStorageSync('avatarUrl'),
		isFirstLogin: uni.getStorageSync('isFirstLogin'), //判断是否需要用户授权
		isWxLogin: uni.getStorageSync('isWxLogin'), //判断是否要获取sessionkey
		//通用字段
		userToken: uni.getStorageSync('userToken'),
		hasLogin: uni.getStorageSync('hasLogin'),
		userInfo: uni.getStorageSync('userInfo'),
		aliOssToken: {
			region: "",
			accessKeyId: "",
			accessKeySecret: "",
			stsToken: "",
			bucket: ""
		},
		enterpriseInfo:uni.getStorageSync('enterpriseInfo')
	},
	mutations: {
		setEnterpriseInfo(state,data){
			state.enterpriseInfo = data
			uni.setStorageSync('enterpriseInfo',data)
		},
		setWxLogin(state, data) {
			state.userInfo = data.miniUser; //todo
			state.isWxLogin = data.isWxLogin;
			state.sessionKey = data.sessionKey;
			uni.setStorageSync('isWxLogin', data.isWxLogin);
			uni.setStorageSync('sessionKey', data.sessionKey);
			uni.setStorageSync('userInfo', data.miniUser);
		},
		login(state, data) {
			state.userInfo = data.miniUser;
			state.hasLogin = true;
			state.userToken = data.userToken
			uni.setStorageSync('userToken', data.userToken);
			uni.setStorageSync('userInfo', data.miniUser);
		},
		logout(state) {
			state.userInfo = {};
			state.hasLogin = false;
			uni.setStorageSync('userToken', "");
			uni.setStorageSync('userInfo', {});
		},
		setFirstLogin(state, data) {
			state.isFirstLogin = data;
		},
		setAliOss(state, data) {
			state.aliOssToken = {
				region: data.region,
				accessKeyId: data.accessKeyId,
				accessKeySecret: data.accessKeySecret,
				stsToken: data.stsToken,
				bucket: data.bucket
			};
		},
	},
	actions: {
		setEnterpriseInfo({commit},data){
			commit('setEnterpriseInfo',data)
		},
		setFirstLogin(context, data) {
			context.commit('setFirstLogin', data);
		},
		setWxLogin(context, data) {
			context.commit('setWxLogin', data);
		},
		login(context, data) {
			context.commit('login', data);
		},
		setAliOss(context, data) {
			context.commit('setAliOss', data);
		},
		logout(context) {
			context.commit('logout');
		}
	}
})

export default store
