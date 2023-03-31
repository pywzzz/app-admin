<template>
	<div>
		<el-card style="margin: 20px 0px">
			<!-- 用自定义事件@getCategoryId实现子组件CategorySelect向父组件Attr传参 -->
			<CategorySelect
				@getCategoryId="getCategoryId"
				:show="!isShowTable"
			></CategorySelect>
		</el-card>
		<el-card>
			<!-- 三级列表筛后的，属性，的展示部分 -->
			<div v-show="isShowTable">
				<!-- disabled属性使“添加属性”这个按钮只有在三级列表都选了后，才能点 -->
				<el-button
					type="primary"
					icon="el-icon-plus"
					:disabled="!category3Id"
					@click="addAttr"
					>添加属性</el-button
				>
				<el-table style="width: 100%" border :data="attrList">
					<el-table-column type="index" label="序号" width="80" align="center">
					</el-table-column>
					<el-table-column prop="attrName" label="属性名称" width="150">
					</el-table-column>
					<el-table-column prop="prop" label="属性值列表" width="width">
						<template slot-scope="{ row }">
							<el-tag
								type="success"
								style="margin: 0px 10px"
								v-for="attrValue in row.attrValueList"
								:key="attrValue.id"
								>{{ attrValue.valueName }}</el-tag
							>
						</template>
					</el-table-column>
					<el-table-column prop="prop" label="操作" width="150">
						<template slot-scope="{ row }">
							<!-- 修改按钮 -->
							<el-button
								type="warning"
								size="mini"
								icon="el-icon-edit"
								@click="updateAttr(row)"
							></el-button>
							<!-- 删除按钮 -->
							<el-button
								type="danger"
								size="mini"
								icon="el-icon-delete"
							></el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<!-- 添加或修改属性的部分 -->
			<div v-show="!isShowTable">
				<el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
					<el-form-item label="属性名">
						<el-input
							placeholder="请输入属性名"
							v-model="attrInfo.attrName"
						></el-input>
					</el-form-item>
				</el-form>
				<!-- disabled使“属性名”这个框中有东西时才可以点“添加属性值”这按钮 -->
				<el-button
					type="primary"
					icon="el-icon-plus"
					@click="addAttrValue"
					:disabled="!attrInfo.attrName"
					>添加属性值</el-button
				>
				<el-button @click="isShowTable = true">取消</el-button>
				<el-table
					style="width: 100%; margin: 20px 0px"
					border
					:data="attrInfo.attrValueList"
				>
					<el-table-column align="center" type="index" label="序号" width="80">
					</el-table-column>
					<el-table-column prop="prop" label="属性值名称" width="width">
						<template slot-scope="{ row, $index }">
							<!-- 输属性值的地方 -->
							<el-input
								v-model="row.valueName"
								placeholder="请输入属性值名称"
								size="mini"
								v-if="row.flag"
								@blur="toLook(row)"
								@keyup.native.enter="toLook(row)"
								:ref="$index"
							></el-input>
							<!-- 这儿用style让span变成一个block，即“块”，因为span太小了，你click不到 -->
							<span
								v-else
								@click="toEdit(row, $index)"
								style="display: block"
								>{{ row.valueName }}</span
							>
						</template>
					</el-table-column>
					<el-table-column prop="prop" label="操作" width="width">
						<template slot-scope="{ row, $index }">
							<!-- 气泡确认框 -->
							<!-- @onConfirm是点击确定按钮后执的事件（新版本的写法是@confirm） -->
							<el-popconfirm
								:title="`确定删除“${row.valueName}”吗？`"
								@onConfirm="deleteAttrValue($index)"
							>
								<!-- 删除按钮 -->
								<el-button
									type="danger"
									icon="el-icon-delete"
									size="mini"
									slot="reference"
								></el-button>
							</el-popconfirm>
						</template>
					</el-table-column>
				</el-table>
				<el-button
					type="primary"
					@click="addOrUpdateAttr"
					:disabled="attrInfo.attrValueList.length < 1"
					>保存</el-button
				>
				<el-button @click="isShowTable = true">取消</el-button>
			</div>
		</el-card>
	</div>
</template>

<script>
// 按需引入lodash中的深拷贝函数cloneDeep
import cloneDeep from "lodash/cloneDeep";
export default {
	name: "Attr",
	data() {
		return {
			category1Id: "",
			category2Id: "",
			category3Id: "",
			//存由三级列表筛后的，产品数据
			attrList: [],
			isShowTable: true,
			attrInfo: {
				//属性名
				attrName: "",
				//属性值
				//其中存的是如 { attrId: 0, valueName: "" } ，attrId为属性值对应的属性名的id，valueName为属性值
				attrValueList: [],
				//这里面存的是这个属性名，所对应三级列表的id
				categoryId: 0,
				//区分是几级列表的id
				categoryLevel: 3,
			},
		};
	},
	methods: {
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
				this.getAttrList();
			}
		},
		async getAttrList() {
			//获取分类的ID
			const { category1Id, category2Id, category3Id } = this;
			//获取属性列表的数据
			let result = await this.$API.attr.reqAttrList(
				category1Id,
				category2Id,
				category3Id
			);
			if (result.code == 200) {
				this.attrList = result.data;
			}
		},
		addAttrValue() {
			// attrId为属性值对应的属性名的id，valueName为属性值
			this.attrInfo.attrValueList.push({
				/* 如果是修改操作，因为是“修改”，所以属性名这东西是存在的（要不你改谁），有属性名那自然有属性名id，即
				存在attrInfo.id，所以attrId值会为attrInfo.id（这个id字段的是由updateAttr中深拷贝得到的，你
				其实在data下的attrInfo中并没有定义id字段）（别在id字段哪儿来的这地方迷）  */
				// 如果是添加操作，则本身是没有属性名的，所以更没有属性名id，所以attrId值会为undefined
				attrId: this.attrInfo.id,
				valueName: "",
				// 给每一个新添加的属性值，一个，flag属性，它用来控制是显示span标签（应在失焦状态显示）还是显示input标签（应在编辑状态）
				flag: true,
			});
			this.$nextTick(() => {
				// 新添加的item总是在最后一个位置，减1是因为数组的索引值是从0开始的
				this.$refs[this.attrInfo.attrValueList.length - 1].focus();
			});
		},
		addAttr() {
			//切换table显示与隐藏
			this.isShowTable = false;
			//清除数据
			this.attrInfo = {
				attrName: "",
				attrValueList: [],
				// 手机第三级列表的id
				categoryId: this.category3Id,
				categoryLevel: 3,
			};
		},
		updateAttr(row) {
			//// 切换table显示与隐藏
			this.isShowTable = false;
			// 将选中的属性赋值给attrInfo
			/* 直接 = row 的话，你是直接修改服务器数据了，即直接修改原始数据了，会导致你不点改的同时
			数据会直接变就，不点“保存”或“取消”按钮，数据都实时改变 */
			// 但这儿的attrInfo这个数据，的结构当中存在对象里套数组、数组里套对象，所以得用深拷贝
			// 浅拷贝的那个是在18
			/* 这个操作会，使得你的attrInfo中多出一个id字段，这个字段是因为row中定义了，而你又cloneDeep，所以
			你的attrInfo也就多了个id字段（尽管你在data的attrInfo中并没有定义id字段） */
			this.attrInfo = cloneDeep(row);
			// 不加的话从，那些由三级列表筛出的属性，你点修改按钮后，因为唯有flag属性的缘故，所以无法让其变成input框供我们去修改
			this.attrInfo.attrValueList.forEach((item) => {
				//第1个参数为添加到谁身上，第2个参数为要添加的新的响应式属性，第3个参数为新的属性的属性值
				this.$set(item, "flag", false);
			});
		},
		toLook(row) {
			// trim()去除字符串头尾空格
			if (row.valueName.trim() == "") {
				this.$message("属性值不能为空");
				return;
			}
			// 新增的属性值不能与已有的属性值重复
			let isRepeat = this.attrInfo.attrValueList.some((item) => {
				// 用这个if使row在判断重复时避免和自己本身去比较
				if (row !== item) {
					return row.valueName == item.valueName;
				}
			});
			if (isRepeat) {
				this.$message("请不要输入重复的属性值");
				return;
			}
			// 让input消失，显示span（因为input标签有个v-if，值为row.flag）
			row.flag = false;
		},
		toEdit(row, index) {
			row.flag = true;
			// 当节点渲染完毕后（从而保证有input这个节点），$nextTick执一次
			this.$nextTick(() => {
				// 利用$refs来获取相应的input表单元素实现聚焦
				// 因为index是一个变量，所以不能$refs.index，而应用这儿的这种中括号（表示枚举）$refs[index]的方式获得
				this.$refs[index].focus();
			});
		},
		deleteAttrValue(index) {
			// 删除index对应的那个属性值
			this.attrInfo.attrValueList.splice(index, 1);
		},
		async addOrUpdateAttr() {
			this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
				(item) => {
					// 把属性值不为空的那些过滤出来（空的就不传给服务器了）
					if (item.valueName != "") {
						// 删除掉提交服务器时不需要的flag属性
						delete item.flag;
						return true;
					}
				}
			);
			try {
				// 发请求，来保存数据
				await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
				// 保存成功后通过isShowTable跳转到具体数据的展示页面
				this.isShowTable = true;
				// 提示消失
				this.$message({ type: "success", message: "保存成功" });
				// 保存成功后再次获取数据
				this.getAttrList();
			} catch (error) {
				this.$message("保存失败");
			}
		},
	},
};
</script>

<style lang="" scoped></style>
