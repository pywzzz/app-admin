<template>
	<div>
		<!-- 按钮 -->
		<el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px"
			>添加</el-button
		>

		<!-- 表格 -->
		<!-- 这儿的 :data 属性表示传的表格数据，人规定它的值必须为数组，可以理解为v-for遍历 -->
		<el-table style="width: 100%" border :data="list">
			<!-- 利用 type="index" 来自动生成序号 -->
			<el-table-column
				type="index"
				prop="prop"
				label="序号"
				width="80px"
				align="center"
			></el-table-column>
			<!-- width值为width的话表示自适应宽度，即宽度与内容相同 -->
			<!-- 这儿的后三列均为width，所以这三个均分了宽度 -->
			<el-table-column
				prop="tmName"
				label="品牌名称"
				width="width"
			></el-table-column>
			<!-- 子组件el-table-column的数据是来源于父组件el-table的，子组件需要借助作用域插槽才可以改变数据的样式 -->
			<el-table-column prop="logoUrl" label="品牌LOGO" width="width">
				<!-- 人父组件el-table回传的数据以对象的形式放在了一个叫row的对象中，这儿解构一下 -->
				<!-- 父组件的 :data 相当于v-for，则这儿的row相当于v-for中的每一个item -->
				<!-- 这儿还可以解构出个 $index ，相当于v-for中的index -->
				<template slot-scope="{ row }">
					<img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
				</template>
			</el-table-column>
			<el-table-column prop="prop" label="操作" width="width">
				<el-button type="warning" size="mini" icon="el-icon-edit"
					>修改</el-button
				>
				<el-button type="danger" size="mini" icon="el-icon-delete"
					>删除</el-button
				>
			</el-table-column>
		</el-table>

		<!-- 分页器 -->
		<!-- pager-count表示按钮的总数，这儿的按钮包括初始的1，末尾的xx，中间的(一般为5个)，这三部分 -->
		<!-- layout中的 -> 表示让其右边的 sizes 和 total 贴着最右边布局 -->
		<!-- @current-change在当前页改变时会触发，并返回当前页的页码 -->
		<!-- @size-change在当前页面中数据条数改变时会触发，并返回每页数据的条数 -->
		<el-pagination
			style="margin-top: 20px; text-align: center"
			:pager-count="7"
			:current-page="page"
			:page-size="limit"
			:total="total"
			:page-sizes="[5, 10, 20]"
			@current-change="handleCurrentChange"
			@size-change="handleSizeChange"
			layout="prev, pager, next, jumper, -> ,sizes, total"
		>
		</el-pagination>
	</div>
</template>

<script>
export default {
	name: "Trademark",
	data() {
		return {
			// 当前第几页
			page: 1,
			// 一页展示多少数据
			limit: 5,
			total: 0,
			// 表格中的列表部分展示的数据
			list: [],
		};
	},
	methods: {
		async getPageList() {
			const { page, limit } = this;
			let result = await this.$API.trademark.reqTrademarkList(page, limit);
			if (result.code == 200) {
				this.total = result.data.total;
				this.list = result.data.records;
			}
		},
		handleCurrentChange(page) {
			this.page = page;
			this.getPageList();
		},
		handleSizeChange(limit) {
			this.limit = limit;
			this.getPageList();
		},
	},
	mounted() {
		this.getPageList();
	},
};
</script>

<style lang="" scoped></style>
