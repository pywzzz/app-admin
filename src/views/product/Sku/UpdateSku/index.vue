<template>
	<div>
		<el-form ref="form" label-width="80px">
			<el-form-item label="SPU名称"> {{ skuInfo.spuName }} </el-form-item>
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
						label="图片名称"
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
			// 下面三个用于初始化平台属性列表、销售属性列表、图片列表
			initAttr: [],
			initSaleAttr: [],
			initImg: [],
			// 存储图片的信息
			spuImageList: [],
			// 存储销售是属性
			spuSaleAttrList: [],
			// 存储平台属性的数据
			attrInfoList: [],
			// 收集sku数据的字段
			skuInfo: {
				id: 0,
				spuName: "",
				spuId: 0,
				tmId: 0,
				// 这4个是通过v-model收集的数据
				skuName: "",
				price: 0,
				weight: "",
				skuDesc: "",
				// 下面4个数据由用户决定
				// 默认图片
				skuDefaultImg: "",
				// 图片
				skuImageList: [],
				// 平台属性
				skuAttrValueList: [],
				// 销售属性
				skuSaleAttrValueList: [],
			},
			// 收集图片勾中的那些图片的数据
			imageList: [],
		};
	},
	methods: {
		async getData(skuInfo) {
			this.skuInfo.id = skuInfo.id;
			this.skuInfo.spuId = skuInfo.spuId;
			this.skuInfo.tmId = skuInfo.tmId;
			this.skuInfo.spuName = skuInfo.spuName;

			this.skuInfo.skuName = skuInfo.skuName;
			this.skuInfo.skuDesc = skuInfo.skuDesc;
			this.skuInfo.price = skuInfo.price;
			this.skuInfo.weight = skuInfo.weight;

			// 这个好像没用到
			this.skuInfo.skuDefaultImg = skuInfo.skuDefaultImg;

			// 获取SKU数据
			let result = await this.$API.sku.reqSkuById(skuInfo.id);
			if (result.code == 200) {
				this.initAttr = result.data.skuAttrValueList;
				this.initSaleAttr = result.data.skuSaleAttrValueList;
				this.initImg = result.data.skuImageList;
			}

			// 获取图片的数据
			let result0 = await this.$API.spu.reqSpuImageLIst(skuInfo.spuId);
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

			// 下面是为图片列表弄上这个sku本身已经勾选的图片及默认按钮
			this.initImg.forEach((initImage) => {
				const spuImage = this.spuImageList.find(
					(image) => image.imgUrl === initImage.imgUrl
				);
				if (spuImage) {
					// 勾选的逻辑必须写在$nextTick中
					this.$nextTick(() => {
						this.$refs.imageTable.toggleRowSelection(spuImage, true);
						// 弄默认按钮
						spuImage.isDefault = initImage.isDefault;
					});
				}
			});

			// 获取销售属性的数据
			let result1 = await this.$API.spu.reqSpuSaleAttrList(skuInfo.spuId);
			if (result1.code == 200) {
				// saleAttrInfo是result1.data数组中的元素（这个元素是一个对象）
				this.spuSaleAttrList = result1.data.map((saleAttrInfo) => {
					// 如果找到了 saleAttrId=id 的那些，就放在foundSaleAttr数组中
					const foundSaleAttr = this.initSaleAttr.find(
						(initSaleAttrItem) =>
							initSaleAttrItem.saleAttrId === saleAttrInfo.id
					);
					// 给这些找到的，设置attrIdAndValueId
					if (foundSaleAttr) {
						return {
							// 先创建一个全新的，但内容和此次遍历相同的saleAttrInfo
							...saleAttrInfo,
							// 向里面加个attrIdAndValueId字段
							attrIdAndValueId: `${foundSaleAttr.saleAttrId}:${foundSaleAttr.saleAttrValueId}`,
						};
					} else {
						// 如果没有找到匹配的元素，返回原始的saleAttrInfo
						return saleAttrInfo;
					}
				});
			}
			// 获取平台属性的数据
			// 这里应该填category1、2、3的id
			let result2 = await this.$API.spu.reqAttrInfoList(74, 75, 76);
			if (result2.code == 200) {
				// attrInfo是result2.data数组中的元素（这个元素是一个对象）
				this.attrInfoList = result2.data.map((attrInfo) => {
					// 如果找到了 attrId=id 的那些，就放在foundAttr数组中
					const foundAttr = this.initAttr.find(
						(initAttrItem) => initAttrItem.attrId === attrInfo.id
					);
					// 给这些找到的，设置attrIdAndValueId
					if (foundAttr) {
						return {
							// 先创建一个全新的，但内容和此次遍历相同的attrInfo
							...attrInfo,
							// 向里面加个attrIdAndValueId字段
							attrIdAndValueId: `${foundAttr.attrId}:${foundAttr.valueId}`,
						};
					} else {
						// 如果没有找到匹配的元素，返回原始的attrInfo
						return attrInfo;
					}
				});
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
			this.$emit("changeScene", 0);
			// 清除数据
			Object.assign(this._data, this.$options.data());
		},
		async save() {
			// 解构
			const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
			// 在发送请求前要先整理参数，从而迎合服务器的所需的数据的格式
			skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
				// 用户在下拉框中选完后，才会有一个叫attrIdAndValueId的字段
				if (item.attrIdAndValueId) {
					const [attrId, valueId] = item.attrIdAndValueId.split(":");
					prev.push({ attrId, valueId });
				}
				return prev;
			}, []);
			skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
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
			let result = await this.$API.sku.reqUpdateSku(skuInfo);
			if (result.code == 200) {
				this.$message({ type: "success", message: "保存成功" });
				// 添加成功后切一下scene
				this.$emit("changeScene", 0);
			}
		},
	},
};
</script>

<style lang="" scoped></style>
