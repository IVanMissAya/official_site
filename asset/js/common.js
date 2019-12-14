let layer, laydate, form;
layui.use(['layer', 'laydate', 'form'], function() {
	//时间组件
	laydate = layui.laydate;
	//弹窗组件
	layer = layui.layer;
	//表单组件
	form = layui.form;
});


/**
 * 导航栏点击事件
 */
$(".navLi").on("click", function(dom) {
	let index = dom.currentTarget.dataset.index;
	window.location.href = "../" + index + "/" + index + ".html";
})

/**
 * 底部导航栏点击事件
 */
$(".bottomNavText").on("click", function(dom) {
	let index = dom.currentTarget.dataset.index;
	window.location.href = "../" + index + "/" + index + ".html";
})

/**
 * 点击logo图片 跳转到首页
 */
$(".logoIcon").on("click", function(dom) {
	window.location.href = "../home/home.html";
})


/**
 * 页面加载事件
 */
$(function() {
	//查看localStorage中的语言
	let type = "zh";
	if (localStorage.getItem("lanaguage")) {
		type = localStorage.getItem("lanaguage");
	}
	loadProperties(type);

	AOS.init({
		duration: 1200,
	});
})

/**
 * 选择语言
 */
$(".languageText").on("click", function(dom) {
	let type = dom.currentTarget.dataset.type;
	//语言类型存入localStorage
	localStorage.setItem("lanaguage", type);
	//切换语言
	loadProperties(type);
	$(".navSec span").removeClass("checkStyle");
	$(".navSec span").promise().done(function() {
		let target = $(dom.currentTarget);
		target.addClass("checkStyle");
	})
})

//加载语言包文件
function loadProperties(types) {
	$.i18n.properties({
		name: 'strings', //属性文件名     命名格式： 文件名_国家代号.properties
		path: '/official/i18n/', //注意这里路径是你属性文件的所在文件夹
		mode: 'map',
		language: types, //这就是国家代号 name+language刚好组成属性文件名：strings+zh -> strings_zh.properties
		callback: function() {
			$("[data-locale]").each(function() {
				$(this).html($.i18n.prop($(this).data("locale")));
			});
		}
	});

	$(".navSec span").removeClass("checkStyle");
	if (types === "zh") {
		$(".zh-option").addClass("checkStyle");
		$(".leaveMsg textarea").attr("placeholder", "在这里输入您的留言,以及您的全部联系信息...");
	} else if (types === "en") {
		$(".en-option").addClass("checkStyle");
		$(".leaveMsg textarea").attr("placeholder", "Enter your message here and all your contact information");
	}
}

/**
 * 页面滚动事件
 */
$(window).scroll(function() {
	//检测鼠标滚轮距离顶部位置
	let top = document.documentElement.scrollTop || document.body.scrollTop;
	let router = localStorage.getItem("router");
	if (top > 0) {
		$('.headerNav').addClass("headerNav_scroll");
		$('.nav_title').addClass("nav_title_scroll");
		$('.navLogo').addClass("logoIcon_scroll");
		$(".languageText").addClass("languageTextScroll");
		$(".navLogo").attr("src", "../asset/img/product_logo.png");
	} else {
		$('.headerNav').removeClass("headerNav_scroll");
		$('.nav_title').removeClass("nav_title_scroll");
		$('.navLogo').removeClass("logoIcon_scroll");
		$(".languageText").removeClass("languageTextScroll");
		if (router === "product") {
			$(".navLogo").attr("src", "../asset/img/product_logo.png");
		} else {
			$(".navLogo").attr("src", "../asset/img/logo.png");
		}
	}
});

/**
 * 验证字符串是否为空，返回自定义提示窗,输入框聚焦
 * @param str
 * @param msg
 */
function checkNullShowMsg(str, msg, className) {
	if (!notNull(str)) {
		layer.ready(function() {
			layer.msg(msg, {
				icon: 2,
				time: 1000
			}, function() {
				$("." + className).focus();
			});
		})
		return false;
	}
	return true;
}

/**
 * 验证邮箱
 * @param {Object} email
 */
function isEmail(email, className) {
	if (email.search(/^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/) != -1) {
		return true;
	}
	layer.ready(function() {
		layer.msg("邮箱格式不正确", {
			icon: 2,
			time: 1000
		}, function() {
			$("." + className).focus();
		});
	})
	return false;
}

/**
 * 验证手机号
 * @param {Object} phonevalue
 */
function isPhone(phonevalue, className) {
	let phoneReg = /^1[3-578]\d{9}$/;
	if (phoneReg.test(phonevalue)) {
		return true;
	}
	layer.ready(function() {
		layer.msg("手机号格式不正确", {
			icon: 2,
			time: 1000
		}, function() {
			$("." + className).focus();
		});
	})
	return false;
}


/**
 * @param {Object} param
 * 验证非空 返回布尔值
 */
function notNull(param) {
	if (param != null && param != '' && typeof(param) != "undefined") {
		return true;
	}
	return false
}


//设置cookie
function setCookie(name, value, expdays) {
	var expdate = new Date();
	//设置Cookie过期日期
	expdate.setDate(expdate.getDate() + expdays);
	//添加Cookie
	document.cookie = name + "=" + escape(value) + ";expires=" + expdate.toUTCString();
}

//根据键获得cookie
function getCookie(name) {
	//获取name在Cookie中起止位置
	var start = document.cookie.indexOf(name + "=");

	if (start != -1) {
		start = start + name.length + 1;
		//获取value的终止位置
		var end = document.cookie.indexOf(";", start);
		if (end == -1)
			end = document.cookie.length;
		//截获cookie的value值,并返回
		return unescape(document.cookie.substring(start, end));
	}
	return "";
}

//删除cookie
function delCookie(name) {
	setCookie(name, "", -1);
}
