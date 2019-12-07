/**
 * 导航栏点击事件
 */
$(".navLi").on("click", function(dom) {
	//修改导航栏样式
	$(".rightNavList ul li").removeClass("checkedNav");
	$(".rightNavList ul li").promise().done(function() {
		let target = $(dom.currentTarget);
		target.addClass("checkedNav");
	})
})

/**
 * 选择语言
 */
$(".languageText").on("click", function(dom) {
	$(".navSec span").removeClass("checkStyle");
	$(".navSec span").promise().done(function(){
		let target = $(dom.currentTarget);
		target.addClass("checkStyle");
	})
})