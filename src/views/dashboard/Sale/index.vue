<template>
	<el-card class="box-card" style="margin: 10px 0px">
		<div slot="header" class="clearfix">
			<!-- 上方左侧 -->
			<el-tabs class="tab" v-model="activeName">
				<el-tab-pane label="销售额" name="sale"></el-tab-pane>
				<el-tab-pane label="访问量" name="visit"></el-tab-pane>
			</el-tabs>
			<!-- 上方右侧 -->
			<div class="right">
				<span>今日</span>
				<span>本周</span>
				<span>本月</span>
				<span>本年</span>
				<!-- 日历 -->
				<el-date-picker
					class="calendar"
					type="daterange"
					range-separator="-"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					size="mini"
				>
				</el-date-picker>
			</div>
		</div>
		<!-- 下半部分 -->
		<div>
			<el-row :gutter="10">
				<el-col :span="18">
					<!-- 柱状图的容器 -->
					<div class="charts" ref="charts"></div>
				</el-col>
				<el-col :span="6" class="right">
					<h3>门店销售额排名</h3>
					<ul>
						<li>
							<span class="rindex">0</span>
							<span>肯德基</span>
							<span class="rvalue">123456</span>
						</li>
						<li>
							<span class="rindex">1</span>
							<span>肯德基</span>
							<span class="rvalue">123456</span>
						</li>
						<li>
							<span class="rindex">3</span>
							<span>肯德基</span>
							<span class="rvalue">123456</span>
						</li>
						<li>
							<span>4</span>
							<span>肯德基</span>
							<span class="rvalue">123456</span>
						</li>
						<li>
							<span>5</span>
							<span>肯德基</span>
							<span class="rvalue">123456</span>
						</li>
						<li>
							<span>6</span>
							<span>肯德基</span>
							<span class="rvalue">123456</span>
						</li>
						<li>
							<span>7</span>
							<span>肯德基</span>
							<span class="rvalue">123456</span>
						</li>
					</ul>
				</el-col>
			</el-row>
		</div>
	</el-card>
</template>

<script>
import echarts from "echarts";
export default {
	name: "",
	mounted() {
		// 初始化echarts实例
		this.barCharts = echarts.init(this.$refs.charts);
		// 配置数据
		this.barCharts.setOption({
			// 标题
			title: {
				text: "销售额趋势",
			},
			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "shadow",
				},
			},
			grid: {
				left: "3%",
				right: "4%",
				bottom: "3%",
				containLabel: true,
			},
			xAxis: [
				{
					type: "category",
					data: [
						"一月",
						"二月",
						"三月",
						"四月",
						"五月",
						"六月",
						"七月",
						"八月",
						"九月",
						"十月",
						"十一月",
						"十二月",
					],
					axisTick: {
						alignWithLabel: true,
					},
				},
			],
			yAxis: [
				{
					type: "value",
				},
			],
			series: [
				{
					name: "Direct",
					type: "bar",
					barWidth: "60%",
					data: [12, 35, 26, 23, 18, 34, 34, 95, 37, 68, 46, 99],
					color: "blue",
				},
			],
		});
	},
	data() {
		return {
			activeName: "sale",
		};
	},
};
</script>

<style scoped>
.clearfix {
	position: relative;
	display: flex;
	justify-content: space-between;
}

.tab {
	width: 100%;
}

.right {
	position: absolute;
	right: 0px;
}

.right span {
	margin: 0px 10px;
}

.calendar {
	width: 250px;
	margin: 0px 20px;
}

.charts {
	width: 100%;
	height: 300px;
}
ul {
	list-style: none;
	width: 100%;
	height: 300px;
	padding: 0px;
}

ul li {
	height: 8%;
	margin: 10px 0px;
}

.rindex {
	float: left;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background: black;
	color: white;
	text-align: center;
}

.rvalue {
	float: right;
}
</style>
