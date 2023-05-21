<template>
	<div class="app-container">
		<el-form inline>
			<!-- 表单元素 -->
			<el-form-item>
				<el-input
					v-model="tempSearchObj.username"
					placeholder="请输入昵称进行查询"
				/>
			</el-form-item>
			<!-- 查询与情况的按钮 -->
			<el-button type="primary" icon="el-icon-search" @click="search"
				>查询</el-button
			>
			<el-button type="default" @click="resetSearch">清空</el-button>
		</el-form>

		<div style="margin-bottom: 20px">
			<!-- 添加与批量添加按钮 -->
			<el-button type="primary" @click="showAddUser">添加</el-button>
			<el-button
				type="danger"
				@click="revomveUsers"
				:disabled="selectedIds.length === 0"
				>批量删除</el-button
			>
		</div>

		<!-- table表格：展示用户信息的地方 -->
		<el-table
			border
			stripe
			v-loading="listLoading"
			:data="users"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55" />

			<el-table-column
				type="index"
				:index="(index) => (page - 1) * limit + index + 1"
				label="序号"
				width="80"
				align="center"
			/>

			<el-table-column prop="account" label="账号" width="150" />
			<el-table-column prop="username" label="昵称" />
			<el-table-column prop="roles" label="角色" :formatter="formatRoles" />

			<el-table-column label="操作" width="230" align="center">
				<template slot-scope="{ row }">
					<el-button
						type="info"
						size="mini"
						icon="el-icon-user-solid"
						title="分配角色"
						@click="showAssignRole(row)"
					/>
					<el-button
						type="primary"
						size="mini"
						icon="el-icon-edit"
						title="修改用户"
						@click="showUpdateUser(row)"
					/>
					<el-popconfirm
						:title="`确定删除 ${row.username} 吗?`"
						@onConfirm="removeUser(row.id)"
					>
						<el-button
							style="margin-left: 10px"
							slot="reference"
							type="danger"
							size="mini"
							icon="el-icon-delete"
							title="删除用户"
						/>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页器 -->
		<el-pagination
			:current-page="page"
			:total="total"
			:page-size="limit"
			:page-sizes="[5, 10, 20]"
			style="margin-top: 20px; text-align: center"
			layout="prev, pager, next, jumper, ->, sizes, total"
			@current-change="getUsers"
			@size-change="handleSizeChange"
		/>
		<!-- 对话框的结构 -->
		<el-dialog
			:title="user.id ? '修改用户' : '添加用户'"
			:visible.sync="dialogUserVisible"
		>
			<el-form
				ref="userForm"
				:model="user"
				:rules="userRules"
				label-width="120px"
			>
				<el-form-item label="账号" prop="account">
					<el-input v-model="user.account" />
				</el-form-item>
				<el-form-item label="昵称">
					<el-input v-model="user.username" />
				</el-form-item>

				<el-form-item v-if="!user.id" label="密码" prop="password">
					<el-input v-model="user.password" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button :loading="loading" type="primary" @click="addOrUpdate"
					>确 定</el-button
				>
			</div>
		</el-dialog>

		<el-dialog
			title="设置角色"
			:visible.sync="dialogRoleVisible"
			:before-close="resetRoleData"
		>
			<el-form label-width="80px">
				<el-form-item label="账号">
					<el-input disabled :value="user.account"></el-input>
				</el-form-item>

				<el-form-item label="角色">
					<el-checkbox
						:indeterminate="isIndeterminate"
						v-model="checkAll"
						@change="handleCheckAllChange"
						>全选</el-checkbox
					>
					<div style="margin: 15px 0"></div>
					<el-checkbox-group
						v-model="userRoleIds"
						@change="handleCheckedChange"
					>
						<el-checkbox
							v-for="role in allRoles"
							:key="role.id"
							:label="role.id"
							>{{ role.roleName }}</el-checkbox
						>
					</el-checkbox-group>
				</el-form-item>
			</el-form>

			<div slot="footer">
				<el-button :loading="loading" type="primary" @click="assignRole"
					>保存</el-button
				>
				<el-button @click="resetRoleData">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import { validUsername, validPassword } from "@/utils/validate";

export default {
	name: "AclUserList",
	mounted() {
		this.getUsers();
	},
	data() {
		const validateUsername = (rule, value, callback) => {
			if (!validUsername(value)) {
				callback(new Error("账号由大小写字母或数字组成，长度在4到8个字符之间"));
			} else {
				callback();
			}
		};
		const validatePassword = (rule, value, callback) => {
			if (!validPassword(value)) {
				callback(
					new Error(
						"密码由大小写字母、数字或特殊字符组成，长度在8到20个字符之间"
					)
				);
			} else {
				callback();
			}
		};
		return {
			// 是否显示列表加载的提示
			listLoading: false,
			searchObj: {
				// 包含请求搜索条件数据的对象
				username: "",
			},
			tempSearchObj: {
				// 收集搜索条件输入的对象
				username: "",
			},
			// 所有选择的user的id的数组
			selectedIds: [],
			// 当前页的用户列表
			users: [],
			page: 1,
			limit: 5,
			total: 0,
			// 当前要操作的user
			user: {},
			// 是否显示用户添加/修改的dialog
			dialogUserVisible: false,
			userRules: {
				// 用户添加/修改表单的校验规则
				account: [
					{ required: true, trigger: "blur", validator: validateUsername },
				],
				password: [
					{ required: true, trigger: "blur", validator: validatePassword },
				],
			},
			// 是否正在提交请求中
			loading: false,
			// 是否显示角色Dialog
			dialogRoleVisible: false,
			// 所有角色列表
			allRoles: [],
			// 用户的角色ID的列表
			userRoleIds: [],
			// 是否是不确定的
			isIndeterminate: false,
			// 是否全选
			checkAll: false,
		};
	},
	methods: {
		formatRoles(row, column, cellValue) {
			// 检查 cellValue 是否为 null 或 undefined，如果是，则返回一个空字符串
			if (!cellValue) {
				return "";
			}
			// 使用数组的 join() 方法将数组元素连接成一个字符串，元素之间用逗号分隔
			return cellValue.join("，");
		},
		// 显示指定角色的界面
		showAssignRole(user) {
			this.user = user;
			this.dialogRoleVisible = true;
			this.getRoles();
		},
		// 全选勾选状态发生改变的监听
		handleCheckAllChange(value) {
			// value 当前勾选状态true/false
			// 如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
			this.userRoleIds = value ? this.allRoles.map((item) => item.id) : [];
			// 如果当前不是全选也不全不选时, 指定为false
			this.isIndeterminate = false;
		},
		// 异步获取用户的角色列表
		async getRoles() {
			const result = await this.$API.user.getRoles(this.user.id);
			const { allRolesList, assignRoles } = result.data;
			this.allRoles = allRolesList;
			this.userRoleIds = assignRoles.map((item) => item.id);

			this.checkAll = allRolesList.length === assignRoles.length;
			this.isIndeterminate =
				assignRoles.length > 0 && assignRoles.length < allRolesList.length;
		},
		// 角色列表选中项发生改变的监听
		handleCheckedChange(value) {
			const { userRoleIds, allRoles } = this;
			this.checkAll =
				userRoleIds.length === allRoles.length && allRoles.length > 0;
			this.isIndeterminate =
				userRoleIds.length > 0 && userRoleIds.length < allRoles.length;
		},
		// 请求给用户进行角色授权
		async assignRole() {
			const userId = this.user.id;
			const roleIds = this.userRoleIds.join(",");
			this.loading = true;
			const result = await this.$API.user.assignRoles(userId, roleIds);
			this.loading = false;
			this.$message.success(result.message || "分配角色成功");
			this.getUsers(this.page);
			this.resetRoleData();

			if (this.$store.getters.name === this.user.username) {
				window.location.reload();
			}
		},
		// 重置用户角色的数据
		resetRoleData() {
			this.dialogRoleVisible = false;
			this.allRoles = [];
			this.userRoleIds = [];
			this.isIndeterminate = false;
			this.checkAll = false;
		},
		// 根据输入进行搜索
		search() {
			this.searchObj = { ...this.tempSearchObj };
			this.getUsers();
		},
		// 重置输入后搜索
		resetSearch() {
			this.searchObj = {
				username: "",
			};
			this.tempSearchObj = {
				username: "",
			};
			this.getUsers();
		},
		// 显示添加用户的界面
		showAddUser() {
			this.user = {};
			this.dialogUserVisible = true;
			// 重置表单的验证规则
			this.$nextTick(() => this.$refs.userForm.clearValidate());
		},
		// 删除所有选中的用户
		revomveUsers() {
			this.$confirm("确定删除吗?")
				.then(async () => {
					await this.$API.user.removeUsers(this.selectedIds);
					this.$message.success("删除成功");
					this.getUsers();
				})
				.catch(() => {});
		},
		// 列表选中状态发生改变的监听回调
		handleSelectionChange(selection) {
			this.selectedIds = selection.map((item) => item.id);
		},
		// 显示更新用户的界面
		showUpdateUser(user) {
			this.user = cloneDeep(user);
			this.dialogUserVisible = true;
		},
		// 删除某个用户
		async removeUser(id) {
			await this.$API.user.removeById(id);
			this.$message.success("删除成功");
			// 如果是本页的数据个数大于1，则停留在当前页，否则停在前一页（期间注意不能让page减成0了）
			let page = 0;
			if (this.users.length > 1) {
				page = this.page;
			} else {
				if (this.page > 1) {
					page = this.page - 1;
				} else {
					page = 1;
				}
			}
			this.getUsers(page);
		},
		// 获取分页列表
		async getUsers(page = 1) {
			this.page = page;
			const { limit, searchObj } = this;
			this.listLoading = true;
			const result = await this.$API.user.getPageList(page, limit, searchObj);
			this.listLoading = false;
			const { items, total } = result.data;
			this.users = items.filter((item) => item.account !== "admin");
			this.total = total - 1;
			this.selectedIds = [];
		},
		// 处理pageSize发生改变的监听回调
		handleSizeChange(pageSize) {
			this.limit = pageSize;
			this.getUsers();
		},
		// 取消用户的保存或更新
		cancel() {
			this.dialogUserVisible = false;
			this.user = {};
		},
		// 保存或者更新用户
		addOrUpdate() {
			this.$refs.userForm.validate((valid) => {
				if (valid) {
					const { user } = this;
					this.loading = true;
					this.$API.user[user.id ? "update" : "add"](user).then((result) => {
						if (result.code === 200) {
							this.loading = false;
							this.$message.success("保存成功！");
							this.getUsers(user.id ? this.page : 1);
							this.user = {};
							this.dialogUserVisible = false;
						} else if (result.code === 201) {
							this.loading = false;
							this.$message.error("此账号已被注册，请输入其他账号！");
						}
					});
				}
			});
		},
	},
};
</script>
