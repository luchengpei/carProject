<template>
  <view class="receive">
	<div class="conponContent">
		<div  class="conponContentItem" @tap="receive">
			<!-- 1进行中 2未开始  可领取-->
			<image v-if="(infoData.status == 1 || infoData.status == 2)&&!isReceive" src="../../static/images/conponReceive.jpg" mode=""></image>
			<image v-if="(infoData.status == 3||isReceive)" src="../../static/images/conponReceived.jpg" mode=""></image>
			<div class="contentDesc">
				<div class="itemLeft">
					<text>¥</text>
					<view>{{ infoData.money }}</view>
				</div>
				<div class="itemRight">
					<view>{{ infoData.couponName }}</view>
					<view>{{ infoData.eventCreated }} ~ {{ infoData.eventEnd }}</view>
				</div>
			</div>
			<div class="limit">*仅限{{ infoData.enterpriseName }}使用</div>
		</div>
	</div>
    </view>
  </view>
</template>

<script>
import urls from "../../api/url.js";
import lib from "api/lib.js";
import utils from "../../utils/utils.js";
export default {
  data() {
    return {
      modalName: "",
      infoData: {
        enterpriseName: "",
        money: "",
        eventCreated: "",
        eventEnd: "",
        couponName: "",
      },
      isReceive: false,
      codeInfo: {},
    };
  },
  async onLoad(ops) {
	if(ops.scene){
		let scene = utils.getScene(ops.scene)
		this.codeInfo = {
			enterpriseId:scene.enterprise_id,
			couponId:scene.id
		}
	}
  },
  async onShow() {
	if(this.codeInfo.enterpriseId){
		await lib.getSessingKeyAndCode({enterprise_id:this.codeInfo.enterpriseId});
	}		
    this.getInfo()
  },
  methods: {
	  //获取优惠券信息
	 async getInfo(){
		  let data = await lib.request(urls.registered, this.codeInfo)
		  this.infoData = data.data
		  this.infoData.eventCreated = utils.timeFormat(
		    new Date(data.data.eventCreated * 1000),
		    "yyyy.MM.dd"
		  );
		  this.infoData.eventEnd = utils.timeFormat(
		    new Date(data.data.eventEnd * 1000),
		    "yyyy.MM.dd"
		  );
	  },
    //领取优惠券
    receive() {
      let params = {
        couponId: this.infoData.couponId,
        enterpriseId: this.infoData.enterpriseId,
      };
      lib
        .request(urls.receiveCoupon, params)
        .then((res) => {
          if (res.errcode === 200) {
            this.isReceive = true;
            uni.showToast({
              title: "领取成功",
              icon: "success",
              duration: 1000,
			  success:()=>{
				  this.getInfo()
			  }
            });
          }
        })
        .catch((err) => {
          // this.isReceive = true;
        });
    },
  },
};
</script>

<style scoped lang="scss">
	.conponContent {
		.conponContentItem {
			height: 192rpx;
			margin-top: 40rpx;
			position: relative;
			margin-top: 40rpx;
			display: flex;
			justify-content: center;
			image {
				width: 670rpx;
				height: 192rpx;
				position: absolute;
			}
			.contentDesc {
				left: 80rpx;
				margin-top: 36rpx;
				position: absolute;
				z-index: 1;
				display: flex;
				.itemLeft {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 120rpx;
					font-size: 60rpx;
					font-weight: 600;
					color: #333;
					margin-right: 40rpx;
					text {
						font-weight: 400;
						font-size: 45rpx;
					}
					view {
						margin-left: 8rpx;
					}
				}
				.itemRight {
					flex: 1;
					view {
						font-size: 28rpx;
						font-weight: 500;
						color: #333333;
					}
					view:nth-child(2) {
						margin-top: 10rpx;
						font-size: 20rpx;
						font-weight: 400;
					}
				}
			}
			.limit {
				position: absolute;
				z-index: 1;
				font-size: 20rpx;
				color: #333333;
				bottom: 20rpx;
				left: 100rpx;
			}
		}
	}
.receive {
  width: 100vw;
  .bigTitle {
    width: 100%;
    display: flex;
    justify-content: center;
    color: #060606;
    font-size: 30rpx;
    font-weight: 500;
    position: relative;
    top: 40rpx;
  }
  .model {
    display: flex;
    justify-content: center;
    position: relative;
    color: white;
    .price {
      position: absolute;
      top: 140rpx;
      left: 140rpx;
      .m {
        font-size: 46rpx;
      }
      .p {
        font-weight: 600;
      }
      .money {
        font-size: 92rpx;
        margin-left: 20rpx;
      }
    }
    .title {
      position: absolute;
      // left: 317rpx;
      top: 74%;
    }
  }
  .btn {
    width: 660rpx;
    height: 90rpx;
    color: white;
    display: flex;
	border-radius: 6rpx;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
  }
  .receive {
    background: #e04f5a;
  }
  .received {
    background: #e88189;
  }
  .action {
    width: 100%;
  }
  .btnReceive{
	  width: 100%;
	  background: #e04f5a;
	  color: white;
  }
}
</style>
