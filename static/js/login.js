var show_num = [];
$(function() {
	$("title").text(localData.loginTitle);
	init();
})

function init(){
	var urlArr = location.href.split("?");	
	var back = getUrlParam("back")
	var code = getUrlParam("c")
	if(back != null && back != "")
		localStorage.setItem("back", back);
	if(code != null && code != "")
		localStorage.setItem("code", code);
	var data = {
		checkCodeToken: getUrlParam("token"),
		domainName: urlArr[0]
	};
	Send(httpUrlData.verifyCheckCodeToken, data, function(obj){
		if(obj.verifyResult == 0){
			localStorage.setItem("checkCodeToken", data.checkCodeToken);
			localStorage.setItem("domainName", data.domainName);
			$("#txt_U_name,#txt_U_Password,#txt_validate").on("click", function(){
				$(this).focus();
			})
			draw();
			$("#loginBtn").click(function() {
				var val = $("#txt_validate").val();
				var num = show_num.join("");
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
				} else if (val == num) {
					// if($(this).hasClass("activeBtn")){
					var data = {
						account: txt_U_name.toLocaleLowerCase(),
						password: hex_sha1(password + localData.passwordKey),
						domainName: urlArr[0],
						code: code
					};
					Send(httpUrlData.login, data, function(obj) {
						localStorage.setItem("token", obj.token);
						localStorage.setItem("account", obj.account);
						localStorage.setItem("animalIndex", obj.animalIndex);
						localStorage.setItem("changePwd", obj.changePwd);
						localStorage.setItem("logoUrl", obj.logoUrl);
						var gameArrStr = "";
						for(var i = 0; i < obj.gameidList.length; i++){
							if(gameArrStr != "")
								gameArrStr += ",";
							gameArrStr += obj.gameidList[i];
						}
						localStorage.setItem("gameArrStr", gameArrStr);
						window.open("agreement.html?v=" + version, "_self");
					}, null, function() {
						$("#txt_validate").val("");
						$("#txt_U_name").val("");
						$("#txt_U_Password").val("");
						draw();
					})
				} else {
					alert('验证码不正确，请重新输入。！');
					$("#txt_validate").val("");
					$("#txt_U_name").val("");
					$("#txt_U_Password").val("");
					draw();
				}
			});
		}else{
			var back = localStorage.getItem("back");
			window.open(back, "_self");
		}
	}, init,function () {
		console.log("请求error！重新请求！");
		init();
	});
}

function draw() {
	show_num = [];
	var canvas_width = document.getElementById('canvas').clientWidth;
	var canvas_height = document.getElementById('canvas').clientHeight;
	var canvas = document.getElementById("canvas"); //获取到canvas的对象，演员
	var context = canvas.getContext("2d"); //获取到canvas画图的环境，演员表演的舞台
	canvas.width = canvas_width;
	canvas.height = canvas_height;
	var sCode = "1,2,3,4,5,6,7,8,9,0";
	var aCode = sCode.split(",");
	var aLength = aCode.length; //获取到数组的长度

	var color = randomColor();
	for (var i = 0; i <= 3; i++) {
		var j = Math.floor(Math.random() * aLength); //获取到随机的索引值
		var deg = Math.random() * 30 * Math.PI / 180; //产生0~30之间的随机弧度
		var txt = aCode[j]; //得到随机的一个内容
		show_num[i] = txt;
		var x = 10 + i * 20; //文字在canvas上的x坐标
		var y = 20 + Math.random() * 8; //文字在canvas上的y坐标
		context.font = "bold 28px 微软雅黑";

		context.translate(x, y);
		context.rotate(deg);

		context.fillStyle = color;
		context.fillText(txt, 0, 0);

		context.rotate(-deg);
		context.translate(-x, -y);
	}
	for (var i = 0; i <= 5; i++) { //验证码上显示线条
		context.strokeStyle = randomColor();
		context.beginPath();
		context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
		context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
		context.stroke();
	}
	for (var i = 0; i <= 30; i++) { //验证码上显示小点
		context.strokeStyle = randomColor();
		context.beginPath();
		var x = Math.random() * canvas_width;
		var y = Math.random() * canvas_height;
		context.moveTo(x, y);
		context.lineTo(x + 1, y + 1);
		context.stroke();
	}
}

function randomColor() { //得到随机的颜色值
	var colorArr = ["rgb(0,0,255)", "rgb(0,139,0)", "rgb(255,0,255)", "rgb(255,48,48)",
		"rgb(255,0,0)", "rgb(0,0,0)"
	];
	var index = Math.floor(Math.random() * colorArr.length);
	return colorArr[index];
}

function resize(){
	var width = $(window).width();
	if(width < 1280)
		width = 1280;
		
	$("body").css("width", width)
	$(".loginTable").css("width", width)
}