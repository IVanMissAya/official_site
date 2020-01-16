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
const wsServer = "ws://192.168.26.135:8080/client/" + chatId;
// 服务器socket路径
// const wsServer = "wss://www.inteagle.com.cn/inteagle-manage/client/" + chatId;
if (typeof(WebSocket) == "undefined") {
	console.log("您的浏览器不支持WebSocket");
} else {
	socket = new socketEntity();
	socket.wsServer = wsServer;
	//连接websocket
	socket.connect(wsServer);
	//socket消息处理
	socket.writeScreen = function(res) {
		//历史消息
		if (res.type === MSG_TYPE.msgRecord) {
			//-----------发消息------
			if (res.sendId === chatId) {
				//文字消息
				if (res.remark === MSG_TYPE.chatMsg) {
					printModule(res.msg, "send");
				} else if (res.remark === MSG_TYPE.chatPic) {
					printPicMsg(res.msg, "send");
				}
			} else {
				//-----------收消息-----------
				//文字消息
				if (res.remark === MSG_TYPE.chatMsg) {
					printModule(res.msg, "receive");
				} else if (res.remark === MSG_TYPE.chatPic) {
					printPicMsg(res.msg, "receive");
				}
			}
		}
	};
}

/**
 * 初始化layeditor富文本编辑器
 */
let layform, layedit, myEdit;
layui.use(['layedit', 'form'], function() {
	layform = layui.form;
	layedit = layui.layedit;
	myEdit = layedit.build('msg-content', {
		//, '|', 'image'
		tool: ['face']
	});
	//自定义验证规则
	layform.verify({
		content: function() {
			layedit.sync(myEdit);
		}
	});
	enterKeydown("chat-bar");
});

/**
 * 发送信息
 */
$(".sendBtn").on("click", function() {
	let msg_content = layedit.getContent(myEdit);
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
			/**
			 * 设置编辑器内容
			 * @param {[type]} index 编辑器索引
			 * @param {[type]} content 要设置的内容
			 * @param {[type]} flag 是否追加模式
			 */
			layedit.setContent(myEdit, "", false);
		} else {
			printTips("连接已断开...");
		}

		$('.chat-content-area').prop('scrollTop', document.getElementById("chat-content-area").scrollHeight);
	}
})

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

/**
 * 打印图片消息
 */
function printPicMsg(src, type) {
	let docId;
	if (type == "send") {
		docId = "chat-msg-send-pic";
	} else if (type == "receive") {
		docId = "chat-msg-receive-pic";
	}
	let module = document.getElementById(docId).innerHTML;
	module = module.replace("[src]", src);
	$(".chat-content-area").append(module);
	$('.chat-content-area').prop('scrollTop', document.getElementById("chat-content-area").scrollHeight);
}

/**
 * 绑定回车键事件
 * @param {Object} id
 */
function enterKeydown() {
	$("#LAY_layedit_1").contents().find("body").keyup(function(event) {
		if (event.keyCode == "13") {
			event.cancelBubble = true;
			event.preventDefault();
			event.stopPropagation();
			$('.sendBtn').click();
		}
	});
}

/**
 * 上传图片
 */
$(".upload-pic").on("click", function() {
	let upload = $("#uploadPic-btn");
	upload.click();
})
/**
 * 上传图片
 */
$("#uploadPic-btn").on("change", function() {
	let file = this.files[0];
	console.log("file----", file);

	if (file.size > (1024 * 1024)) {
		layer.ready(function() {
			layer.msg('上传图片大小不能超过1M!');
		});
		return;
	}

	var reader = new FileReader();
	reader.readAsDataURL(this.files[0])
	reader.onload = function(e) {
		let file_base64 = reader.result //或者 e.target.result都是一样的，都是base64码
		let msg_obj = {
			type: "2",
			msg: file_base64
		};
		//判断当前连接状态
		if (socket.ws.readyState === socket.webSocketState.OPEN) {
			if (getCookie("is-chat") === "false") {
				printTips("会话创建成功");
				printTips("会话已被客服接起");
				setCookie("is-chat", "true", 1);
			}
			//打印图片消息
			printPicMsg(file_base64, "send");
			socket.ws.sendMsg(JSON.stringify(msg_obj));
		} else {
			printTips("连接已断开...");
		}
	}
})
