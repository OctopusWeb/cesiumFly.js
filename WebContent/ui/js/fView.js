var view = null;
var dataPolling = null;
var timeThread = null;
var currentWidth = null;
var currentHeight = null;
var viewData = null;
var time = 0;
var currentIndex = 0;
var currentLife = 0;
var dataType = "regularFlightData";
var times = [];
var compare=null;
window.onload = function()
{

	view = new SViewUI();
	view.initialize();

	/*
	 * if (parent != window) { parent.changeView(); } else {
	 * changeView("regularFlightData", "year", "2013", "8", "null", "null"); }
	 */

	currentWidth = window.innerWidth;
	currentHeight = window.innerHeight;

	try
	{
		var p = decodeURI((location + "")).split("?")[1].split("=")[1];
		update(p);
	}
	catch (ex)
	{
		// alert(ex.message);
	}

	try
	{
		// window.external.CALLCPP("{'msg': 'view6 success','type':
		// 'control'}");
	}
	catch (e)
	{
		// changeView("regularRateData", "year", "2013", "8", "null", "null");
		alert("检测容器失败:" + e.message + "\n" + "显示默认视图");
	}

};

window.onresize = function()
{
	if (currentWidth != window.innerWidth)
	{
		currentWidth = window.innerWidth;
		currentHeight = window.innerHeight;

		view.onresize();
	}
};

function update(json)
{
	try
	{
		var jObj = Json.compileJson(json);

		// changeView("regularRateData", jObj.timeType, jObj.year, jObj.month,
		// jObj.apName, jObj.airline, jObj.title);

		setData(jObj);

		return "success";
	}
	catch (e)
	{
		// alert("update fail:" + e.message);
		return "error";
	}
}

function setData(data)
{

	viewData = data;
	currentIndex = 0;
	currentLife = 0;
    buildTimes();
	changeView();

}

function changeView()
{

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

	if (life != 0)
	{
		currentLife = viewData.life;
		startTimeThread();
	}
	else
	{
		endTimeThread();
	}

	doRequest(dataType, timeType, year, month, area, airport, title);

}

function showNext()
{

	if (currentIndex == viewData.views.length - 1)
	{
		currentIndex = 0;
	}
	else
	{
		currentIndex++;
	}

	changeView();

}

function startTimeThread()
{
	endTimeThread();

	timeThread = window.setInterval(function()
	{

		// alert(time);
		if (currentLife == 0)
		{
			endTimeThread();
		}
		else
		{
			time += 1000;
		}
		// alert(time+" "+currentLife);
		if (time >= currentLife)
		{

			showNext();
		}

	}, 1000);
}

function endTimeThread()
{
	window.clearInterval(timeThread);
	timeThread = null;
}

function buildTimes() {




    times = [];

    var compare = viewData.compare;

    var st = new Date();
    st.setMonth(st.getMonth() - 2);
    st.setDate(1);

  /*  if (compare) {
        st.setFullYear(viewData.year);
        st.setDate(1);
        st.setMonth(viewData.month - 1);

    }*/
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

function doRequest(dataType, timeType, year, month, area, airport, title)
{

	var now = new Date();
	now.setMonth(now.getMonth()-1);
	now.setDate(1);
	
	year = now.Format("yyyy");

	var st = year + "0101";
	var ed = year + "1201";
	// alert(timeType);
	if (timeType == "month")
	{
		var currMonth = new Date(now.getFullYear(), month - 1, 1);
		currMonth.setHours(23);
		currMonth.setMinutes(59);
		currMonth.setSeconds(59);
		//alert(currMonth.Format("yyyyMMdd hhmmss"));


		if (currMonth.getTime() >= now.getTime())
		{
			
			currMonth.setYear(currMonth.getFullYear()  - 1);
		}
		
		//alert(currMonth.Format("yyyyMMdd"));
		//alert(now.Format("yyyyMMdd"));

		st = currMonth.Format("yyyyMMdd");

		var nextMonth = new Date(now.getFullYear() , month, 1);

		if (nextMonth.getTime() > now.getTime())
		{
			nextMonth.setYear(nextMonth.getFullYear()  - 1);
		}

		nextMonth.setHours(nextMonth.getHours() - 3);
		ed = nextMonth.Format("yyyyMMdd");

		year = nextMonth.Format("yyyy");
	}
	else
	{
		var d = new Date();
		d.setMonth(d.getMonth()-2);

		d.setDate(1);
		ed = d.Format("yyyyMMdd");

		d.setMonth(d.getMonth() - 12);

		st = d.Format("yyyyMMdd");

	}

	// alert(st + "," + ed);

	var url = server + "/Gallery/rest/data/" + dataType + "/" + timeType + "/" + st + "/" + ed + "/" + area + "/" + airport + "/";

	httpPost(proxy, "url=" + url, function(json)
	{
		view.setView(dataType, timeType, year, month, area, airport, title);
		console.log(url);
		var jObj = Json.compileJson(json);
		console.log(json)
		view.setJsonData(jObj);
	});

}
