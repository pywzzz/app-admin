import request from "@/utils/request";

//获取一级分类数据接口
export const reqCategory1List = () =>
	request({ url: "/admin/product/getCategory1", method: "get" });

//获取二级分类数据接口
export const reqCategory2List = (category1Id) =>
	request({ url: `/admin/product/getCategory2/${category1Id}`, method: "get" });

//获取三级分类数据接口
export const reqCategory3List = (category2Id) =>
	request({ url: `/admin/product/getCategory3/${category2Id}`, method: "get" });

//带着三级列表的id获取相应数据
export const reqAttrList = (
	page,
	limit,
	category1Id,
	category2Id,
	category3Id
) =>
	request({
		url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}/${page}/${limit}`,
		method: "get",
	});

//添加属性与属性值接口
export const reqAddAttr = (data) =>
	request({ url: "/admin/product/addAttrInfo", method: "post", data });

//更新属性与属性值接口
export const reqUpdateAttr = (data) =>
	request({ url: "/admin/product/updateAttrInfo", method: "put", data });

//删除某个attr
export const reqDeleteAttr = (attrNameId) =>
	request({
		url: `/admin/product/deleteAttrInfo/${attrNameId}`,
		method: "put",
	});

//获取平台属性下的所有sku
export const reqSkuList = (attrId) =>
	request({ url: `/admin/product/skuInAttr/${attrId}`, method: "get" });

//用于判断Attr是否可以被删除
export const reqAttrStatus = (category3Id) =>
	request({
		url: `/admin/product/getAttrStatus/${category3Id}`,
		method: "get",
	});
