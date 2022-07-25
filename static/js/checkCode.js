
function verifCode() {
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
        var domainSplit = window.location.hostname.split('.')
        var len = domainSplit.length
        var domain = domainSplit[len - 2] + '.' + domainSplit[len - 1]
        setCookie('code', $('#kw').val(), domain)
        sessionStorage.setItem('checkCodeData', JSON.stringify(res.data))
        sessionStorage.setItem('safeCode', $('#kw').val())
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