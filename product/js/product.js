/**
 * 页面加载事件
 */
$(function() {
	//初始化table
	initialTable();

})

/**
 * 初始化table
 */
function initialTable() {
	let data = [{"text1": "Ultra-low latency","text2": "below 0.1ms","text3": "below 0.1ms"},
				{"text1": "High dynamic range","text2": "above 120 dB","text3": "above 120 dB"},
				{"text1": "Reduced data rate","text2": "save on bandwidth","text3": "save on bandwidth"},
				{"text1": "Low power consumption","text2": "up to 90% less","text3": "up to 90% less"},
				{"text1": "Standard optics","text2": "use your existing lenses","text3": "use your existing lenses"},
				{"text1": "High dynamic range","text2": "above 120 dB","text3": "above 120 dB"},
				{"text1": "Reduced data rate","text2": "save on bandwidth","text3": "save on bandwidth"},
				{"text1": "Low power consumption","text2": "up to 90% less","text3": "up to 90% less"},
				{"text1": "Low power consumption","text2": "up to 90% less","text3": "up to 90% less"},
				{"text1": "High dynamic range","text2": "above 120 dB","text3": "above 120 dB"},
				{"text1": "Reduced data rate","text2": "save on bandwidth","text3": "save on bandwidth"},
				{"text1": "Low power consumption","text2": "up to 90% less","text3": "up to 90% less"},
				{"text1": "Low power consumption","text2": "up to 90% less","text3": "up to 90% less"}]
	let html = "";
	for (let i = 0; i < data.length; i++) {
		let temp = document.getElementById("tableTr").innerHTML;
		temp = temp.replace("[text1]", data[i].text1);
		temp = temp.replace("[text2]", data[i].text2);
		temp = temp.replace("[text3]", data[i].text3);
		html += temp;
	}
	$(".bottomSensor table").append(html);
}
