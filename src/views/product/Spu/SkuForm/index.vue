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
						<el-checkbox
							v-model="attr.checked"
							style="margin-right: 10px"
							@change="attr.checked ? '' : (attr.attrIdAndValueId = '')"
						></el-checkbox>
						<el-select
							placeholder="请选择"
							v-model="attr.attrIdAndValueId"
							:disabled="!attr.checked"
						>
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
						<el-checkbox
							v-model="saleAttr.checked"
							style="margin-right: 10px"
							@change="saleAttr.checked ? '' : (saleAttr.attrIdAndValueId = '')"
						></el-checkbox>
						<el-select
							placeholder="请选择"
							v-model="saleAttr.attrIdAndValueId"
							:disabled="!saleAttr.checked"
						>
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
				<el-table
					style="width: 100%"
					border
					:data="spuImageList"
					@selection-change="handleSelectionChange"
					ref="imageTable"
				>
					<el-table-column
						type="selection"
						prop=""
						width="60"
					></el-table-column>
					<el-table-column prop="" label="图片" width="width">
						<template slot-scope="{ row }">
							<img :src="row.imgUrl" style="width: 100px; height: 100px" />
						</template>
					</el-table-column>
					<el-table-column
						prop="imgName"
						label="名称"
						width="width"
					></el-table-column>
					<el-table-column prop="" label="操作" width="width">
						<template slot-scope="{ row }">
							<el-button
								type="primary"
								:disabled="!row.isSelected"
								v-if="row.isDefault == 0"
								@click="changeDefault(row)"
								>设置默认</el-button
							>
							<el-button v-else>默认</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="save">保存</el-button>
				<el-button @click="cancel">取消</el-button>
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
				// 这5个是父组件给的数据（总共6个。下面的spu算1个）
				category1Id: 0,
				category2Id: 0,
				category3Id: 0,
				spuId: 0,
				tmId: 0,
				// 这4个是通过v-model收集的数据
				skuName: "",
				price: "",
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
			// 这个也是父组件给的数据（总共6个，上面有5个）
			spu: {},
			// 收集图片勾中的那些图片的数据
			imageList: [],
		};
	},
	methods: {
		async getData(category1Id, category2Id, spu) {
			// 收集父组件给予的数据
			this.skuInfo.category1Id = spu.category1Id;
			this.skuInfo.category2Id = spu.category2Id;
			this.skuInfo.category3Id = spu.category3Id;
			this.skuInfo.spuId = spu.id;
			this.skuInfo.tmId = spu.tmId;
			this.spu = spu;
			// 获取图片的数据
			let result0 = await this.$API.spu.reqSpuImageList(spu.id);
			if (result0.code == 200) {
				let list = result0.data;
				list.forEach((item) => {
					// 收集数据的同时为每个图片数据加个叫isDefault的属性，用来今后确定这是否是默认图片
					item.isDefault = 0;
					// 收集数据的同时为每个图片数据加个叫isSelected的属性，用于动态控制“设为默认”按钮是否可被点击
					item.isSelected = false;
				});
				this.spuImageList = list;
			}
			// 获取销售属性的数据
			let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
			if (result1.code == 200) {
				this.spuSaleAttrList = result1.data;
			}
			// 获取平台属性的数据
			let result2 = await this.$API.spu.reqAttrInfoList(
				category1Id,
				category2Id,
				spu.category3Id
			);
			if (result2.code == 200) {
				this.attrInfoList = result2.data;
			}
		},
		// 这是那个复选框的回调，这个params是勾中的那一堆东西的数据
		handleSelectionChange(params) {
			this.spuImageList.forEach((spuImage) => {
				// 如果includes(spuImage)，那就意味着被勾选了，则返回true，刚好赋给isSelected
				spuImage.isSelected = params.includes(spuImage);

				// 如果默认图片被取消勾选，撤销操作并显示警告
				const isSelected = params.includes(spuImage);
				if (spuImage.isDefault === 1 && !isSelected) {
					// 重新勾上
					this.$refs.imageTable.toggleRowSelection(spuImage, true);
					this.$message.warning("默认图片不能被取消勾选");
					return;
				}
			});
			this.imageList = params;
		},
		changeDefault(row) {
			// 将图片列表的数据的isDefault先都变为0
			this.spuImageList.forEach((item) => {
				item.isDefault = 0;
			});
			// 点击的那个图片的isDefault变为1
			row.isDefault = 1;
			// 收集默认图片的图片地址供上传服务器用
			this.skuInfo.skuDefaultImg = row.imgUrl;
		},
		cancel() {
			// 让父组件把场景切换为0
			this.$emit("changeScenes", 0);
			// 清除数据
			Object.assign(this._data, this.$options.data());
		},
		async save() {
			// 解构
			const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
			// 在发送请求前要先整理参数，从而迎合服务器的所需的数据的格式
			skuInfo.skuAttrValueList = attrInfoList
				.filter((attr) => attr.checked)
				.reduce((prev, item) => {
					// 用户在下拉框中选完后，才会有一个叫attrIdAndValueId的字段
					if (item.attrIdAndValueId) {
						const [attrId, valueId] = item.attrIdAndValueId.split(":");
						prev.push({ attrId, valueId });
					}
					return prev;
				}, []);
			skuInfo.skuSaleAttrValueList = spuSaleAttrList
				.filter((saleAttr) => saleAttr.checked)
				.reduce((prev, item) => {
					if (item.attrIdAndValueId) {
						const [saleAttrId, saleAttrValueId] =
							item.attrIdAndValueId.split(":");
						prev.push({ saleAttrId, saleAttrValueId });
					}
					return prev;
				}, []);
			skuInfo.skuImageList = imageList.map((item) => {
				return {
					imgName: item.imgName,
					imgUrl: item.imgUrl,
					isDefault: item.isDefault,
					spuImgId: item.id,
				};
			});
			// 发请求
			let result = await this.$API.spu.reqAddSku(skuInfo);
			if (result.code == 200) {
				this.$message({ type: "success", message: "添加SKU成功" });
				// 添加成功后切一下scene
				this.$emit("changeScenes", 0);
				// 清除数据
				Object.assign(this._data, this.$options.data());
			}
		},
	},
};
</script>

<style lang="" scoped></style>
