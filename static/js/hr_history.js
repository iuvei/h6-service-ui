var historyData = {};

$(function(){
	initPage(getHistoryData, updateHistoryData, 10, 20)
	getHistoryData(0);
})

function getHistoryData(page){
	// if(page != 0 && getCurDataTimer != null){
	// 	clearTimeout(getCurDataTimer);
	// 	getCurDataTimer = null;
	// }
	var data = {
		gameId: localStorage.getItem('gameId') || 1,
		current: page + 1,
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
			if (res.responseJSON && res.responseJSON.error) {
        alert(res.responseJSON.error)
      }
    }
	})
}

function formatNum(val) {
	return ((val && val.length === 1 && val < 10) ? '0' + val : val)
}
var getCurDataTimer = null;
function updateHistoryData(){
	var isGetData = false;
	var html = '';
	for(var i = 0; i < historyData.records.length; i++){
		var item = historyData.records[i]
		var numArr = [formatNum(item.openNum1), formatNum(item.openNum2), formatNum(item.openNum3), formatNum(item.openNum4), formatNum(item.openNum5), formatNum(item.openNum6), formatNum(item.openNum)]
		console.log(numArr[3])
		var infoArr = [item.sxOpenNum1, item.sxOpenNum2, item.sxOpenNum3, item.sxOpenNum4, item.sxOpenNum5, item.sxOpenNum6, item.xiao, item.poultryBeast, item.temaDS, item.temaDX, item.andDS, item.totalDS, item.totalDX]
		html += '<div class="row">'
				+ '<div class="cell dateCell">' + item.openTime + '</div>'
				+ '<div class="cell issueCell">' + item.gamePeriod + '</div>'
				+ '<div class="cell numBallCell"><div class="' + (numArr[0] && ballInfoObj[numArr[0]].color) + 'Ball">' + numArr[0] + '</div></div>'
				+ '<div class="cell numAnimalCell">' + infoArr[0] + '</div>';
		if(numArr.length > 1)
			html += '<div class="cell numBallCell"><div class="' + (numArr[1] && ballInfoObj[numArr[1]].color) + 'Ball">' + numArr[1] + '</div></div>'
					+ '<div class="cell numAnimalCell">' + infoArr[1] + '</div>';
		else
			html += '<div class="cell numBallCell"></div>'
					+ '<div class="cell numAnimalCell"></div>';
		if(numArr.length > 2)
			html += '<div class="cell numBallCell"><div class="' + (numArr[2] && ballInfoObj[numArr[2]].color) + 'Ball">' + numArr[2] + '</div></div>'
					+ '<div class="cell numAnimalCell">' + infoArr[2] + '</div>';
		else
			html += '<div class="cell numBallCell"></div>'
					+ '<div class="cell numAnimalCell"></div>';
		if(numArr.length > 3)
			html += '<div class="cell numBallCell"><div class="' + ( numArr[3] && ballInfoObj[numArr[3]].color) + 'Ball">' + numArr[3] + '</div></div>'
					+ '<div class="cell numAnimalCell">' + infoArr[3] + '</div>';
		else
			html += '<div class="cell numBallCell"></div>'
					+ '<div class="cell numAnimalCell"></div>';
		if(numArr.length > 4)
			html += '<div class="cell numBallCell"><div class="' + (numArr[4] && ballInfoObj[numArr[4]].color) + 'Ball">' + numArr[4] + '</div></div>'
					+ '<div class="cell numAnimalCell">' + infoArr[4] + '</div>';
		else
			html += '<div class="cell numBallCell"></div>'
					+ '<div class="cell numAnimalCell"></div>';
		if(numArr.length > 5)
			html += '<div class="cell numBallCell"><div class="' + (numArr[5] && ballInfoObj[numArr[5]].color) + 'Ball">' + numArr[5] + '</div></div>'
					+ '<div class="cell numAnimalCell">' + infoArr[5] + '</div>';
		else
			html += '<div class="cell numBallCell"></div>'
					+ '<div class="cell numAnimalCell"></div>';
		html += '<div class="cell addCell">+</div>'
		if(numArr.length > 6)
			html += '<div class="cell specialNumCell"><div class="' + (numArr[6] && ballInfoObj[numArr[6]].color) + 'Ball">' + numArr[6] + '</div></div>'
					+ '<div class="cell specialAnimalCell">' + infoArr[6] + '</div>'
		else
			html += '<div class="cell numBallCell"></div>'
					+ '<div class="cell specialAnimalCell"></div>';
		html += '<div class="cell animalTypeCell">' + (infoArr.length > 7 ? infoArr[7] : ' ') + '</div>'
			+ '<div class="cell sumCell">' + item.totalScore + '</div>'
			+ '<div class="cell sNumOeCell">' + (infoArr.length > 8 ? infoArr[8] : ' ') + '</div>'
			+ '<div class="cell sNumBsCell">' + (infoArr.length > 9 ? infoArr[9] : ' ') + '</div>'
			+ '<div class="cell aNumOeCell">' + (infoArr.length > 10 ? infoArr[10] : ' ') + '</div>'
			+ '<div class="cell sumOeCell">' + (infoArr.length > 11 ? infoArr[11] : ' ') + '</div>'
			+ '<div class="cell sumBsCell">' + (infoArr.length > 12 ? infoArr[12] : ' ') + '</div>'
			+ '</div>';
		if(numArr.length < 7 || infoArr.length < 12)
			isGetData = true;
	}
	$(".systemCont").html(html);
	if(isGetData)
		getCurDataTimer = setTimeout(function(){
			getHistoryData(0)
		}, 1000)
} 