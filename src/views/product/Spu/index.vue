<template>
	<div>
		<el-card style="margin: 20px 0px">
			<!-- 三级列表 -->
			<CategorySelect
				@getCategoryId="getCategoryId"
				:show="scene != 0"
			></CategorySelect>
		</el-card>
		<el-card>
			<!-- 数据列表部分 -->
			<div v-show="scene == 0">
				<!-- 按钮 -->
				<el-button
					type="primary"
					icon="el-icon-plus"
					:disabled="!category3Id"
					@click="addSpu"
					>添加SPU</el-button
				>
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
								@click="addSku(row)"
							></el-button>
							<!-- 按钮 -->
							<el-button
								type="warning"
								size="mini"
								icon="el-icon-edit"
								title="修改spu"
								@click="updateSpu(row)"
							></el-button>
							<!-- 按钮 -->
							<el-button
								type="info"
								size="mini"
								icon="el-icon-info"
								title="查看当前spu全部sku列表"
								@click="getAllSkuInSpu(row)"
							></el-button>
							<el-popconfirm title="确定删除吗？" @onConfirm="deleteSpu(row)">
								<!-- 按钮 -->
								<el-button
									type="danger"
									size="mini"
									icon="el-icon-delete"
									title="删除spu"
									slot="reference"
								></el-button>
							</el-popconfirm>
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
					@current-change="getSpuList"
					@size-change="handleSizeChange"
					layout="prev, pager, next, jumper, ->, sizes, total"
				>
				</el-pagination>
			</div>
			<!-- 添加或修改SPU部分 -->
			<SpuForm
				v-show="scene == 1"
				@changeScene="changeScene"
				ref="spu"
			></SpuForm>
			<!-- 添加SKU部分 -->
			<SkuForm
				v-show="scene == 2"
				ref="sku"
				@changeScenes="changeScenes"
			></SkuForm>
		</el-card>
		<!-- 展示一个SPU中的所含有的所有SKU -->
		<el-dialog
			:title="`${spu.spuName}的sku列表`"
			:visible.sync="dialogTableVisible"
			:before-close="close"
		>
			<el-table :data="skuList" style="width: 100%" border v-loading="loading">
				<el-table-column prop="skuName" label="名称" width="width">
				</el-table-column>
				<el-table-column prop="price" label="价格" width="width">
				</el-table-column>
				<el-table-column prop="weight" label="重量" width="width">
				</el-table-column>
				<el-table-column label="默认图片" width="width">
					<template slot-scope="{ row }">
						<img
							:src="row.skuDefaultImg"
							alt=""
							style="width: 100px; height: 100px"
						/>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
// 引入子组件
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
	name: "Spu",
	// 注册子组件
	components: {
		SpuForm,
		SkuForm,
	},
	data() {
		return {
			// 各级列表的id
			category1Id: "",
			category2Id: "",
			category3Id: "",
			page: 1,
			limit: 5,
			total: 0,
			records: [],
			// 0代表显示“数据列表"，1代表显示“添加或修改SPU”，2代表显示“添加SKU”
			scene: 0,
			// 控制对话框的显示与隐藏
			dialogTableVisible: false,
			spu: {},
			// 存储一个SPU中含的那些SKU
			skuList: [],
			loading: true,
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
		// 这儿的形参名必须写pages，因为这儿用到了解构
		async getSpuList(pages = 1) {
			this.page = pages;
			const { page, limit, category3Id } = this;
			let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
			if (result.code == 200) {
				this.total = result.data.total;
				this.records = result.data.records;
			}
		},
		handleSizeChange(limit) {
			this.limit = limit;
			this.getSpuList();
		},
		addSpu() {
			this.scene = 1;
			// 通知子组件SpuForm发请求（添加操作只用发2个参数，修改操作是4个）
			// 顺便把category3Id传过去。因为添加时本身是没有category3Id的
			// 修改时的category3Id是从服务器取得的
			this.$refs.spu.addSpuData(this.category3Id);
		},
		updateSpu(row) {
			this.scene = 1;
			// 拿到子组件的initSpuData方法，用来获取数据
			this.$refs.spu.initSpuData(row);
		},
		changeScene({ scene, flag }) {
			this.scene = scene;
			// 这一步重新获取数据是针对保存按钮弄的，取消按钮其实不用这一步
			if (flag == "修改") {
				// 停留在当前页
				this.getSpuList(this.page);
			} else {
				// 停留到第一页（getSpuList的参数的默认值你设置的是1）
				this.getSpuList();
			}
		},
		async deleteSpu(row) {
			let result = await this.$API.spu.reqDeleteSpu(row.id);
			if (result.code == 200) {
				this.$message({ type: "success", message: "删除成功" });
				// 代表SPU个数大于1，则删除后停留在当前页，如果SPU个数小于1，则删除后回到上一页
				this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
			}
		},
		addSku(row) {
			this.scene = 2;
			this.$refs.sku.getData(this.category1Id, this.category2Id, row);
		},
		// 这个是SkuForm的取消按钮用的
		changeScenes(scene) {
			this.scene = scene;
		},
		// 查看一个SPU中含有的所有SKU
		async getAllSkuInSpu(spu) {
			// 点击后显示对话框
			this.dialogTableVisible = true;
			//保存spu信息
			this.spu = spu;
			//获取sku列表的数据进行展示
			let result = await this.$API.spu.reqSkuList(spu.id);
			if (result.code == 200) {
				this.skuList = result.data;
				this.loading = false;
			}
		},
		// 关闭对话框时执这个
		close(done) {
			// 让loading属性再次变为真
			this.loading = true;
			// 清除sku列表的数据
			this.skuList = [];
			// 关闭对话框
			done();
		},
	},
};
</script>

<style lang="" scoped></style>
