import urls from "./url.js";
import store from "../store/index.js";
import OOS from "ali-oss";

module.exports = {
  // #ifdef MP-WEIXIN
  /**
   * 获取微信sessionid
   * @param {Object} data
   */
  async wxJsCode2Session(params) {
    const data = await this.request(urls.wxJsCode2Session, params);
    return data;
  },
  /**
   * 获取微信用户信息
   */
  async wxGetUserInfo() {
    //登陆前才进行微信登陆 防止微信登陆状态过期
    await this.getSessingKeyAndCode();
    return await new Promise((resolve, reject) => {
      uni.getUserInfo({
        provider: "weixin",
        success: (infoRes) => {
          resolve(infoRes);
        },
        fail: (err) => {
          console.error("微信获取用户信息失败" + JSON.stringify(err));
          uni.showToast({
            title: "获取微信用户信息失败",
            icon: "warn",
            image: "/static/images/error.png",
            duration: 1000,
          });
          reject(e);
        },
      });
    });
  },
  /**
   * 判断微信登陆是否过期
   */
  async wxCheckSession() {
    return await new Promise((resolve, reject) => {
      wx.checkSession({
        success() {
          resolve(true);
        },
        fail() {},
      });
    });
  },
  /**
   * 小程序登陆信息
   */
  async getSessingKeyAndCode(params = {}) {
    return await new Promise((resolve, reject) => {
      uni.login({
        provider: "weixin",
        success: async (res) => {
          if (res.errMsg == "login:ok") {
            params.code = res.code;
           const key = await this.wxJsCode2Session(params);
            store.dispatch("setWxLogin", {
              isWxLogin: true,
              sessionKey: key.data.key,
              miniUser: key.data.wxUser
            });
            //TODO   用户默认店铺逻辑跳转
            // 如果直接进入小程序,需要判断场景值,有门店进门店页,没有则报错
            // 如果通过分享页进入,直接进入车辆详情页
          }
          resolve(true);
        },
        fail: (err) => {
          console.error("获取微信端code失败：" + JSON.stringify(err));
          uni.showToast({
            title: "获取微信端code失败",
            icon: "warn",
            image: "/static/images/error.png",
            duration: 1000,
          });
          reject(e);
        },
      });
    });
  },
  // #endif
  /**
   * 账号密码登陆
   * @param {Object} params
   */
  async pwdLogin(params) {
    const ret = await this.request(urls.passwordLogin, params);
    store.dispatch("login", ret.data);
  },

  /**
   * 加密公钥
   */
  async salt() {
    const ret = await this.request(urls.salt);
    return ret;
  },

  /**
   * 获取手机验证码
   * @param {Object} params
   */
  async getSms(params) {
    const ret = await this.request(urls.getSms, params);
    return ret;
  },

  /**
   * 验证码登录
   * @param {Object} params
   */
  async smsLogin(params) {
    const ret = await this.request(urls.smsLogin, params);
    store.dispatch("login", ret.data);
  },
  /**
   * 获取车城
   * @param {Object} params
   */
  async getCarShop(params) {
    const ret = await this.request(urls.getCarShop, params);
    return ret;
  },
  /**
   * 注册车商
   * @param {Object} params
   */
  async goRegist(params) {
    const ret = await this.request(urls.goRegist, params);
    return ret;
  },

  /**
   * 找回密码
   * @param {Object} params
   */
  async findPassword(params) {
    const ret = await this.request(urls.findPassword, params);
    return ret;
  },

  /**
   * 退出登录
   */
  async logout() {
    store.dispatch("logout");
    const ret = await this.request(urls.logout);
    return ret;
  },

  async getAreaList(params) {
    const ret = await this.request(urls.getAreaList, params);
    const newSortData = {
      provinceList: [],
      cityList: [],
      countyList: [],
    };
    const areaInfo = [];
    for (var i = 0; i < ret.data.length; i++) {
      if (ret.data[i].level == 1) {
        newSortData.provinceList.push(ret.data[i]);
      } else if (ret.data[i].level == 2) {
        newSortData.cityList.push(ret.data[i]);
      } else if (ret.data[i].level == 3) {
        newSortData.countyList.push(ret.data[i]);
      }
    }

    for (var i = 0; i < newSortData.provinceList.length; i++) {
      const provinceData = {
        label: newSortData.provinceList[i]["name"],
        value: newSortData.provinceList[i]["code"],
        children: [],
      };
      for (var j = 0; j < newSortData.cityList.length; j++) {
        if (
          newSortData.cityList[j]["province_code"] ==
          newSortData.provinceList[i]["code"]
        ) {
          const cityData = {
            label: newSortData.cityList[j]["name"],
            value: newSortData.cityList[j]["code"],
            children: [],
          };
          for (var k = 0; k < newSortData.countyList.length; k++) {
            if (
              newSortData.countyList[k]["city_code"] ==
              newSortData.cityList[j]["code"]
            ) {
              const countyData = {
                label: newSortData.countyList[k]["name"],
                value: newSortData.countyList[k]["code"],
              };
              cityData.children.push(countyData);
            }
          }
          if (cityData.children.length == 0) {
            delete cityData.children;
          }
          provinceData.children.push(cityData);
        }
      }
      areaInfo.push(provinceData);
    }
    return areaInfo;
  },
  /**
   * 身份证,营业执照信息识别,驾驶证识别,行驶证识别
   * @param {Object} url
   * @param {Object} field
   * @param {Object} msg
   */
  async identificationIdCard(url, field, msg) {
    uni.showLoading({
      title: "识别中...",
    });
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        //信息识别
        url: url,
        filePath: field,
        name: "file",
        header: {
          "session-key": store.state.sessionKey,
          "user-token": store.state.userToken,
          "app-token": store.state.userToken,
          "a-version": "1.0",
          "i-version": "1.0",
        },
        success(res) {
          const datas = JSON.parse(res.data);
          if (datas.errcode == 403 || datas.errcode == 402) {
            uni.showToast({
              title: "登录过期",
              icon: "warn",
              image: "/static/images/error.png",
              duration: 800,
            });
            store.dispatch("logout");
            setTimeout(() => {
              wx.reLaunch({
                url: "/pages/login/pwdLogin/pwdLogin",
              });
            }, 800);
            // util.goLogin()
          } else if (
            datas.errcode == "102101003" ||
            datas.errcode == "102101001" ||
            datas.errcode == "102101002"
          ) {
            uni.showToast({
              title: msg,
              icon: "none",
              duration: 1000,
            });
            return reject("图片识别出错");
          } else if (datas.errcode == 200) {
            resolve(datas);
          } else {
            uni.showToast({
              title: datas.errmsg,
              icon: "none",
              duration: 1000,
            });
            return reject("图片识别出错");
          }
        },
        fail: (err) => {
          console.log(err, "身份证，驾驶证，营业执照，营业执照---失败");
          return reject("图片识别出错");
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    });
  },
  /**
   * 单张，多张选择图片
   * @param {Object} num
   */
  async uploadImgLeaflet(num) {
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count: num,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          // console.log(res)
          // if(res.tempFiles[0].size > 600000){
          // uni.showToast({
          //     title: '图片不能大于6M',
          //     icon: 'none',
          //     duration: 1000
          // })
          // }else{
          resolve(res.tempFilePaths[0]);
          // }
        },
        fail: (err) => {
          return reject("上传图片并且压缩-失败");
        },
      });
    });
  },
  /**
   * 选择并压缩图片
   * @param {Object} num
   */
  async uploadImgLeafletCompress(num, compress = true) {
    return await new Promise((resolve, reject) => {
      uni.chooseImage({
        count: num,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          let oldUrl = res.tempFilePaths[0];
          // #ifdef MP-WEIXIN
          //微信的压缩下
          if (compress) {
            // wx.compressImage({
            // 	src: oldUrl,
            // 	quality: 20, //0:2的压缩比比例
            // 	success: (result) => {
            // 		resolve(result.tempFilePath) //url
            // 	},
            // 	fail: (error) => {
            // 		uni.showToast({
            // 			title: error.errMsg,
            // 			icon: 'none',
            // 			duration: 1000
            // 		})
            // 		return reject('图片处理出错');
            // 	}
            // });
            resolve(oldUrl);
          } else {
            resolve(oldUrl);
          }
          // #endif
          // #ifndef MP-WEIXIN
          resolve(oldUrl);
          // #endif
        },
        fail: (err) => {
          return reject("上传图片并且压缩-失败");
        },
      });
    });
  },
  /**
   * 公共图片上传
   * @param {Object} url
   * @param {Object} field
   */
  async publicImgUpload(url, field) {
    uni.showLoading({
      title: "上传中...",
    });
    return await new Promise((resolve, reject) => {
      uni.uploadFile({
        //信息识别
        url: url,
        filePath: field,
        name: "file",
        header: {
          "session-key": store.state.sessionKey,
          "user-token": store.state.userToken,
          "app-token": store.state.userToken,
          "a-version": "1.0",
          "i-version": "1.0",
        },
        success: async (res) => {
          const datas = JSON.parse(res.data);
          if (datas.errcode == 200) {
            resolve(datas);
          } else if (
            datas.errcode == 403 ||
            datas.errcode == 402 ||
            datas.errcode == 401
          ) {
            uni.showToast({
              title: "登录过期",
              icon: "warn",
              image: "/static/images/error.png",
              duration: 800,
            });
            setTimeout(() => {
              uni.reLaunch({
                url: "/pages/login/pwdLogin/pwdLogin",
              });
            }, 800);
            store.dispatch("logout");
            return reject("登录过期");
          } else {
            uni.showToast({
              title: datas.errmsg,
              icon: "none",
              duration: 1000,
            });
            return reject("上传出错");
          }
        },
        fail: (err) => {
          console.log(err, "公共图片上传(加密)---失败fail");
          return reject("上传出错");
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    });
  },

  async aliyunOOS(imgUrl) {
    //使用阿里云加密图片url
    return new Promise((resolve, reject) => {
      if (!imgUrl) {
        return resolve(imgUrl);
      }
      try {
        let client = new OOS({
          region: store.state.aliOssToken.region,
          accessKeyId: store.state.aliOssToken.accessKeyId,
          accessKeySecret: store.state.aliOssToken.accessKeySecret,
          stsToken: store.state.aliOssToken.stsToken,
          bucket: store.state.aliOssToken.bucket,
        });
        const aliUrls = client.signatureUrl(imgUrl);
        resolve(aliUrls);
      } catch (e) {
        console.log(urls.clientToken);
        this.request(urls.clientToken, {}, "").then((result) => {
          if (result.errcode == 200) {
            store.dispatch("setAliOss", {
              region: result.data.region,
              accessKeyId: result.data.accessKeyId,
              accessKeySecret: result.data.accessKeySecret,
              stsToken: result.data.stsToken,
              bucket: result.data.bucket,
            });
            let client = new OOS({
              region: result.data.region,
              accessKeyId: result.data.accessKeyId,
              accessKeySecret: result.data.accessKeySecret,
              stsToken: result.data.stsToken,
              bucket: result.data.bucket,
            });
            const aliUrls = client.signatureUrl(imgUrl);
            resolve(aliUrls);
          } else {
            console.log(result, "阿里云加密图片url--失败");
            uni.showToast({
              title: "服务端错误，请稍后再试",
              icon: "none",
              duration: 1000,
            });
            reject("服务端错误，请稍后再试");
          }
        });
      }
    });
  },
  /**
   * 通用请求接口
   * @param {string} url
   * @param {Object} data
   * @param {string} title 请求loding时展示的提示语
   * @param {boolean} showToast 出错时是否显示提示
   * @param {boolean} loading 是否显示加载状态
   */
  async request(url, data, title = "", showToast = true, loading = false) {
    return await new Promise((resolve, reject) => {
      if (loading) {
        uni.showLoading({
          title: title,
          mask: false,
        });
      }
      uni.request({
        url: url,
        method: "POST",
        data: data,
        header: {
          "Content-Type": "application/json",
          "session-key": store.state.sessionKey,
          "user-token": store.state.userToken,
          "app-token": store.state.userToken,
          "a-version": "1.0",
          "i-version": "1.0",
        },
        success: async (res) => {
          // #ifdef MP-WEIXIN
          if (res.data.errcode == 401) {
            //小程序登陆过期重新登陆
			wx.checkSession({
			  success () {
			    //session_key 未过期，并且在本生命周期一直有效
			  },
			  fail: async()=> {
				  // session_key 已经失效，需要重新执行登录流程
			      await this.getSessingKeyAndCode();
			  }
			})
			
            if (loading) {
              uni.hideLoading();
            }
			uni.navigateTo({
			  url: "/pages/login/login",
			});
            // uni.showToast({
            //   title: "登录过期",
            //   icon: "warn",
            //   image: "/static/images/error.png",
            //   duration: 2000,
            // });
            // setTimeout(() => {
            //   //关闭所有页面，打开到应用内的某个页面。
            //   uni.navigateTo({
            //     url: "/pages/login/login",
            //   });
            // }, 2000);
            store.dispatch("logout");
            return reject("登录过期");
          }
          // #endif
          if (res.data.errcode == 402 || res.data.errcode == 403) {
            //登陆过期跳转登陆页
            if (loading) {
              uni.hideLoading();
            }
            uni.showToast({
              title: "登录过期",
              icon: "warn",
              image: "/static/images/error.png",
              duration: 2000,
            });

            setTimeout(() => {
              //关闭所有页面，打开到应用内的某个页面。
              uni.navigateTo({
                url: "/pages/login/login",
              });
            }, 2000);
            store.dispatch("logout");
            return reject("登录过期");
          } else if (res.data.errcode == 200) {
            //正常返回对应信息
            if (loading) {
              uni.hideLoading();
            }
            resolve(res.data);
          } else {
            //错误，给出后台错误信息
            if (loading) {
              uni.hideLoading();
            }
            uni.showToast({
              title: res.data.errmsg,
              icon: "none",
              duration: 2000,
            });
            reject("网络异常,请重试");
          }
          return;
        },
        fail: (err) => {
          if (loading) {
            uni.hideLoading();
          }
          uni.showToast({
            title: "网络异常",
            icon: "warn",
            image: "/static/images/error.png",
            duration: 2000,
          });
          return reject(err);
        },
      });
    });
  },
};
