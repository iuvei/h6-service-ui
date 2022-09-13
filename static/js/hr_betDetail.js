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
			setPage(res.total, page);
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
		var className =  ""
		// cancelInfo 删除线
		betMoneySum += Number(betData[i].betAmount)
		recedeMoneySum += Number(betData[i].returnAmount)
		infoHtml = '<div class="cell infoCell' + className + (betData[i].isClick === 1 ? ' clickCell ' : '') + '" title="' + betData[i].betContent + '" onclick="showLinkBetInfo(\'' + betData[i].id + '\',' + betData[i].isClick + ')">' + betData[i].betContent + '</div>';
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
	$(".statisticsRow .sumCell").text("小计（" + (total || 0) + "笔）");
	$(".statisticsRow .moneyCell").text(betMoneySum.toFixed(2));
	$(".statisticsRow .feedbackCell").text(recedeMoneySum.toFixed(2));
}

function showLinkBetInfo(id, flag){
	var html = ''
	if (flag != 1) return
	var data = {
		"gameId": localStorage.getItem('gameId') || 1,
		"commandId": id
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