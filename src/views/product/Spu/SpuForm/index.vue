<template>
	<div>
		<el-form ref="form" label-width="80px" :model="spu">
			<el-form-item label="SPU名称">
				<el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
			</el-form-item>
			<el-form-item label="品牌">
				<el-select placeholder="请选择品牌" v-model="spu.tmId">
					<el-option
						:label="tm.tmName"
						:value="tm.id"
						v-for="tm in tradeMarkList"
						:key="tm.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="SPU描述">
				<el-input
					type="textarea"
					rows="4"
					placeholder="描述"
					v-model="spu.description"
				></el-input>
			</el-form-item>
			<el-form-item label="SPU图片">
				<el-upload
					action="https://jsonplaceholder.typicode.com/posts/"
					list-type="picture-card"
					:on-preview="handlePictureCardPreview"
					:on-remove="handleRemove"
					:file-list="spuImageList"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
					<img width="100%" :src="dialogImageUrl" alt="" />
				</el-dialog>
			</el-form-item>
			<el-form-item label="销售属性">
				<el-select
					:placeholder="`还有${unSelectSaleAttr.length}未选择`"
					v-model="attrId"
				>
					<el-option
						:label="unselect.name"
						:value="unselect.id"
						v-for="unselect in unSelectSaleAttr"
						:key="unselect.id"
					></el-option>
				</el-select>
				<el-button type="primary" icon="el-icon-plus" :disabled="!attrId"
					>添加销售属性</el-button
				>
				<el-table style="width: 100%" border :data="spu.spuSaleAttrList">
					<el-table-column
						type="index"
						label="序号"
						width="80px"
						align="center"
					>
					</el-table-column>
					<el-table-column prop="saleAttrName" label="属性名" width="width">
					</el-table-column>
					<el-table-column prop="prop" label="属性名称列表" width="width">
						<template slot-scope="{ row }">
							<!-- 展示已有的属性值 -->
							<el-tag
								:key="tag.id"
								v-for="tag in row.spuSaleAttrValueList"
								closable
								:disable-transitions="false"
								>{{ tag.saleAttrValueName }}</el-tag
							>
							<!-- 负责添加新的属性值 -->
							<el-input
								class="input-new-tag"
								v-if="row.inputVisible"
								v-model="row.inputValue"
								ref="saveTagInput"
								size="small"
							>
							</el-input>
							<!-- 一个按钮 -->
							<el-button v-else class="button-new-tag" size="small"
								>添加</el-button
							>
						</template>
					</el-table-column>
					<el-table-column prop="prop" label="操作" width="width">
						<!-- 删除的按钮 -->
						<template slot-scope="{ row }">
							<el-button
								type="danger"
								icon="el-icon-delete"
								size="mini"
							></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item>
				<el-button type="primary">保存</el-button>
				<el-button @click="$emit('changeScene', 0)">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	name: "",
	data() {
		return {
			dialogImageUrl: "",
			dialogVisible: false,
			spu: {
				// 三级分类的id
				category3Id: 0,
				// 描述
				description: "",
				// spu名称
				spuName: "",
				// 平台的id
				tmId: "",
				// 收集SPU图片的信息
				spuImageList: [],
				// 平台属性与属性值收集
				spuSaleAttrList: [],
			},
			tradeMarkList: [],
			spuImageList: [],
			saleAttrList: [],
			// 未选择的属性名的id（一共三个：尺寸、颜色、版本）
			attrId: "",
		};
	},
	computed: {
		// 计算出还未选择的销售属性还有啥
		unSelectSaleAttr() {
			// saleAttrList一共三个：尺寸、颜色、版本
			// filter是数组的过滤方法，filter中的return值为true则保留return的东西
			return this.saleAttrList.filter((item) => {
				// spuSaleAttrList是当前SPU已经有的saleAttrList
				// every是个数组的方法，会返回一个布尔值，这个布尔值刚好供filter去用
				return this.spu.spuSaleAttrList.every((item1) => {
					// 如果为真则证明没有这个，则应加到unSelectSaleAttr
					return item.name != item1.saleAttrName;
				});
			});
		},
	},
	methods: {
		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		async initSpuData(spu) {
			// 获取SPU信息的数据
			let spuResult = await this.$API.spu.reqSpu(spu.id);
			if (spuResult.code == 200) {
				this.spu = spuResult.data;
			}
			// 获取品牌的信息
			let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
			if (tradeMarkResult.code == 200) {
				this.tradeMarkList = tradeMarkResult.data;
			}
			// 获取spu图片的数据
			let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
			if (spuImageResult.code == 200) {
				// 这里为了迎合elementUI的文档要求，所以需要把服务器返回的数据进行修改
				let listArr = spuImageResult.data;
				listArr.forEach((item) => {
					item.name = item.imgName;
					item.url = item.imgUrl;
				});
				// 数据整理好后再赋值给spuImageList
				this.spuImageList = listArr;
			}
			// 获取平台全部的销售属性
			let saleResult = await this.$API.spu.reqBaseSaleAttrList();
			if (saleResult.code == 200) {
				this.saleAttrList = saleResult.data;
			}
		},
	},
};
</script>

<style>
.el-tag + .el-tag {
	margin-left: 10px;
}
.button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
</style>
