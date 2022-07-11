var historyData = {};

$(function(){
	initPage(getHistoryData, updateHistoryData, 10, 20)
	getHistoryData(0);
})

function getHistoryData(page){
	var data = {
		token: window.top.token,
		gameId: localStorage.getItem('gameId') || 1,
		current: page,
		// masterId: localStorage.getItem('gameId') == 1 ? sessionStorage.getItem('masterId') : 0,
		size: 20
	}
	$.ajax({
		type: 'post',
		url: serverMap[httpUrlData.listLotteryResult.server] + httpUrlData.listLotteryResult.url,
		data: JSON.stringify(data),
		contentType: 'application/json;charset=UTF-8',
		async : true,
		timeout : 30000,
		headers: {
			Authorization: localStorage.getItem('token')
		},
		success(res) {
			historyData = res.data;
			setPage(historyData.total, page);
		},
    error(res) {
      alert(res.responseJSON.error)
    }
	})
}

var getCurDataTimer = null;
function formatNum(val) {
	return val < 10 ? '0' + val : val
}
function updateHistoryData(){
	var isGetData = false;
	var html = '';
	for(var i = 0; i < historyData.records.length; i++){
		var item = historyData.records[i]
		var numArr = [formatNum(item.openNum1), formatNum(item.openNum2), formatNum(item.openNum3), formatNum(item.openNum4), formatNum(item.openNum5), formatNum(item.openNum6), formatNum(item.openNum)]
		var infoArr = [item.sxOpenNum1, item.sxOpenNum2, item.sxOpenNum3, item.sxOpenNum4, item.sxOpenNum5, item.sxOpenNum6, item.xiao, item.poultryBeast, item.temaDS, item.temaDX, item.andDS, item.totalDS, item.totalDX]
		html += '<tr>'
				+ '<td class="dateCell">' + item.createTime + '</td>'
				+ '<td class="issueCell">' + item.gamePeriod + '</td>'
				+ '<td class="numBallCell"><div class="' + ballInfoObj[numArr[0]].color + 'Ball">' + numArr[0] + '</div></td>'
				+ '<td class="numAnimalCell">' + infoArr[0] + '</td>';
		if(numArr.length > 1)
			html += '<td class="numBallCell"><div class="' + ballInfoObj[numArr[1]].color + 'Ball">' + numArr[1] + '</div></td>'
					+ '<td class="numAnimalCell">' + infoArr[1] + '</td>';
		else
			html += '<td class="numBallCell"></td>'
					+ '<td class="numAnimalCell"></td>';
		if(numArr.length > 2)
			html += '<td class="numBallCell"><div class="' + ballInfoObj[numArr[2]].color + 'Ball">' + numArr[2] + '</div></td>'
					+ '<td class="numAnimalCell">' + infoArr[2] + '</td>';
		else
			html += '<td class="numBallCell"></td>'
					+ '<td class="numAnimalCell"></td>';
		if(numArr.length > 3)
			html += '<td class="numBallCell"><div class="' + ballInfoObj[numArr[3]].color + 'Ball">' + numArr[3] + '</div></td>'
					+ '<td class="numAnimalCell">' + infoArr[3] + '</td>';
		else
			html += '<td class="numBallCell"></td>'
					+ '<td class="numAnimalCell"></td>';
		if(numArr.length > 4)
			html += '<td class="numBallCell"><div class="' + ballInfoObj[numArr[4]].color + 'Ball">' + numArr[4] + '</div></td>'
					+ '<td class="numAnimalCell">' + infoArr[4] + '</td>';
		else
			html += '<td class="numBallCell"></td>'
					+ '<td class="numAnimalCell"></td>';
		if(numArr.length > 5)
			html += '<td class="numBallCell"><div class="' + ballInfoObj[numArr[5]].color + 'Ball">' + numArr[5] + '</div></td>'
					+ '<td class="numAnimalCell">' + infoArr[5] + '</td>';
		else
			html += '<td class="numBallCell"></td>'
					+ '<td class="numAnimalCell"></td>';
		html += '<td class="addCell">+</td>'
		if(numArr.length > 6)
			html += '<td class="specialNumCell"><div class="' + ballInfoObj[numArr[6]].color + 'Ball">' + numArr[6] + '</div></td>'
					+ '<td class="specialAnimalCell">' + infoArr[6] + '</td>'
		else
			html += '<td class="numBallCell"></td>'
					+ '<td class="specialAnimalCell"></td>';
		html += '<td class="animalTypeCell">' + (infoArr.length > 7 ? infoArr[7] : ' ') + '</td>'
			+ '<td class="sumCell">' + item.totalScore + '</td>'
			+ '<td class="sNumOeCell">' + (infoArr.length > 8 ? infoArr[8] : ' ') + '</td>'
			+ '<td class="sNumBsCell">' + (infoArr.length > 9 ? infoArr[9] : ' ') + '</td>'
			+ '<td class="aNumOeCell">' + (infoArr.length > 10 ? infoArr[10] : ' ') + '</td>'
			+ '<td class="sumOeCell">' + (infoArr.length > 11 ? infoArr[11] : ' ') + '</td>'
			+ '<td class="sumBsCell">' + (infoArr.length > 12 ? infoArr[12] : ' ') + '</td>'
			+ '</tr>';
		if(numArr.length < 7 || infoArr.length < 12)
			isGetData = true;
	}
	$(".systemCont").html(html);
	if(isGetData)
		getCurDataTimer = setTimeout(function(){
			getHistoryData(0)
		}, 1000)
}