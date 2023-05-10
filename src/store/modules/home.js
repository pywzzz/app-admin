import { reqSaleRank, reqVisitRank } from "@/api/dashboard/home";
import dayjs from "dayjs";

// 仓库存数据的地方
const state = {
	barChartsData: {
		barChartsSaleData: [],
		barChartsVisitData: [52, 25, 86, 3, 78, 34, 34, 95, 37, 8, 16, 39],
	},
	rankData: {
		saleRank: [],
		visitRank: [],
	},
};
// 修改state的唯一地方
const mutations = {
	GETSALERANKDATA(state, finalSaleRankData) {
		state.rankData.saleRank = finalSaleRankData;
	},
	GETVISITRANKDATA(state, finalVisitRankData) {
		state.rankData.visitRank = finalVisitRankData;
	},
	GETSALEBARCHARTSDATA(state, data) {
		state.barChartsData.barChartsSaleData = data;
	},
	GETVISITBARCHARTSDATA(state, data) {
		state.barChartsData.barChartsVisitData = data;
	},
};
// 书写业务逻辑，处理异步云
const actions = {
	async getSaleRankData({ commit }, data) {
		let saleRankData = await reqSaleRank(data);
		if (saleRankData.code == 200) {
			// 将结果按照sales字段降序排序
			let sortedSaleRankData = saleRankData.data.sort(
				(a, b) => b.sales - a.sales
			);
			// 使用map函数添加order字段
			let processedData = sortedSaleRankData.map((item, index) => {
				return { ...item, order: index + 1 };
			});
			// 按大小排序后只保留前7个数据
			let finalSaleRankData = processedData.slice(0, 7);
			commit("GETSALERANKDATA", finalSaleRankData);
		} else {
			return Promise.reject(new Error("fail"));
		}
	},
	async getVisitRankData({ commit }, data) {
		let visitRankData = await reqVisitRank(data);
		if (visitRankData.code == 200) {
			// 将结果按照visits字段降序排序
			let sortedVisitRankData = visitRankData.data.sort(
				(a, b) => b.visits - a.visits
			);
			// 使用map函数添加order字段
			let processedVisitRankData = sortedVisitRankData.map((item, index) => {
				return { ...item, order: index + 1 };
			});
			// 按大小排序后只保留前7个数据
			let finalVisitRankData = processedVisitRankData.slice(0, 7);
			commit("GETVISITRANKDATA", finalVisitRankData);
		} else {
			return Promise.reject(new Error("fail"));
		}
	},
	async getSaleBarChartsData({ commit }) {
		let result = [];
		let months = Array.from({ length: 12 }, (_, i) => {
			const monthStart = dayjs().month(i).startOf("month").format("YYYY-MM-DD");
			const monthEnd = dayjs().month(i).endOf("month").format("YYYY-MM-DD");
			return [monthStart, monthEnd];
		});
		// 对每个月份进行循环处理
		for (let month of months) {
			let res = await reqSaleRank(month);
			if (res.code == 200) {
				let sum = res.data.reduce((total, item) => total + item.sales, 0);
				result.push(sum);
			} else {
				return Promise.reject(new Error("fail"));
			}
		}
		commit("GETSALEBARCHARTSDATA", result);
	},
	async getVisitBarChartsData({ commit }) {
		let result = [];
		let months = Array.from({ length: 12 }, (_, i) => {
			const monthStart = dayjs().month(i).startOf("month").format("YYYY-MM-DD");
			const monthEnd = dayjs().month(i).endOf("month").format("YYYY-MM-DD");
			return [monthStart, monthEnd];
		});
		// 对每个月份进行循环处理
		for (let month of months) {
			let res = await reqVisitRank(month);
			if (res.code == 200) {
				let sum = res.data.reduce((total, item) => total + item.visits, 0);
				result.push(sum);
			} else {
				return Promise.reject(new Error("fail"));
			}
		}
		commit("GETVISITBARCHARTSDATA", result);
	},
};
// 功能类似计算属性，用于少些写东西
const getters = {};

// 对外暴露Store类的一个实例对象
export default {
	state,
	mutations,
	actions,
	getters,
};
