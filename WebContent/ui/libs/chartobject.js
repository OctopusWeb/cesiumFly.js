function ChartObject() {
    this.chart = new function () {
        this.renderTo = null;
        this.type = null;
        this.backgroundColor = "#ffffff";
        this.borderWidth = 0;
        this.borderRadius = 0;
        this.animation = true;
        this.margin = [20, 20, 20, 20];
    };
    this.title = new function () {
        this.text = null;
    };
    this.tooltip = new function () {
        this.enabled = false;
    };
    this.xAxis = new Array();
    this.yAxis = new Array();
    this.series = new Array();
    this.legend = new function () {
        this.enabled = true;
    };
    this.plotOptions = new function () {
        this.column = new function () {
            this.grouping = false;
            this.shadow = false;
            this.animation=false;
        };
        this.series = new function () {
            this.pointWidth = null;
            //this.pointPadding = 0.25;
        };
       
    };
    this.createSeries = function () {
        var s = new function () {
            this.name = null;
            this.data = null;
            this.pointPadding = null;
            this.color = null;
            this.marker = new function () {
                this.symbol = "circle";
                this.fillColor = '#FFFFFF';
                this.lineWidth = 2;
                this.lineColor = null;
                this.radius = 4;
                this.width = 40;
            };
        };
        this.series.push(s);
        return s;
    };
    this.createXAxis = function () {
        var axis = new function () {
            this.categories = null;
            this.opposite = false;
            this.reversed = false;
            this.labels = null;
            this.offset = 0;
            this.tickWidth = 0;
            this.lineWidth = 1;
            this.tickInterval = 1;

            this.labels = new function () {
                this.useHTML = true;
                this.formatter = null;
            };
        };
        this.xAxis.push(axis);
        return axis;
    };
    this.createYAxis = function () {
        var axis = new function () {
            this.max = null;
            this.min = null;
            this.gridLineColor = "#202932";
            this.gridLineWidth = 1;
            this.opposite = false;
            this.reversed = false;
            this.labels = null;
            this.tickInterval = null;
           
            this.alternateGridColor = null;
            this.plotBands = null;
            this.title = new function () {
                this.text = null;
            };
            this.labels = new function () {
                this.useHTML = true;
                this.formatter = null;
            };
        };
        this.yAxis.push(axis);
        return axis;
    };
}
