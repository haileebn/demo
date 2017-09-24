function search(){
  $('#search').prop('disabled', true);
  $.ajax({
    url: "http://192.168.4.1/info",
    json: true,
    error: function(){
      $('#search').prop('disabled', false);
      alert({error:true, msg: "Cant find Kit"});
    },
    success: function(result){
      $('#search').prop('disabled', false);
      $('#device').val(result.id);
      $('#form').show();
      $('#config').prop('disabled', true);
      alert({error:false, msg: "Kit was found. Scaning wifi..."});
      scan();
    },
    timeout: 3000 // sets timeout to 3 seconds
  });
}

function scan(){
  $.ajax({
    url: "http://192.168.4.1/scan",
    json: true,
    success: function(result){
      $('#wifi').html('');
      result.ssid.forEach(function(item){
        $('#wifi').append(`<option value="${item.ssid}">ssid: ${item.ssid}- rssi: ${item.rssi}</option>`);
      });
    }
  });
}

function alert(data){
  if(data.error){
    $('#alert').show().removeClass('alert-success').addClass('alert-danger').html(data.msg);
  } else {
    $('#alert').show().removeClass('alert-danger').addClass('alert-success').html(data.msg);
  }
  setTimeout(function () {
    $('#alert').hide();
  }, 3000);
}
