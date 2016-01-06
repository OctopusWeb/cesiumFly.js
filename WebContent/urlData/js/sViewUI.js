function SViewUI(month, dayCount) {
    // 可视区域对象
    this.form = null;
    this.bgPanel = null;
    this.titlePanel = null;
    this.monthPanel = null;
    this.infoLineUp = null;
    this.chartPanel = null;
    this.chart = null;
    this.month = month;
    this.data = null;
    // 位置参数
    this.basicGI = new GeoInfo();
    this.GI = this.basicGI;
    // 数据
    this.categories = new Array();
    this.initdata = new Array();

    // 类型
    this.dataType = null;
    this.timeType = null;
    this.year = null;
    this.month = null;
    this.area = null;
    this.airport = null;

};
SViewUI.prototype.initialize = function () {

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
    this.bgPanel.appendChild(this.titlePanel);

    // 月份栏
    this.monthPanel = document.createElement("div");
    this.monthPanel.id = "monthPanel";
    this.bgPanel.appendChild(this.monthPanel);

    // 上面线
    this.infoLineUp = document.createElement("div");
    this.infoLineUp.className = "line";
    this.infoLineUp.innerHTML = "&nbsp;";
    this.bgPanel.appendChild(this.infoLineUp);

    // 图表面板
    this.chartPanel = document.createElement("div");
    this.chartPanel.id = "chartPanel";
    this.bgPanel.appendChild(this.chartPanel);

};
SViewUI.prototype.addLegend = function (color, text, x, y) {
    var logoW = parseInt(10 * this.GI.sizeRateW);
    var logoH = parseInt(9 * this.GI.sizeRateH);
    var fontSize = parseInt(logoH * 0.8);
    var logoArc = parseInt(1 * this.GI.sizeRateH);
    var padding = parseInt(6 * this.GI.sizeRateW);
    this.outChart.renderer.rect(x, y, logoW, logoH, logoArc).attr({

        fill: color,
        zIndex: 3
    }).add();
    this.outChart.renderer.text(text, x + logoW + padding, y + fontSize).attr({
        rotation: 0
    }).css({
            color: '#ffffff',
            fontSize: fontSize + 'px',
            fontWeight: 'bold'
        }).add();
};
SViewUI.prototype.onresize = function () {
    this.chart.destroy();

    this.sized();
    this.bgPanel.style.display = "";

    this.bulidChart("chartPanel");

    this.setJsonData(this.data);

};

SViewUI.prototype.filterData = function (value) {
    if (value != null && value != undefined && !isNaN(value)) {
        var num = value * 1;

        if (this.isRate()) {
            if (num > 1) {
                num = ("0." + value.substring(value.indexOf(".") + 1, value.length)) * 100;

            }
            else {
                num = num * 100;
            }


            if (num == 0) {
                //num = 80;
            }

            // alert(num);

            return num;

        }
        else {
            return num;
        }
    }

    return 0;

};

SViewUI.prototype.redrawYAxis = function (jObj) {
    var max = 0;
    var min = 10000000;

    var dataList = null;
    var yoyList = jObj.yoyList;
    var lastList = jObj.lastList;

    if (this.isRate()) {
        dataList = jObj.rateList;
    }
    else {
        dataList = jObj.flightList;
    }

    if (this.isYear()) {


        for (var i = times.length - 2; i >= 0; i--) {
            var date = times[i];
            var yoyDate = new Date(date.getTime());
            var lastDate = new Date(date.getTime());


            yoyDate.setYear(yoyDate.getFullYear() - 1);
            lastDate.setMonth(lastDate.getMonth() - 1);

            var dText = date.Format("yyyyMM");
            var yText = yoyDate.Format("yyyyMM");
            var lText = lastDate.Format("yyyyMM");

            //console.log("yue="+dText);

            var dValue = this.filterData(dataList[dText]);
            var yValue = this.filterData(yoyList[yText]);
            var lValue = this.filterData(lastList[lText]);

            // console.log(dText + " " + yText + " " + lText + "/" + dValue + " " + yValue + " " + lValue);
            if (max < dValue) {
                max = dValue;
            }
            if (min > dValue) {
                min = dValue;
            }

            if (max < yValue) {
                max = yValue;
            }
            if (min > yValue) {
                min = yValue;
            }

            if (max < lValue) {
                max = lValue;
            }
            if (min > lValue) {
                min = lValue;
            }


            //  date.setMonth(date.getMonth() + 1);

        }
    }
    else {

        var date = new Date(this.year, this.month - 1, 1);

        for (var i = 0; i < 31; i++) {

            var yoyDate = new Date(date.getTime());
            var lastDate = new Date(date.getTime());

            yoyDate.setMonth(yoyDate.getMonth() - 1);
            lastDate.setDate(lastDate.getDate() - 1);

            var dText = date.Format("yyyyMMdd");
            var yText = yoyDate.Format("yyyyMMdd");
            var lText = lastDate.Format("yyyyMMdd");

            // alert(dText + " " + yText + " " + lText);

            var dValue = this.filterData(dataList[dText]);
            var yValue = this.filterData(yoyList[yText]);
            var lValue = this.filterData(lastList[lText]);

            //console.log(dText + " " + yText + " " + lText+"/"+dValue + " " + yValue + " " + lValue);

            if (max < dValue) {
                max = dValue;
            }
            if (min > dValue) {
                min = dValue;
            }

            if (max < yValue) {
                max = yValue;
            }
            if (min > yValue) {
                min = yValue;
            }

            if (max < lValue) {
                max = lValue;
            }
            if (min > lValue) {
                min = lValue;
            }

            date.setDate(date.getDate() + 1);

            if (date.getMonth() == this.month) {
                break;
            }

        }
    }

    var tickUnit = 10;
    var opt = this.chart.yAxis[0].options;

    if (this.isRate()) {
        tickUnit = 5;

    }

    var ad = getAxisData(min, max, 10, tickUnit);

    opt.max = ad.max;
    opt.min = ad.min;
    opt.tickInterval = ad.int;


    var m = ad.min - ad.int * 2;
    if (m >= 0) {
        opt.min = m;
    }


    //alert(min + " , " + max);
    //alert(ad.min + " , " + ad.max + "," + ad.int);

    this.chart.yAxis[0].setOptions(opt);

};

SViewUI.prototype.setJsonData = function (jObj) {

    if (jObj == null) {
        return;
    }

    var dataList = null;
    var yoyList = jObj.yoyList;
    var lastList = jObj.lastList;

    if (this.isRate()) {
        dataList = jObj.rateList;
    }
    else {
        dataList = jObj.flightList;
    }

    this.redrawYAxis(jObj);

    // alert(this.isRate());

    if (this.isYear()) {
        for (var i = times.length - 2; i >= 0; i--) {
            var date = times[i];
            var yoyDate = new Date(date.getTime());
            var lastDate = new Date(date.getTime());

            yoyDate.setYear(yoyDate.getFullYear() - 1);
            lastDate.setMonth(lastDate.getMonth() - 1);

            var dText = date.Format("yyyyMM");
            var yText = yoyDate.Format("yyyyMM");
            var lText = lastDate.Format("yyyyMM");

            // console.log(dText + " " + yText + " " + lText);

            // alert(dText + " " + yText + " " + lText);


            var dValue = this.filterData(dataList[dText]);
            var yValue = this.filterData(yoyList[yText]);
            var lValue = this.filterData(lastList[lText]);

            // console.log(dText + " " + yText + " " + lText + "/" + dValue + " " + yValue + " " + lValue);

            if (dValue == 0) {

                yValue = null;
                lValue = null;
            }

            var ind = (times.length - 2) - i;

            this.setData(0, ind, dValue);
            this.setData(1, ind, yValue);
            this.setData(2, ind, lValue);

            //date.setMonth(date.getMonth() + 1);

        }
    }
    else {

        var date = new Date(this.year, this.month - 1, 1);

        for (var i = 0; i < 31; i++) {

            var yoyDate = new Date(date.getTime());
            var lastDate = new Date(date.getTime());

            yoyDate.setMonth(yoyDate.getMonth() - 1);
            lastDate.setDate(lastDate.getDate() - 1);

            var dText = date.Format("yyyyMMdd");
            var yText = yoyDate.Format("yyyyMMdd");
            var lText = lastDate.Format("yyyyMMdd");

            // console.log(dText + " " + yText + " " + lText);

            var dValue = this.filterData(dataList[dText]);
            var yValue = this.filterData(yoyList[yText]);
            var lValue = this.filterData(lastList[lText]);

            // console.log(dValue + " " + yValue + " " + lValue);

            if (dValue == 0) {
                yValue = null;
                lValue = null;
            }


            this.setData(0, i, dValue);
            this.setData(1, i, yValue);
            this.setData(2, i, lValue);

            date.setDate(date.getDate() + 1);

            if (date.getMonth() == this.month) {
                break;
            }

        }
    }

    /*
     * for (var i = 0; i < dataList.length; i++) { alert(dataList[i]);
     * this.setData(0, i, dataList[i] * 1);
     *
     * if (i < yoyList.length) { this.setData(1, i, yoyList[i] * 1); }
     *
     * if (i < lastList.length) { this.setData(2, i, lastList[i] * 1); } }
     */
    this.chart.redraw();
    this.data = jObj;
};

SViewUI.prototype.sized = function () {
    //
    try {
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
        this.infoLineUp.style.margin = this.GI.infoLine_margin + "px";

        // this.chartPanel.style.border="3px solid red";

        if (this.monthPanel != null && !this.isYear()) {

            this.chartPanel.style.height = this.GI.chartPanel_height + "px";
            // this.chartPanel.style.backgroundColor="red";

            this.monthPanel.style.height = this.GI.monthPanel_height + "px";
            this.monthPanel.style.width = this.GI.monthPanel_width + "px";
            this.monthPanel.style.paddingLeft = this.GI.monthPanel_paddingLeft + "px";
            this.monthPanel.innerHTML = "";

            var aw = this.GI.monthPanel_width - 10;

            var w = parseInt(aw / 13);
            var sw = aw - w * 12;

            var table = document.createElement("table");
            table.cellSpacing = 0;
            table.cellPadding = 0;
            // table.style.cssText += "border-bottom:" +
            // this.GI.monthPanel_border;
            this.monthPanel.appendChild(table);
            var row = table.insertRow(0);
            for (var i = 0; i < 13; i++) {

                var cell = row.insertCell(i);
                cell.className = "monthText";
                cell.align = "center";
                cell.vAlign = "middle";
                cell.height = this.GI.monthPanel_height - this.GI.monthPanel_borderWidth * 5;

                cell.style.fontSize = this.GI.monthPanel_fontSize + "px";

                // alert(cell.style.fontSize );
                // cell.color = "yellow";
                // cell.bgColor = "red";

                if (i != 0) {
                    cell.width = w;

                    var d = new Date();
                    d.setDate(1);
                    d.setMonth(d.getMonth() - 12 + i - 2);

                    var year = d.getFullYear();
                    var month = d.getMonth() + 1;
                    // alert(year + " " + month)

                    // /text = year + "/" + month;

                    cell.innerHTML = year + "/" + month;

                    var radius = parseInt(w / 15);

                    if (month == this.month) {
                        cell.style.cssText += "border:" + this.GI.monthPanel_border + ";border-bottom:none;border-top-left-radius:" + radius +
                            "px;border-top-right-radius:" + radius + "px;";

                        cell.style.color = "orange";
                    }
                    else {
                        cell.style.cssText += "border-bottom:" + this.GI.monthPanel_border + "";
                    }
                }
                else {
                    cell.width = sw;
                    cell.style.cssText += "border-bottom:" + this.GI.monthPanel_border + "";
                    cell.innerHTML = "全年";
                }

            }
        }
        else if (this.isYear()) {

            this.chartPanel.style.height = (this.GI.chartPanel_height + this.GI.monthPanel_height) + "px";

            // alert(this.chartPanel.style.height + " " +
            // this.monthPanel.style.height);
        }

    }
    catch (e) {
        alert(e.message);
    }
};

SViewUI.prototype.setInfoValue = function (name, value, color) {
    var infoValue = document.getElementById(name);
    if (infoValue != null) {
        infoValue.innerHTML = value;
        if (color != null) {
            infoValue.style.color = color;
        }
    }
};
SViewUI.prototype.setTitle = function (title) {
    // this.titlePanel.innerHTML = title;
    // this.titlePanel.innerHTML = title;

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

    c1.align = "center";
    c2.align = "right";

    c0.innerHTML = title;

    // alert(title);

    c0.width = "33%";
    c1.width = "34%";
    c2.width = "33%";
    if (this.isRate()) {

        if (this.airport != null && this.airport.length == 3) {
            c1.innerHTML = "航空公司航班正常率统计";
        }
        else {
            c1.innerHTML = "机场放行正常率统计";
        }

    }
    else {
        if (this.airport != null && this.airport.length == 3) {
            c1.innerHTML = "航空公司飞行班次统计";
        }
        else {
            c1.innerHTML = "机场飞行架次统计";
        }

    }

    if (this.isYear()) {
        c2.innerHTML = "全年";
    }
    else {
        c2.innerHTML = "月度";
    }

};

SViewUI.prototype.isYear = function () {
    if (this.timeType == "year") {
        return true;
    }

    return false;
};

SViewUI.prototype.isRate = function () {
    if (this.dataType == "regularRateData") {
        return true;
    }

    return false;
};
SViewUI.prototype.bulidChart = function (container) {

    if (this.isRate()) {
        // this.GI.yGridLineWidth = this.basicGI. * this.GI.sizeRateW;
    }

    var rv = this;
    var co = new ChartObject();
    co.chart.renderTo = container;
    co.chart.backgroundColor = Highcharts.Color("#0B121C").setOpacity(0).get('rgba');
    co.chart.margin = this.GI.chart_xAxis_margin;

    var fontSize = parseInt(14 * this.GI.sizeRateH)
    co.legend.enabled = true;
    co.legend.backgroundColor = "white";
    co.legend.align = "left";
    co.legend.verticalAlign = "top";
    // co.legend.margin =100;
    co.legend.layout = "vertical";
    co.legend.float = true;
    co.legend.x = 90 * this.GI.sizeRateW;
    co.legend.y = 50 * this.GI.sizeRateH;
    co.chart.type = "spline";
    co.legend.itemStyle = {
        fontSize: fontSize + 'px'
    }
    // 时间轴
    var xAxis = co.createXAxis();
    if (this.isYear()) {
        xAxis.categories = this.categoriesY;
    }
    else {
        xAxis.categories = this.categories;
    }
    xAxis.opposite = true;
    xAxis.lineWidth = 0;
    xAxis.offset = this.GI.chart_xAxis_offset;
    xAxis.labels.formatter = function () {

        var text = 11 - this.value;

        if (rv.isYear()) {
            var d = times[text];

            text = d.Format("yyyy/M");

        }

        var html = "<span  style='font-weight:bold;font-size: " + rv.GI.chart_xAxis_fontSize + "px;color: #ffffff;font-family: times new roman'>" + text +
            "</span>";

        return html;
    };

    // 数据轴
    var yAxis = co.createYAxis();
    // yAxis.gridLineWidth = this.GI.yGridLineWidth;

    if (this.isRate()) {
        yAxis.max = 100;
        yAxis.min = 0;
        yAxis.tickInterval = 10;
    }
    else {
        // yAxis.max = 20000;
        // yAxis.min = 100;
        // yAxis.tickInterval = 1000;
    }
    yAxis.alternateGridColor = "#202932";
    yAxis.opposite = false;
    yAxis.labels.formatter = function () {

        var text = this.value;

        if (rv.isRate()) {
            text += "%";
        }
        else {
            if (text > 99999) {
                // alert(parseFloat(text*1.0 / 10000.0).toFixed(2));
                text = (text / 10000).toFixed(0) + "万";
            }
        }

        var html = "<span  style='font-weight:bold;font-size: " + rv.GI.chart_xAxis_fontSize + "px;color: #ffffff;font-family: times new roman'>" + text +
            "</span>";

        return html;
    };

    // 设置marker大小
    /*
     * var imgSrc1 = "imgs/fd1.png"; Highcharts.setSymbolSizes(imgSrc1,
     * this.GI.yGridLineWidth, this.GI.yGridLineWidth); var imgSrc2 =
     * "imgs/fd2.png"; Highcharts.setSymbolSizes(imgSrc2,
     * this.GI.yGridLineWidth, this.GI.yGridLineWidth); var imgSrc3 =
     * "imgs/fd3.png"; Highcharts.setSymbolSizes(imgSrc3,
     * this.GI.yGridLineWidth, this.GI.yGridLineWidth); var imgSrc4 =
     * "imgs/fd4.png"; Highcharts.setSymbolSizes(imgSrc4,
     * this.GI.yGridLineWidth, this.GI.yGridLineWidth);
     */

    // 数据集
    var SP = co.createSeries();
    SP.type = "column";
    SP.name = "当前数据";
    SP.data = this.initdata;
    SP.pointPadding = 0.15;
    SP.color = {
        linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
        },
        stops: [
            [ 0, '#96FF42' ],
            [ 1, '#00852F' ]
        ]
    };

    // SP.color="blue";

    var SP2 = co.createSeries();
    SP2.name = "同比数据";
    SP2.data = this.initdata;
    SP2.color = "red";

    var SP3 = co.createSeries();
    SP3.name = "环比数据";
    SP3.data = this.initdata;
    SP3.color = "green";

    if (this.isYear()) {
        SP.pointPadding = 0.20;

    }
    if (this.isRate()) {

        SP.color = {
            linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
            },
            stops: [
                [ 0, '#65FFFD' ],
                [ 1, '#0096FF' ]
            ]
        };

        // SP.color = Highcharts.Color(SP.color).setOpacity(0.20).get('rgba');

        SP2.color = "#96FF42";
        SP3.color = "#FF4200";
        SP3.marker.symbol = "triangle";

        // 65FFFD

        // SP.marker.symbol = "url(" + imgSrc4 + ")";
        // SP.color = Highcharts.Color("#FF0000").setOpacity(0.23).get('rgba');

        // SP2.marker.symbol = "url(" + imgSrc3 + ")";
        // SP2.color = Highcharts.Color("#00DEFF").setOpacity(1).get('rgba');

        // SP3.marker.symbol = "url(" + imgSrc4 + ")";
        // SP3.color = Highcharts.Color("#FFFF10").setOpacity(1).get('rgba');
    }
    else {
        SP2.color = "#00DEFF";
        SP3.color = "#FF4200";
        SP3.marker.symbol = "triangle";
        // SP.marker.symbol = "url(" + imgSrc1 + ")";
        // SP.color = Highcharts.Color("#FF00FF").setOpacity(0.23).get('rgba');

        // SP2.marker.symbol = "url(" + imgSrc1 + ")";
        // SP2.color = Highcharts.Color("#FFFF00").setOpacity(0.23).get('rgba');

        // SP3.marker.symbol = "url(" + imgSrc2 + ")";
        // SP3.color = Highcharts.Color("#00FFFF").setOpacity(0.23).get('rgba');

    }

    this.chart = new Highcharts.Chart(co);

		
	this.setCompare(compare);
    


};
SViewUI.prototype.setCompare=function(compare)
{
	if (compare == "11") {
		this.chart.series[1].show();
        this.chart.series[2].show();
    }
    else if (compare == "01") {
        this.chart.series[1].hide();
		this.chart.series[2].show();
    }
    else if (compare == "10") {
		this.chart.series[1].show();
        this.chart.series[2].hide();
    }
    else if (compare == "00") {
        this.chart.series[1].hide();
        this.chart.series[2].hide();
    }
};
SViewUI.prototype.setData = function (index, category, data) {

    this.chart.series[index].data[category].update(data, false);

};

SViewUI.prototype.setMax = function (max) {
    this.max = max;
}

SViewUI.prototype.setView = function (dataType, timeType, year, month, area, airport, title) {




    // 记录值
    this.dataType = dataType;
    this.timeType = timeType;
    this.year = year;
    this.month = month;
    this.area = area;
    this.airport = airport;

    // 算横轴
    var xCount = 12;

    if (!this.isYear()) {
        var nextMonth = new Date(year, month, 1);
        nextMonth.setHours(nextMonth.getHours() - 3);
        xCount = nextMonth.getDate();
    }

    this.categories.splice(0, this.categories.length);
    this.initdata.splice(0, this.initdata.length);

    for (var i = 0; i < xCount; i++) {
        this.categories.push(i);
        this.initdata.push(0);

    }

    // 界面调整

    if (this.isYear()) {
        if (this.monthPanel != null) {
            this.monthPanel.style.display = "none";
        }

    }
    else {
        if (this.monthPanel != null) {
            this.monthPanel.style.display = "";
        }
        else {

        }
    }

    // 设置标题

    if (title == null || title == undefined || title == "null") {
        title = "";
    }

    this.setTitle(title);

    // 调整大小
    this.sized();

    if (this.chart != null) {
        this.chart.destroy();
    }

    // alert(this.chartPanel.style.height + " " + this.monthPanel.style.height);

    this.bulidChart("chartPanel");

    // alert(this.chartPanel.style.height + " " + this.monthPanel.style.height);

};

SViewUI.prototype.reset = function () {

};
function GeoInfo() {
    this.width = 960;
    this.height = 540;
    this.sizeRateW = 1;
    this.sizeRateH = 1;
    this.form_padding = 0;
    this.form_margin = 0;
    this.bgPanel_padding = 0;
    this.bgPanel_borderWidth = 3;
    this.bgPanel_border = this.bgPanel_borderWidth + "px ridge #4184D5;";
    this.bgPanel_width = this.width - this.form_margin * 2 - this.form_padding * 2 - this.bgPanel_padding * 2 - this.bgPanel_borderWidth * 2;
    this.bgPanel_height = this.height - this.form_margin * 2 - this.form_padding * 2 - this.bgPanel_padding * 2 - this.bgPanel_borderWidth * 2;
    this.titlePanel_height = 45;
    this.titlePanel_paddingTop = 10;
    this.titlePanel_paddingLeft = 35;
    this.titlePanel_paddingRight = 35;
    this.titlePanel_paddingBottom = 0;
    this.titlePanel_fontsize = 26;
    this.titlePanel_borderWidth = 3;
    this.titlePanel_border = this.titlePanel_borderWidth + "px ridge #4184D5;";
    this.monthPanel_paddingLeft = 30;
    this.monthPanel_width = this.bgPanel_width - this.monthPanel_paddingLeft;
    this.monthPanel_height = 30;
    this.monthPanel_borderWidth = 1;
    this.monthPanel_border = this.monthPanel_borderWidth + "px solid #4184D5;";
    this.monthPanel_fontSize = 14;
    this.infoLine_margin = 5;
    this.infoLine_width = this.bgPanel_width - this.infoLine_margin * 2;
    this.chartPanel_width = this.infoLine_width;
    this.chartPanel_height = this.bgPanel_height - this.titlePanel_height - this.titlePanel_paddingTop - this.titlePanel_paddingBottom -
        this.titlePanel_borderWidth - this.infoLine_margin * 3 - this.monthPanel_height;
    this.chartPanel_left = 0;
    this.chartPanel_top = 0;

    this.chart_xAxis_fontSize = 17;

    this.chart_xAxis_margin =
        [ 35, 10, 10, 50 ];
    this.chart_xAxis_offset = 10;

    this.yGridLineWidth = 16;

}

GeoInfo.prototype.getGeoInfo = function (w, h) {
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

    gi.chartPanel_height = parseInt(this.chartPanel_height * gi.sizeRateH);

    gi.infoLine_margin = parseInt(this.infoLine_margin * gi.sizeRateW);
    gi.chart_xAxis_offset = parseInt(this.chart_xAxis_offset * gi.sizeRateH);

    gi.chart_xAxis_fontSize = parseInt(this.chart_xAxis_fontSize * gi.sizeRateH);
    gi.chart_xAxis_fontSize = parseInt(this.chart_xAxis_fontSize * gi.sizeRateH);

    gi.chart_xAxis_margin =
        [ parseInt(this.chart_xAxis_margin[0] * gi.sizeRateH), parseInt(this.chart_xAxis_margin[1] * gi.sizeRateW), parseInt(this.chart_xAxis_margin[2] *
            gi.sizeRateH), parseInt(this.chart_xAxis_margin[3] * gi.sizeRateW) ];
    gi.yGridLineWidth = parseInt(this.yGridLineWidth * gi.sizeRateH);

    gi.monthPanel_width = parseInt(this.monthPanel_width * gi.sizeRateW);
    gi.monthPanel_paddingLeft = parseInt(this.monthPanel_paddingLeft * gi.sizeRateW);
    gi.monthPanel_height = parseInt(this.monthPanel_height * gi.sizeRateH);
    gi.monthPanel_fontSize = parseInt(this.monthPanel_fontSize * gi.sizeRateH);

    return gi;
};
