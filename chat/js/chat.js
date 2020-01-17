let socket,
	chatId = uuid(8) + "inteagle.chat.id";
// 本地socket路径
// const wsServer = "ws://192.168.26.135:8080/service/" + chatId;
// 服务器socket路径
const wsServer = "wss://www.inteagle.com.cn/inteagle-manage/service/" + chatId;

if (typeof(WebSocket) == "undefined") {
	console.log("您的浏览器不支持WebSocket");
} else {
	socket = new socketEntity();
	socket.wsServer = wsServer;
	//连接websocket
	socket.connect(wsServer);
	socket.writeScreen = function(res) {
		//socket消息处理
		// console.log("ws-res----", res);

		if (res.type === MSG_TYPE.chatTab) {
			// ------新建窗口----------
			//用户列表
			printBoxModule(res);
			//聊天窗口
			printTabModule(res);
		} else if (res.type === MSG_TYPE.chatMsg || res.type === MSG_TYPE.msgRecord || res.type === MSG_TYPE.chatPic) {
			//消息处理
			//---------判断发消息的人是否管理端------
			if (res.sendId.indexOf("inteagle.chat.id") > -1) {
				let promise = new Promise(function(resolve, reject) {
					//---发消息------
					if (res.remark === MSG_TYPE.chatPic) {
						//图片消息
						printPicMsgModule(res, "send");
					} else {
						//文字消息
						printMsgModule(res, "send");
					}
					resolve()
				});
				promise.then(function() {
					scrollBottom(res.collectId);
				});
			} else {
				// 已存在窗口
				//-----------收消息-----------
				if ($("#" + res.sendId + "-tab").length > 0) {
					let promise = new Promise(function(resolve, reject) {
						// ------处理未读消息--------
						let unread_obj = {
							"id": res.sendId,
							"msg": res.msg,
							"type": res.type,
							"remark": res.remark,
							"createTm": res.createTm
						}
						dealUnRead(unread_obj);
						if (res.remark === MSG_TYPE.chatPic) {
							//图片消息
							printPicMsgModule(res, "receive");
						} else {
							//文字消息
							printMsgModule(res, "receive");
						}
						resolve()
					});
					promise.then(function() {
						scrollBottom(res.sendId);
					});
				} else {
					let promise = new Promise(function(resolve, reject) {
						//窗口不存在,新建窗口
						let res_obj = {
							"collectId": res.sendId,
							"type": res.type,
							"createTm": res.createTm
						};
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
							"remark": res.remark,
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
	let promise = new Promise(function(resolve, reject) {
		if (notNull(msg_content)) {
			//判断当前连接状态
			if (socket.ws.readyState === socket.webSocketState.OPEN) {
				let msg_obj = {
					type: "1",
					collectId: tab_id,
					msg: msg_content
				};
				//发送消息
				socket.ws.sendMsg(JSON.stringify(msg_obj));
				$("iframe[textarea=" + tab_id + "-textarea]").contents().find("body").html("");
				printMsgModule(msg_obj, "send");
			} else {
				printTipsModule(tab_id, "连接已断开");
			}
		}
		resolve()
	});
	promise.then(function() {
		scrollBottom(tab_id);
	});
}


/**
 * 上传图片
 */

function uploadPic(dom) {
	let index = $(dom).attr("data-index");
	$("#" + index + "-pic").click();
}

function upPic(dom) {
	let file = $(dom)[0].files[0],
		index = $(dom).attr("data-index");
	let promise = new Promise(function(resolve, reject) {
		if (file.size > (1024 * 1024)) {
			layer.ready(function() {
				layer.msg('上传图片大小不能超过1M!');
			});
			return;
		}
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(e) {
			let file_base64 = reader.result //或者 e.target.result都是一样的，都是base64码
			let msg_obj = {
				"collectId": index,
				"type": "2",
				"msg": file_base64
			};
			//判断当前连接状态
			if (socket.ws.readyState === socket.webSocketState.OPEN) {
				$(dom).attr("type", "text");
				//打印图片消息
				printPicMsgModule(msg_obj, "send");
				socket.ws.sendMsg(JSON.stringify(msg_obj));
				$(dom).attr("type", "file");
			} else {
				printTipsModule(tab_id, "连接已断开");
			}
		}
		resolve()
	});
	promise.then(function() {
		scrollBottom(index);
	});
}


/**
 * 滚动到窗口底部
 * @param {Object} id
 */
function scrollBottom(id) {
	$("#" + id + "-tab .msg-content-box").prop('scrollTop', $("#" + id + "-tab .msg-content-box")[
		0].scrollHeight);
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
	} else {
		$("#" + res.id + "-last").html("收到一条图片消息...");
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
		scrollBottom(res.collectId);
	} else if (type == "receive") {
		docId = "chat-msg-receive";
		module = document.getElementById(docId).innerHTML;
		module = module.replace("[msg]", res.msg);
		$("#" + res.sendId + "-tab .msg-content-box").append(module);
		scrollBottom(res.sendId);
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
		scrollBottom(res.collectId);
	} else if (type == "receive") {
		docId = "chat-msg-receive-pic";
		module = document.getElementById(docId).innerHTML;
		module = module.replace("[src]", res.msg);
		$("#" + res.sendId + "-tab .msg-content-box").append(module);
		scrollBottom(res.sendId);
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
	module = module.replace("[chat-user-name]", obj.collectId);
	module = module.replace("[chat-tab-pic-id]", obj.collectId);
	module = module.replace("[upbtn-id]", obj.collectId + "-pic");
	module = module.replace("[chat-tab-pic-input-id]", obj.collectId);
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


/**
 * 预览图片
 * @param {Object} dom
 */
function previewPic(dom) {
	let imgArry = [],
		imgSrc = $(dom).attr("src");
	imgArry.push(imgSrc);
	layer.photos({
		photos: {
			"title": "photo", //相册标题
			"id": 1, //相册id
			"start": 0, //初始显示的图片序号，默认0
			"data": [ //相册包含的图片，数组格式
				{
					"alt": "photo",
					"pid": 1, //图片id
					"src": imgArry, //原图地址
					"thumb": imgArry //缩略图地址
				}
			]
		},
		anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
	});
}
