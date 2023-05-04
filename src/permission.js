import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

// 设置flag，防止非权限路由，页面死循环重定向
let flag = 0;
router.beforeEach(async (to, from, next) => {
	// 在路由跳转前判断是否被添加成功--解决除首页外其他页面浏览器刷新空白问题
	if (flag === 0 && to.matched.length === 0) {
		flag++;
		next({ path: to.path });
	} else if (flag !== 0 && to.matched.length === 0) {
		// next({ path: '/' })
		next(false); // 此处为重点，非home页刷新后阻止跳转则回到了刷新前的页面
	} else {
		next();
	}

	// start progress bar
	NProgress.start();

	// set page title
	document.title = getPageTitle(to.meta.title);

	// determine whether the user has logged in
	const hasToken = getToken();

	if (hasToken) {
		if (to.path === "/login") {
			// if is logged in, redirect to the home page
			next({ path: "/" });
			NProgress.done();
		} else {
			const hasGetUserInfo = store.getters.name;
			if (hasGetUserInfo) {
				next();
			} else {
				try {
					// get user info
					await store.dispatch("user/getInfo");

					next();
				} catch (error) {
					// remove token and go to login page to re-login
					await store.dispatch("user/resetToken");
					Message.error(error || "Has Error");
					next(`/login?redirect=${to.path}`);
					NProgress.done();
				}
			}
		}
	} else {
		/* has no token*/

		if (whiteList.indexOf(to.path) !== -1) {
			// in the free login whitelist, go directly
			next();
		} else {
			// other pages that do not have permission to access are redirected to the login page.
			next(`/login?redirect=${to.path}`);
			NProgress.done();
		}
	}
});

router.afterEach(() => {
	// finish progress bar
	NProgress.done();
});
