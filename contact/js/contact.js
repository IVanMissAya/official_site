/**
 * 页面加载事件
 */
$(function() {
	localStorage.setItem("router", "contact");

	//初始化地图
	initMap();
})


/**
 * 提交留言
 */
$(".submitBtn").on("click", function(dom) {
	let name = $(".leave_name").val(),
		email = $(".leave_email").val(),
		mobile = $(".leave_mobile").val(),
		leaveMessage = $(".leaveMessage").val();
	if (checkNullShowMsg(name, "请输入您的姓名", "leave_name") && checkNullShowMsg(email, "请输入您的邮箱", "leave_email") &&
		checkNullShowMsg(mobile, "请输入您的手机号", "leave_mobile") && checkNullShowMsg(mobile, "请输入您的留言", "leaveMessage")) {
		if (isEmail(email) && isPhone(mobile)) {
			$.ajax({
				url: "https://www.inteagle.com.cn/inteagle-manage/LeaveMessageController/addLeaveMessage",
				type: "post",
				data: {
					name: name,
					email: email,
					mobile: mobile,
					leaveMessage: leaveMessage
				},
				success: function(res) {
					if (res.state == 200) {
						layer.ready(function() {
							layer.msg("提交成功", {
								icon: 1,
								time: 1000
							}, function() {
								$(".leave_name").val("");
								$(".leave_email").val("");
								$(".leave_mobile").val("");
								$(".leaveMessage").val("");
							});
						})
					}
				},
				error: function(badRes) {
					console.log(badRes);
				}
			});
		}
	}
})

/**
 * 初始化地图组件
 */
function initMap() {
	var Gaomap = new AMap.Map('gcontainer', {
		center: [113.87471, 22.94743],
		zoom: 16
	});
	// 创建一个 Marker 实例：
	var marker = new AMap.Marker({
		position: new AMap.LngLat(113.87471, 22.94743), // 经纬度对象
		title: '中科院云计算中心'
	});

	// 将创建的点标记添加到已有的地图实例：
	Gaomap.add(marker);
}
