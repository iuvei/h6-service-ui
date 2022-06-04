var historyData = {};
var dateArr = [];
$(function(){
	var date = new Date();
	date.setTime(window.top.lotteryData.systemTime);
	date.setDate(date.getDate() - window.top.lotteryData.billDays)
	var dateStr = "";
	var status = "";
	var beginHtml = '';
	var endHtml = '';
	for(var i = 0; i < window.top.lotteryData.billDays; i++){
		date.setDate(date.getDate() + 1)
		dateStr = DateFormat(date, "yyyy-MM-dd");
		dateArr.push(dateStr);
		status = i == 0 ? ' selected="selected"' : ''
		beginHtml += '<option value="' + i + '"' + status + '>' + dateStr + '</option>';
		status = i == window.top.lotteryData.billDays - 1 ? ' selected="selected"' : ''
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
		token: window.top.token,
		gameID: window.top.gameArr[window.top.curIndex].id,
		beginDate: beginDate,
		endDate: endDate
	}
	Send(httpUrlData.listDailyLedger, data, function(obj){
		var html = '';
		var className = '';
		for(var i = 0; i < obj.dailyLedgerList.length - 1; i++){
			var dateStrArr = obj.dailyLedgerList[i].date.split("星期")
			className = obj.dailyLedgerList[i].winMoney > 0 ? ' red' : '';
			html += '<tr>'
					+ '<td class="dateCell"><a class="accountDate" href="#" onclick="listClearedOrder(' + data.gameID + ', \'' + dateStrArr[0] + '\')">' + obj.dailyLedgerList[i].date + '</a></td>'
					+ '<td class="issueCell">' + obj.dailyLedgerList[i].issue + '</td>'
					+ '<td class="allCountCell">' + obj.dailyLedgerList[i].betCount + '</td>'
					+ '<td class="allMoneyCell">' + obj.dailyLedgerList[i].betMoney + '</td>'
					+ '<td class="allFeedbackCell">' + obj.dailyLedgerList[i].recedeMoney + '</td>'
					+ '<td class="allwinCell' + className + '">' + obj.dailyLedgerList[i].winMoney + '</td>'
				+ '</tr>'
		}
		html += '<tr>'
				+ '<td class="dateCell"></td>'
				+ '<td class="issueCell"></td>'
				+ '<td class="allCountCell"></td>'
				+ '<td class="allMoneyCell"></td>'
				+ '<td class="allFeedbackCell"></td>'
				+ '<td class="allwinCell"></td>'
			+ '</tr>'
		className = obj.dailyLedgerList[obj.dailyLedgerList.length - 1].winMoney > 0 ? ' red' : '';
		html += '<tr>'
				+ '<td class="dateCell"></td>'
				+ '<td class="issueCell">总计</td>'
				+ '<td class="allCountCell">' + obj.dailyLedgerList[obj.dailyLedgerList.length - 1].betCount + '</td>'
				+ '<td class="allMoneyCell">' + obj.dailyLedgerList[obj.dailyLedgerList.length - 1].betMoney + '</td>'
				+ '<td class="allFeedbackCell">' + obj.dailyLedgerList[obj.dailyLedgerList.length - 1].recedeMoney + '</td>'
				+ '<td class="allwinCell' + className + '">' + obj.dailyLedgerList[obj.dailyLedgerList.length - 1].winMoney + '</td>'
			+ '</tr>'
		$("#betTable").hide();
		$("#issueTable .systemCont").html(html);
		$("#issueTable").show();
	})
}

function listClearedOrder(id, date){
	var data = {
		token: window.top.token,
		gameID: id,
		date: date
	}
	Send(httpUrlData.listClearedOrder, data, function(obj){
		var html = '';
		for(var i = 0; i < obj.orderList.length; i++){
			var className = obj.orderList[i].status == 3 || obj.orderList[i].status == -1 ? " cancelInfo" : "";
			var winClassName = obj.orderList[i].winMoney > 0 ? " red" : "";
			html += '<tr>'
					+ '<td class="issueCell' + className + '">' + obj.orderList[i].issue + '</td>'
					+ '<td class="timeCell' + className + '">' + obj.orderList[i].betTime + '</td>'
					+ '<td class="betInfoCell"><div class="betInfoCell' + className + '" title="' + obj.orderList[i].betContent + '">' + obj.orderList[i].betContent + '</div></td>'
					+ '<td class="betMoneyCell' + className + '">' + obj.orderList[i].betMoney + '</td>'
					+ '<td class="oddCell"><div class="oddCell' + className + '" title="' + obj.orderList[i].rate + '">' + obj.orderList[i].rate + '</div></td>'
					+ '<td class="feedbackCell' + className + '">' + obj.orderList[i].recedeMoney + '</td>'
					+ '<td class="winCell' + className + winClassName + '">' + obj.orderList[i].winMoney + '</td>'
				+ '</tr>'
		}
		$("#issueTable").hide();
		$("#betTable .systemCont").html(html);
		$("#betTable").show();
	})
}