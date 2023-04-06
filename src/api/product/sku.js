import request from "@/utils/request";

//获取SPU列表中的数据
export const reqSkuList = (page, limit) =>
	request({ url: `/admin/product/list/${page}/${limit}`, method: "get" });

//上架sku
export const reqSale = (skuId) =>
	request({ url: `/admin/product/onSale/${skuId}`, method: "get" });

//下架sku
export const reqCancel = (skuId) =>
	request({ url: `/admin/product/cancelSale/${skuId}`, method: "get" });
