<template>
	<!-- 容器 -->
	<div class="charts" ref="charts"></div>
</template>

<script>
//引入echarts
import echarts from "echarts";
export default {
	name: "",
	mounted() {
		// 初始化echarts实例
		let lineCharts = echarts.init(this.$refs.charts);
		// 配置数据
		lineCharts.setOption({
			xAxis: {
				// 隐藏x轴
				show: false,
				type: "category",
			},
			yAxis: {
				// 隐藏y轴
				show: false,
			},
			// 布局调试
			grid: {
				left: 0,
				top: 0,
				right: 0,
				bottom: 0,
			},
			// 系列
			series: [
				{
					type: "line",
					data: [10, 7, 33, 12, 48, 9, 29, 10, 44],
					// 设置拐点的样式
					itemStyle: {
						opacity: 0,
					},
					// 设置线条的样式
					lineStyle: {
						color: "purple",
					},
					// 设置填充颜色
					areaStyle: {
						// color中的都是在文档中直接cv的。可以达到折线颜色渐变的效果
						color: {
							type: "linear",
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									// 0%处的颜色
									color: "purple",
								},
								{
									offset: 1,
									// 100%处的颜色
									color: "#fff",
								},
							],
							// 默认为false
							global: false,
						},
					},
				},
			],
		});
	},
};
</script>

<style scoped>
.charts {
	width: 100%;
	height: 100%;
}
</style>
