import request from "@/utils/request";

// 第1个参数是当前第几页，第2个参数是一页多少条数据
export const reqTrademarkList = (page, limit) =>
	request({
		url: `/admin/product/baseTrademark/${page}/${limit}`,
		method: "get",
	});

// 添加或更新品牌数据
export const reqAddOrUpdateTrademark = (trademark) => {
	// 更新品牌需要带3个参数：品牌id、品牌名称、品牌LOGO
	// 如果有trademark.id的话就代表是更新操作（trademark.id为添加品牌后数据库生成的）
	if (trademark.id) {
		return request({
			url: "/admin/product/baseTrademark/update",
			method: "put",
			data: trademark,
		});
		// 添加品牌需要带2个参数：品牌名称、品牌LOGO
	} else {
		return request({
			url: "/admin/product/baseTrademark/save",
			method: "post",
			data: trademark,
		});
	}
};

// 删除品牌数据
export const reqDeleteTrademark = (id) =>
	request({
		url: `/admin/product/baseTrademark/remove/${id}`,
		method: "delete",
	});

//获取品牌下的所有spu
export const reqSpuList = (tmId) =>
	request({ url: `/admin/product/spuInTrademark/${tmId}`, method: "get" });

//在SPU这儿添加SKU后，保存数据的接口
export const reqUpdateSpuTrademark = (updateInfo) =>
	request({
		url: "/admin/product/updateSpuTrademark",
		method: "put",
		data: updateInfo,
	});
