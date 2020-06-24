<template>
  <view
    class="vehicle-panel"
    style="height: 430rpx; background-color: #fff;"
    v-if="show"
  >
    <view class="vehicle-panel-row">
      <view
        hover-class="vehicle-hover"
        hover-start-time="10"
        hover-stay-time="100"
        class="vehicle-panel-row-button"
        :style="{ border: buttonBorder }"
        v-for="(item, index) in keyVehicle1"
        :key="index"
        @tap="vehicleTap(item)"
        :class="{ 'vehicle-hover': item === province }"
        >{{ item }}</view
      >
    </view>
    <view class="vehicle-panel-row">
      <view
        hover-class="vehicle-hover"
        hover-start-time="10"
        hover-stay-time="100"
        class="vehicle-panel-row-button"
        :style="{ border: buttonBorder }"
        v-for="(item, index) in keyVehicle2"
        :key="index"
        @tap="vehicleTap(item)"
        :class="{ 'vehicle-hover': item === province }"
        >{{ item }}</view
      >
    </view>
    <view class="vehicle-panel-row">
      <view
        hover-class="vehicle-hover"
        hover-start-time="10"
        hover-stay-time="100"
        class="vehicle-panel-row-button"
        :style="{ border: buttonBorder }"
        v-for="(item, index) in keyVehicle3"
        :key="index"
        @tap="vehicleTap(item)"
        :class="{ 'vehicle-hover': item === province }"
        >{{ item }}</view
      >
    </view>
    <view class="vehicle-panel-row-last">
      <view
        hover-class="vehicle-hover"
        hover-start-time="10"
        hover-stay-time="100"
        class="vehicle-panel-row-button vehicle-panel-row-button-last"
        @tap="vehicleTap(item)"
        v-for="(item, index) in keyVehicle4"
        :key="index"
        :style="{ border: buttonBorder }"
        :class="{ 'vehicle-hover': item === province }"
        >{{ item }}</view
      >
    </view>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    buttonBorder: {
      type: String,
      default: "1px solid #ccc",
    },
    backgroundColor: {
      type: String,
      default: "#fff",
    },
    province: {
      type: String,
      default: "粤",
    },
  },
  data() {
    return {
      keyVehicle1: "陕京津沪冀豫云辽",
      keyVehicle2: "黑湘皖鲁新苏浙赣",
      keyVehicle3: "鄂桂甘晋蒙吉闽贵",
      keyVehicle4: "粤川青藏琼宁渝",
      show: this.value,
    };
  },
  methods: {
    vehicleTap(val) {
      this.show = false;
      this.$emit("inputchange", val);
      this.$emit("input", this.show);
    },
  },
  watch: {
    value(val) {
      this.show = val;
    },
  },
};
</script>

<style>
:host {
  width: 100%;
}
.vehicle-panel {
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1000;
}
.vehicle-panel-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.vehicle-panel-row-last {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.vehicle-panel-row-button {
  background-color: #fff;
  margin: 5rpx;
  padding: 5rpx;
  width: 80rpx;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  border-radius: 10rpx;
}
.vehicle-panel-row-button-number {
  background-color: #eee;
}
.vehicle-panel-row-button-last {
  width: 90rpx;
  height: 90rpx;
  line-height: 90rpx;
}
.vehicle-hover {
  background-color: #ccc;
}
.vehicle-panel-row-button-img {
  display: flex;
  justify-content: center;
  align-items: center;
}
.vehicle-en-button-delete {
  width: 55rpx;
  height: 85rpx;
}
.vehicle-panel-ok {
  background-color: #0f4ba1;
  color: #fff;
  width: 150rpx;
  height: 80rpx;
}
</style>
