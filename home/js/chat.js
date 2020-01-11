let socket;
// 本地socket路径
const wsServer = "ws://192.168.26.135:8080/netSocket/ivan";
// 服务器socket路径
// const wsServer = "wss://www.inteagle.com.cn/inteagle-manage/netSocket/ivan";
if (typeof(WebSocket) == "undefined") {
	console.log("您的浏览器不支持WebSocket");
} else {
	socket = new socketEntity();
	socket.wsServer = wsServer;
	socket.writeScreen = function(res) {
		console.log(res)
	};
	//连接websocket
	socket.connect(wsServer);
}
//处理socket消息
// socket消息处理
if (socket != null) {
	socket.writeScreen = function(res) {
		console.log("res----", res);
	}
}

/**
 * 发送信息
 */
$(".sendBtn").on("click", function() {
	let msg_content = $("#msg-content").val();
	if (notNull(msg_content)) {
		let msg_box = document.getElementById("chat-msg-module").innerHTML;
		msg_box = msg_box.replace("[msg]", msg_content);
		$(".chat-content-area").append(msg_box);
		$("#msg-content").val("");
		$('.chat-content-area').prop('scrollTop', document.getElementById("chat-content-area").scrollHeight);
	}
})
