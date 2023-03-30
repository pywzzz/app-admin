import request from "@/utils/request";

// 第1个参数是当前第几页，第2个参数是一页多少条数据
export const reqTrademarkList = (page, limit) =>
	request({
		url: `/admin/product/baseTrademark/${page}/${limit}`,
		method: "get",
	});
