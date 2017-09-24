let stringContent = '<div id="myChart" style="width:100%;">' +
    '<div id="headChart" style="width:100%;">' +
    '<div id="titleChart">' +
    '<span id="title" style="color: blue;font-size:24px;font-weight:bold;"></span>' +
    // '<>'+
    '</div>' +
    '<div style="float:right;">' +
    '<img id="iconFeeling"><i id="advice"></i>' +
    '</div>' +
    '<div id="infoNode">' +
    '</div>' +
    // end infonode
    '</div>' +
    // end headchart
    '<div class="bodyChart" style="clear:right;">' +
    '<div class="chartjs-tooltip" id="tooltip-0"></div>' +
    '<div class="chartjs-tooltip" id="tooltip-1"></div>' +
    '<canvas id="PM25" style="float: left;">' +
    '</canvas>' +
    '<div id="alert1"></div>' +
    '<canvas id="temp" style="float: left;">' +
    '</canvas>' +
    '<div id="alert"></div>' +
    '<canvas id="hud" style="float: left;">' +
    '</canvas>' +
    '<div id="alert1"></div>' +
    '<i id="lastUpdate" style="margin-top:100px; opacity: 0.35; font-size:12px;"></i>' +
    '</div>'
'</div>';
let timeInterval = null;
let chartPM25;
let chartTemp;
let chartHud;
let preInfowindow = false;

    // getKit();

function myMap() {
    let mapProp = {
        center: new google.maps.LatLng(21.0381934,105.7828466),
        zoom: 15,
    };
    let map = new google.maps.Map($('#googleMap')[0], mapProp);
    // let marker = new google.maps.Marker({ position: mapProp.center });
    // marker.setMap(map);

    var myloc = new google.maps.Marker({
        icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
            new google.maps.Size(22, 22),
            new google.maps.Point(0, 18),
            new google.maps.Point(11, 11)),
        shadow: null,
        zIndex: 999,
        title: "My Location!",
        map: map
    });
    myloc.addListener('click', function() {
        if (myloc.getAnimation() !== null) {
          myloc.setAnimation(null);
        } else {
          myloc.setAnimation(google.maps.Animation.BOUNCE);
        }
    });

    addYourLocationButton(map, myloc);
    getKit(map);
}

// tao button my location
function addYourLocationButton(map, marker) {
    var controlDiv = document.createElement('div');

    var firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '28px';
    firstChild.style.height = '28px';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.padding = '0px';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0px 0px';
    secondChild.style.backgroundRepeat = 'no-repeat';
    secondChild.id = 'you_location_img';
    firstChild.appendChild(secondChild);

    google.maps.event.addListener(map, 'dragend', function() {
        $('#you_location_img').css('background-position', '0px 0px');
    });

    firstChild.addEventListener('click', function() {
        var imgX = '0';
        var animationInterval = setInterval(function() {
            if (imgX == '-18') imgX = '0';
            else imgX = '-18';
            $('#you_location_img').css('background-position', imgX + 'px 0px');
        }, 500);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
              marker.setPosition(latlng);
              marker.setAnimation(google.maps.Animation.BOUNCE);
              map.setCenter(latlng);
              map.setZoom(18);
              clearInterval(animationInterval);
              $('#you_location_img').css('background-position', '-144px 0px');
            });
        } else {
            clearInterval(animationInterval);
            $('#you_location_img').css('background-position', '0px 0px');
        }
    });
    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}
function createTable() {
    var controlDiv = document.createElement('div');
    var table =  document.createElement('table');
    var tbody =  document.createElement('tbody');
    var row = document.createElement('tr');

    var col1 = document.createElement('td'),
    col2 = document.createElement('td'),
    col3 = document.createElement('td'),
    col4 = document.createElement('td'),
    col5 = document.createElement('td'),
    col6 = document.createElement('td');


    row.appendChild(col1); row.appendChild(col2); row.appendChild(col3);
    row.appendChild(col4); row.appendChild(col5); row.appendChild(col6);

    table.appendChild(tbody);
    controlDiv.appendChild(tbody);
// 00A065
// FFE200
// FF9400
// E10016
// 74009F
    col1.style.backgroundColor = "#00A065";
    col1.style.width = '28px';
    col1.style.height = '28px';
    var body = document.getElementById("#googleMap"); 
    controlDiv.index = 9999;
    // controlDiv.style.position = 
    body.appendChild(controlDiv);
}
