<template>
	<div>
		<!-- model表示表单的数据收集到哪里 -->
		<el-form :inline="true" class="demo-form-inline" :model="categoryIdForm">
			<el-form-item label="一级分类">
				<!-- 当一级分类的option，即选择框，发生变化时，调category1Handler -->
				<!-- el-select的v-model收集的是el-option的value -->
				<el-select
					placeholder="请选择"
					v-model="categoryIdForm.category1Id"
					@change="category1Handler"
				>
					<!-- value属性是为下拉框的每一个选项赋予一个唯一标识符 -->
					<el-option
						:label="c1.name"
						:value="c1.id"
						v-for="c1 in list1"
						:key="c1.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="二级分类">
				<!-- 当二级分类的option，即选择框，发生变化时，调category2Handler -->
				<!-- el-select的v-model收集的是el-option的value -->
				<el-select
					placeholder="请选择"
					v-model="categoryIdForm.category2Id"
					@change="category2Handler"
				>
					<!-- value属性是为下拉框的每一个选项赋予一个唯一标识符 -->
					<el-option
						:label="c2.name"
						:value="c2.id"
						v-for="c2 in list2"
						:key="c2.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="三级分类">
				<!-- 当三级分类的option，即选择框，发生变化时，调category3Handler -->
				<!-- el-select的v-model收集的是el-option的value -->
				<el-select
					placeholder="请选择"
					v-model="categoryIdForm.category3Id"
					@change="category3Handler"
				>
					<!-- value属性是为下拉框的每一个选项赋予一个唯一标识符 -->
					<el-option
						:label="c3.name"
						:value="c3.id"
						v-for="c3 in list3"
						:key="c3.id"
					></el-option>
				</el-select>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	name: "CategorySelect",
	data() {
		return {
			list1: [],
			list2: [],
			list3: [],
			//收集相应的一级二级三级分类的id
			categoryIdForm: {
				category1Id: "",
				category2Id: "",
				category3Id: "",
			},
		};
	},
	methods: {
		async getCategory1List() {
			//获取一级分类相关数据，一级分类的接口不用带参数
			let result = await this.$API.attr.reqCategory1List();
			if (result.code == 200) {
				this.list1 = result.data;
			}
		},
		async category1Handler() {
			const { category1Id } = this.categoryIdForm;
			let result = await this.$API.attr.reqCategory2List(category1Id);
			if (result.code == 200) {
				this.list2 = result.data;
			}
		},
		async category2Handler() {
			const { category2Id } = this.categoryIdForm;
			let result = await this.$API.attr.reqCategory3List(category2Id);
			if (result.code == 200) {
				this.list3 = result.data;
			}
		},
		category3Handler() {},
	},
	mounted() {
		// 上去先获得一级列表的数据，让用户至少有东西去点
		this.getCategory1List();
	},
};
</script>

<style lang="" scoped></style>
