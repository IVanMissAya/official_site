let socket,
	collectId = "inteagle.chat.id",
	chatId;
if (getCookie("chatId")) {
	chatId = getCookie("chatId");
} else {
	chatId = uuid(8);
	setCookie("chatId", chatId, 1);
	//是否第一次接入会话
	setCookie("is-chat", "false", 1);
}

// 本地socket路径
// const wsServer = "ws://192.168.26.135:8080/netSocket/" + chatId;
// 服务器socket路径
const wsServer = "wss://www.inteagle.com.cn/inteagle-manage/netSocket/" + chatId;
if (typeof(WebSocket) == "undefined") {
	console.log("您的浏览器不支持WebSocket");
} else {
	socket = new socketEntity();
	socket.wsServer = wsServer;
	socket.writeScreen = function(res) {
		// console.log("res----", res);
		if (res.sendId === chatId) {
			printModule(res.msg, "send");
		} else {
			printModule(res.msg, "receive");
		}
	};
	//连接websocket
	socket.connect(wsServer);
}

/**
 * 发送信息
 */
$(".sendBtn").on("click", function() {
	let msg_content = $("#msg-content").val().trim();
	if (notNull(msg_content)) {
		let msg_box = document.getElementById("chat-msg-send").innerHTML;
		msg_box = msg_box.replace("[msg]", msg_content);
		let msg_obj = {
			type: "1",
			msg: msg_content
		};
		//判断当前连接状态
		if (socket.ws.readyState === socket.webSocketState.OPEN) {
			if (getCookie("is-chat") === "false") {
				printTips("会话创建成功");
				printTips("会话已被客服接起");
				setCookie("is-chat", "true", 1);
			}
			socket.ws.sendMsg(JSON.stringify(msg_obj));
			$(".chat-content-area").append(msg_box);
			$("#msg-content").val("");
			$('.chat-content-area').prop('scrollTop', document.getElementById("chat-content-area").scrollHeight);
		}
	}
})

/**
 * 绑定回车键事件
 * @param {Object} id
 */
function enterKeydown(id) {
	$('#' + id).bind('keyup', function(event) {
		if (event.keyCode == "13") {
			$('.sendBtn').click();
		}
	});
}


/**
 * 打印消息
 * @param {Object} msg
 * @param {Object} type
 */
function printModule(msg, type) {
	let docId;
	if (type == "send") {
		docId = "chat-msg-send";
	} else if (type == "receive") {
		docId = "chat-msg-receive";
	}
	let module = document.getElementById(docId).innerHTML;
	module = module.replace("[msg]", msg);
	$(".chat-content-area").append(module);
	$('.chat-content-area').prop('scrollTop', document.getElementById("chat-content-area").scrollHeight);
}

/**
 * 打印提示消息
 * @param {Object} tips_msg
 */
function printTips(tips_msg) {
	let tips_module = document.getElementById("tips-module").innerHTML;
	tips_module = tips_module.replace("[tips]", tips_msg);
	$(".chat-content-area").append(tips_module);
}
