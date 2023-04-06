import request from "@/utils/request";

//获取SPU列表中的数据
export const reqSkuList = (page, limit) =>
	request({ url: `/admin/product/list/${page}/${limit}`, method: "get" });
