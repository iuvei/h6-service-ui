var show_num = [];
$(function() {
	$("title").text(localData.loginTitle);
	loadUrl()
	init();
	$('#clear').click(function() {
		$("#curPassword, #newPassword1, #newPassword2").val("");
	})
})
function loadUrl() {
	var checkCodeData = window.location.href.includes('auth=true')
	if (!checkCodeData) {
		window.open(location.origin, '_self')
	}
}
function init(){
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
			Send(httpUrlData.login, JSON.stringify(data), function(res) {
				if (res.data.firstLogin == 1) {
					var isPwd = confirm("因为您是首次登录，因此需要修改密码后才能登录")
					if (isPwd) {
						$('.modal').show()
						localStorage.setItem("token", res.data.accessToken);
					}
				} else {
					localStorage.setItem("token", res.data.accessToken);
					localStorage.setItem("refreshToken", res.data.refreshToken);
					localStorage.setItem("expiresIn", res.data.expiresIn);
					localStorage.setItem("animalIndex", 2);
					localStorage.setItem("changePwd", 0);
					window.open("agreement.html?v=" + version, "_self");
				}
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
function updatePassword(){	
	var curPassword = $("#curPassword").val();
	var newPassword1 = $("#newPassword1").val();
	var newPassword2 = $("#newPassword2").val();
	if (curPassword == "" || newPassword1 == "" || newPassword2 == "") {
		alert("请输入新密码和旧密码");
		return;
	}
	if(newPassword1 != newPassword2){
		alert("新密码2次输入不一致");
		return;
	}
	if(newPassword1.indexOf(" ") >= 0){
		alert("新密码不能输入空格");
		return;		
	}
	if(newPassword1.length < 6 || newPassword1.length > 16){
		alert("请输入6-16位的新密码");
		return;		
	}
	if(newPassword1.length < 6 || newPassword1.length > 16){
		alert("请输入6-16位的新密码");
		return;		
	}
	if(newPassword1.match(".*[a-zA-Z]+.*") == null || newPassword1.match(/\d/g) == null){
		alert("密码至少包含一个数字和一个字母");
		return;		
	}
	var data = {
		password: curPassword,
		newPassword: newPassword1,
		confirmNewPassword: newPassword1,
	}
	Send(httpUrlData.updatePassword, JSON.stringify(data), function(obj){
		alert("修改成功");
		$('.modal').hide()
		$("#txt_validate").val("");
		$("#txt_U_name").val("");
		$("#txt_U_Password").val("");
	})
}