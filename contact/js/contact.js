/**
 * 页面加载事件
 */
$(function() {
	//初始化地图
	initMap();
})


function initMap() {
	var Gaomap = new AMap.Map('gcontainer', {
		center: [113.880594, 22.95487],
		zoom: 16
	});
}
