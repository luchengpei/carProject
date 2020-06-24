import {
	helpers
} from 'vuelidate/lib/validators';

// 验证是否是手机号码
const validatePhone = function(number) {
	if (!helpers.req(number)) { //存在才校验
		return true;
	}
	let flag = true
	var myreg = /^[1][0-9]{10}$/;
	if (!myreg.test(number)) {
		flag = false
	}
	return flag
};
// 验证推荐码是否是6位数字
const validateRecommend = function(number) {
	if (!helpers.req(number)) { //存在才校验
		return true;
	}
	let flag = true
	var myreg = /^\d{6}$/;
	if (!myreg.test(number)) {
		flag = false
	}
	return flag
};

//验证身份证是否正确
const validateIDcard = function(str) {
	if (!helpers.req(str)) { //存在才校验
		return true;
	}
	var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	return regIdNo.test(str) ? true : false
};
// 验证座机号码
const validateCheckTel = function(number) {
	if (!helpers.req(number)) { //存在才校验
		return true;
	}
	let flag = true
	var myreg = /(\d{2,5}-\d{7,8}(-\d{1,})?)/;
	if (!myreg.test(number)) {
		flag = false
	}
	return flag
}

// 密码6-18位，带字母和数字
const validatePassword = function(str) {
	return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(str) ? true : false
}

//验证客服电话是否正确
const validatePhoneAndTel = function(number) {
	let flag = false
	if (validatePhone(number) || validateCheckTel(number)) {
		flag = true
	}
	return flag
};

module.exports = {
	validatePhone: validatePhone,
	validateRecommend: validateRecommend,
	validateIDcard: validateIDcard,
	validateCheckTel: validateCheckTel,
	validatePhoneAndTel: validatePhoneAndTel,
	validatePassword: validatePassword
}
