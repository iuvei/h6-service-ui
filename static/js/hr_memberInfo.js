var betData = {};
$(function(){
	getMemberMaterial();
})

function getMemberMaterial(){
	var data = {
		token: window.top.token,
		gameID: window.top.gameArr[window.top.curIndex].id
	}
	Send(httpUrlData.getMemberMaterial, data, function(obj){
		var html = '';
		for(var i = 0; i < obj.memberMaterialList.length; i++){
			html += '<div class="row">'
					+ '<div class="cell typeCell">' + obj.memberMaterialList[i].type + '</div>'
					+ '<div class="cell betMinCell">' + obj.memberMaterialList[i].orderMin + '</div>'
					+ '<div class="cell betMaxCell">' + obj.memberMaterialList[i].orderMax + '</div>'
					+ '<div class="cell itemMaxCell">' + obj.memberMaterialList[i].issueMax + '</div>'
					+ '<div class="cell aCell">' + obj.memberMaterialList[i].recedeA + '</div>'
					+ '<div class="cell bCell">' + obj.memberMaterialList[i].recedeB + '</div>'
				+ '</div>';
		}
		$(".systemCont").html(html);
	})
}