var betData = {};
var total = 0
$(function(){
	initPage(getBetDetailData, updateBetDetailData, 10, 20)
	getBetDetailData(0);
})

function getBetDetailData(page){
	var data = {
		"gameId": localStorage.getItem('gameId') || 1,
		"amount":0,
		current: page + 1,
		size: 20
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
			betData = res.records;
			total = res.total
			setPage(total, page);
		},
    error(res) {
			if (res.responseJSON && res.responseJSON.error) {
        alert(res.responseJSON.error)
      }
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
		infoHtml = '<td class="infoCell"><div class="infoCell' + className + (betData[i].isClick === 1 ? ' clickInfo ' : '') + '" title="' + betData[i].betContent + '" onclick="showLinkBetInfo(' + i + ',' + betData[i].id + ',' + betData[i].isClick + ')">' + betData[i].betContent + '</div></td>';
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
	$(".statisticsRow .sumCell").text("小计（" + (total || 0) + "笔）");
	$(".statisticsRow .moneyCell").text(betMoneySum.toFixed(2));
	$(".statisticsRow .feedbackCell").text(recedeMoneySum.toFixed(2));
}

function showLinkBetInfo(index, id, flag){
	if (flag != 1) return
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
			if (res.responseJSON && res.responseJSON.error) {
        alert(res.responseJSON.error)
      }
    }
	})
}

function showBetListTable(){
	$("#betInfoTable").hide();
	$("#betListTable, .ctrlPanel").show();
}