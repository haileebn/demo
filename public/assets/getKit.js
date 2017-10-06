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

function handleDate(strDate, hour) {
	// body...
	strDate = strDate.split('/');
	const day = strDate[0];
	const month = strDate[1];
	const year = strDate[2];
	let time = new Date();
	time.setYear(year);
	time.setMonth(month - 1);
	time.setDate(day);
	time.setHours(hour);
	return time;
}
function getKit(map) {
	$.ajax({
    url: '/v1/kit',
    headers: {
        'Content-Type': 'application/json'
    },
    type: "GET",
    dataType: "json",
    success: function(response) {
    	let infowindow = new google.maps.InfoWindow({ maxWidth: 1000 });
    	const kit = response.kit;
    	const station = response.station;
      for (let i = 0; i < kit.length; i++) {
        let location = { lat: kit[i].location[0], lng: kit[i].location[1] };
        let colorIconMarker;
        let lastPm25 = kit[i].lastRecord.data.pm25;
        if (lastPm25 <= 50) colorIconMarker = "lv1";
        else if (lastPm25 <= 100) colorIconMarker = "lv2";
        else if (lastPm25 <= 150) colorIconMarker = "lv3";
        else if (lastPm25 <= 200) colorIconMarker = "lv4";
        else if (lastPm25 <= 300) colorIconMarker = "lv5";
        else colorIconMarker = "lv6";
        let marker = new google.maps.Marker({
            position: location,
            icon: '/image/' + colorIconMarker + '.png',
            label: { color: '#fff', fontSize: '12px', fontWeight: '600', text: "" + lastPm25 },
            map: map,
            title: `${kit[i].name}`
        });
        (function(marker, i) {
            google.maps.event.addListener(marker, "click", function(e) {
                chartPM25 = null;
                chartTemp = null;
                chartHud = null;
                if (timeInterval) clearTimeout(timeInterval);
                if (preInfowindow) preInfowindow = null;
                infowindow.setContent(stringContent);
                infowindow.open(map, marker);

                // node sau khi infowindow duoc mo len thi moi thay doi duoc dom html cua stringContent
                $("#title").html(kit[i].name);
                preInfowindow = infowindow;
                getAnalysisKitID(kit, kit[i].kitID);
                // console.log(i);
            });
        })(marker, i);
    	}
    	for (let i = 0; i < station.length; i++) {
	      let location = { lat: Number(station[i].location[0]), lng: Number(station[i].location[1]) };
	      let colorIconMarker;
	      let lastPm25 = station[i].lastRecord;
	       if (lastPm25 <= 50) colorIconMarker = "lv1_station";
        else if (lastPm25 <= 100) colorIconMarker = "lv2_station";
        else if (lastPm25 <= 150) colorIconMarker = "lv3_station";
        else if (lastPm25 <= 200) colorIconMarker = "lv4_station";
        else if (lastPm25 <= 300) colorIconMarker = "lv5_station";
	      else colorIconMarker = "lv6_station";
        let marker = new google.maps.Marker({
          position: location,
          icon: '/image/' + colorIconMarker + '.png',
          label: { color: '#fff', fontSize: '10px', fontWeight: '500', text: "" + lastPm25 },
          map: map,
          title: station[i].name
        });
    	}
    }  
  });
}
function getAnalysisKitID(kit, kitID) {
	// body...
	$.ajax({
	  url: `/v1/analysis/${kitID}`,
	  type: "GET",
	  dataType: "json",
	  success: function(result) {
	  	// console.log(result);
      let today = "";
      let pm25 = [];
      let temp = [];
      let hud = [];
      let timeLabel = [];
      for (var j = result.analysis.length -1; j >= 0; j--) {
          if (result.analysis[j].data) {
        		const data = result.analysis[j].data;
            pm25.unshift(data.pm25);
            temp.unshift(data.temp);
            hud.unshift(data.hud);
            timeLabel.unshift(new Date(handleDate(result.analysis[j].date,result.analysis[j].hour)));
          } else {
              pm25.unshift(undefined);
              temp.unshift(undefined);
              hud.unshift(undefined);
              timeLabel.unshift(undefined);
          }
      }
      today = "To Day: " + moment(lastUpdate).format('dddd, D MMM YYYY');


      if (chartPM25 || chartTemp || chartHud) {
          updateChart(pm25, timeLabel, "pm25");
          updateChart(temp, timeLabel, "temp");
          updateChart(hud, timeLabel, "hud");
          console.log("updateChart!!" + kitID);
      } else {
          drawChart(pm25, timeLabel, "pm25");
          drawChart(temp, timeLabel, "temp");
          drawChart(hud, timeLabel, "hud");
          console.log("drawChart!!" + kitID);
      }

      $("#today").html(today);
	  	getKitID(kit, kitID);
	  }
	});
}
function getKitID(kit, kitID) {
	$.ajax({
	  url: `/v1/kit/${kitID}`,
	  type: "GET",
	  dataType: "json",
	  success: function(result) {
	  	const data = result.kit.lastRecord.data;
      let IconFeel = "";
      let strAdvice = "";
      let color = "";
       if (data.pm25 <= 50) {
        iconFeel = "feeling_lv1";
        strAdvice = "Hãy đi chơi đâu đó.";
        color = "#00A065";
       }
        else if (data.pm25 <= 100) {
          iconFeel = "feeling_lv2";
          strAdvice = "Hạn chế cho trẻ em ra ngoài chơi.";
          color = "#FFE200";
        }
        else if (data.pm25 <= 150) {
          iconFeel = "feeling_lv3";
          strAdvice = "Không phải thời điểm ra ngoài thích hợp với người nhạy cảm.";
         color = "#FF9400";
        }
        else if (data.pm25 <= 200) {
          iconFeel = "feeling_lv4";
          strAdvice = "Mọi người hạn chế ra ngoài!";
         color = "#E10016";
        }
        else if (data.pm25 <= 300) {
          iconFeel = "feeling_lv5";
          strAdvice = "Cảnh báo cấp 1!!!";
         color = "#74009F";
        }
        else {
          iconFeel = "feeling_lv6";
          strAdvice = "Cảnh báo khẩn cấp!!!";
         color = "#8B0017";
        }
        let stringInfoNode = "";
        let lastUpdate = result.kit.lastRecord.time;
        lastUpdate = "Last Update:" + moment(lastUpdate).format('YYYY-MM-DD, HH:mm:ss');
        stringInfoNode += "PM2.5: <span style=\"color: " + color +";font-size:20px;font-weight:bold;\">" + data.pm25 + "</span> μg/m&sup3<br>";
        stringInfoNode += "Temperature : " + data.temp + "\u00B0C, ";
        stringInfoNode += "Humidity :" + data.hud + "\u0025";
      $("#advice").css("color", color);
      $("#iconFeeling").attr("src", '/imageFeeling/' + iconFeel + '.png');
      $("#advice").html(strAdvice);
      $("#lastUpdate").html(lastUpdate);
      $("#infoNode").html(stringInfoNode);

      timeInterval = setTimeout(function() {
          getKitID(kit, kitID);
      }, 10000);
	  }
	});
}