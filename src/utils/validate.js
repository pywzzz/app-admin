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
	// 正则表达式：只包含英文字母和数字，同时不能为空（至少包含一个字符）
	const regex = /^[A-Za-z0-9]+$/;

	// 去除首尾空白字符
	const trimmedStr = str.trim();

	// 使用 test 方法检查 trimmedStr 是否符合正则表达式要求
	return trimmedStr.length > 0 && regex.test(trimmedStr);
}
