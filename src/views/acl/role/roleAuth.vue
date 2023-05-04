<template>
	<div>
		<el-input disabled :value="$route.query.roleName"></el-input>
		<el-tree
			style="margin: 20px 0"
			ref="tree"
			:data="allPermissions"
			node-key="id"
			show-checkbox
			default-expand-all
			:props="defaultProps"
		/>
		<el-button :loading="loading" type="primary" @click="save">保存</el-button>
		<el-button @click="$router.replace({ name: 'Role' })">取消</el-button>
	</div>
</template>
<script>
export default {
	name: "roleAuth",

	data() {
		return {
			loading: false, // 用来标识是否正在保存请求中的标识, 防止重复提交
			allPermissions: [], // 所有
			defaultProps: {
				children: "children",
				label: "name",
			},
		};
	},

	created() {
		this.init();
	},

	methods: {
		/* 
      初始化
      */
		init() {
			const roleId = this.$route.params.id;
			this.getPermissions(roleId);
		},

		/* 
      获取指定角色的权限列表
      */
		getPermissions(roleId) {
			this.$API.permission.getPermissionList().then((result) => {
				const allPermissions = result.data;
				this.allPermissions = allPermissions;
				this.$API.permission.toAssign(roleId).then((result) => {
					this.$refs.tree.setCheckedKeys(result.data);
				});
			});
		},

		/* 
      保存权限列表
      */
		save() {
			const ids = this.$refs.tree
				.getCheckedKeys()
				.concat(this.$refs.tree.getHalfCheckedKeys())
				.join(",");
			this.loading = true;
			this.$API.permission
				.doAssign(this.$route.params.id, ids)
				.then((result) => {
					this.loading = false;
					this.$message.success(result.$message || "分配权限成功");
					// 必须在跳转前获取(跳转后通过this获取不到正确的数据了)
					const roleName = this.$route.query.roleName;
					const roles = this.$store.getters.roles;
					this.$router.replace("/acl/role/list", () => {
						// 跳转成功后, 判断如果更新的是当前用户对应角色的权限, 重新加载页面以获得最新的数据
						if (roles.includes(roleName)) {
							window.location.reload();
						}
					});
				});
		},
	},
};
</script>
