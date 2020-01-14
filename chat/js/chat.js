let socket,
	chatId = "inteagle.chat.id";
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
		// console.log(res)
	};
	//连接websocket
	socket.connect(wsServer);
}
//处理socket消息
if (socket != null) {
	socket.writeScreen = function(res) {
		if (res.type === MSG_TYPE.chatTab) {
			//用户列表
			printBoxModule(res);
			//聊天窗口
			printTabModule(res);
		} else if (res.type === MSG_TYPE.chatMsg || res.type === MSG_TYPE.msgRecord) {
			//消息处理
			if (res.sendId === chatId) {
				//发消息
				printMsgModule(res, "send");
				$("#" + res.collectId + "-tab .msg-content-box").prop('scrollTop', $("#" + res.collectId + "-tab .msg-content-box")[
					0].scrollHeight);
			} else {
				//收消息
				//判断窗口是否存在
				if ($("#" + res.sendId + "-tab").length > 0) {
					//处理未读
					dealUnRead(res.sendId);

					printMsgModule(res, "receive");
					$("#" + res.sendId + "-tab .msg-content-box").prop('scrollTop', $("#" + res.sendId + "-tab .msg-content-box")[0].scrollHeight);
				} else {
					let res_obj = {
						"collectId": res.sendId,
						"type": "0"
					};
					//用户列表
					printBoxModule(res_obj);
					//聊天窗口
					printTabModule(res_obj);
				}
			}
		}
	}
}

/**
 * 点击切换聊天窗口
 */
function changeTab(dom) {
	let index = $(dom).data("index"),
		flag = $(dom)[0].dataset.flag;
	//显示对应聊天窗
	$(".chat-tab").removeClass("active-tab");
	$("#" + index + "-tab").addClass("active-tab");
	//修改窗口列表样式
	$(".sin-chat-card").removeClass("active-card");
	$(dom.children).addClass("active-card");
	if (flag === "hidden") {
		//查询历史记录
		getMsgRecord(index);

		$(".toTab").attr("data-flag", "hidden");
		$(dom)[0].dataset.flag = "show";
	}
	//绑定回车键事件
	enterKeydown(index);
}


/**
 * 查询对应窗口的历史消息
 * @param {Object} id
 */
function getMsgRecord(id) {
	//清空节点
	$("#" + id + "-tab .msg-content-box").html("");
	let msg_obj = {
		type: "3",
		collectId: id,
		msg: id
	};
	//发送消息
	socket.ws.sendMsg(JSON.stringify(msg_obj));
}


/**
 * 绑定回车键事件
 * @param {Object} id
 */
function enterKeydown(id) {
	$('#' + id + "-tab").bind('keyup', function(event) {
		if (event.keyCode == "13") {
			$("button[data-tab='" + id + "']").click();
		}
	});
}

/**
 * 发送消息
 */
function sendMsg(dom) {
	let tab_id = $(dom).data("tab"),
		msg_content = $("#" + tab_id + "-textarea").val();
	if (notNull(msg_content)) {
		let msg_box = document.getElementById("chat-msg-send").innerHTML;
		msg_box = msg_box.replace("[msg]", msg_content);
		let msg_obj = {
			type: "1",
			collectId: tab_id,
			msg: msg_content
		};
		//发送消息
		socket.ws.sendMsg(JSON.stringify(msg_obj));
		$("#" + tab_id + "-tab .msg-content-box").append(msg_box);
		$("#" + tab_id + "-textarea").val("");
		$("#" + tab_id + "-tab .msg-content-box").prop('scrollTop', $("#" + tab_id + "-tab .msg-content-box")[0].scrollHeight);
	}
}

/**
 * 处理未读消息
 */
function dealUnRead(id) {
	let is_check = $("#" + id + "-box").attr("data-flag");
	if (is_check === "show") {
		$("#" + id + "-unread").html(0);
		$("#" + id + "-unread").hide();
	} else {
		let unread = parseInt($("#" + id + "-unread").text());
		unread++;
		if (unread >= 99) {
			unread = 99;
		}
		$("#" + id + "-unread").html(unread);
		$("#" + id + "-unread").show();
	}
}

/**
 * 打印消息
 * @param {Object} msg
 * @param {Object} type
 */
function printMsgModule(res, type) {
	let docId, module;
	if (type == "send") {
		docId = "chat-msg-send";
		module = document.getElementById(docId).innerHTML;
		module = module.replace("[msg]", res.msg);
		$("#" + res.collectId + "-tab .msg-content-box").append(module);
	} else if (type == "receive") {
		docId = "chat-msg-receive";
		$("#" + res.sendId + "-last").html(res.msg);
		$("#" + res.sendId + "-time").html(timestampToTime(res.createTm));
		module = document.getElementById(docId).innerHTML;
		module = module.replace("[msg]", res.msg);
		$("#" + res.sendId + "-tab .msg-content-box").append(module);
	}
}

/**
 * 打印用户列表
 * @param {Object} obj
 */
function printBoxModule(obj) {
	let module = document.getElementById("chat-box-module").innerHTML;
	module = module.replace("[chat-box-id]", obj.collectId + "-box");
	module = module.replace("[chat-box-index]", obj.collectId);
	module = module.replace("[chat-user-name]", obj.collectId);
	module = module.replace("[chat-id-last]", obj.collectId + "-last");
	module = module.replace("[chat-id-time]", obj.collectId + "-time");
	module = module.replace("[chat-id-unread]", obj.collectId + "-unread");
	module = module.replace("[chat-last-msg]", "");
	module = module.replace("[chat-time]", "");
	$(".chat-list-column").append(module);
}

/**
 * 打印聊天窗口模板
 * @param {Object} obj
 */
function printTabModule(obj) {
	let module = document.getElementById("chat-tab-mudole").innerHTML;
	module = module.replace("[chat-tab-id]", obj.collectId + "-tab");
	module = module.replace("[chat-user-name]", obj.collectId);
	module = module.replace("[chat-area]", obj.collectId + "-textarea");
	module = module.replace("[tab-id]", obj.collectId);
	$(".chat-content-box").append(module);
}
