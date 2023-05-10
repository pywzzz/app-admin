import request from "@/utils/request";

export const reqSaleRank = (params) =>
	request({ url: "/getSaleRank", method: "get", params });

export const reqVisitRank = (params) =>
	request({ url: "/getVisitRank", method: "get", params });
