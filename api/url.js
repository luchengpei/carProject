//线上测试地址 https://minidev.kudai.co
// #ifdef H5
const BASEURL = "https://minidev.kudai.co/capplet";
// #endif

// #ifdef MP-WEIXIN
// const BASEURL = 'https://minidev.kudai.co/capplet';
// const BASEURL1 = 'http://192.168.0.12:7013/cmobile'
//线上
// const BASEURL = "https://test.kudait.cn/capplet";
// const BASEURL1 = 'https://test.kudait.cn/java2/cmobile'

const BASEURL = "https://minidev.kudai.co/capplet";
const BASEURL1 = 'https://minidev.kudai.co/java2/cmobile'
// const BASEURL1 = 'http://192.168.0.12:7013/cmobile'
// const BASEURL = 'https://loanmini.kudai.co/capplet';
// const BASEURL1 = 'https://loanmini.kudai.co/java2/cmobile'
// #endif

// #ifdef APP-PLUS-NVUE||APP-PLUS
const BASEURL = "https://minidev.kudai.co/capplet";
// #endif

// 微信的jscode换取sessionKey
const wxJsCode2Session = BASEURL + "/mp/session-key";
// const wxJsCode2Session = BASEURL + "/user/wx/code";
// 获取用户信息（微信用户登陆）
const wxLogin = BASEURL + "/mp/wx-login";
// const wxLogin = BASEURL + "/user/login";
//获取服务器令牌
const clientToken = BASEURL + "/client_token";

// ------------车商信息--------

// 车商信息
const enterpriseInfo = BASEURL + "/vehicle/enterprise-info";

// ------------个人中心----------
// 车辆收藏
const carStar = BASEURL + "/vehicle/star";

// 车辆收藏列表
const carStarList = BASEURL + "/vehicle/star-list";

// 删除收藏的车辆
const carDelStar = BASEURL + "/vehicle/del-star";

//---------- 车辆信息-----------

// 车辆列表
const carList = BASEURL + "/vehicle/list";

// 车辆详情
const carDetail = BASEURL + "/vehicle/detail";

// 车辆详细配置
const carConfig = BASEURL + "/vehicle/config";

//品牌列表
const brandsCar = BASEURL + "/vehicle/brands";

//车系列表
const seriesCar = BASEURL + "/vehicle/series";

//车型列表
const carsCar = BASEURL + "/vehicle/cars";

//扫码获取优惠券信息
const registered = BASEURL1 + "/user/registered";

//获取门店信息
const storeInfo = BASEURL1 + "/user/store/info";

//活动信息
const activtyInfo = BASEURL1 + "/user/event-info";

//我的优惠券查询
const myCouponInfo = BASEURL1 + "/user/get-coupon";
//领取优惠券
const receiveCoupon = BASEURL1 + "/user/receive";
//获取活动表单
const formElement = BASEURL1 + "/user/get-formElement";

//提交表单
const submitForm = BASEURL1 + "/user/saveOrUpdate-eventUser";

//获取用户关注最新门店信息
const newStoreInfo = BASEURL1 + "/user/new-storeInfo";

//获取门店车商列表
const getStoreDealerList = BASEURL1 + '/user/get-enterprise-list-by-user-id-v2'
//获取门店优惠券列表
const storeCouponList = BASEURL1 + '/user/enterprise-coupon-info'

//获取门店全部活动列表
const enterpriseList = BASEURL1 + '/user/enterprise-event-info'

//指定车生活
const currentEnterprise = BASEURL1 + '/user/query-storeInfo'

// 首页搜索
const homeLikeCar = BASEURL1 + '/home/home-like-car'

// 首页车辆坐标获取
const homeCar = BASEURL1 + '/home/home-car'
//首页获取车辆详情
const getCarInfo = BASEURL1 + '/home/get-car-basic'

//判断是否绑定门店
const isBandStore = BASEURL1 + '/home/collect-or-not-shop'

//新用户活动详情
const participateEnrollment = BASEURL1 + '/user/participate-enrollment'

//获取活动验证码
const activitySms = BASEURL1 + '/user/activity-sms'

//参与新用户活动(立即领取)
const participateReceive = BASEURL1 + '/user/participate-receive'

//裂变优惠券领取
const getFissionCoupon = BASEURL1 + '/user/get-fission-coupon'

//获取我的活动信息
const enventInfoV3 = BASEURL1 + '/user/event-info-v3'

export default {
	BASEURL,
	wxJsCode2Session,
	wxLogin,
	clientToken,
	enterpriseInfo,
	carList,
	carDetail,
	carConfig,
	carStar,
	carStarList,
	carDelStar,
	brandsCar,
	seriesCar,
	carsCar,
	registered,
	storeInfo,
	activtyInfo,
	myCouponInfo,
	formElement,
	submitForm,
	receiveCoupon,
	newStoreInfo,
	getStoreDealerList,
	storeCouponList,
	enterpriseList,
	currentEnterprise,
	homeLikeCar,
	homeCar,
	getCarInfo,
	isBandStore,
	participateEnrollment,
	activitySms,
	participateReceive,
	getFissionCoupon,
	enventInfoV3
}
