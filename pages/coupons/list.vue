<template>
  <view class="couponList">
    <scroll-view
      scroll-x
      class="bg-white nav"
      scroll-with-animation
      :scroll-left="scrollLeft"
    >
      <view
        class="cu-item"
        :class="index == TabCur ? 'text-green cur' : ''"
        v-for="(item, index) in tabList"
        :key="index"
        @tap="tabSelect"
        :data-id="index"
      >
        {{ item.title }}
      </view>
    </scroll-view>
    <view class="isEmpty" v-if="!couponList.length">
      <image src="../../static/images/empty.png" mode="aspectFit"></image>
      <text>暂无优惠券</text>
    </view>
    <view class="list" v-else>
      <list :list="couponList" :type="TabCur"></list>
    </view>
  </view>
</template>

<script>
import list from "./components/index.vue";
import urls from "../../api/url.js";
import lib from "api/lib.js";
import utils from "../../utils/utils.js";
export default {
  components: {
    list,
  },
  data() {
    return {
      TabCur: 0,
      scrollLeft: 0,
      tabList: [
        {
          title: "未使用",
        },
        {
          title: "已使用",
        },
        {
          title: "已过期",
        },
      ],
      couponList: [],
    };
  },
  onLoad() {
  	uni.removeStorageSync('currentIndex')
  },
  onShow() {
	let index = uni.getStorageSync('currentIndex')||1
	this.TabCur = index-1
    this.getCouponInfo(index);
  },
  methods: {
    //选显卡切换
    tabSelect(e) {
	  this.couponList= []
      this.TabCur = e.currentTarget.dataset.id;
	  uni.setStorageSync('currentIndex',this.TabCur+1)
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
      this.getCouponInfo(this.TabCur + 1);
    },
    //获取优惠券列表
    getCouponInfo(couponUseStatus) {
      let params = { couponUseStatus: couponUseStatus };
      lib.request(urls.myCouponInfo, params).then((res) => {
        this.couponList = JSON.parse(JSON.stringify(res.data));
        this.couponList.forEach((row) => {
          row.eventCreated = utils.timeFormat(
            new Date(row.eventCreated * 1000),
            "yyyy.MM.dd"
          );
          row.eventEnd = utils.timeFormat(
            new Date(row.eventEnd * 1000),
            "yyyy.MM.dd"
          );
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.couponList {
  .nav {
    width: 100vw;
    display: flex;
  }
  .cu-item {
    // flex:1;
    text-align: center;
    width: 33.33%;
  }
  .isEmpty {
    display: flex;
    margin-top: 30%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    > image {
      width: 90rpx;
      height: 90rpx;
      margin-bottom: 30rpx;
    }
  }
}
</style>
