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
				<el-table style="width: 100%" border>
					<!-- 序号列 -->
					<el-table-column type="index" label="序号" width="80" align="center">
					</el-table-column>
					<!-- SPU名称列 -->
					<el-table-column prop="prop" label="SPU名称" width="width">
					</el-table-column>
					<!-- SPU描述列 -->
					<el-table-column prop="prop" label="SPU描述" width="width">
					</el-table-column>
					<!-- 操作列 -->
					<el-table-column prop="prop" label="操作" width="width">
						<template slot-scope="{ row }">
							<!-- 按钮 -->
							<el-button
								type="success"
								size="mini"
								icon="el-icon-plus"
							></el-button>
							<!-- 按钮 -->
							<el-button
								type="warning"
								size="mini"
								icon="el-icon-edit"
							></el-button>
							<!-- 按钮 -->
							<el-button
								type="info"
								size="mini"
								icon="el-icon-info"
							></el-button>
							<!-- 按钮 -->
							<el-button
								type="danger"
								size="mini"
								icon="el-icon-delete"
							></el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页器 -->
				<el-pagination
					style="text-align: center"
					:current-page="3"
					:page-sizes="[3, 5, 10]"
					:page-size="3"
					:total="99"
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
		getSpuList() {},
	},
};
</script>

<style lang="" scoped></style>
