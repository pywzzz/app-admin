import request from "@/utils/request";
//获取图片的数据
export const reqSpuImageLIst = (spuId) =>
	request({ url: `/admin/product/spuImageList/${spuId}`, method: "get" });

//获取销售属性的数据
export const reqSpuSaleAttrList = (spuId) =>
	request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: "get" });

//获取平台属性的数据
export const reqAttrInfoList = (category1Id, category2Id, category3Id) =>
	request({
		url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
		method: "get",
	});
