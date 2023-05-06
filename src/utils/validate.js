/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
	return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
	// 正则表达式：只包含大小写字母和数字，长度在 4 到 8 个字符之间
	const regex = /^[A-Za-z0-9]+$/;

	// 去除首尾空白字符
	const trimmedStr = str.trim();

	// 使用 test 方法检查 trimmedStr 是否符合正则表达式要求
	return (
		trimmedStr.length >= 4 && trimmedStr.length <= 8 && regex.test(trimmedStr)
	);
}

/**
 * @param {string} password
 * @returns {Boolean}
 */
export function validPassword(password) {
	// 正则表达式：长度在 8 到 20 个字符之间，且内容只能包括大小写字母、数字或特殊字符
	const regex = /^[A-Za-z\d@$!%*?&]{8,20}$/;

	// 使用 test 方法检查密码是否符合正则表达式要求
	return regex.test(password);
}
