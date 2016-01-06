function RViewUI()
{
	// 可视区域对象
	this.form = null;
	this.bgPanel = null;
	this.titlePanel = null;
	this.infoPanel = null;
	this.infoLineUp = null;
	this.infoLineDown = null;
	this.chartPanel = null;
	this.outChartPanel = null;
	this.inChartPanel = null;
	this.outChart = null;
	this.inChart = null;
	this.title = "";
	this.data = null;
	this.date = null;

	// 位置参数
	this.basicGI = new GeoInfo();
	this.GI = this.basicGI;
	// 数据
	this.categories = new Array();
	this.initdata = new Array();
	this.vipsOut = new Array();
	this.vipsIn = new Array();
	for (var i = 0; i < 24; i++)
	{
		this.categories.push(i);
		this.initdata.push(0);
		this.vipsOut.push(new Array());
		this.vipsIn.push(new Array());
	}
};
RViewUI.prototype.initialize = function()
{

	// 容器
	this.form = document.body;
	// 背景面板
	this.bgPanel = document.createElement("div");
	this.bgPanel.id = "bgPanel";
	this.bgPanel.style.border = "3px ridge #4184D5;";
	this.form.appendChild(this.bgPanel);
	// 标题栏
	this.titlePanel = document.createElement("div");
	this.titlePanel.id = "titlePanel";
	this.titlePanel.innerHTML = this.title + "航班运行态势";
	this.bgPanel.appendChild(this.titlePanel);
	// 信息栏
	this.infoPanel = document.createElement("div");
	this.infoPanel.id = "infoPanel";
	this.bgPanel.appendChild(this.infoPanel);

	// this.infoPanel.style.background = "red";

	// 图表面板
	this.chartPanel = document.createElement("div");
	this.chartPanel.id = "chartPanel";
	this.bgPanel.appendChild(this.chartPanel);
	// 起飞图表面板
	this.outChartPanel = document.createElement("div");
	this.outChartPanel.id = "outChart";
	this.outChartPanel.className = "chart";
	this.chartPanel.appendChild(this.outChartPanel);
	// 降落图表面板
	this.inChartPanel = document.createElement("div");
	this.inChartPanel.id = "inChart";
	this.inChartPanel.className = "chart";
	this.chartPanel.appendChild(this.inChartPanel);
	// 计算大小
	this.sized();
	this.bulidChart("inChart");
	this.bulidChart("outChart");

	// alert(this.inChart.yAxis[0].max);
	// this.inChart.redraw();
	// this.inChart.yAxis[0].max=1000;
	//
	// var legendLogoX = parseInt(25 * this.GI.sizeRateW);
	// var legendLogoY = parseInt(16 * this.GI.sizeRateH);

	// this.addLegend(this.outChart.series[0].color,
	// this.outChart.series[0].name, legendLogoX, legendLogoY);
	// this.addLegend(this.outChart.series[1].color,
	// this.outChart.series[1].name, legendLogoX, legendLogoY * 2);
	// this.addLegend(this.inChart.series[0].color, this.inChart.series[0].name,
	// legendLogoX, legendLogoY * 3);
	// this.addLegend(this.inChart.series[1].color, this.inChart.series[1].name,
	// legendLogoX, legendLogoY * 4);
};

RViewUI.prototype.addLegend = function(color, text, x, y)
{
	var logoW = parseInt(18 * this.GI.sizeRateW);
	var logoH = parseInt(14 * this.GI.sizeRateH);
	var fontSize = parseInt(logoH * 1);
	var logoArc = parseInt(1 * this.GI.sizeRateH);
	var padding = parseInt(6 * this.GI.sizeRateW);
	this.outChart.renderer.rect(x, y, logoW, logoH, logoArc).attr({

		fill : color,
		zIndex : 3
	}).add();
	this.outChart.renderer.text(text, x + logoW + padding, y + fontSize).attr({
		rotation : 0
	}).css({
		color : '#ffffff',
		fontSize : fontSize + 'px',
		fontWeight : 'bold'
	}).add();
};
RViewUI.prototype.onresize = function()
{

	this.inChart.destroy();
	this.outChart.destroy();
	this.reset();

	this.sized();
	this.bgPanel.style.display = "";

	this.bulidChart("inChart");
	this.bulidChart("outChart");

	var tmpdata = this.data;
	this.data = null;
	this.setJsonData(tmpdata);

};

RViewUI.prototype.setJsonData = function(jObj, isResize)
{

	if (jObj == null)
	{
		return;
	}

	var staMaster = jObj.staMaster;

	if (staMaster == null)
	{
		this.reset();
		this.setInfoValue("nscheduleFlightsCount", 0);
		this.setInfoValue("fscheduleFlightsCount", 0);
		this.setInfoValue("rdepFlightsCount", 0);
		this.setInfoValue("unDepCLDFlightsCount", 0);
		this.setInfoValue("delay", 0);
		this.setInfoValue("cnlflightsCount", 0);
		this.setInfoValue("specialFlightsCount", 0);
		this.setInfoValue("vipFlightsCounts", 0);
		this.setInfoValue("dynamicNormalRate", 0);

		this.redrawYAxis(jObj);

		// 柱状图
		for (var i = 0; i < 24; i++)
		{

			this.setData("out", 0, i, 0);
			this.setData("out", 1, i, 0);
			this.setData("in", 0, i, 0);
			this.setData("in", 1, i, 0);

		}

		this.outChart.redraw();
		this.inChart.redraw();

		return;
	}

	var nscheduleFlightsCount = this.filterData(staMaster.nscheduleFlightsCount);
	var fscheduleFlightsCount = this.filterData(staMaster.fscheduleFlightsCount);
	var nfscount = nscheduleFlightsCount + fscheduleFlightsCount;

	// 全部架次 nfscount

	this.setInfoValue("nfscount", nfscount);

	// 国内航班计划
	this.setInfoValue("nscheduleFlightsCount", nscheduleFlightsCount);
	// 国际航班计划
	this.setInfoValue("fscheduleFlightsCount", fscheduleFlightsCount);
	// 已起飞架次
	this.setInfoValue("rdepFlightsCount", this.filterData(staMaster.rdepFlightsCount));
	// 已降落架次

	this.setInfoValue("rarrFlightsCount", this.filterData(staMaster.rarrFlightsCount));
	// 排队架次
	this.setInfoValue("unDepCLDFlightsCount", this.filterData(staMaster.unDepCLDFlightsCount));
	// 延误架次
	var depDelayFlightsCount = this.filterData(staMaster.depDelayFlightsCount);
	var arrDelayFlightsCount = this.filterData(staMaster.arrDelayFlightsCount);
	var delay = depDelayFlightsCount + arrDelayFlightsCount;
	delay = depDelayFlightsCount;
	this.setInfoValue("delay", delay);
	// 取消架次
	//this.setInfoValue("cnlflightsCount", this.filterData(staMaster.cnlflightsCount));
	// 专机架次
	this.setInfoValue("specialFlightsCount", this.filterData(staMaster.specialFlightsCount));
	// 要客架次
	this.setInfoValue("vipFlightsCounts", this.filterData(staMaster.vipFlightsCount));
	// 实时正常率
	// var dynamicDepNormalRate = staMaster.dynamicDepNormalRate;
	// var dynamicArrNormalRate = staMaster.dynamicArrNormalRate;
	var dynamicNormalRate = this.filterData(staMaster.dynamicNormalRate * 100);
	dynamicNormalRate = parseInt(dynamicNormalRate);
	this.setInfoValue("dynamicNormalRate", dynamicNormalRate + "%");

	this.redrawYAxis(jObj);

	// 柱状图
	
	for (var i = 0; i < 24; i++)
	{
		var str = jObj.staMaster.missionDate;
		if (i < 10)
		{
			str += "0" + i + "00";
		}
		else
		{
			str += i + "00";
		}

		var SDepFlightsCounts = this.getJsonValue(jObj.sdepFlightsCounts, str);
		var SArrFlightsCounts = this.getJsonValue(jObj.sarrFlightsCounts, str);

		this.setData("out", 0, i, SDepFlightsCounts);
		this.setData("out", 1, i, this.getJsonValue(jObj.rdepFlightsCounts, str));
		this.setData("in", 0, i, SArrFlightsCounts);
		this.setData("in", 1, i, this.getJsonValue(jObj.rarrFlightsCounts, str));

		var dSpecialFlightsCounts = this.getJsonValue(jObj.dspecialFlightsCounts, str);
		var aSpecialFlightsCounts = this.getJsonValue(jObj.aspecialFlightsCounts, str);
		// var dSpecialFlightsCountsLast = 0;
		// var aSpecialFlightsCountsLast = 0;
		// var dSpecialFlightsCountsPlus = dSpecialFlightsCounts;
		// var aSpecialFlightsCountsPlus = aSpecialFlightsCounts;

		// this.addVipMarker("out", i);
		// this.addVipMarker("in", i);
		for (var j = 0; j < dSpecialFlightsCounts; j++)
		{
			this.addVipMarker("out", i);
		}

		for (var j = 0; j < aSpecialFlightsCounts; j++)
		{
			this.addVipMarker("in", i);
		}

		// if (this.data != null)
		// {
		//
		// dSpecialFlightsCountsLast =
		// this.getJsonValue(this.data.DSpecialFlightsCounts, str);
		// aSpecialFlightsCountsLast =
		// this.getJsonValue(this.data.ASpecialFlightsCounts, str);
		// dSpecialFlightsCountsPlus = dSpecialFlightsCounts -
		// dSpecialFlightsCountsLast;
		// aSpecialFlightsCountsPlus = aSpecialFlightsCounts -
		// aSpecialFlightsCountsLast;
		// }
		//
		// // alert(dSpecialFlightsCounts+","+ dSpecialFlightsCountsLast+","+
		// // dSpecialFlightsCountsPlus);
		//
		// if (dSpecialFlightsCountsPlus >= 0)
		// {
		//
		// for (var j = 0; j < dSpecialFlightsCountsPlus; j++)
		// {
		// this.addVipMarker("out", i);
		// }
		// }
		//
		// if (aSpecialFlightsCountsPlus >= 0)
		// {
		//
		// for (var j = 0; j < aSpecialFlightsCountsPlus; j++)
		// {
		// this.addVipMarker("in", i);
		// }
		// }
	}

	this.outChart.redraw();
	this.inChart.redraw();

	this.data = jObj;

};

RViewUI.prototype.getJsonValue = function(jObj, key)
{
	try
	{
		return jObj[key] * 1;
	}
	catch (e)
	{

	}

	return 0;

};

RViewUI.prototype.filterData = function(value)
{
	if (value != null && value != undefined && !isNaN(value))
	{
		var num = value * 1;

		return num;

	}

	return 0;

};

RViewUI.prototype.redrawYAxis = function(jObj)
{
	var max0 = 0;
	var min0 = 10000000;

	var max1 = 0;
	var min1 = 10000000;

	// 柱状图
	for (var i = 0; i < 24; i++)
	{
		var str = jObj.staMaster.missionDate;
		if (i < 10)
		{
			str += "0" + i + "00";
		}
		else
		{
			str += i + "00";
		}

		var sdepFlightsCounts = parseInt(jObj.sdepFlightsCounts[str]);
		var rdepFlightsCounts = parseInt(jObj.rdepFlightsCounts[str]);
		var sarrFlightsCounts = parseInt(jObj.sarrFlightsCounts[str]);
		var rarrFlightsCounts = parseInt(jObj.rarrFlightsCounts[str]);

		if (max0 < sdepFlightsCounts)
		{
			max0 = sdepFlightsCounts;
		}
		if (min0 > sdepFlightsCounts)
		{
			min0 = sdepFlightsCounts;
		}

		if (max0 < rdepFlightsCounts)
		{
			max0 = rdepFlightsCounts;
		}
		if (min0 > rdepFlightsCounts)
		{
			min0 = rdepFlightsCounts;
		}

		if (max1 < sarrFlightsCounts)
		{
			max1 = sarrFlightsCounts;
		}
		if (min1 > sarrFlightsCounts)
		{
			min1 = sarrFlightsCounts;
		}

		if (max1 < rarrFlightsCounts)
		{
			max1 = rarrFlightsCounts;
		}
		if (min1 > rarrFlightsCounts)
		{
			min1 = rarrFlightsCounts;
		}

	}

	var ado = getAxisData(min0, max0, 10, 10);
	var adi = getAxisData(min1, max1, 10, 10);

	var inOpt = this.inChart.yAxis[0].options;
	var outOpt = this.outChart.yAxis[0].options;

	inOpt.max = adi.max;
	inOpt.min = adi.min;
	inOpt.tickInterval = adi.int;

	outOpt.max = ado.max;
	inOpt.min = ado.min;
	outOpt.tickInterval = ado.int;

	// alert(max0 + " " + min0 + " " + int0 + "\n" + max1 + " " + min1 + " " +
	// int1);

	this.inChart.yAxis[0].setOptions(inOpt);
	this.outChart.yAxis[0].setOptions(outOpt);
};
RViewUI.prototype.sized = function()
{
	//
	try
	{
		this.GI = this.basicGI.getGeoInfo(window.innerWidth, window.innerHeight);
		//
		this.form.style.margin = this.GI.form_margin + "px";
		this.form.style.padding = this.GI.form_padding + "px";
		this.bgPanel.style.padding = this.GI.bgPanel_padding + "px";
		this.bgPanel.style.cssText += "border:" + this.GI.bgPanel_border;
		this.bgPanel.style.width = this.GI.bgPanel_width + "px";
		this.bgPanel.style.height = this.GI.bgPanel_height + "px";
		this.titlePanel.style.height = this.GI.titlePanel_height + "px";
		this.titlePanel.style.paddingTop = this.GI.titlePanel_paddingTop + "px";
		this.titlePanel.style.paddingLeft = this.GI.titlePanel_paddingLeft + "px";
		this.titlePanel.style.paddingRight = this.GI.titlePanel_paddingRight + "px";
		this.titlePanel.style.paddingBottom = this.GI.titlePanel_paddingBottom + "px";
		this.titlePanel.style.fontSize = this.GI.titlePanel_fontsize + "px";
		this.titlePanel.style.cssText += "border-bottom:" + this.GI.titlePanel_border;
		this.infoPanel.style.width = this.GI.infoPanel_width + "px";
		this.infoPanel.style.height = this.GI.infoPanel_height + "px";
		this.infoPanel.style.left = this.GI.infoPanel_left + "px";
		this.infoPanel.style.top = this.GI.infoPanel_top + "px";
		this.infoPanel.style.cssText += "border:" + this.GI.infoPane_border;
		this.chartPanel.style.width = this.GI.chartPanel_width + "px";
		this.chartPanel.style.height = this.GI.chartPanel_height + "px";
		this.chartPanel.style.left = this.GI.chartPanel_left + "px";
		this.chartPanel.style.top = this.GI.chartPanel_top + "px";
		this.outChartPanel.style.height = this.GI.chartHeight + "px";
		this.inChartPanel.style.height = this.GI.chartHeight + "px";

		this.infoPanel.innerHTML = "";
		this.addFlyInfo();
		this.addInfo("specialFlightsCount", "专机架次", "", "#FED038", false);
		this.addInfo("vipFlightsCounts", "要客架次", "", "#FED038", true);
		this.addInfo("rdepFlightsCount", "离港已执行", "", "#FED038", false);
		this.addInfo("rarrFlightsCount", "进港已执行", "", "#FED038", false);
		this.addInfo("delay", "离港延误", "", "#FED038", false);
		this.addInfo("unDepCLDFlightsCount", "地面排队架次 ", "(关舱门60分钟后未起飞架次)", "#FED038", true);
		this.addInfo("dynamicNormalRate", "离港正常率", "", "#FED038", false);

		//this.addInfo("cnlflightsCount", "取消架次", "", "#FED038", false);

	}
	catch (e)
	{
		alert(e.message);
	}
};

RViewUI.prototype.addFlyInfo = function()
{
	var infoPane = document.createElement("table");
	this.infoPanel.appendChild(infoPane);
	infoPane.cellPadding = 0;
	infoPane.cellSpacing = 0;
	infoPane.style.cssText += "border-bottom:" + this.GI.infoPane_border;
	// infoPane.style.margin = this.GI.infoPane_margin + "px";
	infoPane.style.width = this.GI.infoPane_width + "px";

	var row = infoPane.insertRow(0);
	var c1 = row.insertCell(0);
	var c2 = row.insertCell(1);

	c1.style.width = this.GI.infoPane_logo_width + "px";
	c1.innerHTML = "<img src='imgs/navfly.png' width=" + this.GI.infoPane_logo_size + " height=" + this.GI.infoPane_logo_size + ">";
	c1.align = "center";
	c1.vAlign = "top";
	c1.style.paddingTop = this.GI.infoPane_logo_padding + "px";

	var table = document.createElement("table");
	// table.border=1;
	table.width = "100%";
	// table.style.cssText += "border-bottom:" + this.GI.infoPane_border;
	c2.appendChild(table);
	var cellText = table.insertRow(0).insertCell(0);
	cellText.id = "plan_text"
	cellText.className = "infoText";
	cellText.colSpan = "3";
	// cellText.width="252";
	// c2.style.width = "130px";
	cellText.innerHTML = "航班计划架次";
	cellText.align = "left";
	cellText.vAlign = "middle";
	cellText.style.fontSize = this.GI.infoText_fontSize + "px";
	cellText.style.padding = this.GI.infoPane_padding + "px";

	var row = table.insertRow(1);
	var c21 = row.insertCell(0);
	var c22 = row.insertCell(1);
	var c23 = row.insertCell(2);

	c21.width = "40%";
	c21.align = "center";
	c21.vAlign = "middle";
	c21.style.cssText='color:#9AC0D5;font-size:' + this.GI.infoPane_sub_fontsize + 'px';
	c21.innerHTML="(总架次)";
	//c21.innerHTML += "<span style='color:#9AC0D5;font-size:" + this.GI.infoPane_sub_fontsize + "px'>(总架次)</span><br>";
	//c21.innerHTML += "<span class='infoText' id='nfscount' style='color:#C6FF01;font-size:" + this.GI.infoValue_fontSize + "px'>wait</span>";
	//c21.style.paddingBottom = this.GI.infoPane_padding + "px";

	c22.width = "30%";
	c22.align = "center";
	c22.vAlign = "middle";
	c22.style.cssText='color:#9AC0D5;font-size:' + this.GI.infoPane_sub_fontsize + 'px';
	c22.innerHTML="(国内)";
	//c22.innerHTML += "<span style='color:#9AC0D5;font-size:" + this.GI.infoPane_sub_fontsize + "px'>(国内)</span><br>";
	//c22.innerHTML += "<span class='infoText' id='nscheduleFlightsCount' style='color:#FED038;font-size:" + this.GI.infoValue_fontSize + "px'>wait</span>";
	//c22.style.paddingBottom = this.GI.infoPane_padding + "px";

	c23.width = "30%";
	c23.align = "center";
	c23.vAlign = "middle";
	c23.style.cssText='color:#9AC0D5;font-size:' + this.GI.infoPane_sub_fontsize + 'px';
	c23.innerHTML="<span>(</span><span>国外及<br>港澳台</span><span>)</span>";
	//c23.innerHTML += "<span style='color:#9AC0D5;font-size:" + this.GI.infoPane_sub_fontsize + "px'>(国际及<br>港澳台)</span><br>";
	//c23.innerHTML += "<span class='infoText' id='fscheduleFlightsCount' style='color:#FED038;font-size:" + this.GI.infoValue_fontSize + "px'>wait</span>";
	//c23.style.paddingBottom = this.GI.infoPane_padding + "px";


	var row2 = table.insertRow(2);
	var c31 = row2.insertCell(0);
	var c32 = row2.insertCell(1);
	var c33 = row2.insertCell(2);

	c31.align = "center";
	c31.vAlign = "middle";
	c31.innerHTML += "<span class='infoText' id='nfscount' style='color:#C6FF01;font-size:" + this.GI.infoValue_fontSize + "px'>wait</span>";

	c32.align = "center";
	c32.vAlign = "middle";
	c32.innerHTML += "<span class='infoText' id='nscheduleFlightsCount' style='color:#FED038;font-size:" + this.GI.infoValue_fontSize + "px'>wait</span>";

	c33.align = "center";
	c33.vAlign = "middle";
	c33.innerHTML += "<span class='infoText' id='fscheduleFlightsCount' style='color:#FED038;font-size:" + this.GI.infoValue_fontSize + "px'>wait</span>";
		

};

RViewUI.prototype.addInfo = function(name, text, subtext, color, showBorder)
{

	var infoPane = document.createElement("table");
	// infoPane.border = 1;
	this.infoPanel.appendChild(infoPane);
	infoPane.cellPadding = 0;
	infoPane.cellSpacing = 0;

	if (showBorder)
	{
		infoPane.style.cssText += "border-bottom:" + this.GI.infoPane_border;
	}

	infoPane.style.margin = this.GI.infoPane_margin + "px";
	infoPane.style.width = this.GI.infoPane_width + "px";

	var row = infoPane.insertRow(0);
	var c1 = row.insertCell(0);
	var c2 = row.insertCell(1);
	var c3 = row.insertCell(2);
	c1.style.width = this.GI.infoPane_logo_width + "px";
	c1.innerHTML = "<img src='imgs/navfly.png' width=" + this.GI.infoPane_logo_size + " height=" + this.GI.infoPane_logo_size + ">";
	c1.align = "center";
	c1.vAlign = "middle";

	c2.id = name + "_text";
	c2.className = "infoText";
	c2.style.width = this.GI.infoPane_text_width + "px";
	c2.innerHTML = text;
	c2.align = "left";
	c2.vAlign = "middle";
	c2.style.fontSize = this.GI.infoText_fontSize + "px";
	c2.style.padding = this.GI.infoPane_padding + "px";
	// c2.innerHTML += "<br><span style='float:left;font-size:" +
	// this.GI.infoPane_sub_fontsize + "px'>" + subtext + "</span>";

	c3.id = name;
	c3.className = "infoValue";
	c3.innerHTML = "wait";
	c3.align = "center";
	c3.vAlign = "middle";
	c3.style.paddingRight = this.GI.infoPane_padding + "px";
	c3.style.fontSize = this.GI.infoValue_fontSize + "px";
	c3.style.color = color;

	if (subtext && subtext != "")
	{
		var row2 = infoPane.insertRow(infoPane.rows.length);
		var c20 = row2.insertCell(0);
		c20.innerHTML = "&nbsp;";
		var c21 = row2.insertCell(1);
		c21.id = name + "_subtext";
		c21.colSpan = "2";
		c21.style.fontSize = this.GI.infoPane_sub_fontsize + "px";
		c21.style.padding = this.GI.infoPane_padding + "px";
		c21.className = "infoText";
		c21.align = "left";
		c21.vAlign = "middle";
		c21.innerHTML = subtext;
	}

};
RViewUI.prototype.setInfoValue = function(name, value, color)
{
	var infoValue = document.getElementById(name);
	if (infoValue != null)
	{
		infoValue.innerHTML = value;
		if (color != null)
		{
			infoValue.style.color = color;
		}
	}

};

RViewUI.prototype.setInfoTitle = function(name, text, subText)
{
	var infoText = document.getElementById(name + "_text");
	if (infoText != null)
	{
		infoText.innerHTML = text;

	}

	var subInfoText = document.getElementById(name + "_subtext");
	
	if (subInfoText != null)
	{
		
		subInfoText.innerHTML = subText;

	}

};
RViewUI.prototype.setTitle = function(title, date, area)
{
	this.titlePanel.innerHTML = "";

	var tb = document.createElement("table");
	this.titlePanel.appendChild(tb);
	tb.cellSpacing = 0;
	tb.cellPadding = 0;
	tb.width = "100%";

	var r = tb.insertRow(0);
	// r.border=1;
	// r.bgColor="red";
	var c0 = r.insertCell(0);
	var c1 = r.insertCell(1);
	var c2 = r.insertCell(2);
	c0.innerHTML = title;

	c0.width = "33%";
	c1.innerHTML = "航班运行态势";
	c1.width = "34%";
	c1.align = "center";
	c2.innerHTML = date;
	c2.width = "33%";
	c2.align = "right";

	// c1.bgColor="red";
	// this.titlePanel.innerHTML = "航班运行态势-" + title + "-" + date;

	if (area == null || area == "null")
	{

		this.setInfoTitle("plan", "全国计划班次");
		this.setInfoTitle("specialFlightsCount", "专机班次");
		this.setInfoTitle("vipFlightsCounts", "要客班次");
		this.setInfoTitle("cnlflightsCount", "取消班次");
		this.setInfoTitle("unDepCLDFlightsCount", "地面排队班次", "(关舱门60分钟后未起飞班次)");

	}
	else
	{
		this.setInfoTitle("plan", "航班计划架次");
		this.setInfoTitle("specialFlightsCount", "专机架次");
		this.setInfoTitle("vipFlightsCounts", "要客架次");
		this.setInfoTitle("cnlflightsCount", "取消架次");
		this.setInfoTitle("unDepCLDFlightsCount", "地面排队架次", "(关舱门60分钟后未起飞架次)");

	}
};
RViewUI.prototype.setDate = function(date)
{
	this.date = date;
};
RViewUI.prototype.bulidChart = function(container)
{
	var rv = this;
	var co = new ChartObject();
	co.chart.renderTo = container;
	co.chart.type = 'column';
	co.chart.backgroundColor = Highcharts.Color("#0B121C").setOpacity(0).get('rgba');
	co.plotOptions.column.grouping = false;
	co.plotOptions.column.shadow = true;
	// co.plotOptions.series.pointWidth = rv.GI.chart_point_width;

	var fontSize = parseInt(14 * this.GI.sizeRateH)
	co.legend.enabled = true;
	co.legend.backgroundColor = "white";
	co.legend.align = "left";
	co.legend.verticalAlign = "top";
	// co.legend.margin =100;
	co.legend.layout = "vertical";
	co.legend.float = true;
	co.legend.x = 10 * this.GI.sizeRateW;
	co.legend.y = 10 * this.GI.sizeRateH;
	co.legend.itemStyle = {
		fontSize : fontSize + 'px'
	}

	var xAxis = co.createXAxis();
	xAxis.categories = this.categories;
	var yAxis = co.createYAxis();
	// yAxis.max = 900;
	yAxis.opposite = true;
	// yAxis.tickInterval = 50;
	yAxis.labels.formatter = function()
	{
		var html = "<span  style='font-size: " + rv.GI.chart_yAxis_fontSize + "px;color: #ffffff;font-family: times new roman'>" + this.value + "</span>";
		return html;
	};
	var SP = co.createSeries();
	SP.name = this.title + "起飞计划";
	SP.data = this.initdata;
	// SP.pointPadding = 0.05;
	SP.color = Highcharts.Color("#65FFFD").setOpacity(0.23).get('rgba');
	var SR = co.createSeries();
	SR.name = this.title + "实际起飞";
	// SR.type="spline";
	SR.data = this.initdata;
	SR.pointPadding = 0.15;
	SR.color = {
		linearGradient : {
			x1 : 0,
			y1 : 0,
			x2 : 0,
			y2 : 1
		},
		stops :
		[
		[ 0, '#65FFFD' ],
		[ 1, '#0096FF' ] ]
	};
	if (container == "inChart")
	{

		co.legend.y = this.GI.chartHeight - 90 * this.GI.sizeRateW;

		yAxis.reversed = true;
		xAxis.opposite = true;
		SP.name = this.title + "降落计划";
		// SP.data = iPlan;
		SP.color = Highcharts.Color("#FF8F1E").setOpacity(0.23).get('rgba');
		SR.name = this.title + "实际降落";

		// SR.data = iReal;
		SR.color = {
			linearGradient : {
				x1 : 0,
				y1 : 0,
				x2 : 0,
				y2 : 1
			},
			stops :
			[
			[ 0, '#CD3D00' ],
			[ 1, '#FF8F1E' ] ]
		};
		xAxis.labels.formatter = function()
		{
			var i = this.value;
			if (i < 10)
			{
				i = "0" + i + ":00";
			}
			else
			{
				i = i + ":00";
			}
			var html = "<span  style='font-size: " + rv.GI.chart_xAxis_fontSize + "px;color: #ffffff;font-family: times new roman'>" + i + "</span>";
			return html;
		};
		co.chart.margin = rv.GI.chart_xAxis_inMargin;
		this.inChart = new Highcharts.Chart(co);
	}
	else
	{
		co.chart.margin = rv.GI.chart_xAxis_outMargin;
		xAxis.labels.formatter = function()
		{
			var html = "<img  style='margin-top: " + rv.GI.chart_xAxis_logoMarginTop + "px' src='imgs/" + this.value + ".png' width='" + rv.GI.chart_xAxis_logoSize + "' height='" + rv.GI.chart_xAxis_logoSize + "' border='0' >";
			return html;
		};
		this.outChart = new Highcharts.Chart(co);
	}
};
RViewUI.prototype.setData = function(type, index, category, data)
{
	if (type == "out")
	{
		// alert(this.outChart.series[index].data[category]);
		this.outChart.series[index].data[category].update(data, false);

	}
	else if (type == "in")
	{
		this.inChart.series[index].data[category].update(data, false);
	}
};
RViewUI.prototype.addVipMarker = function(type, category)
{
	var baseVipMarkerX = 23;
	var baseVipMarkerOutY = 195;
	var baseVipMarkerInY = 15;
	var size = parseInt(10 * this.GI.sizeRateW);

	if (type == "out")
	{
		var x = baseVipMarkerX + category * 28.6;
		var y = baseVipMarkerOutY - 12 * this.vipsOut[category].length;
		// alert(x+","+y);

		// alert(x * this.GI.sizeRateW + "," + y * this.GI.sizeRateH + "," +
		// size);
		var marker = this.outChart.renderer.image('imgs/vipo.png', x * this.GI.sizeRateW, y * this.GI.sizeRateH, size, size);
		marker.add();
		this.vipsOut[category].push(marker);
	}
	else if (type == "in")
	{
		var x = baseVipMarkerX + category * 28.6;
		var y = baseVipMarkerInY + 12 * this.vipsIn[category].length;
		var marker = this.inChart.renderer.image('imgs/vipi.png', x * this.GI.sizeRateW, y * this.GI.sizeRateH, size, size);
		marker.add();
		this.vipsIn[category].push(marker);
	}
};
RViewUI.prototype.reset = function()
{
	for (var i = 0; i < this.vipsIn.length; i++)
	{
		var vips = this.vipsIn[i];
		for (var j = 0; j < vips.length; j++)
		{
			var marker = vips[j];
			if (marker != null && marker.destroy)
			{
				marker.destroy();
			}
		}
		this.vipsIn[i] = new Array();
	}
	for (var i = 0; i < this.vipsOut.length; i++)
	{
		var vips = this.vipsOut[i];
		for (var j = 0; j < vips.length; j++)
		{
			var marker = vips[j];
			if (marker != null && marker.destroy)
			{
				marker.destroy();
			}
		}
		this.vipsOut[i] = new Array();
	}
};
function GeoInfo()
{
	this.width = 960;
	this.height = 540;
	this.sizeRateW = 1;
	this.sizeRateH = 1;
	this.form_padding = 0;
	this.form_margin = 2;
	this.bgPanel_padding = 0;
	this.bgPanel_borderWidth = 3;
	this.bgPanel_border = this.bgPanel_borderWidth + "px ridge #4184D5;";
	this.bgPanel_width = this.width - this.form_margin * 2 - this.form_padding * 2 - this.bgPanel_padding * 2 - this.bgPanel_borderWidth * 2;
	this.bgPanel_height = this.height - this.form_margin * 2 - this.form_padding * 2 - this.bgPanel_padding * 2 - this.bgPanel_borderWidth * 2;
	this.titlePanel_height = 45;
	this.titlePanel_paddingTop = 10;
	this.titlePanel_paddingLeft = 35;
	this.titlePanel_paddingRight = 35;
	this.titlePanel_paddingBottom = 10;
	this.titlePanel_fontsize = 26;
	this.titlePanel_borderWidth = 3;
	this.titlePanel_border = this.titlePanel_borderWidth + "px ridge #4184D5;";
	this.infoPanel_width = 220;
	this.infoPanel_height = this.bgPanel_height - this.titlePanel_height - this.titlePanel_paddingTop - this.titlePanel_paddingBottom - this.titlePanel_borderWidth - 25;
	this.infoPanel_left = this.form_margin + this.form_padding + this.bgPanel_padding + this.bgPanel_borderWidth + 5;
	this.infoPanel_top = this.form_margin + this.form_padding + this.bgPanel_padding + this.bgPanel_borderWidth + +this.titlePanel_height + +this.titlePanel_borderWidth + this.titlePanel_paddingBottom + this.titlePanel_paddingTop + 5;
	//
	this.infoPane_margin = 0;
	this.infoPane_padding = 8;
	this.infoPane_borderWidth = 1;
	this.infoPane_border = this.infoPane_borderWidth + "px solid #4184D5;";
	this.infoPane_width = 220;
	this.infoPane_logo_size = 24;
	this.infoPane_logo_padding = 16;
	this.infoPane_logo_width = 30;
	this.infoPane_text_width = 127;
	this.infoPane_sub_fontsize = 12;

	//
	this.chartPanel_width = this.bgPanel_width - this.infoPanel_width - 15;
	this.chartPanel_height = this.infoPanel_height;
	this.chartPanel_left = this.infoPanel_width + 15;
	this.chartPanel_top = this.infoPanel_top;

	this.chartHeight = this.chartPanel_height / 2;
	this.infoText_paddingTop = 12;
	this.infoText_paddingBottom = 10;
	this.infoText_fontSize = 19;
	this.infoValue_fontSize = 16;
	this.chart_yAxis_fontSize = 14;
	this.chart_xAxis_fontSize = 12;
	this.chart_xAxis_logoSize = 12;
	this.chart_xAxis_logoMarginTop = 0;
	this.chart_xAxis_textMarginBottom = 2;

	this.chart_xAxis_inMargin =
	[ 15, 30, 10, 0 ];
	this.chart_xAxis_outMargin =
	[ 10, 30, 17, 0 ];
	this.chart_point_width = 11;
}
GeoInfo.prototype.getGeoInfo = function(w, h)
{
	var gi = new GeoInfo();
	gi.width = w;
	gi.height = h;
	gi.sizeRateW = w / this.width;
	gi.sizeRateH = h / this.height;
	gi.form_padding = parseInt(this.form_padding * gi.sizeRateW);
	gi.form_margin = parseInt(this.form_margin * gi.sizeRateW);
	gi.bgPanel_padding = parseInt(this.bgPanel_padding * gi.sizeRateW);
	gi.bgPanel_borderWidth = parseInt(this.bgPanel_borderWidth * gi.sizeRateW);
	gi.bgPanel_border = this.bgPanel_borderWidth + "px ridge #4184D5;";
	gi.bgPanel_width = parseInt(this.bgPanel_width * gi.sizeRateW);
	gi.bgPanel_height = parseInt(this.bgPanel_height * gi.sizeRateH);
	gi.titlePanel_height = parseInt(this.titlePanel_height * gi.sizeRateH);
	gi.titlePanel_paddingTop = parseInt(this.titlePanel_paddingTop * gi.sizeRateH);
	gi.titlePanel_paddingLeft = parseInt(this.titlePanel_paddingLeft * gi.sizeRateW);
	gi.titlePanel_paddingRight = parseInt(this.titlePanel_paddingRight * gi.sizeRateW);
	gi.titlePanel_paddingBottom = parseInt(this.titlePanel_paddingBottom * gi.sizeRateH);
	gi.titlePanel_fontsize = parseInt(this.titlePanel_fontsize * gi.sizeRateH);
	gi.titlePanel_borderWidth = parseInt(this.titlePanel_borderWidth * gi.sizeRateW);
	gi.titlePanel_border = this.titlePanel_borderWidth + "px ridge #4184D5;";
	gi.infoPanel_width = parseInt(this.infoPanel_width * gi.sizeRateW);
	gi.infoPanel_height = parseInt(this.infoPanel_height * gi.sizeRateH);
	gi.infoPanel_left = parseInt(this.infoPanel_left * gi.sizeRateW);
	gi.infoPanel_top = parseInt(this.infoPanel_top * gi.sizeRateW);
	gi.chartPanel_width = parseInt(this.chartPanel_width * gi.sizeRateW);
	gi.chartPanel_height = parseInt(this.chartPanel_height * gi.sizeRateH);
	gi.chartPanel_left = parseInt(this.chartPanel_left * gi.sizeRateW);
	gi.chartPanel_top = parseInt(this.chartPanel_top * gi.sizeRateH);
	gi.chartHeight = parseInt(this.chartHeight * gi.sizeRateH);
	gi.infoText_paddingTop = parseInt(this.infoText_paddingTop * gi.sizeRateH);
	gi.infoText_paddingBottom = parseInt(this.infoText_paddingBottom * gi.sizeRateH);
	gi.infoText_fontSize = parseInt(this.infoText_fontSize * gi.sizeRateH);
	gi.infoValue_fontSize = parseInt(this.infoValue_fontSize * gi.sizeRateH);

	gi.infoPane_margin = Math.ceil(this.infoPane_margin * gi.sizeRateW);
	gi.infoPane_padding = Math.ceil(this.infoPane_padding * gi.sizeRateH);
	gi.infoPane_borderWidth = parseInt(this.infoPane_borderWidth * gi.sizeRateW);
	gi.infoPane_border = this.infoPane_borderWidth + "px solid #4184D5;";
	gi.infoPane_width = parseInt(this.infoPane_width * gi.sizeRateW);
	gi.infoPane_logo_size = parseInt(this.infoPane_logo_size * gi.sizeRateW);
	gi.infoPane_logo_padding = parseInt(this.infoPane_logo_padding * gi.sizeRateH);
	gi.infoPane_logo_width = parseInt(this.infoPane_logo_width * gi.sizeRateW);
	gi.infoPane_text_width = parseInt(this.infoPane_text_width * gi.sizeRateW);
	gi.infoPane_sub_fontsize = parseInt(this.infoPane_sub_fontsize * gi.sizeRateH);

	if (gi.sizeRateW > 1)
	{
		gi.infoPane_margin = Math.ceil(gi.infoPane_margin * gi.sizeRateW);
	}

	gi.chart_yAxis_fontSize = parseInt(this.chart_yAxis_fontSize * gi.sizeRateH);

	gi.chart_xAxis_fontSize = parseInt(this.chart_xAxis_fontSize * gi.sizeRateH);
	gi.chart_xAxis_logoSize = parseInt(this.chart_xAxis_logoSize * gi.sizeRateW);
	gi.chart_xAxis_logoMarginTop = parseInt(this.chart_xAxis_logoMarginTop * gi.sizeRateH);
	gi.chart_xAxis_textMarginBottom = parseInt(this.chart_xAxis_textMarginBottom * gi.sizeRateH);
	gi.chart_point_width = parseInt(this.chart_point_width * gi.sizeRateW);
	gi.chart_xAxis_inMargin =
	[ parseInt(this.chart_xAxis_inMargin[0] * gi.sizeRateH), parseInt(this.chart_xAxis_inMargin[1] * gi.sizeRateW), parseInt(this.chart_xAxis_inMargin[2] * gi.sizeRateH), parseInt(this.chart_xAxis_inMargin[3] * gi.sizeRateW) ];
	gi.chart_xAxis_outMargin =
	[ parseInt(this.chart_xAxis_outMargin[0] * gi.sizeRateH), parseInt(this.chart_xAxis_outMargin[1] * gi.sizeRateW), parseInt(this.chart_xAxis_outMargin[2] * gi.sizeRateH), parseInt(this.chart_xAxis_outMargin[3] * gi.sizeRateW) ];
	return gi;
};
