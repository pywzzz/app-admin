import request from "@/utils/request";

// 查询销售属性
export const reqSaleAttrList = (
	category1Id,
	category2Id,
	category3Id,
	page,
	limit
) =>
	request({
		url: `/admin/product/saleAttrInfoList/${category1Id}/${category2Id}/${category3Id}/${page}/${limit}`,
		method: "get",
	});

// 添加销售属性
export const save = (data) =>
	request({ url: "/admin/product/addSaleAttrInfo", method: "post", data });

// 更新销售属性
export const updateById = (data) =>
	request({ url: "/admin/product/updateSaleAttrInfo", method: "put", data });

// 删除销售属性
export const removeById = (id) =>
	request({
		url: `/admin/product/deleteSaleAttrInfo/${id}`,
		method: "put",
	});
