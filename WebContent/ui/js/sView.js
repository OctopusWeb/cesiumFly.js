var view = null;
var dataPolling = null;
var timeThread = null;
var currentWidth = null;
var currentHeight = null;
var viewData = null;
var time = 0;
var currentIndex = 0;
var currentLife = 0;
var dataType = "regularRateData";
var first = true;
var times = [];
var init=true;
var compare=null;

window.onload = function () {

    view = new SViewUI();
    view.initialize();

    currentWidth = window.innerWidth;
    currentHeight = window.innerHeight;

    try {
        var p = decodeURI((location + "")).split("?")[1].split("=")[1];
        update(p);
    }
    catch (ex) {
        // alert(ex.message);
    }

    try {
        // window.external.CALLCPP("{'msg': 'view6 success','type':
        // 'control'}");
    }
    catch (e) {
        // changeView("regularRateData", "year", "2013", "8", "null", "null");
        alert("检测容器失败:" + e.message + "\n" + "显示默认视图");
    }

};

window.onresize = function () {
    if (currentWidth != window.innerWidth) {
        currentWidth = window.innerWidth;
        currentHeight = window.innerHeight;

        view.onresize();
    }
};

function update(json) {
    try {
        var jObj = Json.compileJson(json);

		compare = jObj.compare;

		if(compare)
		{
			view.setCompare(compare);
			return "success";
		}


        // changeView("regularRateData", jObj.timeType, jObj.year, jObj.month,
        // jObj.apName, jObj.airline, jObj.title);

        setData(jObj);

        return "success";
    }
    catch (e) {
        // alert("update fail:" + e.message);
        return "error";
    }
}

function setData(data) {


    viewData = data;
    currentIndex = 0;
    currentLife = 0;
    buildTimes();
    changeView();

}

function changeView() {

    endTimeThread();

    time = 0;

    var data = viewData.views[currentIndex];
    var life = parseInt(viewData.life);
    var timeType = viewData.timeType;
    var year = viewData.year;
    var month = viewData.month;
    var area = data.apName;
    var airport = data.airline
    var title = data.title;


    if (area != null && area.length == 3) {
        airport = area;
        area = null;
    }

    if (life != 0) {
        currentLife = viewData.life;
        startTimeThread();
    }
    else {
        endTimeThread();
    }

    doRequest(dataType, timeType, year, month, area, airport, title);

}

function showNext() {

    if (currentIndex == viewData.views.length - 1) {
        currentIndex = 0;
    }
    else {
        currentIndex++;
    }

    changeView();

}

function startTimeThread() {
    endTimeThread();

    timeThread = window.setInterval(function () {

        // alert(time);
        if (currentLife == 0) {
            endTimeThread();
        }
        else {
            time += 1000;
        }
        // alert(time+" "+currentLife);
        if (time >= currentLife) {

            showNext();
        }

    }, 1000);
}

function endTimeThread() {
    window.clearInterval(timeThread);
    timeThread = null;
}

function buildTimes() {


    if (isNaN(viewData.year) || isNaN(viewData.month)) {
        return;
    }

	if(viewData.month==0 || viewData.year==0)
	{
		return;
	}


    times = [];



    var st = new Date();
    st.setMonth(st.getMonth() - 2);
    st.setDate(1);

    if (!init) {
        st.setFullYear(viewData.year);
        st.setDate(1);
        st.setMonth(viewData.month - 1);
	
    }
	else
	{
		init=false;
	}
    times.push(st);

    for (var i = 1; i <= 12; i++) {
        var dt = new Date();
        dt.setFullYear(st.getFullYear());
        dt.setDate(st.getDate());
        dt.setMonth(st.getMonth() - i);

        times.push(dt);
    }

    /* for (var i = 0; i < times.length; i++) {
     var dt = times[i];
     console.log(i + ":" + dt.Format("yyyyMMdd"));
     }*/


}

function doRequest(dataType, timeType, year, month, area, airport, title) {


    var now = new Date();
    year = now.Format("yyyy");

    var st = year + "0101";
    var ed = year + "1201";
    timeType = "year";


    var d = new Date();
    d.setMonth(d.getMonth() - 2);
    ed = d.Format("yyyyMMdd");

    d.setMonth(d.getMonth() - 12);

    st = d.Format("yyyyMMdd");

    // }

    var ed = times[0].Format("yyyyMMdd");
    var st = times[times.length - 1].Format("yyyyMMdd");
    timeType = "year";


    console.log(st + "," + ed);

    var url = server + "/Gallery/rest/data/" + dataType + "/" + st + "/" + ed + "/" + area + "/" + airport + "/";

    $.getJSON("urlData/data1.txt",function(data){

        var jObj = Json.compileJson(data);


        view.setJsonData(jObj);
    };

}
