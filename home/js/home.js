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
	$(".tool-icon").attr("data-flag", "hide")
	if (flag == "show") {
		$(".tool-inside").removeClass("fadeInRight");
		$(".tool-inside").addClass("fadeOutRight");
		$(".tool-inside").promise().done(function() {
			$(".tool-inside").hide();
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
					break;
				case "1":
					$(".phoneArea").show();
					break;
				case "2":
					$(".qrcodeArea").show();
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
			$("#chat-bar").hide();
		}, 500)
	})
})
