var show_num = [];
$(function() {
	$("title").text(localData.loginTitle);
	init();
})
function init(){
	// var urlArr = location.href.split("?");	
	// var back = getUrlParam("back")
	// var code = getUrlParam("c")
	// if(back != null && back != "")
	// 	localStorage.setItem("back", back);
	// if(code != null && code != "")
	// 	localStorage.setItem("code", code);
	// var data = {
	// 	checkCodeToken: getUrlParam("token"),
	// 	domainName: urlArr[0]
	// };
	draw()
	$("#loginBtn").click(function() {
		var val = $("#txt_validate").val();
		var txt_U_name = $("#txt_U_name").val();
		var password = $("#txt_U_Password").val();
		if (txt_U_name == "") {
			alert("帐号不能为空，请输入");
			return;
		}
		if (password == "") {
			alert("密码不能为空，请输入");
			return;
		}
		if (val == '') {
			alert('校验码不能为空，请正确输入！');
			return;
		} else {
			var data = {
				"userName": txt_U_name,
				"passWord": password,
				"uuid": createUUID(),
				"captchaVerification": val
			}
			console.log(data)
			Send(httpUrlData.login, JSON.stringify(data), function(res) {
				localStorage.setItem("token", res.data.accessToken);
				localStorage.setItem("refreshToken", res.data.refreshToken);
				localStorage.setItem("expiresIn", res.data.expiresIn);
				localStorage.setItem("animalIndex", 2);
				localStorage.setItem("changePwd", 0);
				window.open("agreement.html?v=" + version, "_self");
			}, null, function() {
				$("#txt_validate").val("");
				$("#txt_U_name").val("");
				$("#txt_U_Password").val("");
				draw();
			})
		}
	})
}
function draw() {
	$('#verifyCode').attr('src', httpUrlData.getVerifyCode.url + new Date().getTime())
}

function resize(){
	var width = $(window).width();
	if(width < 1280)
		width = 1280;
		
	$("body").css("width", width)
	$(".loginTable").css("width", width)
}