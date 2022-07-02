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
		betMoneySum += Number(betData[i].betAmount)
		recedeMoneySum += Number(betData[i].returnAmount)
		var className = ''
		infoHtml = '<td class="infoCell"><div class="infoCell clickInfo' + className + '" title="' + betData[i].betContent + '" onclick="showLinkBetInfo(' + i + ',' + betData[i].id + ')">' + betData[i].betContent + '</div></td>';
		html += '<tr>'
				+ '<td class="numCell"><div class="' + className + '">' + betData[i].id + '</div></td>'
				+ '<td class="timeCell"><div class="' + className + '">' + betData[i].createTime + '</div></td>'
				+ infoHtml
				+ '<td class="moneyCell"><div class="' + className + '">' + betData[i].betAmount + '</div></td>'
				+ '<td class="oddsCell"><div class="oddsCell' + className + '" title="' + betData[i].betOdds + '">' + betData[i].betOdds + '</div></td>'
				+ '<td class="winCell"><div class="' + className + '">' + betData[i].betWinAmount + '</div></td>'
				+ '<td class="feedbackCell"><div class="' + className + '">' + betData[i].returnAmount + '</div></td>'
			+ '</tr>';
	}
	$(".systemCont").html(html);
	$(".statisticsRow .sumCell").text("小计（" + betData.length + "笔）");
	$(".statisticsRow .moneyCell").text(betMoneySum.toFixed(2));
	$(".statisticsRow .feedbackCell").text(recedeMoneySum.toFixed(2));
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
		}
	})
}

function showBetListTable(){
	$("#betInfoTable").hide();
	$("#betListTable, .ctrlPanel").show();
}