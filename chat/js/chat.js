/**
 * 页面加载事件
 */
$(function() {

})

/**
 * 点击切换聊天窗口
 */
$(".toTab").on("click", function(dom) {
	let index = dom.currentTarget.dataset.index;
	//修改窗口选中样式
	$(".chat-tab").removeClass("active-tab");
	$("#" + index).addClass("active-tab");
	$(".sin-chat-card").removeClass("active-card");
	$(dom.currentTarget).children(".sin-chat-card").addClass("active-card");
})
