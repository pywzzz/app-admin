import request from "@/utils/request";

//获取SPU列表中的数据
export const reqSpuList = (page, limit, category3Id) =>
	request({
		url: `/admin/product/${page}/${limit}`,
		method: "get",
		params: { category3Id },
	});

//获取SPU信息
export const reqSpu = (spuId) =>
	request({ url: `/admin/product/getSpuById/${spuId}`, method: "get" });

//获取品牌的信息
export const reqTradeMarkList = () =>
	request({
		url: `/admin/product/baseTrademark/getTrademarkList`,
		method: "get",
	});

//获取SPU图标的接口
export const reqSpuImageList = (spuId) =>
	request({ url: `/admin/product/spuImageList/${spuId}`, method: "get" });

//获取平台全部销售属性----整个平台销售属性一共三个
export const reqBaseSaleAttrList = () =>
	request({ url: "/admin/product/baseSaleAttrList", method: "get" });

//修改或添加SPU，这两种操作携带给服务器参数大致一样的，唯一的区别就是携带的参数是否带id
export const reqAddOrUpdateSpu = (spuInfo) => {
	//携带的参数带有id则为修改SPU
	if (spuInfo.id) {
		return request({
			url: "/admin/product/updateSpuInfo",
			method: "post",
			data: spuInfo,
		});
	} else {
		//携带的参数不带id则为添加SPU
		return request({
			url: "/admin/product/saveSpuInfo",
			method: "post",
			data: spuInfo,
		});
	}
};

//删除SPU
export const reqDeleteSpu = (spuId) =>
	request({ url: `/admin/product/deleteSpu/${spuId}`, method: "delete" });

//获取SPU这儿添加SKU时的图片的数据
export const reqSpuImageLIst = (spuId) =>
	request({ url: `/admin/product/spuImageList/${spuId}`, method: "get" });

//获取SPU这儿添加SKU时的销售属性的数据
export const reqSpuSaleAttrList = (spuId) =>
	request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: "get" });

//获取SPU这儿添加SKU时的平台属性的数据
export const reqAttrInfoList = (category1Id, category2Id, category3Id) =>
	request({
		url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
		method: "get",
	});
