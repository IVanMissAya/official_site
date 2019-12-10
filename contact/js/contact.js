/**
 * 页面加载事件
 */
$(function() {
	localStorage.setItem("router", "contact");
	
	//初始化地图
	initMap();
})

/**
 * 初始化地图组件
 */
function initMap() {
	var Gaomap = new AMap.Map('gcontainer', {
		center: [113.880594, 22.95487],
		zoom: 16
	});
}

