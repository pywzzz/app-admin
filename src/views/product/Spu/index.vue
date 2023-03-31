<template>
	<div>
		<el-card style="margin: 20px 0px">
			<!-- 三级列表 -->
			<CategorySelect
				@getCategoryId="getCategoryId"
				:show="!show"
			></CategorySelect>
		</el-card>
		<el-card>
			<div>
				<!-- 按钮 -->
				<el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
				<el-table style="width: 100%" border :data="records">
					<!-- 序号列 -->
					<el-table-column type="index" label="序号" width="80" align="center">
					</el-table-column>
					<!-- SPU名称列 -->
					<el-table-column prop="spuName" label="SPU名称" width="width">
					</el-table-column>
					<!-- SPU描述列 -->
					<el-table-column prop="description" label="SPU描述" width="width">
					</el-table-column>
					<!-- 操作列 -->
					<el-table-column prop="prop" label="操作" width="width">
						<template slot-scope="{ row }">
							<!-- 按钮 -->
							<el-button
								type="success"
								size="mini"
								icon="el-icon-plus"
								title="添加sku"
							></el-button>
							<!-- 按钮 -->
							<el-button
								type="warning"
								size="mini"
								icon="el-icon-edit"
								title="修改spu"
							></el-button>
							<!-- 按钮 -->
							<el-button
								type="info"
								size="mini"
								icon="el-icon-info"
								title="查看当前spu全部sku列表"
							></el-button>
							<!-- 按钮 -->
							<el-button
								type="danger"
								size="mini"
								icon="el-icon-delete"
								title="删除spu"
							></el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页器 -->
				<el-pagination
					style="text-align: center"
					:current-page="page"
					:page-sizes="[5, 10, 20]"
					:page-size="limit"
					:total="total"
					@current-change="handleCurrentChange"
					@size-change="handleSizeChange"
					layout="prev, pager, next, jumper, ->, sizes, total"
				>
				</el-pagination>
			</div>
		</el-card>
	</div>
</template>

<script>
export default {
	name: "Spu",
	data() {
		return {
			// 各级列表的id
			category1Id: "",
			category2Id: "",
			category3Id: "",
			// 控制三级列表的下拉框能不能点
			show: true,
			page: 1,
			limit: 5,
			total: 0,
			records: [],
		};
	},
	methods: {
		//用于子组件CategorySelect向父组件Spu传参
		getCategoryId({ categoryId, level }) {
			if (level == 1) {
				this.category1Id = categoryId;
				this.category2Id = "";
				this.category3Id = "";
			} else if (level == 2) {
				this.category2Id = categoryId;
				this.category3Id = "";
			} else {
				this.category3Id = categoryId;
				this.getSpuList();
			}
		},
		async getSpuList() {
			const { page, limit, category3Id } = this;
			let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
			if (result.code == 200) {
				this.total = result.data.total;
				this.records = result.data.records;
			}
		},
		handleCurrentChange(page) {
			this.page = page;
			this.getSpuList();
		},
		handleSizeChange(limit) {
			this.limit = limit;
			this.getSpuList();
		},
	},
};
</script>

<style lang="" scoped></style>
