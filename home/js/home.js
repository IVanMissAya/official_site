/**
 * 页面加载事件
 */
$(function() {
})

/**
 * 右侧工具栏
 */
$(".tool-icon").on("click", function(dom) {
	let index = dom.currentTarget.dataset.index,
		flag = dom.currentTarget.dataset.flag;
	$(".tool-icon").attr("data-flag", "hide");
	if (flag == "show") {
		$(".tool-inside").removeClass("fadeInRight");
		$(".tool-inside").addClass("fadeOutRight");
		$(".tool-inside").promise().done(function() {
			setTimeout(function() {
				$(".tool-inside").hide();
			}, 500)
		})
	} else {
		dom.currentTarget.dataset.flag = "show";
		$(".tool-inside").removeClass("fadeOutRight");
		$(".tool-inside").addClass("fadeInRight");
		$(".tool-inside").promise().done(function() {
			$(".tool-inside").hide();
			switch (index) {
				case "0":
					$(".chat-bar").show();
					$(".chat-time").html(getNowFormatDate(0));
					$('.chat-content-area').prop('scrollTop', $('.chat-content-area')[0].scrollHeight);
					break;
				case "1":
					$(".phoneArea").show();
					break;
			}
		})
	}
})

/**
 * 关闭聊天窗
 */
$("#hide-chat").on("click", function() {
	$("#chat-bar").addClass("fadeOutRight");
	$("#chat-bar").promise().done(function() {
		setTimeout(function() {
			$(".tool-bar ul li:first-child div").attr("data-flag", "hide");
			$("#chat-bar").hide();
		}, 500)
	})
})
