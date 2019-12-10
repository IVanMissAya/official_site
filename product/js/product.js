/**
 * 页面加载事件
 */
$(function() {
	localStorage.setItem("router", "product");
	//初始化table
	initialTable();
})

/**
 * 初始化table
 */
function initialTable() {
	let data = [{"text1": "Resolution","text2": "240 x 180","text3": "346 x 260","colText_1":"Resolution","colText_2":"Resolution240","colText_3":"Resolution346"},
				{"text1": "Time resolution","text2": "1 µs","text3": "1 µs","colText_1":"TimeResolution","colText_2":"TimeResolution1","colText_3":"TimeResolution2"},
				{"text1": "Frames","text2": "Greyscale, calibration mode only","text3": "Greyscale, simultaneous output","colText_1":"Frames","colText_2":"Frames1","colText_3":"Frames2"},
				{"text1": "Optics","text2": "CS-mount","text3": "CS-mount","colText_1":"Optics","colText_2":"Optics1","colText_3":"Optics2"},
				{"text1": "Host Connection, Power source","text2": "USB 3.0 micro","text3": "USB 3.0 micro","colText_1":"PowerSource","colText_2":"PowerSource1","colText_3":"PowerSource2"},
				{"text1": "Bandwidth","text2": "12 MEPS","text3": "12 MEPS","colText_1":"Bandwidth","colText_2":"Bandwidth1","colText_3":"Bandwidth2"},
				{"text1": "Software","text2": "jAER and cAER","text3": "jAER and cAER","colText_1":"Software","colText_2":"Software1","colText_3":"Software2"},
				{"text1": "Power consumption","text2": "event/frame mode: 120/160 mA","text3": "with/without APS: 130/120 mA","colText_1":"consumption","colText_2":"consumption1","colText_3":"consumption2"},
				{"text1": "Dimensions [mm]","text2": "H 40 x W 60 x D 25","text3": "H 40 x W 60 x D 25","colText_1":"Dimensions","colText_2":"Dimensions1","colText_3":"Dimensions2"},
				{"text1": "Weight","text2": "75 g without lens","text3": "100 g without lens","colText_1":"Weight","colText_2":"Weight1","colText_3":"Weight2"},
				{"text1": "Hardware camera sync","text2": "Yes","text3": "Yes","colText_1":" camera","colText_2":"camera1","colText_3":"camera2"},
				{"text1": "IMU","text2": "Yes","text3": "Yes","colText_1":"IMU","colText_2":"IMU1","colText_3":"IMU2"},
				{"text1": "Special features","text2": "4 side mounting points, Robust engineering plastic","text3": "4 side mounting points, Anodized aluminum casing","colText_1":"features","colText_2":"features1","colText_3":"features2"},
				{"text1": "Tripod mount","text2": "Whitworth 1/4″-20 female","text3": "Whitworth 1/4″-20 female","colText_1":"mount","colText_2":"mount1","colText_3":"mount2"}]
	let html = "";
	for (let i = 0; i < data.length; i++) {
		let temp = document.getElementById("tableTr").innerHTML;
		temp = temp.replace("[text1]", data[i].text1);
		temp = temp.replace("[text2]", data[i].text2);
		temp = temp.replace("[text3]", data[i].text3);
		
		if(data[i].colText_1){
			temp = temp.replace("[colText_1]", data[i].colText_1);
			temp = temp.replace("[colText_2]", data[i].colText_2);
			temp = temp.replace("[colText_3]", data[i].colText_3);
		}
		html += temp;
	}
	$(".bottomSensor table").append(html);
	
	//查看localStorage中的语言
	let type = "zh";
	if (localStorage.getItem("lanaguage")) {
		type = localStorage.getItem("lanaguage");
	}
	loadProperties(type);
	
}
