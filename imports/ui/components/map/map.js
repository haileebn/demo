// import { Links } from '/imports/api/links/links.js';
import { ListKits } from '/imports/api/collections/collections.js';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';
// import { EJSON } from 'meteor/ejson';
import './map.html';

const url = "http://localhost:1111/kit";
let timeInterval = null;
Template.map.onCreated(() => {
  // Meteor.subscribe('links.all');
  // Meteor.getListId = () => FlowRouter.getParam('_id');
  // Meteor.autorun(() => {
    Meteor.subscribe('listKits.all');
  // });
  // if (LK.count() !== 0){
  //     console.log(ListKits.find().count());
  //
  //
  //     Session.set("listKits", ListKits.find().fetch());
  // }
});

Template.map.helpers({
  links() {
      // console.log("1213");

      // return Links.find({});
  },
});

Template.map.events({
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
});


Template.map.onRendered(() => {
    // let mymap = L.map('mapid',{
    //     zoomControl: false,
    // }).setView([21.038189,105.7827482], 18);
    // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    //     attribution: 'Map data &copy; contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    //     maxZoom: 18,
    //     id: 'mapbox.streets',
    //     accessToken: 'pk.eyJ1IjoiaGFpbGVlYm4iLCJhIjoiY2o4eHl5NHY2MjNzczJ6bXJodzVrbDY2OCJ9.Gr7kFFa3FAZarwChakmDnA'
    // }).addTo(mymap);
    //
    // L.control.zoom({
    //     position:'bottomleft'
    // }).addTo(mymap);
    // // ham tracker cho phep truy van den Database
    // Tracker.autorun(() => {
    //     const allKit = getAllKit().data;
    //     // console.log(allKit);
    //     let myFeatureGroup = L.featureGroup().addTo(mymap);//.on("click", groupClick);
    //     let marker;
    //     // khong kiem tra van chay... khong biet co can KT ko ???
    //     // if (allKit) {
    //         allKit.forEach((kit, index) => {
    //             // console.log(kit.KitID, "---",index);
    //             marker = L.marker(kit.Location).addTo(myFeatureGroup);
    //             marker.on("click", function (event) {
    //                 let clickedMarker = event.layer;
    //                 if(timeInterval) {
    //                     console.log("click maker");
    //                     clearTimeout(timeInterval);
    //                 }
    //                 const tab = $("#detailKit-wrapper");
    //                 tab.toggleClass("active", true);
    //                 getDataOfKit(kit.KitID)
    //             });
    //         });
    //     // }
    //
    //     // marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    //     mymap.on('click', onMapClick);
    // });
});
// function onMapClick(e) {
//     const detailWrapper = $("#detailKit-wrapper");
//     if(detailWrapper.hasClass("active")){
//         if(timeInterval){
//             clearTimeout(timeInterval);
//             console.log("clearrrr");
//         }
//         console.log("endddd");
//         detailWrapper.toggleClass("active", false);
//     }
// }
// function getAllKit() {
//     return $.parseJSON($.ajax({
//         type: "GET",
//         url: `${url}/all`,
//         async: false,
//         // dataType: "jsonp",
//         // success: function(result){
//         //     console.log(result.allKit);
//         // }
//     }).responseText);
// }
// function drawC(ctx, color, lineWidth, radius, percent, divValue) {
//     percent = Math.min(Math.max(0, percent || 1), 1);
//     ctx.beginPath();
//     ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
//     ctx.strokeStyle = color;
//     ctx.lineCap = 'round'; // butt, round or square
//     ctx.lineWidth = lineWidth;
//     ctx.stroke();
//     divValue.css("color", color);
// }
// function drawCircle(id, ana = "") {
//     let el = document.getElementById(id); // get canvas
//
//     let options = {
//         percent:  el.getAttribute('data-percent') || 25,
//         size: el.getAttribute('data-size') || 120,
//         lineWidth: el.getAttribute('data-line') || 12,
//         rotate: el.getAttribute('data-rotate') || 0
//     };
//     let canvas = $(`#${id} canvas`)[0];
//     let divValue = $(`#valuePM25${ana}`);
//     let divUnit = $(`#unitPM25${ana}`);
//     divValue.html(options.percent);
//     divUnit.html('&micro;g/m&sup3;');
//
//     if (typeof(G_vmlCanvasManager) !== 'undefined') {
//         G_vmlCanvasManager.initElement(canvas);
//     }
//
//     let ctx = canvas.getContext('2d');
//     canvas.width = canvas.height = options.size;
//     // div.appendChild(divValue);
//     // div.appendChild(divUnit);
//     // row.appendChild(div);
//     // row.appendChild(canvas);
//     // el.appendChild(row);
//
//     ctx.translate(options.size / 2, options.size / 2); // change center
//     ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg
//
//     //imd = ctx.getImageData(0, 0, 240, 240);
//     let radius = (options.size - options.lineWidth) / 2;
//
//     drawC(ctx, '#CFD0D2', options.lineWidth, radius, 100 / 100, divValue);
//     drawC(ctx, '#00A242', options.lineWidth, radius, options.percent / 500, divValue);
// }
//
// function getDataOfKit(KitID) {
//     $.ajax({
//         type: "GET",
//         url: `${url}/${KitID}`,
//         // dataType: "jsonp",
//         success: function(result){
//             // console.log($("#graph").attr("data-percent"))
//             $("#graph").attr("data-percent", result.data["pm2.5"]);
//             $("#temp > div > span:last-child").html(result.data["temp"]);
//             $("#hud > div > span:last-child").html(result.data["hud"]);
//             drawCircle('graph');
//             console.log(`show data of kit : ${result.KitID}`);
//             timeInterval = setTimeout(() => {
//                 getDataOfKit(KitID);
//             }, 5000);
//         }
//     });
//     // $.getJSON("http://localhost:1111/kit/0001")
//     // .done(function( data ) {
//     //     console.log(data);
//     // });
// }