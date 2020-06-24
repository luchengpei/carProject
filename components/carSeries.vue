<template>
	<view class="car-series-box" >
		<view class="carSeries-cover" @click="isHideSer">
		</view>
		<view class="series-box">
			<view class="series-content">
				<view class="series-item" v-for="(item,index) in seriesData" :key="index"  @click="seriesTip(index)">
					<view class="series-type bg-gray" :class="{is_Choose:is_ChooseId === index}">
						{{item.name}}
					</view>
				</view>
			</view>
			<view class="series-btn" @click="sureClick">
				<text class="series-btn-text">确定</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			is_ChooseId:0,
			seriesData:[],
			checkM:''
			};
		},
		props:{
			showcarSeries:{
				type:Object,
				default:()=>{
					return {}
				}
			}
		},
		watch:{
			//监听传入参数,参数改变触发数据改变
			showcarSeries:{		
				　handler(val){
					this.initData();
				},
				deep:true,
				immediate:true,
			}
		},
		methods:{
			//数据渲染赋值
			initData(){
				if(this.showcarSeries.isShow ) {
					this.is_ChooseId = this.showcarSeries.keepSeriesId
				}else {
					this.is_ChooseId = this.showcarSeries.keepPaymentId
				}
				this.checkM =  this.showcarSeries.isShow
				this.seriesData = this.showcarSeries.seriesList
			},
			isHideSer(){
				//监听关闭弹窗事件
				this.$emit('closeCar',false);
			},
			seriesTip(id){
				//选中ID
				this.is_ChooseId = id
			},
			sureClick(){
				//选中参数
				this.$emit('comfirm-data',{id:this.seriesData[this.is_ChooseId].id,check : this.checkM,keepId:this.is_ChooseId});
			},
		}
	}
</script>

<style>
	.car-series-box {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 267rpx;
		left: 0;
	}
	
	.is_Choose {
		background-color: #F37B1D!important;
		color: #fff;
	}

	.carSeries-cover {
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.3);
	}
	
	.series-box {
		position: absolute;
		top: 0rpx;
		left: 0;
		z-index: 99;
		background-color: #fff;
		width: 100%;
	}
	
	.series-content　{
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		padding: 10rpx 30rpx 0;
	}
	
	.series-item {
		width: 33%;
		margin-top: 20rpx;
		display: flex;
		justify-content: center;
	}
	
	.series-type  {
		width: 220rpx;
		height: 50rpx;
		line-height: 50rpx;
		/* background-color: ; */
		border-radius: 50rpx;
		text-align: center;
	}
	
	.series-btn {
		width: 100%;
		padding: 0 30rpx;
	}
	
	.series-btn-text {
		display: block;
		width: 100%;
		height: 60rpx;
		background-color: #F37B1D;
		text-align: center;
		line-height: 60rpx;
		border-radius: 30rpx;
		color: #FFF;
		margin: 40rpx 0;
	}
</style>
