<template>
  <view class="index">
    <view class="form" v-for="(item, index) in list" :key="index">
      <!-- input普通text和number(手机) -->
      <view class="form-item" v-if="item.type !== 2&&item.type !== 4">
        <input
          :type="item.type === 1 ? 'text' : 'number'"
          v-model="item.elementValue"
          :placeholder="item.placeholder"
		  @change="customMethod(index,item.elementValue,item.type)"
          :maxlength="item.type === 3 ? 11 : item.elementLength"
		  :disabled="item.disabled"
		  class="br"
        />
      </view>
      <!-- 车牌号 -->
      <view class="form-item rela" v-if="item.type === 2">
        <view class="title" @tap="showProvince">
          <view style="margin-left: 12rpx;">
            {{ province }}
          </view>
          <text class="cuIcon-unfold" v-if="!isShow"></text>
          <text class="cuIcon-fold" v-else></text>
        </view>
       <input
          type="text"
          v-model="item.elementValue"
          :placeholder="item.placeholder"
		  @change="customMethod(index,item.elementValue,item.type)"
		  v-if="!isSelect"
		  class="spe"
		  :disabled="item.disabled"
        />
       <input
          type="text"
          class="spe"
          v-model="item.elementValue"
          :placeholder="item.placeholder"
		  :disabled="true"
		  v-else
        />
        <view class="ab" v-if="item.isLicense!=2">
         <checkbox-group class="block" @change="CheckboxChange($event,item)" v-if="!show">
            <view class="cu-form-group">
              <checkbox
                class="round"
                :class="checkbox.checked ? 'checked' : ''"
                :checked="checkbox.checked ? true : false"
                value="cb"
              ></checkbox>
            </view>
          </checkbox-group>
		  <checkbox-group class="block" v-else >
		    <view class="cu-form-group">
		      <checkbox
		        class="round"
		        :class="checkbox.checked ? 'checked' : ''"
				:disabled="true"
		        :checked="checkbox.checked ? true : false"
		        value="cb"
		      ></checkbox>
		    </view>
		  </checkbox-group>
          <view class="tip">
            未上牌
          </view>
        </view>
      </view>
    </view>
    <view class="keyword">
      <keyWord
        v-model="isShow"
        @inputchange="inputchange"
        :province="province"
      />
    </view>
  </view>
</template>

<script>
import keyWord from "./keyword.vue";
export default {
  props: {
    list: Array,
  },
  components: {
    keyWord,
  },
  data() {
    return {
      isShow: false,
      province: "粤",
      checkbox: {
        checked: "",
      },
      cb: "",
      isSelect: false,
	  show:false
    };
  },
  methods: {
	 showProvince(){
		 if(this.show) return false
		  this.isShow = true
	 },
    inputchange(val) {
      this.province = val;
	  this.$emit('concatCarNo',val)
    },
	customMethod(index,value,type){
		this.$emit('getValue',index,value,this.province,type,this.isSelect)
	},
    CheckboxChange(e,item) {
      let values = e.detail.value;
      if (values.length) {
        this.isSelect = true;
        this.checkbox.checked = "checkd";
      } else {
        this.checkbox.checked = "";
        this.isSelect = false;
      }
	  this.$emit('getIsSelect',this.isSelect)
    },
  },
  watch: {
    isSelect(val) {
	  let index = this.list.findIndex((row) => row.type === 2);
    },
	list(val){
		val.forEach(row=>{
			if(row.elementValue){
				this.show  = true	
			}
			if(row.type==2&&row.isLicense==3){
				this.checkbox.checked = true
			}
			if(row.type==2&&!row.elementValue){
				this.province = '粤'
			}
		})
	}
  },
};
</script>

<style scoped lang="scss">
.form {
  width: 700rpx;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 0 40rpx;
  margin-left: 70rpx;
  .form-item {
    display: flex;
    align-items: center;
    height: 90rpx;
    margin-top: 20rpx;
    > input {
      padding-left: 20rpx;
      height: 100%;
      width: 540rpx;
      border: 1rpx solid #fff;
	  border-left: none;
	  background: white;
	  // border-radius: 6rpx;
    }

    text {
      color: #000;
      font-size: 32rpx;
      flex: 1;
    }

    .car {
      width: 120rpx !important;
      margin-left: 0 !important;
    }

    .title {
      width: 90rpx;
      border: 1rpx solid #fff;
      height: 100%;
	  border-right: none;
	  border-radius: 6rpx 0 0 6rpx;
      display: flex;
      align-items: center;
      justify-content: center;
	  background: white;
	  >text{
		  color:#04B283
	  }
    }
  }

  .submit {
    width: 587rpx;
    height: 90rpx;
    background: #e04f5a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-top: 30rpx;
  }

  .rule {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 47rpx;
    box-sizing: border-box;

    .leftLine {
      width: 180rpx;
      height: 1rpx;
      background: #979797;
      border: 1rpx #979797 solid;
    }

    .rightLine {
      width: 180rpx;
      height: 1rpx;
      background: #979797;
      border: 1rpx #979797 solid;
    }

    .title {
      margin: 0 20rpx;
      font-size: 36rpx;
      color: #000;
      font-weight: 600;
    }
  }
  .cu-form-group {
    min-height: 70rpx;
  }
  .rela {
    position: relative;
    height: 90rpx;
    .ab {
      position: absolute;
      left: 346rpx;
      display: flex;
      align-items: center;
      width: 200rpx;
      height: 90rpx;
      z-index: 9999;
	  background: white;
	  border: 1rpx solid #fff;
	  border-left: none;
	  border-radius: 0rpx 6rpx 6rpx 0rpx;
    }
    .tip {
      position: relative;
      left: -20rpx;
    }
  }
}
.spe{
	margin: 0;
	width: 450rpx !important;
	z-index: 9999 !important
}
.br{
	border-radius: 6rpx;
}
</style>
