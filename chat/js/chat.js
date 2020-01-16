let socket,
	chatId = uuid(8) + "inteagle.chat.id";
// 本地socket路径
const wsServer = "ws://192.168.26.135:8080/service/" + chatId;
// 服务器socket路径
// const wsServer = "wss://www.inteagle.com.cn/inteagle-manage/service/" + chatId;

if (typeof(WebSocket) == "undefined") {
	console.log("您的浏览器不支持WebSocket");
} else {
	socket = new socketEntity();
	socket.wsServer = wsServer;
	//连接websocket
	socket.connect(wsServer);
	socket.writeScreen = function(res) {
		//socket消息处理
		console.log("ws-res----", res);

		if (res.type === MSG_TYPE.chatTab) {
			// ------新建窗口----------
			//用户列表
			printBoxModule(res);
			//聊天窗口
			printTabModule(res);
		} else if (res.type === MSG_TYPE.chatMsg || res.type === MSG_TYPE.msgRecord || res.type === MSG_TYPE.chatPic) {

			//消息处理
			if (res.sendId.indexOf("inteagle.chat.id") > -1) {
				//---发消息------
				if (res.remark === MSG_TYPE.chatPic) {
					//图片消息
					printPicMsgModule(res, "send");
				} else {
					//文字消息
					let promise = new Promise(function(resolve, reject) {
						printMsgModule(res, "send");
						resolve()
					});
					promise.then(function() {
						let height = $("#" + res.collectId + "-tab .msg-content-box")[0].scrollHeight + 500;
						$("#" + res.collectId + "-tab .msg-content-box").prop('scrollTop', height);
					});
				}
			} else {
				//-----------收消息-----------
				//判断窗口是否存在
				if ($("#" + res.sendId + "-tab").length > 0) {
					//处理未读
					let unread_obj = {
						"id": res.sendId,
						"msg": res.msg,
						"type": res.type,
						"createTm": res.createTm
					}
					dealUnRead(unread_obj);
					if (res.remark === MSG_TYPE.chatPic) {
						//图片消息
						printPicMsgModule(res, "receive");
					} else {
						//文字消息
						let promise = new Promise(function(resolve, reject) {
							printMsgModule(res, "receive");
							resolve()
						});
						promise.then(function() {
							$("#" + res.sendId + "-tab .msg-content-box").prop('scrollTop', $("#" + res.sendId + "-tab .msg-content-box")[
								0].scrollHeight);
						});
					}
				} else {

					//窗口不存在,新建窗口
					let res_obj = {
						"collectId": res.sendId,
						"type": res.type,
						"createTm": res.createTm,
						"remark": res.remark
					};
					let promise = new Promise(function(resolve, reject) {
						//用户列表
						printBoxModule(res_obj);
						//聊天窗口
						printTabModule(res_obj);
						resolve()
					});
					promise.then(function() {
						let unread_obj = {
							"id": res.sendId,
							"msg": res.msg,
							"type": res.type,
							"createTm": res.createTm
						}
						//显示未读消息
						dealUnRead(unread_obj);
					});

				}
			}
		}




	}
};

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
	// $('#' + id + "-tab").bind('keyup', function(event) {
	// 	if (event.keyCode == "13") {
	// 		$("button[data-tab='" + id + "']").click();
	// 	}
	// });
	$("iframe[textarea=" + id + "-textarea]").contents().find("body").keyup(function(event) {
		if (event.keyCode == "13") {
			event.cancelBubble = true;
			event.preventDefault();
			event.stopPropagation();
			$("button[data-tab='" + id + "']").click();
		}
	});
}

/**
 * 发送消息
 */
function sendMsg(dom) {
	let tab_id = $(dom).data("tab"),
		//节点内标签内容
		msg_content = $("iframe[textarea=" + tab_id + "-textarea]").contents().find("body").html();

	if (msg_content.indexOf("<div><br></div><div><br></div>") > -1) {
		msg_content = msg_content.replace("<div><br></div><div><br></div>", "");
	}

	console.log("msg_content----", msg_content);
	if (notNull(msg_content)) {
		let msg_box = document.getElementById("chat-msg-send").innerHTML;
		msg_box = msg_box.replace("[msg]", msg_content);
		let msg_obj = {
			type: "1",
			collectId: tab_id,
			msg: msg_content
		};

		//判断当前连接状态
		if (socket.ws.readyState === socket.webSocketState.OPEN) {
			//发送消息
			socket.ws.sendMsg(JSON.stringify(msg_obj));
			$("iframe[textarea=" + tab_id + "-textarea]").contents().find("body").html("");
			$("#" + tab_id + "-tab .msg-content-box").append(msg_box);
			$("#" + tab_id + "-tab .msg-content-box").prop('scrollTop', $("#" + tab_id + "-tab .msg-content-box")[0].scrollHeight +
				200);
		} else {
			printTipsModule(tab_id, "连接已断开");
		}

	}
}


/**
 * 处理未读消息
 */
function dealUnRead(res) {
	let is_check = $("#" + res.id + "-box").attr("data-flag");
	if (is_check === "show") {
		$("#" + res.id + "-unread").html(0);
		$("#" + res.id + "-unread").hide();
	} else {
		let unread = parseInt($("#" + res.id + "-unread").text());
		unread++;
		if (unread >= 99) {
			unread = 99;
		}
		$("#" + res.id + "-unread").html(unread);
		$("#" + res.id + "-unread").show();
	}
	if (res.remark === MSG_TYPE.chatMsg) {
		$("#" + res.id + "-last").html(res.msg);
	}
	$("#" + res.id + "-time").html(timestampToTime(res.createTm));

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
		module = document.getElementById(docId).innerHTML;
		module = module.replace("[msg]", res.msg);
		$("#" + res.sendId + "-tab .msg-content-box").append(module);
	}
}

/**
 * 打印图片消息
 * @param {Object} res
 * @param {Object} type
 */
function printPicMsgModule(res, type) {
	let docId, module;
	if (type == "send") {
		docId = "chat-msg-send-pic";
		module = document.getElementById(docId).innerHTML;
		module = module.replace("[src]", res.msg);
		$("#" + res.collectId + "-tab .msg-content-box").append(module);
	} else if (type == "receive") {
		docId = "chat-msg-receive-pic";
		module = document.getElementById(docId).innerHTML;
		module = module.replace("[src]", res.msg);
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


let layedit, layform;
/**
 * 打印聊天窗口模板
 * @param {Object} obj
 */
function printTabModule(obj) {
	let module = document.getElementById("chat-tab-mudole").innerHTML;
	module = module.replace("[chat-tab-id]", obj.collectId + "-tab");
	// module = module.replace("[chat-time]", chat_time);
	module = module.replace("[chat-user-name]", obj.collectId);
	module = module.replace("[chat-area]", obj.collectId + "-textarea");
	module = module.replace("[tab-id]", obj.collectId);
	$(".chat-content-box").append(module);
	layui.use(['layedit', 'form'], function() {
		layform = layui.form;
		layedit = layui.layedit;
		let iframe_name = obj.collectId + "-myEdit";
		iframe_name = layedit.build(obj.collectId + "-textarea", {
			//, '|', 'image'
			tool: ['face']
		});
		$("iframe").contents().find("body").css("min-height", '160px');
		//自定义验证规则
		layform.verify({
			content: function() {
				layedit.sync(iframe_name);
			}
		});
	});
}

/**
 * 打印提示消息
 * @param {Object} tips_msg
 */
function printTipsModule(id, tips_msg) {
	let module = document.getElementById("msg-tips").innerHTML;
	module = module.replace("[msg_tips]", tips_msg);
	$("#" + id + "-tab .msg-content-box").append(module);
}
