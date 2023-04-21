<template>
	<div>
		<!-- 按钮 -->
		<el-button
			type="primary"
			icon="el-icon-plus"
			style="margin: 10px 0px"
			@click="showDialog"
			>添加</el-button
		>

		<!-- 表格 -->
		<!-- 这儿的 :data 属性表示传的表格数据，人规定它的值必须为数组，可以理解为v-for遍历 -->
		<el-table style="width: 100%" border :data="list">
			<!-- 利用 type="index" 来自动生成序号 -->
			<el-table-column
				type="index"
				prop="prop"
				label="序号"
				width="80px"
				align="center"
			></el-table-column>
			<!-- width值为width的话表示自适应宽度，即宽度与内容相同 -->
			<!-- 这儿的后三列均为width，所以这三个均分了宽度 -->
			<el-table-column
				prop="tmName"
				label="品牌名称"
				width="width"
			></el-table-column>
			<!-- 子组件el-table-column的数据是来源于父组件el-table的，子组件需要借助作用域插槽才可以改变数据的样式 -->
			<el-table-column prop="logoUrl" label="品牌LOGO" width="width">
				<!-- 人父组件el-table回传的数据以对象的形式放在了一个叫row的对象中，这儿解构一下 -->
				<!-- 父组件的 :data 相当于v-for，则这儿的row相当于v-for中的每一个item -->
				<!-- 这儿还可以解构出个 $index ，相当于v-for中的index -->
				<template slot-scope="{ row }">
					<img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
				</template>
			</el-table-column>
			<el-table-column prop="prop" label="操作" width="width">
				<!-- 人父组件el-table回传的数据以对象的形式放在了一个叫row的对象中，这儿解构一下 -->
				<!-- 父组件的 :data 相当于v-for，则这儿的row相当于v-for中的每一个item -->
				<!-- 这儿还可以解构出个 $index ，相当于v-for中的index -->
				<template slot-scope="{ row }">
					<el-button
						type="warning"
						size="mini"
						icon="el-icon-edit"
						title="修改品牌"
						@click="updateTrademark(row)"
					></el-button>
					<el-button
						type="danger"
						size="mini"
						icon="el-icon-delete"
						title="删除品牌"
						@click="deleteTrademark(row)"
					></el-button>
					<el-button
						type="info"
						size="mini"
						icon="el-icon-info"
						title="查看当前品牌下的全部spu"
						@click="getAllSpuInTrademark(row)"
					></el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页器 -->
		<!-- pager-count表示按钮的总数，这儿的按钮包括初始的1，末尾的xx，中间的(一般为5个)，这三部分 -->
		<!-- layout中的 -> 表示让其右边的 sizes 和 total 贴着最右边布局 -->
		<!-- @current-change在当前页改变时会触发，并返回当前页的页码 -->
		<!-- @size-change在当前页面中数据条数改变时会触发，并返回每页数据的条数 -->
		<el-pagination
			style="margin-top: 20px; text-align: center"
			:pager-count="7"
			:current-page="page"
			:page-size="limit"
			:total="total"
			:page-sizes="[5, 10, 20]"
			@current-change="handleCurrentChange"
			@size-change="handleSizeChange"
			layout="prev, pager, next, jumper, -> ,sizes, total"
		>
		</el-pagination>

		<!-- 对话框 -->
		<!-- 这个 :visible.sync 来控制对话框显示与否 -->
		<el-dialog
			:title="tmForm.id ? '修改品牌' : '添加品牌'"
			:visible.sync="dialogFormVisible"
		>
			<!-- form表单 -->
			<!-- model属性用于收集表单数据 -->
			<el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
				<el-form-item label="品牌名称" label-width="100px" prop="tmName">
					<!-- 输入框 -->
					<el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
				</el-form-item>
				<el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
					<!-- 上传图片 -->
					<!-- action属性的值为图片上传的地址 -->
					<!-- on-success属性会在图片上传成功时执行一次 -->
					<!-- before-upload属性会在图片上传之前执行一次 -->
					<el-upload
						class="avatar-uploader"
						action="/dev-api/admin/product/fileUpload"
						:show-file-list="false"
						:on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload"
					>
						<img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						<div slot="tip" class="el-upload__tip">
							只能上传jpg文件，且不超过2MB
						</div>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addOrUpdateTrademark"
					>确 定</el-button
				>
			</div>
		</el-dialog>
		<!-- 展示一个品牌中的所含有的所有SPU -->
		<el-dialog
			:title="`${spuListTitle}的spu列表`"
			:visible.sync="dialogTableVisible"
			:before-close="close"
		>
			<el-table :data="spuList" style="width: 100%" border v-loading="loading">
				<el-table-column prop="spuName" label="spu名称" width="width">
				</el-table-column>
				<el-table-column label="所属品牌" width="width">
					<template slot-scope="scope">
						<el-select placeholder="请选择品牌" v-model="scope.row.tmId">
							<el-option
								v-for="tm in tradeMarkList"
								:key="tm.id"
								:label="tm.tmName"
								:value="tm.id"
							></el-option>
						</el-select>
					</template>
				</el-table-column>
			</el-table>
			<el-button type="primary" @click="saveData">保存</el-button>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: "Trademark",
	data() {
		// 自定义校验规则
		// 第1个参数是校验规则，第2个参数是用户的数据，第3个参数是个用于放行的函数
		var validateTmName = (rule, value, callback) => {
			if (value.length < 2 || value.length > 10) {
				callback(new Error("品牌名称需 2 到 10 位"));
			} else {
				callback();
			}
		};
		return {
			// 当前第几页
			page: 1,
			// 一页展示多少数据
			limit: 5,
			total: 0,
			// 控制对话框的显示与隐藏
			dialogTableVisible: false,
			loading: true,
			// 存储一个品牌中含的那些SPU
			spuList: [],
			// 这个是展示SPU的那个对话框的标题
			spuListTitle: "",
			// 表格中的列表部分展示的数据
			list: [],
			// 存储所有的品牌
			tradeMarkList: [],
			// 控制对话框显示与否
			dialogFormVisible: false,
			// 收集品牌信息（其中的字段是和后台相呼应的，不能随便写）
			tmForm: {
				tmName: "",
				logoUrl: "",
			},
			// 表单验证规则
			// trigger属性的blur表示失焦时触发验证，change表示内容发生变化就触发验证
			rules: {
				tmName: [
					{ required: true, message: "请输入品牌名称", trigger: "blur" },
					// 自定义校验规则
					{ validator: validateTmName, trigger: "change" },
				],
				logoUrl: [{ required: true, message: "请选择品牌图片" }],
			},
		};
	},
	methods: {
		async getPageList() {
			const { page, limit } = this;
			let result = await this.$API.trademark.reqTrademarkList(page, limit);
			if (result.code == 200) {
				this.total = result.data.total;
				this.list = result.data.records;
			}
		},
		handleCurrentChange(page) {
			this.page = page;
			this.getPageList();
		},
		handleSizeChange(limit) {
			this.limit = limit;
			this.getPageList();
		},
		// “品牌管理”中左上角“添加”按钮的回调
		showDialog() {
			this.dialogFormVisible = true;
			// 每次添加之前应把之前的数据清空
			this.tmForm = { tmName: "", logoUrl: "" };
		},
		// “品牌管理”中“修改”按钮的回调
		// row这个参数包含着用户选中的那个商品的信息，id、tmName啥的
		updateTrademark(row) {
			this.dialogFormVisible = true;
			// 这儿得 = { ...row } ，即浅拷贝
			/* 直接 = row 的话，你是直接修改服务器数据了，即直接修改原始数据了，会导致
			你不点改的同时数据会直接变就，不点“确认”或“取消”按钮，数据都实时改变 */
			this.tmForm = { ...row };
		},
		// 图片上传成功
		// res是一个对象，存储着成功上传之后服务器返回的数据一些数据
		handleAvatarSuccess(res) {
			this.tmForm.logoUrl = res.data;
		},
		// 图片上传之前
		beforeAvatarUpload(file) {
			const isJPG = file.type === "image/jpeg";
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG) {
				this.$message.error("上传头像图片只能是 JPG 格式!");
			}
			if (!isLt2M) {
				this.$message.error("上传头像图片大小不能超过 2MB!");
			}
			return isJPG && isLt2M;
		},
		addOrUpdateTrademark() {
			this.$refs.ruleForm.validate(async (success) => {
				// 如果通过校验
				if (success) {
					// 关闭这个对话框
					this.dialogFormVisible = false;
					let result = await this.$API.trademark.reqAddOrUpdateTrademark(
						this.tmForm
					);
					if (result.code == 200) {
						// 这是一个elementUI的弹出框
						this.$message({
							// 样式
							type: "success",
							// 这里利用是否有tmForm.id来判断是添加操作还是更新操作
							message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
						});
						// 如果是添加操作，则跳转到第1页；如果是修改，则停留在当前页
						this.handleCurrentChange(this.tmForm.id ? this.page : 1);
						// 弄完后重新获取数据以供展示
						this.getPageList();
					}
				}
				// 校验失败
				else {
					console.log("error submit!!");
					return false;
				}
			});
		},
		async deleteTrademark(row) {
			// 先获取这个品牌下的spu，然后主要用处是判它包含几个元素
			let result = await this.$API.trademark.reqSpuList(row.id);
			if (result.code == 200) {
				this.spuList = result.data;
			}
			// 如果不为空
			if (this.spuList.length > 0) {
				this.$alert(`“${row.tmName}”下存在spu，无法删除。`, "提示", {
					confirmButtonText: "查看",
					type: "warning",
				})
					.then(() => {
						this.getAllSpuInTrademark(row);
					})
					.catch(() => {
						// 清除spu列表的数据
						this.spuList = [];
					});
			} else {
				// 弹框
				this.$confirm(`确定删除“${row.tmName}”吗？`, "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
					.then(async () => {
						// 点击“确定”按钮触发then
						await this.$API.trademark.reqDeleteTrademark(row.id);
						this.$message({
							type: "success",
							message: "删除成功!",
						});
						// 如果是本页的数据个数大于1，则停留在当前页，否则停在前一页（期间注意不能让page减成0了）
						let page = 0;
						if (this.list.lenght > 1) {
							page = this.page;
						} else {
							if (page > 1) {
								page = this.page - 1;
							} else {
								page = 1;
							}
						}
						this.handleCurrentChange(page);
						// 弄完后重新获取数据以供展示
						this.getPageList();
					})
					.catch(() => {
						// 点击“取消”按钮触发catch
					});
			}
		},
		// 查看一个品牌中含有的所有SPU
		async getAllSpuInTrademark(row) {
			// 点击后显示对话框
			this.dialogTableVisible = true;
			// 存一下对话框标题
			this.spuListTitle = row.tmName;
			// 获取品牌的信息
			let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
			if (tradeMarkResult.code == 200) {
				this.tradeMarkList = tradeMarkResult.data;
			}
			// 传入的是品牌的id
			let result = await this.$API.trademark.reqSpuList(row.id);
			if (result.code == 200) {
				this.spuList = result.data;
				this.loading = false;
			}
		},
		// 关闭对话框时执这个
		close(done) {
			// 让loading属性再次变为真
			this.loading = true;
			// 清除spu列表的数据
			this.spuList = [];
			// 关闭对话框
			done();
		},
		async saveData() {
			const updateInfo = {
				updateList: this.spuList.map((item) => {
					return {
						spuId: item.id,
						tmId: item.tmId,
					};
				}),
			};
			let result = await this.$API.trademark.reqUpdateSpuTrademark(updateInfo);
			if (result.code == 200) {
				// 让loading属性再次变为真
				this.loading = true;
				// 清除sku列表的数据
				this.spuList = [];
				// 关闭对话框
				this.dialogTableVisible = false;
			}
		},
	},
	mounted() {
		this.getPageList();
	},
};
</script>

<style>
.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.avatar-uploader .el-upload:hover {
	border-color: #409eff;
}
.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}
.avatar {
	width: 178px;
	height: 178px;
	display: block;
}
</style>
