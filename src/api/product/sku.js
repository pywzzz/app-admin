import request from "@/utils/request";

//获取SPU列表中的数据
export const reqSkuList = (page, limit, skuName) =>
	request({
		url: `/admin/product/list/${page}/${limit}`,
		method: "get",
		params: { skuName },
	});

//上架sku
export const reqSale = (skuId) =>
	request({ url: `/admin/product/onSale/${skuId}`, method: "put" });

//下架sku
export const reqCancel = (skuId) =>
	request({ url: `/admin/product/cancelSale/${skuId}`, method: "put" });

//获取某个sku的详情的接口
export const reqSkuById = (skuId) =>
	request({ url: `/admin/product/getSkuById/${skuId}`, method: "get" });

//删除某个sku
export const reqDeleteSku = (skuId) =>
	request({ url: `/admin/product/deleteSku/${skuId}`, method: "put" });

//更新某个sku
export const reqUpdateSku = (skuInfo) =>
	request({ url: "/admin/product/updateSku", method: "put", data: skuInfo });
