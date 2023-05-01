import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter, constantRoutes, anyRoutes, asyncRoutes } from "@/router";
import router from "@/router";

const getDefaultState = () => {
	return {
		token: getToken(),
		name: "",
		avatar: "",
		// 服务器返回的菜单信息【根据不同的角色：返回的标记信息，数组里面的元素是字符串】
		routes: [],
		// 角色信息
		roles: [],
		// 根据服务器返回的标记信息，得出最终能展示的异步路由
		resultAsyncRoutes: [],
		// 用户最终可以访问的全部路由
		resultAllRoutes: [],
	};
};

const state = getDefaultState();

const mutations = {
	RESET_STATE: (state) => {
		Object.assign(state, getDefaultState());
	},
	SET_TOKEN: (state, token) => {
		state.token = token;
	},
	// 存储用户信息
	SET_USERINFO: (state, userInfo) => {
		// 用户名
		state.name = userInfo.name;
		// 用户头像
		state.avatar = userInfo.avatar;
		// 菜单权限标记
		state.routes = userInfo.routes;
		// 角色
		state.roles = userInfo.roles;
	},
	// 最终计算出的异步路由
	SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
		// 当前用户可以访问的异步路由
		state.resultAsyncRoutes = asyncRoutes;
		// 当前用户可以访问的所有路由，这儿就是合并一下
		state.resultAllRoutes = constantRoutes.concat(
			state.resultAsyncRoutes,
			anyRoutes
		);
		// 给路由器添加新的路由
		router.addRoutes(state.resultAllRoutes);
	},
};

// 这个函数用于将两个数组进行对比，得出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
	// 过滤出当前用户能展示的异步路由
	return asyncRoutes.filter((item) => {
		// 如果数组中没有这个元素则indexOf返回的索引值为-1，如果有，则返回的一定不是-1
		if (routes.indexOf(item.name) != -1) {
			// 这里用递归去处理xx级子路由
			if (item.children && item.children.length) {
				item.children = computedAsyncRoutes(item.children, routes);
			}
			return true;
		}
	});
};
const actions = {
	// 原始写法
	/* login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          const { data } = response;
          commit("SET_TOKEN", data.token);
          setToken(data.token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    }); */

	// async配合await的写法
	// 登录
	async login({ commit }, userInfo) {
		// 解构数据
		const { username, password } = userInfo;
		let result = await login({ username: username.trim(), password: password });
		if (result.code == 200) {
			commit("SET_TOKEN", result.data.token);
			setToken(result.data.token);
			return "ok";
		} else {
			return Promise.reject(new Error("fail"));
		}
	},

	// get user info
	getInfo({ commit, state }) {
		return new Promise((resolve, reject) => {
			getInfo(state.token)
				.then((response) => {
					const { data } = response;

					if (!data) {
						reject("Verification failed, please Login again.");
					}
					// 存储用户的全部信息
					commit("SET_USERINFO", data);
					commit(
						"SET_RESULTASYNCROUTES",
						computedAsyncRoutes(asyncRoutes, data.routes)
					);
					resolve(data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	// user logout
	logout({ commit, state }) {
		return new Promise((resolve, reject) => {
			logout(state.token)
				.then(() => {
					removeToken(); // must remove  token  first
					resetRouter();
					commit("RESET_STATE");
					resolve();
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	// remove token
	resetToken({ commit }) {
		return new Promise((resolve) => {
			removeToken(); // must remove  token  first
			commit("RESET_STATE");
			resolve();
		});
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};
