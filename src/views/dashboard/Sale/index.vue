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
				<el-col :span="18"> 左部分 </el-col>
				<el-col :span="6"> 右部分 </el-col>
			</el-row>
		</div>
	</el-card>
</template>

<script>
export default {
	name: "",
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
</style>
