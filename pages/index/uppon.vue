<template>
	<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
		<view class="cu-dialog">
			<view class="padding-xl">
				<view class="tip">
					<view class="jl">
						<view class="" v-if="isPromise">
							距离你{{detail.distance/1000}}公里
						</view>
						<view class="" v-else>
							无法获取距离
						</view>
					</view>
					<view class="cuIcon-roundclosefill" @tap="close" style="color:#ccc;font-size: 40rpx;">
					</view>
				</view>
				<view class="carItem" @tap="toDetail">
				    <view class="imgBox">
				     <image :src="detail.headsLeft" mode=""></image>
				    </view>
				    <view class="carItemRight">
				     <view class="carName">
				      {{detail.configCarName}}
				     </view>
				     <view class="carYear">
				      <text>{{detail.totalDistance}}公里</text><text style="margin:0px 10rpx">/</text><text>{{detail.registrationDate}}年</text>
				     </view>
				     <view class="carItemMoney">
				      <view class="carMoney">
				       {{detail.salePrice}}万
				      </view>
				     <view class="carDistance">
				       详情 <text class="cuIcon-right"></text>
				      </view>
				     </view>
				    </view>
				   </view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			value: {},
			detail:{},
			isPromise:{}
		},
		data() {
			return {
				modalName: ''
			}
		},
		methods: {
			close(){
				this.modalName = ''
				this.$emit('input','')
			},
			//跳转车辆详情
			toDetail(){
				uni.navigateTo({
					url:`/pages/shop/carInfo?id=${this.detail.id}`
				})
				this.$emit('input','')
			}
		},
		watch:{
			value(val){
				this.modalName = val
			}
		}
	}
</script>

<style scoped lang="scss">
	.padding-xl {
		text-align: left;
		padding: 0 20rpx;
		background: white;
		border-bottom: 1rpx solid #eee;
		.tip{
			display: flex;
			height: 70rpx;
			justify-content: space-between;
			align-items: center;
		}
		.carItem {
		   display: flex;
		   margin: 15rpx 0;
		   padding: 26rpx 20rpx;
		   background-color: #F5F5F5;
		
		   .imgBox {
		    width: 268rpx;
		    height: 188rpx;
		
		    image {
		     width: 100%;
		     height: 100%;
		    }
		   }
		   .carItemRight {
		    padding-left: 10rpx;
		    flex:1;
		
		    .carName {
		     margin-bottom: 10rpx;
		     display: -webkit-box;
		     word-break: break-all;
		     -webkit-box-orient: vertical;
		     -webkit-line-clamp: 2;
		     overflow: hidden;
		     text-overflow: ellipsis;
		    }
		    .carYear {
		     color: #666666;
		     font-size: 24rpx;
		     margin-bottom: 20rpx;
		    }
		    .carItemMoney {
		     display: flex;
		     justify-content: space-between;
		     align-items: baseline;
		
		     .carMoney {
		      color: #E34F5B;
		      font-size: 36rpx;
		     }
		     .carDistance {
		      font-size: 24rpx;
		     }
		    }
		   }
		  }
	}
</style>
