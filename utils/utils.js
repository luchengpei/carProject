// import api from '@/api/api';
// import wxRequest from '@/utils/wxRequest';

/**
 * WGS84转GCj02
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function wgs84togcj02tobd09(lng, lat) {
	const xPI = (3.14159265358979324 * 3000.0) / 180.0;
	const PI = 3.1415926535897932384626;
	const a = 6378245.0;
	const ee = 0.00669342162296594323;
	// WGS84转GCj02
	let dlat = transformlat(lng - 105.0, lat - 35.0);
	let dlng = transformlng(lng - 105.0, lat - 35.0);
	let radlat = (lat / 180.0) * PI;
	let magic = Math.sin(radlat);
	magic = 1 - ee * magic * magic;
	let sqrtmagic = Math.sqrt(magic);
	dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
	dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
	let mglat = lat + dlat;
	let mglng = lng + dlng;
	// 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
	let z =
		Math.sqrt(mglng * mglng + mglat * mglat) + 0.00002 * Math.sin(mglat * xPI);
	let theta = Math.atan2(mglat, mglng) + 0.000003 * Math.cos(mglng * xPI);
	let bdlng = z * Math.cos(theta) + 0.0065;
	let bdlat = z * Math.sin(theta) + 0.006;
	// return [bdlng, bdlat]
	return {
		lng: bdlng,
		lat: bdlat,
	};
}

function transformlat(lng, lat) {
	const PI = 3.1415926535897932384626;
	let ret = -100.0 +
		2.0 * lng +
		3.0 * lat +
		0.2 * lat * lat +
		0.1 * lng * lat +
		0.2 * Math.sqrt(Math.abs(lng));
	ret +=
		((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
			2.0) /
		3.0;
	ret +=
		((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
		3.0;
	ret +=
		((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) *
			2.0) /
		3.0;
	return ret;
}

function transformlng(lng, lat) {
	const PI = 3.1415926535897932384626;
	let ret =
		300.0 +
		lng +
		2.0 * lat +
		0.1 * lng * lng +
		0.1 * lng * lat +
		0.1 * Math.sqrt(Math.abs(lng));
	ret +=
		((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
			2.0) /
		3.0;
	ret +=
		((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
		3.0;
	ret +=
		((150.0 * Math.sin((lng / 12.0) * PI) +
				300.0 * Math.sin((lng / 30.0) * PI)) *
			2.0) /
		3.0;
	return ret;
}

/**
 * 百度地图---->腾讯地图
 * @param double lat 纬度
 * @param double lng 经度
 * @return array();
 */
function bMapTransWXMap(lng, lat) {
	let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
	let x = lng - 0.0065;
	let y = lat - 0.006;
	let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
	let lngs = z * Math.cos(theta);
	let lats = z * Math.sin(theta);

	return {
		lng: lngs,
		lat: lats,
	};
}

// 将图片的http替换成https并且压缩,type=1是海报，type=2是列表
function getHttps(str, type) {
	str = str.replace("http://", "https://");
	switch (type) {
		case 1:
			str = str + "?x-oss-process=style/cycxhaibao";
			break;
		case 2:
			str = str + "?x-oss-process=style/cycxlb";
			break;
	}
	return str;
}

// 格式化小数点后2位
function toDecimal(x) {
	var f = parseFloat(x);
	if (isNaN(f)) {
		return false;
	}
	var f = Math.round(x * 100) / 100;
	var s = f.toString();
	var rs = s.indexOf(".");
	if (rs < 0) {
		rs = s.length;
		s += ".";
	}
	while (s.length <= rs + 2) {
		s += "0";
	}
	return s;
}

// 单位元换成单位万元,并且保留小数点后2位
function toWan(num) {
	num = (num * 100) / 1000000;
	return this.toDecimal(num);
}

// 解码---二维码的参数需要解码
function getScene(scene = "") {
	//scene长度有限制，都缩写了，这里做个映射
	const mapping = {
		a: "id",
		b: "enterprise_id",
		c: "code",
	};
	if (scene == "") return {};
	let res = {};
	let params = decodeURIComponent(scene).split("&");
	params.forEach((item) => {
		let pram = item.split("=");
		if (mapping[pram[0]] != undefined) {
			res[mapping[pram[0]]] = pram[1];
		}
	});
	return res;
}
//types : year  month  day   all
function timestampToTimeType(timestamp, types) {
	var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear();
	var M =
		date.getMonth() + 1 < 10 ?
		"0" + (date.getMonth() + 1) :
		date.getMonth() + 1;
	var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
	var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
	var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
	switch (types) {
		case "year":
			return Y;
			break;
		case "month":
			return Y + "-" + M;
			breal;
		case "day":
			return Y + "-" + M + "-" + D;
			break;
		case "all":
			return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
			break;
		default:
			return Y + "-" + M + "-" + D;
			break;
	}
}

function sortLetter(arrs) {
	//字母排序
	let newArr = [];
	let letters = [
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"W",
		"X",
		"Y",
		"Z",
	];
	for (let j = 0; j < letters.length; j++) {
		let objs = {};
		objs.letter = letters[j];
		objs.list = [];
		for (let i = 0; i < arrs.length; i++) {
			if (letters[j] == arrs[i].p_shouzimu) {
				objs.list.push(arrs[i]);
			}
		}
		newArr.push(objs);
	}
	return newArr;
}

function showToast(texts) {
	uni.showToast({
		title: texts,
		icon: "none",
		duration: 1000,
	});
}

/**
 * time 前端时间戳
 * fmt yyyy-MM-dd hh
 * */
function timeFormat(time, fmt) {
	let o = {
		"M+": time.getMonth() + 1, //月份
		"d+": time.getDate(), //日
		"h+": time.getHours(), //小时
		"m+": time.getMinutes(), //分
		"s+": time.getSeconds(), //秒
		"q+": Math.floor((time.getMonth() + 3) / 3), //季度
		S: time.getMilliseconds(), //毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(
			RegExp.$1,
			(time.getFullYear() + "").substr(4 - RegExp.$1.length)
		);
	for (let k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
			);
	return fmt;
}
//数组对象深克隆
function deepCopy(obj) {
	let result = Array.isArray(obj) ? [] : {};
	if (obj && typeof obj === 'object') {
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (obj[key] && typeof obj[key] === 'object') {
					result[key] = deepCopy(obj[key]);
				} else {
					result[key] = obj[key];
				}
			}
		}
	}
	return result;
}

module.exports = {
	getHttps,
	toDecimal,
	toWan,
	getScene,
	timestampToTimeType,
	sortLetter,
	bMapTransWXMap,
	wgs84togcj02tobd09,
	timeFormat,
	deepCopy,
};
