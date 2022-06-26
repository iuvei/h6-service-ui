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
		url: serverMap[httpUrlData.listBetDetailList.server] + httpUrlData.listBetDetail.url,
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
	// var data = {
	// 	token: window.top.token,
	// 	gameID: window.top.gameArr[window.top.curIndex].id,
	// 	page: page,
	// 	pageSize: 50
	// }
	// Send(httpUrlData.listBetDetail, data, function(obj){
	// 	betData = obj;
	// 	setPage(obj.totalCount, page);
	// })
}

function updateBetDetailData(){
	var html = '';
	var recedeMoneySum = 0;
	var betMoneySum = 0;
		var infoHtml = '';
	for(var i = 0; i < betData.orderList.length; i++){
		var className = betData.orderList[i].status == 3 || betData.orderList[i].status == -1 ? " cancelInfo" : "";
		if(betData.orderList[i].orderDetailList.length > 0)
			infoHtml = '<td class="infoCell"><div class="infoCell clickInfo' + className + '" title="' + betData.orderList[i].betContent + '" onclick="showLinkBetInfo(' + i + ')">' + betData.orderList[i].betContent + '</div></td>';
		else
			infoHtml = '<td class="infoCell"><div class="infoCell' + className + '" title="' + betData.orderList[i].betContent + '">' + betData.orderList[i].betContent + '</div></td>';
		html += '<tr>'
				+ '<td class="numCell"><div class="' + className + '">' + betData.orderList[i].orderNum + '</div></td>'
				+ '<td class="timeCell"><div class="' + className + '">' + betData.orderList[i].betTime + '</div></td>'
				+ infoHtml
				+ '<td class="moneyCell"><div class="' + className + '">' + betData.orderList[i].betMoney + '</div></td>'
				+ '<td class="oddsCell"><div class="oddsCell' + className + '" title="' + betData.orderList[i].rate + '">' + betData.orderList[i].rate + '</div></td>'
				+ '<td class="winCell"><div class="' + className + '">' + betData.orderList[i].willWinMoney + '</div></td>'
				+ '<td class="feedbackCell"><div class="' + className + '">' + betData.orderList[i].recedeMoney + '</div></td>'
			+ '</tr>';
	}
	$(".systemCont").html(html);
	$(".statisticsRow .sumCell").text("小计（" + betData.orderList.length + "笔）");
	$(".statisticsRow .moneyCell").text(betData.pageBetMoney);
	$(".statisticsRow .feedbackCell").text(betData.pageRecedeMoney);
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