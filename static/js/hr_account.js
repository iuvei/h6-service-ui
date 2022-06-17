var historyData = {};
var dateArr = [];
$(function(){
	console.log()
	var date = new Date();
	date.setTime(new Date().getTime());
	date.setDate(date.getDate() - 32)
	var dateStr = "";
	var status = "";
	var beginHtml = '';
	var endHtml = '';
	for(var i = 0; i < 32; i++){
		date.setDate(date.getDate() + 1)
		dateStr = DateFormat(date, "yyyy-MM-dd");
		dateArr.push(dateStr);
		status = i == 0 ? ' selected="selected"' : ''
		beginHtml += '<option value="' + i + '"' + status + '>' + dateStr + '</option>';
		status = i == 32 - 1 ? ' selected="selected"' : ''
		endHtml += '<option value="' + i + '"' + status + '>' + dateStr + '</option>';
	}
	$("#beginDate").empty().append(beginHtml);
	$("#endDate").empty().append(endHtml);
	findAccountData();
})

function findAccountData(){
	var beginIndex = $("#beginDate").val();
	var endIndex = $("#endDate").val();
	listDailyLedger(dateArr[beginIndex], dateArr[endIndex])
}

function findCurWeekAccountData(){
	var beginDate = new Date();
	var day = beginDate.getDay();
	var minusDay = day == 0 ? 6 : day - 1;
	beginDate.setDate(beginDate.getDate() - minusDay)
	var endDate = new Date();
	listDailyLedger(DateFormat(beginDate, "yyyy-MM-dd"), DateFormat(endDate, "yyyy-MM-dd"))
}

function findLastWeekAccountData(){
	var beginDate = new Date();
	var day = beginDate.getDay();
	var minusDay = day == 0 ? 6 : day - 1;
	beginDate.setDate(beginDate.getDate() - minusDay - 7)
	var endDate = new Date(beginDate.getTime());
	endDate.setDate(beginDate.getDate() + 6)
	listDailyLedger(DateFormat(beginDate, "yyyy-MM-dd"), DateFormat(endDate, "yyyy-MM-dd"))
}

function listDailyLedger(beginDate, endDate){
	var data = {
    "startTime": beginDate,
    "endTime": endDate,
    "userId": window.top.lotteryData.userId,
    "gameId":"1"
	}
	$.ajax({
		type : 'post',
		url : serverMap[httpUrlData.listDailyLedger.server] + httpUrlData.listDailyLedger.url,
		data : JSON.stringify(data),
		dataType : "json",
		contentType: 'application/json;charset=UTF-8',
		async : true,
		timeout : 30000,
		headers: {
			Authorization: localStorage.getItem('token')
		},
		success(obj) {
			var html = '';
			var className = "";
			if (obj.length > 0) {
				obj.forEach(function(item) {
					console.log(item)
					className = item.ctTotal > 0 ? " redFont" : "";
					html += '<div class="row">'
						+ '<div class="cell dateCell"><a class="accountDate" href="#" onclick="listClearedOrder(' + item.gamePeriod + ',' + item.createTime + ')">' + item.createTime + '</a></div>'
						+ '<div class="cell issueCell">' + item.gamePeriod + '</div>'
						+ '<div class="cell allCountCell">' + (item.ctPeriod || 0) + '</div>'
						+ '<div class="cell allMoneyCell">' + item.ctBalance + '</div>'
						+ '<div class="cell allFeedbackCell">' + item.ctAmt + '</div>'
						+ '<div class="cell allwinCell' + className + '">' + item.ctTotal + '</div>'
					+ '</div>'
				})
				html += '<div class="row">'
						+ '<div class="cell dateCell"></div>'
						+ '<div class="cell issueCell"></div>'
						+ '<div class="cell allCountCell"></div>'
						+ '<div class="cell allMoneyCell"></div>'
						+ '<div class="cell allFeedbackCell"></div>'
						+ '<div class="cell allwinCell"></div>'
					+ '</div>'
				className = obj[obj.length - 1].ctTotal > 0 ? " redFont" : "";
				html += '<div class="row">'
						+ '<div class="cell dateCell"></div>'
						+ '<div class="cell issueCell">总计</div>'
						+ '<div class="cell allCountCell">' + arr2Sum('ctPeriod', obj) + '</div>'
						+ '<div class="cell allMoneyCell">' + arr2Sum('ctBalance', obj) + '</div>'
						+ '<div class="cell allFeedbackCell">' + arr2Sum('ctAmt', obj) + '</div>'
						+ '<div class="cell allwinCell">' + arr2Sum('ctTotal', obj) + '</div>'
					+ '</div>'
			}
			$("#betTable").hide();
			$("#issueTable .systemCont").html(html);
			$("#issueTable").show();

		}
	})
}

function arr2Sum(key, arr) {
	var sum = 0
	let data = arr.map(function(item) { return Number(item[key]) })
	for (let k of data) {
		sum += k
	}
	return sum
}
function listClearedOrder(gamePeriod, date){
	var data = {
    "gameId":"1",
    "userId": window.top.lotteryData.userId,
    "gamePeriod": gamePeriod
	}
	$.ajax({
		type : 'post',
		url : serverMap[httpUrlData.listBetDetail.server] + httpUrlData.listBetDetail.url,
		data : JSON.stringify(data),
		dataType : "json",
		contentType: 'application/json;charset=UTF-8',
		async : true,
		timeout : 30000,
		headers: {
			Authorization: localStorage.getItem('token')
		},
		success(obj) {
			var html = '';
			obj.forEach(function(item) {
				var winClassName = item.yk > 0 ? " redFont" : "";
				html += '<div class="row">'
					+ '<div class="cell issueCell">' + item.gamePeriod + '</div>'
					+ '<div class="cell timeCell">' + item.createTime + '</div>'
					+ '<div class="cell betInfoCell" title="' + item.content + '">' + item.content + '</div>'
					+ '<div class="cell betMoneyCell">' + item.transactionsBalance + '</div>'
					+ '<div class="cell oddCell" title="' + item.oddsDetails + '">' + item.oddsDetails + '</div>'
					+ '<div class="cell feedbackCell">' + item.ty + '</div>'
					+ '<div class="cell winCell' + winClassName + '">' + item.yk + '</div>'
				+ '</div>'
			})
			$("#issueTable").hide();
			$("#betTable .systemCont").html(html);
			$("#betTable").show();
		}
	})
}