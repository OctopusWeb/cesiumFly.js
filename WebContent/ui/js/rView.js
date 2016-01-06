var view = null;
var dataPolling = null;
var timeThread = null;
var currentWidth = null;
var currentHeight = null;
var viewData = null;
var time = 0;
var currentIndex = 0;
var currentLife = 0;
var date_view = "";

window.onload = function()
{
	
	view = new RViewUI();
	view.initialize();
	
	
	
	currentWidth = window.innerWidth;
	currentHeight = window.innerHeight;

	// alert(window.navigator.userAgent);
	try
	{
		var p = decodeURI((location + "")).split("?")[1].split("=")[1];
		
		update(p);
	}
	catch (ex)
	{
		console.log(ex.message);
	}

	try
	{
		// window.external.CALLCPP("{'msg': 'view1 success','type':
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

		date_view = jObj.date;
		if (date_view == null || date_view == undefined || date_view == "" || date_view == "0")
		{
			var d = new Date();
			date_view = d.Format("yyyyMMdd");
		}

		setData(jObj);

		return "success";

		// changeView(jObj.name, jObj.date, jObj.area);
	}
	catch (e)
	{
		alert("update fail:" + e.message);

		return "error";
	}
}
var num=parseInt(Math.random()*10);
var firstCity=["ZSPD","ZBAA","ZSAM","ZYHB","ZGGG","ZGSZ","ZUCK","ZBTJ","ZSSS","ZUUU","ZBAA"]
startDataPolling(firstCity[num], "null");
function ExternalCall(json)
{	
	var city=eval('(' + json + ')').city;
	startDataPolling(city, "null");
}

function setData(data)
{

	viewData = data;
	currentIndex = 0;
	currentLife = 0;

	changeView();

}

function changeView()
{

	endTimeThread();
	endDataPolling();

	time = 0;

	var data = viewData.views[currentIndex];
	var life = parseInt(viewData.life);
	var interval = viewData.interval;

	if (interval == null || interval == undefined || interval == "" || interval == "0")
	{
		interval = 40000;
	}

	// alert(date + "," + interval);

	if (life != 0)
	{
		currentLife = viewData.life;
		startTimeThread();
	}
	else
	{
		endTimeThread();
	}

//	startDataPolling(data.title, data.apName, interval);

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

function startDataPolling(title, area, interval)
{
	doRequest(title, area);

//	dataPolling = window.setInterval(function()
//	{
//
//		doRequest(title, area);
//
//	}, interval);
}

function endDataPolling()
{
	window.clearInterval(dataPolling);
	dataPolling = null;
}

function doRequest(title, area)
{
	
	var date = date_view;

	var now = new Date();
	var now_date = now.Format("yyyyMMdd");

	if (now_date != date)
	{
		var hour = now.getHours();
		if (hour < 1)
		{
			date = now_date;
			date_view = now_date;
		}
	}
	var day=parseInt(now_date.substring(6, 8))-1;
	var d = now_date.substring(0, 4) + "年" + now_date.substring(4, 6) + "月" + day + "日";

	var jsonurl="../urlData/"+title+".txt";
	$.getJSON("../urlData/all.txt",function(data)
	{
		for(var i=0;i<207;i++){
			if(data[i].apName==title){
				var t=data[i].airportName;
			}
		}
		view.setTitle(t, d, area);
	});
	$.getJSON(jsonurl,function(data)
	{
		view.setDate(date);
		view.reset();
		var json=JSON.stringify(data)
		var jObj = Json.compileJson(json);
		view.setJsonData(jObj);
	});
}