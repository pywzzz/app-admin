<template>
	<div>
		<el-card style="margin: 20px 0px">
			<!-- 用自定义事件@getCategoryId实现子组件CategorySelect向父组件Attr传参 -->
			<CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
		</el-card>
		<el-card></el-card>
	</div>
</template>

<script>
export default {
	name: "Attr",
	data() {
		return {
			category1Id: "",
			category2Id: "",
			category3Id: "",
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
		getAttrList() {},
	},
};
</script>

<style lang="" scoped></style>
