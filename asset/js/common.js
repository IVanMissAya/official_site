/**
 * 导航栏点击事件
 */
$(".navLi").on("click", function(dom) {
	let index = dom.currentTarget.dataset.index;
	window.location.href = "../" + index + "/" + index + ".html";
})

/**
 * 选择语言
 */
$(".languageText").on("click", function(dom) {
	$(".navSec span").removeClass("checkStyle");
	$(".navSec span").promise().done(function() {
		let target = $(dom.currentTarget);
		target.addClass("checkStyle");
	})
})

/**
 * 页面滚动事件
 */
$(window).scroll(function() {
	//检测鼠标滚轮距离顶部位置
	let top = document.documentElement.scrollTop || document.body.scrollTop;
	if (top > 0) {
		$('.headerNav').addClass("headerNav_scroll");
		$('.nav_title').addClass("nav_title_scroll");
		$(".navLogo").attr("src", "../asset/img/product_logo.png");
		$('.navLogo').addClass("logoIcon_scroll");
	} else {
		$('.headerNav').removeClass("headerNav_scroll");
		$('.nav_title').removeClass("nav_title_scroll");
		$(".navLogo").attr("src", "../asset/img/logo.png");
		$('.navLogo').removeClass("logoIcon_scroll");
	}
});
