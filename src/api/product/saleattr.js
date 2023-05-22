import request from "@/utils/request";

// 查询销售属性
export const reqSaleAttrList = (
	category1Id,
	category2Id,
	category3Id,
	page,
	limit,
	searchObj
) =>
	request({
		url: `/admin/product/saleAttrInfoList/${category1Id}/${category2Id}/${category3Id}/${page}/${limit}`,
		method: "get",
		params: searchObj,
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

//获取销售属性下的所有spu
export const reqSpuList = (saleAttrId) =>
	request({ url: `/admin/product/spuInSaleAttr/${saleAttrId}`, method: "get" });
