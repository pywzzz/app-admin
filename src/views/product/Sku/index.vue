<template>
	<div>
		<div v-show="scene == 0">
			<!-- 表格 -->
			<el-table style="width: 100%" border :data="records">
				<el-table-column
					type="index"
					:index="(index) => (page - 1) * limit + index + 1"
					label="序号"
					width="80"
					align="center"
				></el-table-column>
				<el-table-column
					prop="skuName"
					label="SKU名称"
					width="120"
				></el-table-column>
				<el-table-column
					prop="spuName"
					label="所属的SPU"
					width="120"
				></el-table-column>
				<el-table-column
					prop="tmName"
					label="SPU所属的品牌"
					width="150"
				></el-table-column>
				<el-table-column
					prop="skuDesc"
					label="描述"
					width="width"
				></el-table-column>
				<el-table-column label="默认图片" width="100">
					<template slot-scope="{ row }">
						<img
							:src="row.skuDefaultImg"
							alt=""
							style="width: 80px; height: 80px"
						/>
					</template>
				</el-table-column>
				<el-table-column
					prop="weight"
					label="重量(千克)"
					width="100"
				></el-table-column>
				<el-table-column
					prop="price"
					label="价格(元)"
					width="100"
				></el-table-column>
				<el-table-column label="操作" width="250">
					<template slot-scope="{ row }">
						<!-- isSale是服务器返回的数据中的一个属性，1表示已上架，0表示已下架 -->
						<el-button
							type="success"
							icon="el-icon-sort-up"
							size="mini"
							title="点我上架"
							v-if="row.isSale == 0"
							@click="shelveSku(row)"
						></el-button>
						<!-- isSale是服务器返回的数据中的一个属性，1表示已上架，0表示已下架 -->
						<el-button
							type="warning"
							icon="el-icon-sort-down"
							size="mini"
							title="点我下架"
							@click="disableSku(row)"
							v-else
						></el-button>
						<el-button
							type="primary"
							icon="el-icon-edit"
							size="mini"
							@click="updateSku(row)"
						></el-button>
						<el-button
							type="info"
							icon="el-icon-info"
							size="mini"
							@click="getSkuInfo(row)"
						></el-button>
						<el-popconfirm title="确定删除吗？" @onConfirm="deleteSku(row)">
							<!-- 按钮 -->
							<el-button
								type="danger"
								size="mini"
								icon="el-icon-delete"
								slot="reference"
								style="margin-left: 10px"
							></el-button>
						</el-popconfirm>
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
			<!-- sku详情 -->
			<el-drawer :visible.sync="show" :show-close="false" size="50%">
				<el-row>
					<el-col :span="5">商品状态：</el-col>
					<el-col :span="16">{{ saleStatus }}</el-col>
				</el-row>
				<el-row>
					<el-col :span="5">平台属性：</el-col>
					<el-col :span="16">
						<template>
							<el-tag
								type="success"
								v-for="attr in skuInfo.skuAttrValueList"
								:key="attr.id"
								style="margin-right: 10px"
								>{{ attr.attrName }}：{{ attr.valueName }}</el-tag
							>
						</template>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="5">销售属性：</el-col>
					<el-col :span="16">
						<template>
							<el-tag
								type="success"
								v-for="saleAttr in skuInfo.skuSaleAttrValueList"
								:key="saleAttr.id"
								style="margin-right: 10px"
								>{{ saleAttr.saleAttrName }}：{{ saleAttr.saleAttrValueName }}
							</el-tag>
						</template>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="5">商品图片</el-col>
					<el-col :span="16">
						<el-carousel height="450px" border>
							<el-carousel-item
								v-for="item in skuInfo.skuImageList"
								:key="item.id"
							>
								<img
									:src="item.imgUrl"
									style="object-fit: contain; width: 100%; height: 100%"
								/>
							</el-carousel-item>
						</el-carousel>
					</el-col>
				</el-row>
			</el-drawer>
		</div>
		<!-- 修改sku -->
		<UpdateSku
			v-show="scene == 1"
			ref="updateSku"
			@changeScene="changeScene"
		></UpdateSku>
	</div>
</template>

<script>
import UpdateSku from "./UpdateSku";
export default {
	name: "Sku",
	components: {
		UpdateSku,
	},
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
			// 存储sku的详情
			skuInfo: {},
			// 控制sku详情信息这部分的显示与否
			show: false,
			// 0代表显示“数据列表"，1代表显示“修改SKU”
			scene: 0,
		};
	},
	computed: {
		saleStatus() {
			return this.skuInfo.isSale == 1 ? "已上架" : "已下架";
		},
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
		// 获取某个sku的详情
		async getSkuInfo(sku) {
			// 点击后展示sku详情
			this.show = true;
			// 获取SKU数据
			let result = await this.$API.sku.reqSkuById(sku.id);
			if (result.code == 200) {
				this.skuInfo = result.data;
			}
		},
		async deleteSku(row) {
			let result = await this.$API.sku.reqDeleteSku(row.id);
			if (result.code == 200) {
				this.$message({ type: "success", message: "删除成功" });
				// 代表SPU个数大于1，则删除后停留在当前页，如果SPU个数小于1，则删除后回到上一页（期间注意不能让page减成0了）
				let page = 0;
				if (this.records.length > 1) {
					page = this.page;
				} else {
					if (page > 1) {
						page = this.page - 1;
					} else {
						page = 1;
					}
				}
				this.getSkuList(page);
			}
		},
		updateSku(row) {
			this.scene = 1;
			this.$refs.updateSku.getData(row);
		},
		// 这个是SkuForm的取消按钮用的
		changeScene(scene) {
			this.scene = scene;
		},
	},
	mounted() {
		// 获取sku列表的方法
		this.getSkuList();
	},
};
</script>

<style>
.el-carousel__item h3 {
	color: #475669;
	font-size: 14px;
	opacity: 0.75;
	line-height: 150px;
	margin: 0;
}

.el-carousel__item:nth-child(2n) {
	background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
	background-color: #d3dce6;
}

.el-carousel__button {
	width: 10px;
	height: 10px;
	background: red;
	border-radius: 50%;
}
</style>

<style scoped>
.el-row .el-col-5 {
	font-size: 18px;
	text-align: right;
}

.el-col {
	margin: 10px 10px;
}
</style>
