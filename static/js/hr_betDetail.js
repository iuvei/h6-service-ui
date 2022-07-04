var betData = {};
$(function(){
	initPage(getBetDetailData, updateBetDetailData, 10, 50)
	getBetDetailData(0);
})

function getBetDetailData(page){
	var data = {
		"gameId": localStorage.getItem('gameId') || 1,
		"amount":0
	}
	$.ajax({
		type: 'post',
		url: serverMap[httpUrlData.listBetDetailList.server] + httpUrlData.listBetDetailList.url,
		data: JSON.stringify(data),
		contentType: 'application/json;charset=UTF-8',
		async : true,
		timeout : 30000,
		headers: {
			Authorization: localStorage.getItem('token')
		},
		success(res) {
			betData = res;
			setPage(res.length, page);
		},
    error(res) {
      alert(res.responseJSON.error)
    }
	})
}

function updateBetDetailData(){
	var html = '';
	var recedeMoneySum = 0;
	var betMoneySum = 0;
		var infoHtml = '';
		
	for(var i = 0; i < betData.length; i++){
		var className =  ""
		// cancelInfo
		betMoneySum += Number(betData[i].betAmount)
		recedeMoneySum += Number(betData[i].returnAmount)
		infoHtml = '<div class="cell infoCell clickCell' + className + '" title="' + betData[i].betContent + '" onclick="showLinkBetInfo(' + i + ',' + betData[i].id + ')">' + betData[i].betContent + '</div>';
		html += '<div class="row">'
				+ '<div class="cell numCell' + className + '">' + betData[i].id + '</div>'
				+ '<div class="cell timeCell' + className + '">' + betData[i].createTime + '</div>'
				+ infoHtml
				+ '<div class="cell moneyCell' + className + '">' + betData[i].betAmount + '</div>'
				+ '<div class="cell oddsCell' + className + '" title="' + betData[i].betOdds + '">' + betData[i].betOdds + '</div>'
				+ '<div class="cell winCell' + className + '">' + betData[i].betWinAmount + '</div>'
				+ '<div class="cell feedbackCell' + className + '">' + betData[i].returnAmount + '</div>'
			+ '</div>';

			
	}
	$(".systemCont").html(html);
	$(".statisticsRow .sumCell").text("小计（" + betData.length + "笔）");
	$(".statisticsRow .moneyCell").text(betMoneySum);
	$(".statisticsRow .feedbackCell").text(recedeMoneySum);
}

function showLinkBetInfo(index, id){
	var html = ''
	var data = {
		"gameId": localStorage.getItem('gameId') || 1,
		"commandId":id
	}
	$.ajax({
		type: 'post',
		url: serverMap[httpUrlData.listBetDetail.server] + httpUrlData.listBetDetail.url,
		data: JSON.stringify(data),
		contentType: 'application/json;charset=UTF-8',
		async : true,
		timeout : 30000,
		headers: {
			Authorization: localStorage.getItem('token')
		},
		success(res) {
			if (res) {
				res.forEach(item => {
					html += '<div>' + item + '</div>'
				})
				$("#betInfoTable .systemCont").html(html).show();
				$("#betListTable, .ctrlPanel").hide();
				$("#betInfoTable").show();
			}
		},
    error(res) {
      alert(res.responseJSON.error)
    }
	})
}

function showBetListTable(){
	$("#betInfoTable").hide();
	$("#betListTable, .ctrlPanel").show();
}