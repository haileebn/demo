import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';

import './home.html';

import '../../components/map/map.js';
import '../../components/navbar/navbar.js';
import '../../components/detailKit/detailKit.js';

const url = "http://localhost:1111";
let timeInterval = null;

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
        if(timeInterval) {
            console.log("click makesadsadsar");
            clearTimeout(timeInterval);
        }
        tab.toggleClass("active");

    },
    'click #day'(){
        getAnalysisOfKitInDay(Session.get("kitId"));

    },
    'click #week'(){
        getAnalysisOfKitInWeek(Session.get("kitId"));
    },
});
Template.App_home.onRendered(() => {
    let mymap = initMap('pk.eyJ1IjoiaGFpbGVlYm4iLCJhIjoiY2o4eHl5NHY2MjNzczJ6bXJodzVrbDY2OCJ9.Gr7kFFa3FAZarwChakmDnA');
    // ham tracker cho phep truy van den Database
    Tracker.autorun(() => {
        const allKit = getAllKit().data;
        let myFeatureGroup = L.featureGroup().addTo(mymap);//.on("click", groupClick);
        let marker;
        allKit.forEach((kit, index) => {
            // console.log(kit.KitID, "---",index);
            marker = L.marker(kit.Location).addTo(myFeatureGroup);
            marker.on("click", function (event) {
                const tab = $("#detailKit-wrapper");
                let clickedMarker = event.layer;

                if(timeInterval) {
                    // console.log("click maker");
                    clearTimeout(timeInterval);
                    tab.toggleClass("active", false);
                }
                setTimeout(() => {
                    tab.toggleClass("active", true);
                }, 200);
                getLastDataOfKit(kit.KitID);
                getAnalysisOfKitInDay(kit.KitID);
                Session.set("kitId", kit.KitID);
            });
        });
        // marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
        mymap.on('click', onMapClick);
    });
});
function initMap(accessToken) {
    const mymap = L.map('mapid',{
        zoomControl: false,
    }).setView([21.038189,105.7827482], 18);
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

function onMapClick(e) {
    const detailWrapper = $("#detailKit-wrapper");
    if(detailWrapper.hasClass("active")){
        if(timeInterval){
            clearTimeout(timeInterval);
            console.log("clearrrr");
        }
        console.log("endddd");
        detailWrapper.toggleClass("active", false);
    }
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
}
function drawCircle(id, ana = "") {
    let el = document.getElementById(id); // get canvas

    let options = {
        percent:  el.getAttribute('data-percent') || 25,
        size: el.getAttribute('data-size') || 120,
        lineWidth: el.getAttribute('data-line') || 12,
        rotate: el.getAttribute('data-rotate') || 0
    };
    let canvas = $(`#${id} canvas`)[0];
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

    drawC(ctx, '#CFD0D2', options.lineWidth, radius, 100 / 100, divValue);
    drawC(ctx, '#00A242', options.lineWidth, radius, options.percent / 500, divValue);
}
function drawChartAnalysis(kit, type) {
    let labels = [];
    if (type === "Week"){
        labels = handleLabels(type, kit.Date);
    } else if (type === "Day") {
        labels = handleLabels(type, kit.Date, kit.StartHour);
    }
    console.log(labels);
    let ctx = document.getElementById("chartpm25").getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'PM2.5',
                data: kit['PM2.5'],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
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
            $("#graph").attr("data-percent", result.data["PM2.5"]);
            $("#temp > div > span:last-child").html(result.data["temp"]);
            $("#hud > div > span:last-child").html(result.data["hud"]);
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
            console.log(result);
            $("#graphAnalysis").attr("data-percent", result["PM2.5"][result["PM2.5"].length - 1]);
            $("#tempAnalysis > div > span:last-child").html(result["Temperature"][result["Temperature"].length - 1]);
            $("#hudAnalysis > div > span:last-child").html(result["Humidity"][result["Humidity"].length - 1]);

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
            console.log(result);
            $("#graphAnalysis").attr("data-percent", result["PM2.5"][result["PM2.5"].length - 1]);
            $("#tempAnalysis > div > span:last-child").html(result["Temperature"][result["Temperature"].length - 1]);
            $("#hudAnalysis > div > span:last-child").html(result["Humidity"][result["Humidity"].length - 1]);

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