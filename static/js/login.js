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
				"userName": 'huazai',
				"passWord": '123456',
				"role": "sys",
				"uuid": "37e00636-9ac6-4016-8ecf-11092df33c61",
				"captchaVerification": val
			}
			Send(httpUrlData.login, JSON.stringify(data), function(res) {
				localStorage.setItem("token", res.data.accessToken);
				localStorage.setItem("refreshToken", res.data.refreshToken);
				localStorage.setItem("expiresIn", res.data.expiresIn);
				window.open("agreement.html?v=" + version, "_self");
			}, null, function() {
				$("#txt_validate").val("");
				$("#txt_U_name").val("");
				$("#txt_U_Password").val("");
				draw();
			})
		}
		
	})
	// Send(httpUrlData.verifyCheckCodeToken, data, function(obj){
	// 	if(obj.verifyResult == 0){
	// 		localStorage.setItem("checkCodeToken", data.checkCodeToken);
	// 		localStorage.setItem("domainName", data.domainName);
	// 		$("#txt_U_name,#txt_U_Password,#txt_validate").on("click", function(){
	// 			$(this).focus();
	// 		})
	// 		draw();
	// 		$("#loginBtn").click(function() {
	// 			var val = $("#txt_validate").val();
	// 			var num = show_num.join("");
	// 			var txt_U_name = $("#txt_U_name").val();
	// 			var password = $("#txt_U_Password").val();
	// 			if (txt_U_name == "") {
	// 				alert("帐号不能为空，请输入");
	// 				return;
	// 			}
	// 			if (password == "") {
	// 				alert("密码不能为空，请输入");
	// 				return;
	// 			}
	// 			if (val == '') {
	// 				alert('校验码不能为空，请正确输入！');
	// 				return;
	// 			} else if (val == num) {
	// 				// if($(this).hasClass("activeBtn")){
	// 				var data = {
	// 					account: txt_U_name.toLocaleLowerCase(),
	// 					password: hex_sha1(password + localData.passwordKey),
	// 					domainName: urlArr[0],
	// 					code: code
	// 				};
	// 				Send(httpUrlData.login, data, function(obj) {
	// 					localStorage.setItem("token", obj.token);
	// 					localStorage.setItem("account", obj.account);
	// 					localStorage.setItem("animalIndex", obj.animalIndex);
	// 					localStorage.setItem("changePwd", obj.changePwd);
	// 					localStorage.setItem("logoUrl", obj.logoUrl);
	// 					var gameArrStr = "";
	// 					for(var i = 0; i < obj.gameidList.length; i++){
	// 						if(gameArrStr != "")
	// 							gameArrStr += ",";
	// 						gameArrStr += obj.gameidList[i];
	// 					}
	// 					localStorage.setItem("gameArrStr", gameArrStr);
	// 					window.open("agreement.html?v=" + version, "_self");
	// 				}, null, function() {
	// 					$("#txt_validate").val("");
	// 					$("#txt_U_name").val("");
	// 					$("#txt_U_Password").val("");
	// 					draw();
	// 				})
	// 			} else {
	// 				alert('验证码不正确，请重新输入。！');
	// 				$("#txt_validate").val("");
	// 				$("#txt_U_name").val("");
	// 				$("#txt_U_Password").val("");
	// 				draw();
	// 			}
	// 		});
	// 	}else{
	// 		var back = localStorage.getItem("back");
	// 		window.open(back, "_self");
	// 	}
	// }, init,function () {
	// 	console.log("请求error！重新请求！");
	// 	init();
	// });
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