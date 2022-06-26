var historyData = {};
var dateArr = [];
$(function(){
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

function listDailyLedger(beginDate, endDate) {
	console.log(window.top.lotteryData)
	var data = {
    "startTime": beginDate,
    "endTime": endDate,
    "userId": window.top.lotteryData.userId,
    "gameId": localStorage.getItem('gameId') || 1,
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
			var className = '';
			if (obj.length > 0) {
				obj.forEach(function(item) {
					className = item.ctTotal > 0 ? " redFont" : "";
					html += '<tr>'
							+ '<td class="dateCell"><a class="accountDate" href="#" onclick="listClearedOrder(' + item.gamePeriod + ',' + item.createTime + ')">' + item.createTime + '</a></td>'
							+ '<td class="issueCell">' + item.gamePeriod + '</td>'
							+ '<td class="allCountCell">' + (item.ctPeriod || 0) + '</td>'
							+ '<td class="allMoneyCell">' + item.ctBalance + '</td>'
							+ '<td class="allFeedbackCell">' + item.ctAmt + '</td>'
							+ '<td class="allwinCell">' + item.ctTotal + '</td>'
						+ '</tr>'
				})
				html += '<tr>'
						+ '<td class="dateCell"></td>'
						+ '<td class="issueCell"></td>'
						+ '<td class="allCountCell"></td>'
						+ '<td class="allMoneyCell"></td>'
						+ '<td class="allFeedbackCell"></td>'
						+ '<td class="allwinCell"></td>'
					+ '</tr>'
				className = obj[obj.length - 1].ctTotal > 0 ? " redFont" : "";
				html += '<tr>'
						+ '<td class="dateCell"></td>'
						+ '<td class="issueCell">总计</td>'
						+ '<td class="allCountCell">' + arr2Sum('ctPeriod', obj) + '</td>'
						+ '<td class="allMoneyCell">' + arr2Sum('ctBalance', obj) + '</td>'
						+ '<td class="allFeedbackCell">' + arr2Sum('ctAmt', obj) + '</td>'
						+ '<td class="allwinCell">' + arr2Sum('ctTotal', obj) + '</td>'
					+ '</tr>'
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
    "gameId": localStorage.getItem('gameId') || 1,
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
				html += '<tr>'
						+ '<td class="issueCell">' + item.gamePeriod + '</td>'
						+ '<td class="timeCell">' + item.createTime + '</td>'
						+ '<td class="betInfoCell"><div class="betInfoCell" title="' + item.content + '">' + item.content + '</div></td>'
						+ '<td class="betMoneyCell">' + item.transactionsBalance + '</td>'
						+ '<td class="oddCell"><div class="oddCell" title="' + item.oddsDetails + '">' + item.oddsDetails + '</div></td>'
						+ '<td class="feedbackCell">' + item.ty + '</td>'
						+ '<td class="winCell' + winClassName + '">' + item.yk + '</td>'
					+ '</tr>'
			})
			$("#issueTable").hide();
			$("#betTable .systemCont").html(html);
			$("#betTable").show();
		}
	})
}