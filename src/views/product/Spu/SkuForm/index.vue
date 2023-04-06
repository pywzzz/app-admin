<template>
	<div>
		<el-form ref="form" label-width="80px">
			<el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
			<el-form-item label="SKU名称">
				<el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
			</el-form-item>
			<el-form-item label="价格(元)">
				<el-input
					placeholder="价格(元)"
					type="number"
					v-model="skuInfo.price"
				></el-input>
			</el-form-item>
			<el-form-item label="重量(千克)">
				<el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
			</el-form-item>
			<el-form-item label="规格描述">
				<el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
			</el-form-item>
			<el-form-item label="平台属性">
				<el-form :inline="true" ref="form" label-width="80px">
					<el-form-item
						:label="attr.attrName"
						v-for="attr in attrInfoList"
						:key="attr.id"
					>
						<el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
							<el-option
								:label="attrValue.valueName"
								:value="`${attr.id}:${attrValue.id}`"
								v-for="attrValue in attr.attrValueList"
								:key="attrValue.id"
							></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-form-item>
			<el-form-item label="销售属性">
				<el-form :inline="true" ref="form" label-width="80px">
					<el-form-item
						:label="saleAttr.saleAttrName"
						v-for="saleAttr in spuSaleAttrList"
						:key="saleAttr.id"
					>
						<el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
							<el-option
								:label="saleAttrValue.saleAttrValueName"
								:value="`${saleAttr.id}:${saleAttrValue.id}`"
								v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
								:key="saleAttrValue.id"
							></el-option>
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
			// 收集sku数据的字段
			skuInfo: {
				// 这3个是父组件给的数据（总共4个。下面的spu算1个）
				category3Id: 0,
				spuId: 0,
				tmId: 0,
				// 这4个是通过v-model收集的数据
				skuName: "",
				price: 0,
				weight: "",
				skuDesc: "",
				// 下面4个数据是用户自己弄的
				// 自己设置的默认图片
				skuDefaultImg: "",
				// 图片
				skuImageList: [],
				// 平台属性
				skuAttrValueList: [],
				// 销售属性
				skuSaleAttrValueList: [],
			},
			// 这个也是父组件给的数据（总共4个，上面有3个）
			spu: {},
		};
	},
	methods: {
		async getData(category1Id, category2Id, spu) {
			// 收集父组件给予的数据
			this.skuInfo.category3Id = spu.category3Id;
			this.skuInfo.spuId = spu.id;
			this.skuInfo.tmId = spu.tmId;
			this.spu = spu;
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
