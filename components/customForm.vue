<template>
	<view class="customForm">
		<form>
			<!-- input -->
			<view class="cu-form-group margin-top">
				<view class="title">邮件</view>
				<input placeholder="两字短标题" name="input"></input>
			</view>
			<!-- 收货地址 -->
			<view class="cu-form-group">
				<view class="title">收货地址</view>
				<input placeholder="输入框带个图标" name="input"></input>
				<text class='cuIcon-locationfill text-orange'></text>
			</view>
			<!-- 手机号码 -->
			<view class="cu-form-group">
				<view class="title">手机号码</view>
				<input placeholder="输入框带标签" name="input"></input>
				<view class="cu-capsule radius">
					<view class='cu-tag bg-blue '>
						+86
					</view>
					<view class="cu-tag line-blue">
						中国大陆
					</view>
				</view>
			</view>
			<!-- 普通选择 -->
			<view class="cu-form-group">
				<view class="title">普通选择</view>
				<picker  :value="index" :range="picker">
					<view class="picker">
						{{index>-1?picker[index]:'禁止换行，超出容器部分会以 ... 方式截断'}}
					</view>
				</picker>
			</view>
			<!-- 日期选择 -->
			<view class="cu-form-group">
				<view class="title">日期选择</view>
				<picker mode="date" :value="date" start="2015-09-01" end="2020-09-01" >
					<view class="picker">
						{{date}}
					</view>
				</picker>
			</view>
		</form>
	</view>
</template>

<script>
	export default{
		props:{
			list:Array,
			default:[]
		},
		data() {
			return {
				picker: ['喵喵喵', '汪汪汪', '哼唧哼唧'],
				index:-1,
				date: '2018-12-25',
			}
		},
		methods: {
			PickerChange(e) {
				this.index = e.detail.value
			},
			DateChange(e) {
				this.date = e.detail.value
			},
		},
	}
</script>

<style scoped lang="scss">
</style>
