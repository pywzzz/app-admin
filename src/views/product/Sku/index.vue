<template>
	<div>
		<!-- 表格 -->
		<el-table style="width: 100%" border :data="records">
			<el-table-column
				type="index"
				label="序号"
				width="80"
				align="center"
			></el-table-column>
			<el-table-column
				prop="skuName"
				label="名称"
				width="width"
			></el-table-column>
			<el-table-column
				prop="skuDesc"
				label="描述"
				width="width"
			></el-table-column>
			<el-table-column label="默认图片" width="110">
				<template slot-scope="{ row }">
					<img
						:src="row.skuDefaultImg"
						alt=""
						style="width: 80px; height: 80px"
					/>
				</template>
			</el-table-column>
			<el-table-column prop="weight" label="重量" width="80"></el-table-column>
			<el-table-column prop="price" label="价格" width="80"></el-table-column>
			<el-table-column label="操作" width="width">
				<template slot-scope="{ row }">
					<!-- isSale是服务器返回的数据中的一个属性，1表示已上架，0表示已下架 -->
					<el-button
						type="success"
						icon="el-icon-sort-down"
						size="mini"
						v-if="row.isSale == 0"
						@click="shelveSku(row)"
					></el-button>
					<!-- isSale是服务器返回的数据中的一个属性，1表示已上架，0表示已下架 -->
					<el-button
						type="success"
						icon="el-icon-sort-up"
						size="mini"
						@click="disableSku(row)"
						v-else
					></el-button>
					<el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
					<el-button type="info" icon="el-icon-info" size="mini"></el-button>
					<el-button
						type="danger"
						icon="el-icon-delete"
						size="mini"
					></el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页器 -->
		<el-pagination
			layout="prev, pager, next, jumper, ->, sizes, total"
			style="text-align: center"
			:current-page="page"
			:page-sizes="[3, 5, 10]"
			:page-size="limit"
			:total="total"
			@current-change="getSkuList"
			@size-change="handleSizeChange"
		>
		</el-pagination>
	</div>
</template>

<script>
export default {
	name: "Sku",
	data() {
		return {
			// 当前是第几页
			page: 1,
			// 一页多少条数据
			limit: 10,
			// 一共多少条数据
			total: 0,
			// 存储SKU列表中的数据
			records: [],
		};
	},
	methods: {
		handleSizeChange(limit) {
			this.limit = limit;
			this.getSkuList();
		},
		async getSkuList(pages = 1) {
			this.page = pages;
			// 解构出默认的参数
			const { page, limit } = this;
			let result = await this.$API.sku.reqSkuList(page, limit);
			if (result.code == 200) {
				this.total = result.data.total;
				this.records = result.data.records;
			}
		},
		// 上架sku
		async shelveSku(row) {
			let result = await this.$API.sku.reqSale(row.id);
			if (result.code == 200) {
				row.isSale = 1;
				this.$message({ type: "success", message: "上架成功" });
			}
		},
		// 下架sku
		async disableSku(row) {
			let result = await this.$API.sku.reqCancel(row.id);
			if (result.code == 200) {
				row.isSale = 0;
				this.$message({ type: "success", message: "下架成功" });
			}
		},
	},
	mounted() {
		// 获取sku列表的方法
		this.getSkuList();
	},
};
</script>

<style lang="" scoped></style>
