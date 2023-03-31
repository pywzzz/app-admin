import request from "@/utils/request";

//获取SPU列表中的数据
export const reqSpuList = (page, limit, category3Id) =>
	request({
		url: `/admin/product/${page}/${limit}`,
		method: "get",
		params: { category3Id },
	});
