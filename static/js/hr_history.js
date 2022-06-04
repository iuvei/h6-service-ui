var historyData = {};

$(function(){
	initPage(getHistoryData, updateHistoryData, 10, 20)
	getHistoryData(0);
})

function getHistoryData(page){
	if(page != 0 && getCurDataTimer != null){
		clearTimeout(getCurDataTimer);
		getCurDataTimer = null;
	}
	var data = {
		token: window.top.token,
		gameID: window.top.gameArr[window.top.curIndex].id,
		page: page,
		pageSize: 20
	}
	Send(httpUrlData.listLotteryResult, data, function(obj){
		historyData = obj;
		setPage(obj.total, page);
	})
}

var getCurDataTimer = null;
function updateHistoryData(){
	var isGetData = false;
	var html = '';
	for(var i = 0; i < historyData.lotteryResultList.length; i++){
		var numArr = historyData.lotteryResultList[i].resultNum.split(",");
		var infoArr = historyData.lotteryResultList[i].resultInfo.split(",");
		html += '<div class="row">'
				+ '<div class="cell dateCell">' + historyData.lotteryResultList[i].resultDate + '</div>'
				+ '<div class="cell issueCell">' + historyData.lotteryResultList[i].issue + '</div>'
				+ '<div class="cell numBallCell"><div class="' + ballInfoObj[numArr[0]].color + 'Ball">' + numArr[0] + '</div></div>'
				+ '<div class="cell numAnimalCell">' + infoArr[0] + '</div>';
		if(numArr.length > 1)
			html += '<div class="cell numBallCell"><div class="' + ballInfoObj[numArr[1]].color + 'Ball">' + numArr[1] + '</div></div>'
					+ '<div class="cell numAnimalCell">' + infoArr[1] + '</div>';
		else
			html += '<div class="cell numBallCell"></div>'
					+ '<div class="cell numAnimalCell"></div>';
		if(numArr.length > 2)
			html += '<div class="cell numBallCell"><div class="' + ballInfoObj[numArr[2]].color + 'Ball">' + numArr[2] + '</div></div>'
					+ '<div class="cell numAnimalCell">' + infoArr[2] + '</div>';
		else
			html += '<div class="cell numBallCell"></div>'
					+ '<div class="cell numAnimalCell"></div>';
		if(numArr.length > 3)
			html += '<div class="cell numBallCell"><div class="' + ballInfoObj[numArr[3]].color + 'Ball">' + numArr[3] + '</div></div>'
					+ '<div class="cell numAnimalCell">' + infoArr[3] + '</div>';
		else
			html += '<div class="cell numBallCell"></div>'
					+ '<div class="cell numAnimalCell"></div>';
		if(numArr.length > 4)
			html += '<div class="cell numBallCell"><div class="' + ballInfoObj[numArr[4]].color + 'Ball">' + numArr[4] + '</div></div>'
					+ '<div class="cell numAnimalCell">' + infoArr[4] + '</div>';
		else
			html += '<div class="cell numBallCell"></div>'
					+ '<div class="cell numAnimalCell"></div>';
		if(numArr.length > 5)
			html += '<div class="cell numBallCell"><div class="' + ballInfoObj[numArr[5]].color + 'Ball">' + numArr[5] + '</div></div>'
					+ '<div class="cell numAnimalCell">' + infoArr[5] + '</div>';
		else
			html += '<div class="cell numBallCell"></div>'
					+ '<div class="cell numAnimalCell"></div>';
		html += '<div class="cell addCell">+</div>'
		if(numArr.length > 6)
			html += '<div class="cell specialNumCell"><div class="' + ballInfoObj[numArr[6]].color + 'Ball">' + numArr[6] + '</div></div>'
					+ '<div class="cell specialAnimalCell">' + infoArr[6] + '</div>'
		else
			html += '<div class="cell numBallCell"></div>'
					+ '<div class="cell specialAnimalCell"></div>';
		html += '<div class="cell animalTypeCell">' + (infoArr.length > 7 ? infoArr[7] : ' ') + '</div>'
			+ '<div class="cell sumCell">' + historyData.lotteryResultList[i].sum + '</div>'
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