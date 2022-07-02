
function verifCode() {
      console.log($('#kw').val())
  $.ajax({
    type: 'get',
		url : serverMap[httpUrlData.verifyCheckCode.server] + httpUrlData.verifyCheckCode.url,
		dataType : "json",
    data: {
      code: $('#kw').val()
    },
		contentType: 'application/json;charset=UTF-8',
		async : true,
		timeout : 30000,
    success(res) {
      if (res.code == 1) {
        sessionStorage.setItem('checkCodeData', JSON.stringify(res.data))
        window.open('home.html', '_self')
      } else {
        alert(res.msg)
      }
    },
    error(res) {
      alert(res.responseJSON.error)
    }
  })
}