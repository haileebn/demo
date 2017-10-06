
let chartPM25;
let chartTemp;
let chartHud;
function getAnalysisKitID(kitID) {
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
      getKitID(kitID);
    }
  });
}
function getKitID(kitID) {
  $.ajax({
    url: `/v1/kit/${kitID}`,
    type: "GET",
    dataType: "json",
    success: function(result) {
      const data = result.kit.lastRecord.data;
      let iconFeel = "";
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
      $("#advice").html(strAdvice).css("color", color);
      $("#iconFeeling").attr("src", '/imageFeeling/' + iconFeel + '.png');
      $("#lastUpdate").html(lastUpdate);
      $("#infoNode").html(stringInfoNode);
      $("#title").html(result.kit.name);
      timeInterval = setTimeout(function() {
        getKitID(kitID);
      }, 10000);
    }
  });
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
