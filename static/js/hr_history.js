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
		token: window.top.token,
		gameId: localStorage.getItem('gameId'),
		current: page,
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
			console.log(res)
			historyData = res.data;
			setPage(historyData.total, page);
		}
	})
	// Send(httpUrlData.listLotteryResult, data, function(obj){
	// })
}

var getCurDataTimer = null;
function updateHistoryData(){
	var isGetData = false;
	var html = '';
	console.log(historyData.records)
	for(var i = 0; i < historyData.records.length; i++){
		var numArr = [0]
		var infoArr = [1]
		var item = historyData.records[i]
		html += '<div class="row">'
				+ '<div class="cell dateCell">' + item.createTime + '</div>'
				+ '<div class="cell issueCell">' + item.gamePeriod + '</div>'
				+ '<div class="cell numBallCell"><div class="' + 'Ball">' + item.openNum1 + '</div></div>'
				+ '<div class="cell numAnimalCell">' + item.sxOpenNum1 + '</div>';
		// if(numArr.length > 1)
			html += '<div class="cell numBallCell"><div class="' + 'Ball">' + item.openNum2 + '</div></div>'
					+ '<div class="cell numAnimalCell">' + item.sxOpenNum2 + '</div>';
		// else
		// 	html += '<div class="cell numBallCell"></div>'
		// 			+ '<div class="cell numAnimalCell"></div>';
		// if(numArr.length > 2)
			html += '<div class="cell numBallCell"><div class="' +'Ball">' + item.openNum3 + '</div></div>'
					+ '<div class="cell numAnimalCell">' + item.sxOpenNum3 + '</div>';
		// else
		// 	html += '<div class="cell numBallCell"></div>'
		// 			+ '<div class="cell numAnimalCell"></div>';
		// if(numArr.length > 3)
			html += '<div class="cell numBallCell"><div class="' + 'Ball">' + item.openNum4 + '</div></div>'
					+ '<div class="cell numAnimalCell">' + item.sxOpenNum4 + '</div>';
		// else
		// 	html += '<div class="cell numBallCell"></div>'
		// 			+ '<div class="cell numAnimalCell"></div>';
		// if(numArr.length > 4)
			html += '<div class="cell numBallCell"><div class="' +  'Ball">' + item.openNum5 + '</div></div>'
					+ '<div class="cell numAnimalCell">' + item.sxOpenNum5 + '</div>';
		// else
		// 	html += '<div class="cell numBallCell"></div>'
		// 			+ '<div class="cell numAnimalCell"></div>';
		// if(numArr.length > 5)
			html += '<div class="cell numBallCell"><div class="' +  'Ball">' + item.openNum6 + '</div></div>'
					+ '<div class="cell numAnimalCell">' + item.sxOpenNum6 + '</div>';
		// else
			// html += '<div class="cell numBallCell"></div>'
		// 			+ '<div class="cell numAnimalCell"></div>';
		html += '<div class="cell addCell">+</div>'
		// if(numArr.length > 6)
			html += '<div class="cell specialNumCell"><div class="' + 'Ball">' + item.xiao + '</div></div>'
					+ '<div class="cell specialAnimalCell">' + item.xiao + '</div>'
		// else
		// 	html += '<div class="cell numBallCell"></div>'
		// 			+ '<div class="cell specialAnimalCell"></div>';
		html += '<div class="cell animalTypeCell">' + item.poultryBeast + '</div>'
			+ '<div class="cell sumCell">' + item.totalScore + '</div>'
			+ '<div class="cell sNumOeCell">' + item.temaDS + '</div>'
			+ '<div class="cell sNumBsCell">' + item.temaDX + '</div>'
			+ '<div class="cell aNumOeCell">' + item.andDS + '</div>'
			+ '<div class="cell sumOeCell">' + item.totalDX + '</div>'
			+ '<div class="cell sumBsCell">' + item.totalDX + '</div>'
			+ '</div>';
		if(numArr.length < 7 || infoArr.length < 12)
			isGetData = true;
	}
	$(".systemCont").html(html);
	// if(isGetData)
		// getCurDataTimer = setTimeout(function(){
		// 	getHistoryData(0)
		// }, 1000)
}