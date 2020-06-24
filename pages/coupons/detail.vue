<template>
  <view class="detail">
    <view class="info">
      <view class="price">
        <text>￥</text>
        <text class="money">{{ info.money }}</text>
      </view>
      <view class="title">
        {{ info.couponName }}
      </view>
      <view class="time">
        <text>有效期:</text>
        <text class="startTime">{{ info.eventCreated }}</text>
        -
        <text class="endTime">{{ info.eventEnd }}</text>
      </view>
      <view class="limit">
        <text>适用门店:</text>
        <text>{{ info.enterpriseName }}</text>
      </view>
    </view>
    <view class="code">
      <image :src="qr" mode="" v-if="type === 0"></image>
      <image
        src="../../static/images/hasUse.png"
        mode="aspectFit"
        v-if="type === 1"
      ></image>
      <image
        src="../../static/images/expired.png"
        mode="aspectFit"
        v-if="type === 2"
      ></image>
    </view>
  </view>
</template>

<script>
import Qr from "../../utils/qrcode.js";
export default {
  data() {
    return {
      qr: "",
      type: null,
      info: {},
    };
  },
  methods: {
    //生成二维码
    getQr() {
      let userId = uni.getStorageSync("userInfo").id;
      let couponId = this.info.couponId;
      let eventId = this.info.enterpriseId;
      let data = {
        userId,
        couponId,
        eventId,
      };

      // let str = `userId=${userId}&couponId=${couponId}&enterpriseId=${enterpriseId}`
      this.qr = Qr.createQrCodeImg(JSON.stringify(data));
    },
  },
  onLoad(ops) {
    this.type = Number(ops.type);
    this.info = uni.getStorageSync("couponInfo");
  },
  mounted() {
    this.getQr();
  },
};
</script>

<style scoped lang="scss">
.detail {
  width: 420rpx;
  // padding:100rpx 170rpx 0 170rpx;
  margin: 0 auto;
  margin-top: 100rpx;
  box-sizing: border-box;
  .info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .price {
      color: #e04f5a;
      font-weight: 600;
      .money {
        font-size: 72rpx;
      }
    }
    .title {
      color: #000000;
      font-size: 36rpx;
      font-weight: 500;
      margin: 14rpx 0;
    }
    .time {
      color: #979797;
    }
    .limit {
      color: #979797;
      margin-top: 14rpx;
      margin-left: -130rpx;
    }
  }
  .code {
    width: 400rpx;
    height: 400rpx;
    margin-top: 80rpx;
    > image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
