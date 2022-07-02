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
		if(betData[i].betContent)
			infoHtml = '<div class="cell infoCell clickCell' + className + '" title="' + betData[i].betContent + '" onclick="showLinkBetInfo(' + i + ')">' + betData[i].betContent + '</div>';
		else
			infoHtml = '<div class="cell infoCell' + className + '" title="' + betData[i].betContent + '">' + betData[i].betContent + '</div>';
		html += '<div class="row">'
				+ '<div class="cell numCell' + className + '">' + betData[i].orderNum + '</div>'
				+ '<div class="cell timeCell' + className + '">' + betData[i].createTime + '</div>'
				+ infoHtml
				+ '<div class="cell moneyCell' + className + '">' + betData[i].betAmount + '</div>'
				+ '<div class="cell oddsCell' + className + '" title="' + betData[i].betOdds + '">' + betData[i].betOdds + '</div>'
				+ '<div class="cell winCell' + className + '">' + betData[i].willWinMoney + '</div>'
				+ '<div class="cell feedbackCell' + className + '">' + betData[i].returnAmount + '</div>'
			+ '</div>';

			
	}
	$(".systemCont").html(html);
	$(".statisticsRow .sumCell").text("小计（" + betData.length + "笔）");
	$(".statisticsRow .moneyCell").text(betMoneySum);
	$(".statisticsRow .feedbackCell").text(recedeMoneySum);
}

function showLinkBetInfo(index){
	var html = ''
	for(var i = 0; i < betData.orderList[index].orderDetailList.length; i++){
		html += '<div>' + betData.orderList[index].orderDetailList[i] + '</div>'
	}
	$("#betInfoTable .systemCont").html(html).show();
	$("#betListTable, .ctrlPanel").hide();
	$("#betInfoTable").show();
}

function showBetListTable(){
	$("#betInfoTable").hide();
	$("#betListTable, .ctrlPanel").show();
}