<template>
	<div>
		<!-- 按钮 -->
		<el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px"
			>添加</el-button
		>

		<!-- 表格 -->
		<el-table style="width: 100%" border>
			<el-table-column
				prop="prop"
				label="序号"
				width="80px"
				align="center"
			></el-table-column>
            <!-- width值为width的话表示自适应宽度，即宽度与内容相同 -->
            <!-- 这儿的后三列均为width，所以这三个均分了宽度 -->
			<el-table-column
				prop="prop"
				label="品牌名称"
				width="width"
			></el-table-column>
			<el-table-column
				prop="prop"
				label="品牌LOGO"
				width="width"
			></el-table-column>
			<el-table-column prop="prop" label="操作" width="width"></el-table-column>
		</el-table>

		<!-- 分页器 -->
        <!-- pager-count表示按钮的总数，这儿的按钮包括初始的1，末尾的xx，中间的(一般为5个)，这三部分 -->
        <!-- layout中的 -> 表示让其右边的 sizes 和 total 贴着最右边布局 -->
		<el-pagination
			style="margin-top: 20px; text-align: center"
			:pager-count="7"
			:current-page="11"
			:page-size="3"
			:total="99"
			:page-sizes="[5, 10, 20]"
			layout="prev, pager, next, jumper, -> ,sizes, total"
		>
		</el-pagination>
	</div>
</template>

<script>
export default {
	name: "tradeMark",
};
</script>

<style lang="" scoped></style>
