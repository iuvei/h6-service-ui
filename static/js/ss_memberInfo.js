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
			html += '<tr>'
					+ '<td class="typeCell">' + obj.memberMaterialList[i].type + '</td>'
					+ '<td class="betMinCell">' + obj.memberMaterialList[i].orderMin + '</td>'
					+ '<td class="betMaxCell">' + obj.memberMaterialList[i].orderMax + '</td>'
					+ '<td class="itemMaxCell">' + obj.memberMaterialList[i].issueMax + '</td>'
					+ '<td class="aCell">' + obj.memberMaterialList[i].recedeA + '</td>'
					+ '<td class="bCell">' + obj.memberMaterialList[i].recedeB + '</td>'
				+ '</tr>';
		}
		$(".systemCont").html(html);
	})
}