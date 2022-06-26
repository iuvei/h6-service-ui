var httpID = 0;
var curToken = "";
function Send(url, data, successCall, timeoutCallback, errorCall){
	// if(curToken != "" && data.token != null && curToken != data.token){
	// 	GotoLogin();
	// 	return;
	// }
	var isCall = false;
	data.httpID = httpID++;
	var sendTime = new Date().getTime();
		$.ajax({
			type : url.type || 'post',
			url : serverMap[url.server] + url.url,
			data : data,
			dataType : "json",
			contentType: url.contentType || 'application/json;charset=UTF-8',
			async : true,
			timeout : 30000,
			headers: {
				Authorization: localStorage.getItem('token')
			},
			success : function(obj){
				if(obj == null)  return;
				// if(httpUrlData.heartBeat.url != url){
				// 	removeLoading();
				// }
				if(obj.code == 1)
				{
					if (successCall != null && successCall != "") {            
						successCall(obj);
					};
				}
				else{
					console.log("错误码：" + localData.httpServer + url + "     " + obj.errorMsg)
					alert(obj.msg);
					if(obj.code == 2){
						GotoLogin();
						return;
					};
					if(errorCall != null){
						errorCall();
					}
				}
			},
			//调用执行后调用的函数
			complete: function (XMLHttpRequest, textStatus) {
				console.log(textStatus);
				if(textStatus == 'timeout'){
					console.log("请求超时:" + serverMap[url.server] + url.url);
					if (timeoutCallback != null && timeoutCallback != "" && !isCall) {
						isCall = true;
						timeoutCallback();
					}
					else if(httpUrlData.heartBeat.url != url && httpUrlData.syncTime.url != url){
						alert("请稍候");
					}
					// if(httpUrlData.heartBeat.url != url){
					// 	removeLoading();
					// }
				}
			},
			error :function(XMLHttpRequest, errorInfo){
				console.log("error错误信息:" + serverMap[url.server] + url.url + "     " + errorInfo);
				if(errorCall != null && errorCall != "" && !isCall){
					isCall = true;
					setTimeout(errorCall, 1000);
				}
				// removeLoading();
			}
		})
	console.log("send成功");
}
/**
 * 退出到登陆页面
 */
function GotoLogin() {
  localStorage.removeItem('token')
	window.top.open(window.location.origin + "/views/login.html?", "_self");
}
