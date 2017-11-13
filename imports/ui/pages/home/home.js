import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';

import './home.html';

import '../../components/map/map.js';
import '../../components/navbar/navbar.js';
import '../../components/detailKit/detailKit.js';

const url = "http://118.70.72.15:2222";
let timeInterval = null;
let myChart = null;
Template.App_home.events({
    'submit .info-link-add'(event) {
        event.preventDefault();
        const target = event.target;
        const title = target.title;
        const url = target.url;

        Meteor.call('links.insert', title.value, url.value, (error) => {
            if (error) {
                alert(error.error);
            } else {
                title.value = '';
                url.value = '';
            }
        });
    },
    'click #close-detail-kit'(e){
        e.preventDefault();
        const tab = $("#detailKit-wrapper");
        const iconMarker = $('.leaflet-div-icon > img');

        iconMarker.each((index, key) => {
            $(key).attr('src', '/img/marker-icon.png');
        });

        if(timeInterval) {
            console.log("click makesadsadsar");
            clearTimeout(timeInterval);
        }
        tab.toggleClass("active");

    },
    'click #day'(){
        const elDay = $("#day");
        const elWeek = $("#week");
        elWeek.toggleClass("active", false);
        elDay.toggleClass("active", true);
        getAnalysisOfKitInDay(Session.get("kitId"));

    },
    'click #week'(){
        const elDay = $("#day");
        const elWeek = $("#week");
        elWeek.toggleClass("active", true);
        elDay.toggleClass("active", false);
        getAnalysisOfKitInWeek(Session.get("kitId"));
    },
});
Template.App_home.onRendered(() => {
    const accessTokenMap = 'pk.eyJ1IjoiaGFpbGVlYm4iLCJhIjoiY2o4eHl5NHY2MjNzczJ6bXJodzVrbDY2OCJ9.Gr7kFFa3FAZarwChakmDnA';
    let mymap = initMap(accessTokenMap, [21.038189,105.7827482]);
    // ham tracker cho phep truy van den Database
    Tracker.autorun(() => {
        const allKit = getAllKit().data;
        let myFeatureGroup = L.featureGroup().addTo(mymap);//.on("click", groupClick);
        let marker;

        allKit.forEach((kit, index) => {
            // console.log(kit.KitID, "---",index);
            // console.log(L.AwesomeMarkers.icon);
            L.NumberedDivIcon = L.Icon.extend({
                options: {
                    iconUrl: '/img/marker-icon.png',
                    number: '',
                    shadowUrl: null,
                    iconSize: new L.Point(25, 41),
                    iconAnchor: new L.Point(13, 41),
                    popupAnchor: new L.Point(0, -33),
                    /*
                    iconAnchor: (Point)
                    popupAnchor: (Point)
                    */
                    className: 'leaflet-div-icon'
                },

                createIcon: function () {
                    let div = document.createElement('div');
                    let img = this._createImg(this.options['iconUrl']);
                    let numdiv = document.createElement('div');
                    numdiv.setAttribute ( "class", "number" );
                    numdiv.innerHTML = this.options['number'] || '';
                    div.appendChild ( img );
                    div.appendChild ( numdiv );
                    this._setIconStyles(div, 'icon');
                    return div;
                },

//you could change this to add a shadow like in the normal marker if you really wanted
                createShadow: function () {
                    return null;
                }
            });

            // let markerIcon = L.icon({
            //     iconUrl: '/img/marker-icon.png',
            //     // title: "sdsadsadsa",
            //     // number: "1",
            //     iconSize:     [35, 35], // size of the icon
            //     shadowSize:   [50, 64], // size of the shadow
            //     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            //     shadowAnchor: [4, 62],  // the same for the shadow
            //     // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            // });
            // console.log();
            marker = L.marker(kit.Location, { icon: new L.NumberedDivIcon({number: kit["PM2.5"]})}).addTo(myFeatureGroup);
            let valueMarker = $('.number')[index];

            $(valueMarker).attr("data-number", kit["PM2.5"]);

            // if (kit["PM2.5"] > 200) {
            $(valueMarker).css('color', getColorPMByLevel(kit["PM2.5"]));
            // } else {
            //     $(valueMarker).css('color', 'red');
            // }
            marker.on("click", L.bind(onClickMarker, null, kit, index));

            marker.bindPopup(`<b>${kit.Name}</b><br>${kit.KitID}`, { closeButton: false });
            marker.on('mouseover', mouseOverMarker);
            marker.on('mouseout', mouseOutMarker);
        });
        mymap.on('click', onMapClick);
    });
});
function initMap(accessToken, latLng) {
    const mymap = L.map('mapid',{
        zoomControl: false,
    }).setView(latLng, 14);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: accessToken
    }).addTo(mymap);

    L.control.zoom({
        position:'bottomleft'
    }).addTo(mymap);
    return mymap;
}

function onMapClick() {
    const detailWrapper = $("#detailKit-wrapper");
    const elDay = $("#day");
    const elWeek = $("#week");
    const iconMarker = $('.leaflet-div-icon > img');

    elDay.toggleClass("active", true);
    elWeek.toggleClass("active", false);

    iconMarker.each((index, key) => {
       $(key).attr('src', '/img/marker-icon.png');
    });

    if(detailWrapper.hasClass("active")){
        if(timeInterval){
            clearTimeout(timeInterval);
            console.log("clearrrr");
        }
        console.log("endddd");
        detailWrapper.toggleClass("active", false);
    }
}

function onClickMarker(kit, index) {
    const tab = $("#detailKit-wrapper");
    const elDay = $("#day");
    const elWeek = $("#week");
    const iconMarker = $('.leaflet-div-icon > img');
    elDay.toggleClass("active", true);
    elWeek.toggleClass("active", false);

    iconMarker.each((i, key) => {
        $(key).attr('src', '/img/marker-icon.png');
    });

    $(iconMarker[index]).attr('src', '/img/marker-icon-active.png');
    // console.log(this.L.Marker.icon);
    if(timeInterval) {
        // console.log("click maker");
        clearTimeout(timeInterval);
        tab.toggleClass("active", false);
    }
    setTimeout(() => {
        tab.toggleClass("active", true);
    }, 200);
    $("#nameKit").find("strong").html(kit.Name);
    getLastDataOfKit(kit.KitID);
    getAnalysisOfKitInDay(kit.KitID);
    Session.set("kitId", kit.KitID);
}

function mouseOverMarker() {
    this.openPopup();
    // $($('.leaflet-div-icon > img')[index]).attr('src', '/img/marker-icon-active.png');
}

function mouseOutMarker() {
    this.closePopup();
    // $('.leaflet-div-icon > img').attr('src', '/img/marker-icon.png');
}

function getAllKit() {
    return $.parseJSON($.ajax({
        type: "GET",
        url: `${url}/kit/all`,
        async: false,
    }).responseText);
}
function drawC(ctx, color, lineWidth, radius, percent, divValue) {
    percent = Math.min(Math.max(0, percent || 1), 1);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
    ctx.strokeStyle = color;
    ctx.lineCap = 'round'; // butt, round or square
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    divValue.css("color", color);
    // console.log(color);

}
function drawCircle(id, ana = "") {
    let el = document.getElementById(id); // get canvas

    let options = {
        percent:  el.getAttribute('data-percent') || 25,
        size: el.getAttribute('data-size') || 120,
        lineWidth: el.getAttribute('data-line') || 12,
        rotate: el.getAttribute('data-rotate') || 0
    };
    let canvas = $(`#${id}`).find(`canvas`)[0];
    let divValue = $(`#valuePM25${ana}`);
    let divUnit = $(`#unitPM25${ana}`);
    divValue.html(options.percent);
    divUnit.html('&micro;g/m&sup3;');

    if (typeof(G_vmlCanvasManager) !== 'undefined') {
        G_vmlCanvasManager.initElement(canvas);
    }

    let ctx = canvas.getContext('2d');
    canvas.width = canvas.height = options.size;

    ctx.translate(options.size / 2, options.size / 2); // change center
    ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

    let radius = (options.size - options.lineWidth) / 2;
    // console.log(options.percent);
    let color = getColorPMByLevel(options.percent);

    drawC(ctx, '#CFD0D2', options.lineWidth, radius, 100 / 100, divValue);
    drawC(ctx, color, options.lineWidth, radius, options.percent / 500, divValue);
}
function drawChartAnalysis(kit, type) {
    if (myChart) {
        myChart.destroy();
        // console.log("okokok")
    }
    let labels = [];
    let arraycolor = [];
    kit['PM2.5'].forEach((key, index) => {
        arraycolor.push(getColorPMByLevel(key));
    });
    if (type === "Week"){
        labels = handleLabels(type, kit.Date);
    } else if (type === "Day") {
        labels = handleLabels(type, kit.Date, kit.StartHour);
    }
    // console.log(labels);
    let ctx = document.getElementById("chartpm25").getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'PM2.5',
                data: kit['PM2.5'],
                backgroundColor: arraycolor,
                // borderColor: [
                //     'rgba(255,99,132,1)',
                //     'rgba(54, 162, 235, 1)',
                //     'rgba(255, 206, 86, 1)',
                //     'rgba(75, 192, 192, 1)',
                //     'rgba(153, 102, 255, 1)',
                //     'rgba(255, 159, 64, 1)'
                // ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }],
                // xAxes: [{
                //     label: {
                //         display: false
                //     }
                // }]
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}
function getLastDataOfKit(KitID) {
    $.ajax({
        type: "GET",
        url: `${url}/kit/${KitID}`,
        success: function(result){
            // console.log(result);
            // $('#temp').css('width', '150px');
            // $("#nameKit strong").html(result);
            let color = getColorPMByLevel(result.data["PM2.5"]);
            $("#graph").attr("data-percent", result.data["PM2.5"]);
            $("#temp").find("> div > span:last-child").html(result.data["temp"]);
            $("#hud").find("> div > span:last-child").html(result.data["hud"]);
            $("#notification").find("div div").css("background", color);
            handlePointAqiIndex(result.data["PM2.5"]);
            drawCircle('graph');
            console.log(`show data of kit : ${result.KitID}`);
            timeInterval = setTimeout(() => {
                getLastDataOfKit(KitID);
            }, 5000);
        }
    });
    // $.getJSON("http://localhost:1111/kit/0001")
    // .done(function( data ) {
    //     console.log(data);
    // });
}
function getAnalysisOfKitInDay(KitID) {
    $.ajax({
        type: "GET",
        url: `${url}/analysis/day/${KitID}`,
        success: function(result){
            // console.log(result);
            $("#graphAnalysis").attr("data-percent", result["PM2.5"][result["PM2.5"].length - 1]);
            $("#tempAnalysis").find("> div > span:last-child").html(result["Temperature"][result["Temperature"].length - 1]);
            $("#hudAnalysis").find("> div > span:last-child").html(result["Humidity"][result["Humidity"].length - 1]);

            drawCircle('graphAnalysis', 'Analysis');
            drawChartAnalysis(result, result.AnalysisType);
            // console.log(`show data of kit : ${result.KitID}`);
            // timeInterval = setTimeout(() => {
            //     getLastDataOfKit(KitID);
            // }, 10000);
        }
    });
    // $.getJSON("http://localhost:1111/kit/0001")
    // .done(function( data ) {
    //     console.log(data);
    // });
}
function getAnalysisOfKitInWeek(KitID) {
    $.ajax({
        type: "GET",
        url: `${url}/analysis/week/${KitID}`,
        success: function(result){
            // console.log(result);
            $("#graphAnalysis").attr("data-percent", result["PM2.5"][result["PM2.5"].length - 1]);
            $("#tempAnalysis").find("> div > span:last-child").html(result["Temperature"][result["Temperature"].length - 1]);
            $("#hudAnalysis").find("> div > span:last-child").html(result["Humidity"][result["Humidity"].length - 1]);

            drawCircle('graphAnalysis', 'Analysis');
            drawChartAnalysis(result, result.AnalysisType);
            // console.log(`show data of kit : ${result.KitID}`);
            // timeInterval = setTimeout(() => {
            //     getLastDataOfKit(KitID);
            // }, 10000);
        }
    });
    // $.getJSON("http://localhost:1111/kit/0001")
    // .done(function( data ) {
    //     console.log(data);
    // });
}

function  handleLabels(analysisType, dateCurrent, start) {
    const labels = [];
    const date = dateCurrent.split('/');
    let dayCurrent = new Date();
    dayCurrent.setDate(date[0]);
    dayCurrent.setMonth(date[1]);
    dayCurrent.setYear(date[2]);
    // console.log(date);

    if (analysisType === "Week"){
    // labels la 7 ngay tinh tu ngay hien tai.

        for(let i = 0; i < 7; i++){
            dayCurrent.setDate(dayCurrent.getDate() - 1);
            labels.unshift(dayCurrent.getDate());
        }
        // console.log(dayCurrent.getMonth());
    }else if (analysisType === "Day"){

        dayCurrent.setHours(start);
        for(let i = 0; i < 24; i++){
            dayCurrent.setHours(dayCurrent.getHours() - 1);
            labels.unshift(dayCurrent.getHours());
        }
        // console.log(dayCurrent);
    }
    // console.log(labels);
    return labels;
}

function handlePointAqiIndex(quantity) {
    let el = $("#pointer").find("span");
    let index = quantity/3;

    if(quantity > 300)
        index = (quantity + 700)/12;
    else if(quantity > 200)
        index = (quantity + 200)/6;
    // console.log(index);
    el.css({
        "padding-left": `${index}%`
    });
}
function checkLevelPM(quantity) {
    if (quantity > 300) return 6;
    else if(quantity > 200) return 5;
    else if(quantity > 150) return 4;
    else if(quantity > 100) return 3;
    else if(quantity > 50) return 2;
    else return 1;
}
function getColorPMByLevel(quantity) {
    const lv = checkLevelPM(quantity);
    const PMColorLv = {
        lv1:"#009966",
        lv2:"#FFDE33",
        lv3:"#FF9933",
        lv4:"#CC0033",
        lv5:"#660099",
        lv6:"#7E0023"
    };
    if (lv === 6) return PMColorLv.lv6;
    else if(lv === 5) return PMColorLv.lv5;
    else if(lv === 4) return PMColorLv.lv4;
    else if(lv === 3) return PMColorLv.lv3;
    else if(lv === 2) return PMColorLv.lv2;
    else return PMColorLv.lv1;
}
