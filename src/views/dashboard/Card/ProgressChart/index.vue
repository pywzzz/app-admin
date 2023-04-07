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
				min: 0,
				max: 100,
			},
			yAxis: {
				// 隐藏y轴
				show: false,
				type: "category",
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
					type: "bar",
					data: [78],
					color: "yellowgreen",
					// 柱状图的宽度
					barWidth: 10,
					// 设置背景颜色
					showBackground: true,
					backgroundStyle: {
						color: "#eee",
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
