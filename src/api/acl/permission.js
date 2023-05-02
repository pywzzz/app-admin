import request from "@/utils/request";

const api_name = "/admin/acl/permission";

export default {
	//   查看某个角色的权限列表
	toAssign(roleId) {
		return request({
			url: `${api_name}/toAssign/${roleId}`,
			method: "get",
		});
	},

	//   给某个角色授权
	doAssign(roleId, permissionId) {
		return request({
			url: `${api_name}/doAssign`,
			method: "post",
			params: { roleId, permissionId },
		});
	},
};
