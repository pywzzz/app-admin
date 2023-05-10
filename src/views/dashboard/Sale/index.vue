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
				<el-tabs
					class="tab"
					v-model="timeRange"
					@tab-click="handleTimeRangeChange"
				>
					<el-tab-pane
						v-for="tab in tabs"
						:label="tab.label"
						:name="tab.name"
						:key="tab.name"
					>
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
						></el-date-picker>
					</el-tab-pane>
				</el-tabs>
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
					<h3>品牌{{ title }}排名</h3>
					<div class="container">
						<div v-if="listData.length === 0" class="center">No Data</div>
						<ul v-else>
							<li v-for="item in listData" :key="item.order">
								<span class="rindex">{{ item.order }}</span>
								<span>{{ item.tmName }}</span>
								<span class="rvalue">
									{{
										isLoading
											? "loading..."
											: activeName == "sale"
											? item.sales
												? "￥" + item.sales
												: "loading..."
											: item.visits
											? item.visits + "次"
											: "loading..."
									}}
								</span>
							</li>
						</ul>
					</div>
				</el-col>
			</el-row>
		</div>
	</el-card>
</template>

<script>
import echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
	name: "",
	mounted() {
		this.setDay();
		this.getSaleRankData();
		this.getVisitRankData();
		this.getSaleBarChartsData();
		this.getVisitBarChartsData();
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
					data: [],
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
			isLoading: false,
			timeRange: "day",
			listData: [],
			tabs: [
				{ label: "本日", name: "day" },
				{ label: "本周", name: "week" },
				{ label: "本月", name: "month" },
				{ label: "本年", name: "year" },
				{ label: "其他", name: "others" },
			],
		};
	},
	computed: {
		title() {
			return this.activeName == "sale" ? "销售额" : "访问量";
		},
		...mapState({
			barChartsData: (state) => state.home.barChartsData,
			rankData: (state) => state.home.rankData,
		}),
	},
	watch: {
		title() {
			this.updateChartsData();
			this.activeName == "sale"
				? this.getSaleRankData()
				: this.getVisitRankData();
		},
		calendarDate(newVal) {
			this.activeName == "sale"
				? this.getSaleRankData()
				: this.getVisitRankData();

			if (newVal == null || newVal == undefined) {
				this.timeRange = "others";
			} else if (
				newVal[0] == dayjs().format("YYYY-MM-DD") &&
				newVal[1] == dayjs().format("YYYY-MM-DD")
			) {
				this.timeRange = "day";
			} else if (
				newVal[0] == dayjs().day(1).format("YYYY-MM-DD") &&
				newVal[1] == dayjs().day(7).format("YYYY-MM-DD")
			) {
				this.timeRange = "week";
			} else if (
				newVal[0] == dayjs().startOf("month").format("YYYY-MM-DD") &&
				newVal[1] == dayjs().endOf("month").format("YYYY-MM-DD")
			) {
				this.timeRange = "month";
			} else if (
				newVal[0] == dayjs().startOf("year").format("YYYY-MM-DD") &&
				newVal[1] == dayjs().endOf("year").format("YYYY-MM-DD")
			) {
				this.timeRange = "year";
			} else {
				this.timeRange = "others";
			}
		},
		barChartsData: {
			deep: true,
			handler() {
				this.updateChartsData();
			},
		},
	},
	methods: {
		async getSaleRankData() {
			this.isLoading = true;
			await this.$store.dispatch("getSaleRankData", this.calendarDate);
			this.listData = this.rankData.saleRank;
			this.isLoading = false;
		},
		async getVisitRankData() {
			this.isLoading = true;
			await this.$store.dispatch("getVisitRankData", this.calendarDate);
			this.listData = this.rankData.visitRank;
			this.isLoading = false;
		},
		async getSaleBarChartsData() {
			await this.$store.dispatch("getSaleBarChartsData");
		},
		async getVisitBarChartsData() {
			await this.$store.dispatch("getVisitBarChartsData");
		},
		handleTimeRangeChange(tab) {
			switch (tab.name) {
				case "day":
					this.setDay();
					break;
				case "week":
					this.setWeek();
					break;
				case "month":
					this.setMonth();
					break;
				case "year":
					this.setYear();
					break;
				default:
					break;
			}
		},
		setDay() {
			const day = dayjs().format("YYYY-MM-DD");
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
		updateChartsData() {
			this.barCharts.setOption({
				title: {
					text: this.title + "趋势",
				},
				series: [
					{
						name: "Direct",
						type: "bar",
						barWidth: "60%",
						data:
							this.activeName == "sale"
								? this.barChartsData.barChartsSaleData
								: this.barChartsData.barChartsVisitData,
						color: "blue",
					},
				],
			});
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

.container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}

.center {
	text-align: center;
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
