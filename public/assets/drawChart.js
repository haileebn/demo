const RED = [
    'rgba(255,0,0,1)',
    'rgba(255,0,0,1)',
    'rgba(255,0,0,1)',
    'rgba(255,0,0,1)',
    'rgba(255,0,0,1)',
    'rgba(255,0,0,1)'
];
const BLUE = [
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 255, 1)'
]
const point = 'rgb(28,159,231)';
const pointHover = 'rgb(31,97,158)';

function drawChart(type, timeLabel, name) {
    var modal = $('#myChart');
    var canvas = modal.find('.bodyChart #' + name);
    if (name === "pm25") canvas.attr('width', '600').attr('height', '200');
    else canvas.attr('width', '300').attr('height', '200');
    var ctx = canvas[0].getContext("2d");
    var gradient = ctx.createLinearGradient(0, 200, 0, 0);
    var arraycolor = [];
    let color = RED;
    let Ticks = "";
    let labelString = "";
     switch (name) {
        case "pm25":
            Ticks = {
                beginAtZero: true,
                stepSize: 20
            };
            labelString = name + " (μg/m\u00B3)";
            type.forEach((key, index) => {
            if (key <= 50) arraycolor.push('#00A065'); // lv1
            else if (key <= 100) arraycolor.push('#FFE200'); // lv2
            else if (key <= 150) arraycolor.push('#FF9400'); // lv3
            else if (key <= 200) arraycolor.push('#E10016'); // lv4
            else if (key <= 300) arraycolor.push('#74009F'); // lv5
            else arraycolor.push('#8B0017'); // lv6
            });
            break;
        case "temp":
            Ticks = {
                beginAtZero: true,
                max: 60,
                stepSize: 10
            };
            labelString = "Temperature" + " (\u00B0C)";
            gradient.addColorStop(0, "rgba(255,255,100,0.5)");
            gradient.addColorStop(1, "rgba(255,0,0,1)");
            type.forEach((key, index) => {
                arraycolor.push(gradient);
            });
            break;
        case "hud":
            Ticks = {
                beginAtZero: true,
                max: 100,
                stepSize: 20
            };
            labelString = "Humidity" + " (\u0025)";
            gradient.addColorStop(0, "rgba(0,82,137,0.5)");
            gradient.addColorStop(1, "rgba(0,188,241,0.5)");
            type.forEach((key, index) => {
                arraycolor.push(gradient);
            });
            break;
    }
    var customTooltips = function(tooltip) {
        $(this._chart.canvas).css("cursor", "pointer");

        var positionY = this._chart.canvas.offsetTop;
        var positionX = this._chart.canvas.offsetLeft;

        $(".chartjs-tooltip").css({
            opacity: 0,
        });
        if (!tooltip || !tooltip.opacity) {
            return;
        }
        if (tooltip.dataPoints.length > 0) {
            tooltip.dataPoints.forEach(function(dataPoint) {
                let formatTime = dataPoint.xLabel;
                var content =   formatTime + "<br>"+
                                labelString + ": " + Number(dataPoint.yLabel).toFixed(2);
                var $tooltip = $("#tooltip-" + dataPoint.datasetIndex);

                $tooltip.html(content);
                $tooltip.css({
                    opacity: 1,
                    top: positionY + dataPoint.y + 10 + "px",
                    left: positionX + dataPoint.x + 10 + "px",
                });
            });
        }
    };
   
    // console.log(timeLabel);
    let hour = [];
    timeLabel.forEach((key, index) => {
        hour.push(key.getHours());
    });
    // console.log(hour);
    let chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: hour,
            datasets: [{
                // label: labelString,
                data: type,
                // showLine: false,
                // borderWidth: 1,
                // fillColor: gradient,
                backgroundColor: arraycolor,
                pointBackgroundColor: point,
                borderColor: pointHover,
                pointHoverBackgroundColor: pointHover,
                pointHoverBorderColor: RED,
                borderWidth: 0.3,
            }]
        },
        options: {
            tooltips: {
                    enabled: false,
                    mode: 'index',
                    intersect: true,
                    custom: customTooltips
                },
                // legend: {
                //     labels: {
                //         // usePointStyle: false,
                //         display: false
                //     }
                // },
            showTooltips: false,
            animation: {
                duration: 1500, // general animation time
            },
             title:{
                display:true,
                text: labelString
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    // gridLines: {
                    //     display: true
                    // },
                    // ticks: Ticks,
                     stacked: true
                }],
                xAxes: [{
                    // type: 'number',
                    // scaleLabel: {
                    //     display: true,
                    //     labelString: 'Time'
                    // },
                    // // gridLines: {
                    //     display: true,

                    // },
                     stacked: true
                }]

            },
            responsive: false,
        }
    });
    // chartName = chart;
    if (name == "pm25") chartPM25 = chart;
    else if (name == "temp") chartTemp = chart;
    else if (name == "hud") chartHud = chart;
}

function updateChart(type, timeLabel, name) {
    let hour = [];

    timeLabel.forEach((key, index) => {
        hour.push(key.getHours());
    });
    switch (name) {
        case "pm25":
            chartPM25.data.datasets[0].data = type;
            chartPM25.data.labels = hour;
            chartPM25.update();
        case "temp":
            chartTemp.data.datasets[0].data = type;
            chartTemp.data.labels = hour;
            chartTemp.update();
        case "hud":
            chartHud.data.datasets[0].data = type;
            chartHud.data.labels = hour;
            chartHud.update();
    }
}
function infoLatLng(lat, lng) {
    // body...
    let strLat = "";
    let strLng = "";

    if (lat < 90 && lat > 0) {
        strLat += lat + "&degN";
    } else strLat = +lat + "&degS";

    if (lng < 180 && lng > 0) {
        strLng += lng + "&degE";
    } else strLng = +lng + "&degW";
    return strLat + " / " + strLng;
}