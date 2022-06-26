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
		window.top.open("ss_index.html?v=" + version, "_self");
	})
}

function clear(){
	$("#curPassword, #newPassword1, #newPassword2").val("");
}