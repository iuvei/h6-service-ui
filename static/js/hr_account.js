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
		var className = "";
		for(var i = 0; i < obj.dailyLedgerList.length - 1; i++){
			var dateStrArr = obj.dailyLedgerList[i].date.split("星期")
			className = obj.dailyLedgerList[i].winMoney > 0 ? " redFont" : "";
			html += '<div class="row">'
					+ '<div class="cell dateCell"><a class="accountDate" href="#" onclick="listClearedOrder(' + data.gameID + ', \'' + dateStrArr[0] + '\')">' + obj.dailyLedgerList[i].date + '</a></div>'
					+ '<div class="cell issueCell">' + obj.dailyLedgerList[i].issue + '</div>'
					+ '<div class="cell allCountCell">' + obj.dailyLedgerList[i].betCount + '</div>'
					+ '<div class="cell allMoneyCell">' + obj.dailyLedgerList[i].betMoney + '</div>'
					+ '<div class="cell allFeedbackCell">' + obj.dailyLedgerList[i].recedeMoney + '</div>'
					+ '<div class="cell allwinCell ' + className + '">' + obj.dailyLedgerList[i].winMoney + '</div>'
				+ '</div>'
		}
		html += '<div class="row">'
				+ '<div class="cell dateCell"></div>'
				+ '<div class="cell issueCell"></div>'
				+ '<div class="cell allCountCell"></div>'
				+ '<div class="cell allMoneyCell"></div>'
				+ '<div class="cell allFeedbackCell"></div>'
				+ '<div class="cell allwinCell"></div>'
			+ '</div>'
		className = obj.dailyLedgerList[obj.dailyLedgerList.length - 1].winMoney > 0 ? " redFont" : "";
		html += '<div class="row">'
				+ '<div class="cell dateCell"></div>'
				+ '<div class="cell issueCell">总计</div>'
				+ '<div class="cell allCountCell">' + obj.dailyLedgerList[obj.dailyLedgerList.length - 1].betCount + '</div>'
				+ '<div class="cell allMoneyCell">' + obj.dailyLedgerList[obj.dailyLedgerList.length - 1].betMoney + '</div>'
				+ '<div class="cell allFeedbackCell">' + obj.dailyLedgerList[obj.dailyLedgerList.length - 1].recedeMoney + '</div>'
				+ '<div class="cell allwinCell">' + obj.dailyLedgerList[obj.dailyLedgerList.length - 1].winMoney + '</div>'
			+ '</div>'
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
			var winClassName = obj.orderList[i].winMoney > 0 ? " redFont" : "";
			html += '<div class="row">'
					+ '<div class="cell issueCell' + className + '">' + obj.orderList[i].issue + '</div>'
					+ '<div class="cell timeCell' + className + '">' + obj.orderList[i].betTime + '</div>'
					+ '<div class="cell betInfoCell' + className + '" title="' + obj.orderList[i].betContent + '">' + obj.orderList[i].betContent + '</div>'
					+ '<div class="cell betMoneyCell' + className + '">' + obj.orderList[i].betMoney + '</div>'
					+ '<div class="cell oddCell' + className + '" title="' + obj.orderList[i].rate + '">' + obj.orderList[i].rate + '</div>'
					+ '<div class="cell feedbackCell' + className + '">' + obj.orderList[i].recedeMoney + '</div>'
					+ '<div class="cell winCell' + className + winClassName + '">' + obj.orderList[i].winMoney + '</div>'
				+ '</div>'
		}
		$("#issueTable").hide();
		$("#betTable .systemCont").html(html);
		$("#betTable").show();
	})
}