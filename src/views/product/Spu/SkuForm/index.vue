<template>
	<div>
		<el-form ref="form" label-width="80px">
			<el-form-item label="SPU名称"> 这是SPU名称 </el-form-item>
			<el-form-item label="SKU名称">
				<el-input placeholder="sku名称"></el-input>
			</el-form-item>
			<el-form-item label="价格(元)">
				<el-input placeholder="价格(元)"></el-input>
			</el-form-item>
			<el-form-item label="重量(千克)">
				<el-input placeholder="重量(千克)"></el-input>
			</el-form-item>
			<el-form-item label="规格描述">
				<el-input type="textarea" rows="4"></el-input>
			</el-form-item>
			<el-form-item label="平台属性">
				<el-form :inline="true" ref="form" label-width="80px">
					<el-form-item label="屏幕尺寸">
						<el-select placeholder="请选择" value="">
							<el-option label="label" value="value"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-form-item>
			<el-form-item label="销售属性">
				<el-form :inline="true" ref="form" label-width="80px">
					<el-form-item label="颜色">
						<el-select placeholder="请选择" value="">
							<el-option label="label" value="value"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-form-item>
			<el-form-item label="图片列表">
				<el-table style="width: 100%" border>
					<el-table-column
						type="selection"
						prop=""
						label=""
						width="60"
					></el-table-column>
					<el-table-column prop="" label="图片" width="width"></el-table-column>
					<el-table-column prop="" label="名称" width="width"></el-table-column>
					<el-table-column prop="" label="操作" width="width"></el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item>
				<el-button type="primary">保存</el-button>
				<el-button>取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	name: "",
	data() {
		return {
			// 存储图片的信息
			spuImageList: [],
			// 存储销售是属性
			spuSaleAttrList: [],
			// 存储平台属性的数据
			attrInfoList: [],
		};
	},
	methods: {
		async getData(category1Id, category2Id, spu) {
			// 获取图片的数据
			let result0 = await this.$API.sku.reqSpuImageLIst(spu.id);
			if (result0.code == 200) {
				this.spuImageList = result0.data;
			}
			// 获取销售属性的数据
			let result1 = await this.$API.sku.reqSpuSaleAttrList(spu.id);
			if (result1.code == 200) {
				this.spuSaleAttrList = result1.data;
			}
			// 获取平台属性的数据
			let result2 = await this.$API.sku.reqAttrInfoList(
				category1Id,
				category2Id,
				spu.category3Id
			);
			if (result2.code == 200) {
				this.attrInfoList = result2.data;
			}
		},
	},
};
</script>

<style lang="" scoped></style>
