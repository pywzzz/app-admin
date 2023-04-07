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
				<span @click="setDay">今日</span>
				<span @click="setWeek">本周</span>
				<span @click="setMonth">本月</span>
				<span @click="setYear">本年</span>
				<!-- 日历 -->
				<el-date-picker
					v-model="calendarDate"
					class="calendar"
					type="daterange"
					range-separator="-"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					size="mini"
					value-format="yyyy-MM-dd"
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
					<h3>门店{{ title }}排名</h3>
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
import dayjs from "dayjs";
export default {
	name: "",
	mounted() {
		// 初始化echarts实例
		this.barCharts = echarts.init(this.$refs.charts);
		// 配置数据
		this.barCharts.setOption({
			// 标题
			title: {
				text: this.title + "趋势",
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
			// 把柱状图挂载在实例上从而在watch中再次设置它的title
			barCharts: null,
			calendarDate: [],
		};
	},
	computed: {
		title() {
			return this.activeName == "sale" ? "销售额" : "访问量";
		},
	},
	watch: {
		title() {
			this.barCharts.setOption({
				title: {
					text: this.title + "趋势",
				},
			});
		},
	},
	methods: {
		setDay() {
			const day = dayjs().format("YYYY-MM-DD");
			console.log(day);
			this.calendarDate = [day, day];
		},
		setWeek() {
			// day(1)返回本周的星期一
			const start = dayjs().day(1).format("YYYY-MM-DD");
			const end = dayjs().day(7).format("YYYY-MM-DD");
			this.calendarDate = [start, end];
		},
		setMonth() {
			// startOf("month")返回这个月的第一天
			const start = dayjs().startOf("month").format("YYYY-MM-DD");
			const end = dayjs().endOf("month").format("YYYY-MM-DD");
			this.calendarDate = [start, end];
		},
		setYear() {
			// startOf("year")返回这一年的第一天
			const start = dayjs().startOf("year").format("YYYY-MM-DD");
			const end = dayjs().endOf("year").format("YYYY-MM-DD");
			this.calendarDate = [start, end];
		},
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
