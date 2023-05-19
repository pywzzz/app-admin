<template>
	<div>
		<el-card style="margin: 20px 0px">
			<!-- 用自定义事件@getCategoryId实现子组件CategorySelect向父组件Attr传参 -->
			<CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
		</el-card>
		<div style="margin-bottom: 20px">
			<el-button type="primary" @click="addSaleAttr" :disabled="!category3Id"
				>添加销售属性</el-button
			>
		</div>
		<el-table border stripe :data="saleAttrs">
			<el-table-column type="index" label="序号" width="80" align="center">
			</el-table-column>
			<el-table-column label="销售属性名称">
				<template slot-scope="{ row }">
					<template v-if="row.edit">
						<el-input
							v-model="row.saleAttrName"
							class="edit-input"
							size="small"
						/>
						<el-button
							class="cancel-btn"
							size="small"
							icon="el-icon-refresh"
							type="warning"
							@click="cancelEdit(row)"
						>
							取消
						</el-button>
					</template>
					<span v-else>{{ row.saleAttrName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="300" align="center">
				<template slot-scope="{ row }">
					<el-button
						size="mini"
						type="primary"
						icon="el-icon-check"
						title="确定"
						@click="updateSaleAttr(row)"
						v-if="row.edit"
					/>
					<el-button
						size="mini"
						type="primary"
						icon="el-icon-edit"
						title="修改销售属性名"
						@click="row.edit = true"
						v-if="!row.edit"
					/>
					<el-button
						size="mini"
						type="danger"
						icon="el-icon-delete"
						title="删除销售属性"
						@click="removeSaleAttr(row)"
					/>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="page"
			:total="total"
			:page-size="limit"
			:page-sizes="[5, 10, 20, 30, 40, 50, 100]"
			style="padding: 20px 0"
			layout="prev, pager, next, jumper, ->, sizes, total"
			@current-change="getSaleAttrs"
			@size-change="handleSizeChange"
		/>
	</div>
</template>

<script>
export default {
	name: "SaleAttr",
	data() {
		return {
			category1Id: "",
			category2Id: "",
			category3Id: "",
			// 销售属性列表
			saleAttrs: [],
			total: 0,
			page: 1,
			limit: 5,
		};
	},
	methods: {
		// 每页数量发生改变的监听
		handleSizeChange(pageSize) {
			this.limit = pageSize;
			this.getSaleAttrs();
		},
		// 利用level这个参数来区分收到的是几级列表的id
		getCategoryId({ categoryId, level }) {
			// 把子组件CategorySelect传来的数据保存父组件Attr的data中
			if (level == 1) {
				this.category1Id = categoryId;
				this.category2Id = "";
				this.category3Id = "";
			} else if (level == 2) {
				this.category2Id = categoryId;
				this.category3Id = "";
			} else if (level == 3) {
				this.category3Id = categoryId;
				// 在有了第三级列表的id后，就该在组件展示数据了
				this.getSaleAttrs();
			}
		},
		// 异步获取销售属性分页列表
		getSaleAttrs(page = 1) {
			this.page = page;
			const { limit, category1Id, category2Id, category3Id } = this;
			this.$API.saleattr
				.reqSaleAttrList(category1Id, category2Id, category3Id, page, limit)
				.then((result) => {
					const { items, total } = result.data;
					this.saleAttrs = items.map((item) => {
						// 用于标识是否显示编辑输入框的属性
						item.edit = false;
						// 缓存销售属性名称, 用于取消
						item.originSaleAttrName = item.saleAttrName;
						return item;
					});
					this.total = total;
				})
				.finally(() => {});
		},
		// 添加销售属性
		addSaleAttr() {
			// 显示添加界面
			this.$prompt("请输入销售属性名", "添加销售属性", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
			})
				.then(({ value }) => {
					this.$API.saleattr
						.save({ saleAttrName: value, category3Id: this.category3Id })
						.then((result) => {
							this.$message.success(result.message || "添加成功");
							this.getSaleAttrs();
						});
				})
				.catch(() => {});
		},
		// 更新销售属性
		updateSaleAttr(saleAttr) {
			this.$API.saleattr
				.updateById({ id: saleAttr.id, saleAttrName: saleAttr.saleAttrName })
				.then((result) => {
					this.$message.success(result.message || "更新成功!");
					this.getSaleAttrs(this.page);
				});
		},
		// 取消修改
		cancelEdit(saleAttr) {
			saleAttr.saleAttrName = saleAttr.originSaleAttrName;
			saleAttr.edit = false;
		},
		// 删除指定的销售属性
		removeSaleAttr({ id, saleAttrName }) {
			this.$confirm(`确定删除 '${saleAttrName}' 吗?`, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(async () => {
					const result = await this.$API.saleattr.removeById(id);
					this.$message.success(result.message || "删除成功!");
					// 如果是本页的数据个数大于1，则停留在当前页，否则停在前一页（期间注意不能让page减成0了）
					let page = 0;
					if (this.saleAttrs.length > 1) {
						page = this.page;
					} else {
						if (page > 1) {
							page = this.page - 1;
						} else {
							page = 1;
						}
					}
					this.getSaleAttrs(page);
				})
				.catch(() => {});
		},
	},
};
</script>

<style scoped>
.edit-input {
	padding-right: 100px;
}

.cancel-btn {
	position: absolute;
	right: 15px;
	top: 10px;
}
</style>
