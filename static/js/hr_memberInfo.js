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
		console.log(obj)
		var html = '';
		for(var i = 0; i < obj.data.length; i++){
			html += '<div class="row">'
					+ '<div class="cell typeCell">' + obj.data[i].playType + '</div>'
					+ '<div class="cell betMinCell">' + obj.data[i].playMin + '</div>'
					+ '<div class="cell betMaxCell">' + obj.data[i].playMax + '</div>'
					+ '<div class="cell itemMaxCell">' + obj.data[i].max + '</div>'
					+ '<div class="cell aCell">' + obj.data[i].returnAA + '</div>'
					+ '<div class="cell bCell">' + obj.data[i].returnAB + '</div>'
				+ '</div>';
		}
		$(".systemCont").html(html);
	})
}