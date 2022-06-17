var gameArr = [];
var token = localStorage.getItem("token");
var account = localStorage.getItem("account");
var lotteryData = {};
var rateData = {};
var READY_STATUS = 0;
var OPEN_STATUS = 1;
var CLOSE_STATUS = 2;
var animalNumArr = [
	{animal: '鼠', numArr: [], type: 1},
	{animal: '牛', numArr: [], type: 0},
	{animal: '虎', numArr: [], type: 1},
	{animal: '兔', numArr: [], type: 1},
	{animal: '龙', numArr: [], type: 1},
	{animal: '蛇', numArr: [], type: 1},
	{animal: '马', numArr: [], type: 0},
	{animal: '羊', numArr: [], type: 0},
	{animal: '猴', numArr: [], type: 1},
	{animal: '鸡', numArr: [], type: 0},
	{animal: '狗', numArr: [], type: 0},
	{animal: '猪', numArr: [], type: 0},
];
$(function() {
	resize();
	$("#logo").attr("src", localStorage.getItem("logoUrl"));
	var arr = localStorage.getItem("gameArrStr").split(",");
	for(var i = 0; i < arr.length; i++){
		var id = parseInt(arr[i]);
		for(var j = 0; j < lotteryArr.length; j++){
			if(lotteryArr[j].id == id)
				gameArr.push(lotteryArr[j]);
		}
	}
	getUserInfo()
	initLotteryMenu();
	var animalIndex = parseInt(localStorage.getItem("animalIndex"));
	for(var i = 0; i < 49; i++){
		var index = animalIndex - (i % 12);
		index = index < 0 ? index + 12 : index;
		animalNumArr[index].numArr.push(i + 1);
	}
	InitNotice();
	setInterval(update, TIME_FREQUENCY);
	// getGameData(gameArr[curIndex].id, true, 0);
		getLastRecord();
	window.open("ss_six.html?v=" + version, 'lotteryFrame');
});
function getUserInfo() {
  Send(httpUrlData.getUserInfo, {}, function (obj) {
    lotteryData = {
      ...obj.data,
      ...lotteryData
    }
    updateInfoPanel(obj.data)
    showUseInfoPanel()
  })
}

var timeDif = 0;
var getDataBetType = "";
function getGameData(gameID, isInit, rateVersion){
	var data = {
		token: token,
		gameID: gameID,
		betTypes: isInit ? "" : getDataBetType,
		rateVersion: rateVersion
	};
	if(Object.keys(rateData).length == 0)
		data.betTypes = "";
	Send(httpUrlData.getGameData, data, function(obj){
		var dt = new Date();
		lotteryData = obj;
		timeDif = dt.getTime() - lotteryData.systemTime;
		lotteryData.openResultTime = obj.openResultTime + timeDif;
		lotteryData.especialNumCloseTime = obj.especialNumCloseTime + timeDif;
		lotteryData.otherNumCloseTime = obj.otherNumCloseTime + timeDif;
		lotteryData.showCloseUpcomingTime = obj.showCloseUpcomingTime + timeDif;
		lotteryData.openTime = obj.openTime + timeDif;
		openTime = lotteryData.openTime - dt.getTime();
		especialNumCloseTime = lotteryData.especialNumCloseTime - dt.getTime();
		otherNumCloseTime = lotteryData.otherNumCloseTime - dt.getTime();
		openResultTime = lotteryData.openResultTime - dt.getTime();
		UpdateRateData(lotteryData.rate);
		if(isInit){
			getCurrentResultNum(gameID, function(){
				showUseInfoPanel();
				getLastRecord();
				setResult();
				toLottery(curIndex);
			});
		}
		else{
			updateInfoPanel();
			lotteryFrame.updateOdds();
		}
	})
}

function UpdateRateData(data){
	for(var key in data){
		rateData[key] = data[key];
	}
}

var resultNum = [];
function getCurrentResultNum(gameID, call){
	var data = {
		token: token,
		gameID: gameID
	};
	Send(httpUrlData.getCurrentResultNum, data, function(obj){
		resultNum = [];
		if(obj.resultNum != ""){
			resultNum = obj.resultNum.split(",");
			getResultTime = 0;
		}
		updateInfoPanel();
		if(call != null)
			call();
	})
}


// 计时器频率
var TIME_FREQUENCY = 50;
// 心跳请求间隔
var HEART_TIME = 10000;
// 距离下次心跳时间
var heartTime = 10000;
// 开奖结果请求间隔
var GET_RESULT_TIME = 5000;
// 距离下次请求开奖结果时间
var getResultTime = 0;
// 通知请求间隔
var NOTICE_TIME = 30000;
// 距离下次通知时间
var noticeTime = 30000;
var SECOND = 1000;
var second = 1000;
var openTime = 999999000;
var especialNumCloseTime = 999999000;
var otherNumCloseTime = 999999000;
var RESULT_TIME = 1000;
var resultTime = 1000;
var isClose = false;
function update(){
	var dt = new Date();
	SetNotice();
	heartTime -= TIME_FREQUENCY;
	if(heartTime <= 0){
		heartTime += HEART_TIME;
		getGameData(gameArr[curIndex].id, false, lotteryData.rateVersion);
		getLastRecord();
	}
	if(lotteryFrame.update != null)
		lotteryFrame.update(TIME_FREQUENCY, dt);
	if(resultNum.length == 0 && dt.getTime() >= lotteryData.openResultTime){
		getResultTime -= TIME_FREQUENCY;
		if(getResultTime <= 0){
			getResultTime = GET_RESULT_TIME;
			getCurrentResultNum(gameArr[curIndex].id);
		}
	}
	noticeTime -= TIME_FREQUENCY;
	if(noticeTime <= 0){
		noticeTime += NOTICE_TIME;
		listNotice();
	}
	if(second > 0){
		second -= TIME_FREQUENCY;
		if(second <= 0){
			second = SECOND;
			if((window.top.curTab > 0 && otherNumCloseTime > 0) || (window.top.curTab == 0 && especialNumCloseTime > 0))
				isClose = false;
			openTime = lotteryData.openTime - dt.getTime();
			especialNumCloseTime = lotteryData.especialNumCloseTime - dt.getTime();
			otherNumCloseTime = lotteryData.otherNumCloseTime - dt.getTime();
			openResultTime = lotteryData.openResultTime - dt.getTime();
			if(lotteryData.status == READY_STATUS && openTime > 0){
				$(".openStatus").text("距离开盘：" + getTimeStr(openTime))
			}
			else if(lotteryData.status == OPEN_STATUS){
				if(curTab == 0 && especialNumCloseTime > 0)
					$(".openStatus").text("距离封盘：" + getTimeStr(especialNumCloseTime));
				else if(curTab != 0 && otherNumCloseTime > 0)
					$(".openStatus").text("距离封盘：" + getTimeStr(otherNumCloseTime));
				else{
					$(".openStatus").text("已封盘");
					if(!isClose)
						lotteryFrame.updateOdds();
				}
			}
			else if(lotteryData.status == CLOSE_STATUS && openResultTime > 0){
				$(".openStatus").text("距离开奖：" + getTimeStr(openResultTime));
			}
			else{
				$(".openStatus").text("已封盘 已开奖");
				if(!isClose)
					lotteryFrame.updateOdds();
			}
		}
	}
	if(dt.getTime() >= lotteryData.openResultTime && resultNum.length < 7){
		resultTime -= TIME_FREQUENCY;
		if(resultTime < 0){
			resultTime = RESULT_TIME;
			getCurrentResultNum(gameArr[curIndex].id, setResult);
		}
	}
}

function getTimeStr(time){
	var s = Math.floor(time / 1000) % 60;
	var m = Math.floor(time / 60000) % 60;
	var h = Math.floor(time / 3600000) % 24;
	var d = Math.floor(time / 86400000);
	return d + "天 " + h + "小时 " + m + "分 " + s + "秒"
}

function setResult(){
	var ballHtml = '';
	var animal = '';
	if(resultNum.length > 0){
		for(var i = 0; i < resultNum.length; i++){
			if(i == 6)
				ballHtml += '<div class="add">+</div>';
			animal = "";
			for(var j = 0; j < animalNumArr.length; j++){
				for(var k = 0; k < animalNumArr[j].numArr.length; k++){
					if(animalNumArr[j].numArr[k] == parseInt(resultNum[i])){
						animal = animalNumArr[j].animal;
						break;
					}
				}
				if(animal != "")
					break;
			}
			ballHtml += '<div class="' + ballInfoObj[resultNum[i]].color + 'Ball">' + resultNum[i] + '</div>'
					+ '<div class="animal">' + animal + '</div>'
		}
	}
	$(".lotteryMenuBox .lotteryResult").html(ballHtml);
}

function resize(){
	var width = $(window).width();
	var height = $(window).height();
	if(width < 1280)
		width = 1280;
	$(".left").css("height", height - 106);
}

var curIndex = 0;
var curTab = 0;
function initLotteryMenu(){
	var html = '';
	for(var i = 0; i < gameArr.length; i++){
		var status = i == curIndex ? 'current' : '';
		html += '<div class="lotteryItem ' + status + '" onclick="clickLottery(' + i + ')">' + gameArr[i].name + '</div>';
	}
	$(".lotteryMenuCont").empty().append(html);
}

/**
 * 跳转到指定页面
 */
function toPage(page, btn) {
	window.open(page + "?v=" + version, 'systemFrame');
	$(".comMenu.current").removeClass("current");
	$(btn).parent().addClass("current")
	$("#systemFrame").show();
	$("#lotteryFrame").hide();
}

function clickLottery(index){
	if(confirm("进入" + gameArr[index].name + "?")){
		curIndex = index;
		getGameData(gameArr[curIndex].id, true, 0);
	}
}

function toLottery(index){
	$(".mainMenu .comMenu.current").removeClass("current");
	$(".lotteryMenuCont .lotteryItem.current").removeClass("current");
	$(".lotteryMenuCont .lotteryItem:eq(" + index + ")").addClass("current");
	$("#systemFrame").hide();
	lotteryFrame.setLotteryInfo();
	toLotteryTab(curTab, true);
	getLastRecord();
	ResetNotice();
}

function toLotteryTab(tabIndex, isInit) {
	if(curTab != tabIndex){
		lotteryFrame.curRate = 0;
		$(".secMenuCont .secItem.current").removeClass("current");
		$(".secMenuCont .secItem:eq(" + tabIndex + ")").addClass("current");
		curTab = tabIndex;
		lotteryFrame.resetData();
		lotteryFrame.setLotteryTab();
	}
	if(!isInit)
		window.top.heartTime = 0;
	$(".mainMenu .comMenu.current").removeClass("current");
	$("#systemFrame").hide();
	$("#lotteryFrame").show();
}

var noticeArr = [];

// 当前公告索引
var noticeIndex = 0;
var noticeContent;
// 是否静止公告
var noticeStop = false;

function listNotice(){
	var data = {
		token: token,
		gameId: gameArr[curIndex].id
	}
	Send(httpUrlData.listNotice, data, function(obj){
		noticeArr = [];
		for(var i = 0; i < obj.noticeList.length; i++){
			noticeArr.push(obj.noticeList[i]);
		}
	})
}
/**
 * 初始化公告栏
 */
function InitNotice() {
	noticeContent = $("#noticeContent");
	noticeContent.css("margin-left", noticeContent.parent().width()).mouseover(function() {
		noticeStop = true;
	}).mouseout(function(){
		noticeStop = false
	});
	$("#noticeContent").click(function(){
		if(noticeArr.length == 0)
			return;
		var html = "";
		for(var i = 0; i < noticeArr.length; i++){
			html += '<tr>'
					+ '<td class="cell indexCell">' + (i + 1) + '</td>'
					+ '<td class="cell timeCell">' + noticeArr[i].n_create_time + '</td>'
					+ '<td class="cell infoCell">' + noticeArr[i].n_content + '</td>'
				+ '</tr>';
		}
		$(".noticePopupPanel .noticePopupPanelCont .systemCont").html(html);
		$(".noticePopupPanel").show();
	});
	$(".noticePopupPanel .noticePopupPanelCont .btn").click(function(){
		$(".noticePopupPanel").hide();
	});
	listNotice();
}

function ResetNotice(){
	noticeArr = [];
	noticeIndex = 0;
	noticeContent.html("").css("margin-left", noticeContent.parent().width());
	listNotice();
}
/**
 * 设置公告栏公告状态
 */
function SetNotice() {
	if (noticeStop) return;
	if (noticeArr.length > 0) {
		if (noticeContent.html() == "") {
			noticeIndex = 0;
			noticeContent.html(noticeArr[noticeIndex].n_content).css("margin-left", noticeContent.parent().width());
		} else {
			noticeContent.css("margin-left", parseInt(noticeContent.css("margin-left")) - 2 + "px");
			if (parseInt(noticeContent.css("margin-left")) <= parseInt(noticeContent.width()) * -1) {
				if(noticeIndex >= noticeArr.length)
					noticeIndex = 0;
				noticeContent.html(noticeArr[noticeIndex++].n_content).css("margin-left", noticeContent.parent().width());
			}
		}
	}
}

function showUseInfoPanel(){
	$(".left .leftPanel").hide();
	$(".left .userInfoPanel").show();
}

var quota = {};
var betType = 0;
function updateInfoPanel(){
	$("#userName").text(account);
	$("#creditAmount").text(lotteryData.creditMoney);
	$("#usedAmount").text(lotteryData.usedMoney);
	$("#balance").text(lotteryData.usableMoney);
	$("#issue").text(lotteryData.issue);
	$(".issueInfo .issue").text(lotteryData.issue);
}

var quickRate = 0;
var quickAddId = 0;
function showQuickBetPanel(){
	quickRate = lotteryFrame.curRate;
	var titleStr = "";
	var betType = 1011;
	switch(curTab){
		case 0 : 
			titleStr = "特码"; betType = 1011; 
			quickAddId = 1011000; 
			break;
		case 1 : 
			titleStr = "正码"; 
			betType = 1081; 
			quickAddId = 1081000; 
			break;
		case 2 : 
			titleStr = "正" + lotteryFrame.curNsIndex; 
			betType = 1011 + 10 * lotteryFrame.curNsIndex; 
			quickAddId = 1011000 + 10000 * lotteryFrame.curNsIndex; 
			break;
	}
	titleStr += quickRate == 0 ? "A盘" : "B盘";
	$(".left .quickBetPanel .betInfoBox .betNumBox").text("");
	$(".left .quickBetPanel .quickBetTitle").text(titleStr);
	$(".left .leftPanel").hide();
	$(".left .quickBetPanel").show();
}

function clickQuickBetNum(obj){
	obj = $(obj);
	obj.toggleClass("selected");
	updateBetNumBox();
}

function updateBetNumBox(){
	var arr = $(".left .quickBetPanel .numTable .selected");
	var numArr = []
	for(var i = 0; i < arr.length; i++){
		numArr.push(arr.eq(i).text())
	}
	numArr.sort();
	$(".left .quickBetPanel .betNumBox").text(numArr.join(","));
}

function clickQuickBetType(type, obj){
	obj = $(obj);
	obj.toggleClass("selected");
	var selected = obj.hasClass("selected");
	var keyArr = [];
	var valArr = [];
	switch(type){
		case 0: keyArr.push("oe"); valArr.push("odd"); break;
		case 1: keyArr.push("oe"); valArr.push("even"); break;
		case 2: keyArr.push("bs"); valArr.push("big"); break;
		case 3: keyArr.push("bs"); valArr.push("small"); break;
		case 4: keyArr.push("nsoe"); valArr.push("odd"); break;
		case 5: keyArr.push("nsoe"); valArr.push("even"); break;
		case 6: keyArr.push("bs"); valArr.push("big"); keyArr.push("oe"); valArr.push("odd"); break;
		case 7: keyArr.push("bs"); valArr.push("big"); keyArr.push("oe"); valArr.push("even"); break;
		case 8: keyArr.push("bs"); valArr.push("small"); keyArr.push("oe"); valArr.push("odd"); break;
		case 9: keyArr.push("bs"); valArr.push("small"); keyArr.push("oe"); valArr.push("even"); break;
		case 10: keyArr.push("color"); valArr.push("red"); break;
		case 11: keyArr.push("color"); valArr.push("red"); keyArr.push("oe"); valArr.push("odd"); break;
		case 12: keyArr.push("color"); valArr.push("red"); keyArr.push("oe"); valArr.push("even"); break;
		case 13: keyArr.push("color"); valArr.push("red"); keyArr.push("bs"); valArr.push("big"); break;
		case 14: keyArr.push("color"); valArr.push("red"); keyArr.push("bs"); valArr.push("small"); break;
		case 15: keyArr.push("color"); valArr.push("blue"); break;
		case 16: keyArr.push("color"); valArr.push("blue"); keyArr.push("oe"); valArr.push("odd"); break;
		case 17: keyArr.push("color"); valArr.push("blue"); keyArr.push("oe"); valArr.push("even"); break;
		case 18: keyArr.push("color"); valArr.push("blue"); keyArr.push("bs"); valArr.push("big"); break;
		case 19: keyArr.push("color"); valArr.push("blue"); keyArr.push("bs"); valArr.push("small"); break;
		case 20: keyArr.push("color"); valArr.push("green"); break;
		case 21: keyArr.push("color"); valArr.push("green"); keyArr.push("oe"); valArr.push("odd"); break;
		case 22: keyArr.push("color"); valArr.push("green"); keyArr.push("oe"); valArr.push("even"); break;
		case 23: keyArr.push("color"); valArr.push("green"); keyArr.push("bs"); valArr.push("big"); break;
		case 24: keyArr.push("color"); valArr.push("green"); keyArr.push("bs"); valArr.push("small"); break;
		case 25: keyArr.push("lbs"); valArr.push("big"); break;
		case 26: keyArr.push("lbs"); valArr.push("small"); break;
	}
	var isTarget = true;
	for(var key in ballInfoObj){
		isTarget = true;
		for(var i = 0; i < keyArr.length; i++){
			if(ballInfoObj[key][keyArr[i]] != valArr[i]){
				isTarget = false;
				break;
			}
		}
		if(isTarget){
			if(selected){
				if(!$(".quickBetPanel .numTable .num" + key).hasClass("selected"))
					$(".quickBetPanel .numTable .num" + key).addClass("selected")
			}
			else
				$(".quickBetPanel .numTable .num" + key).removeClass("selected");
		}
	}
	updateBetNumBox();
}

function clickQuickBetFirst(num, obj){
	obj = $(obj);
	obj.toggleClass("selected");
	var selected = obj.hasClass("selected");
	var targetNum = "";
	for(var i = 0; i < 10; i++){
		if(selected){
			if(!$(".quickBetPanel .numTable .num" + num + i).hasClass("selected"))
				$(".quickBetPanel .numTable .num" + num + i).addClass("selected")
		}
		else
			$(".quickBetPanel .numTable .num" + num + i).removeClass("selected");
	}
	updateBetNumBox();
}

function clickQuickBetAnimal(index, obj){
	obj = $(obj);
	obj.toggleClass("selected");
	var selected = obj.hasClass("selected");
	for(var i = 0; i < animalNumArr[index].numArr.length; i++){
		var num = animalNumArr[index].numArr[i] < 10 ? "0" + animalNumArr[index].numArr[i] : animalNumArr[index].numArr[i];
		if(selected){
			if(!$(".quickBetPanel .numTable .num" + num).hasClass("selected"))
				$(".quickBetPanel .numTable .num" + num).addClass("selected")
		}
		else
			$(".quickBetPanel .numTable .num" + num).removeClass("selected");
	}
	updateBetNumBox();
}

function clickQuickBetAnimalType(type, obj){
	obj = $(obj);
	obj.toggleClass("selected");
	var selected = obj.hasClass("selected");
	for(var i = 0; i < animalNumArr.length; i++){
		if(animalNumArr[i].type == type){
			for(var j = 0; j < animalNumArr[i].numArr.length; j++){
				var num = animalNumArr[i].numArr[j] < 10 ? "0" + animalNumArr[i].numArr[j] : animalNumArr[i].numArr[j];
				if(selected){
					if(!$(".quickBetPanel .numTable .num" + num).hasClass("selected"))
						$(".quickBetPanel .numTable .num" + num).addClass("selected")
				}
				else
					$(".quickBetPanel .numTable .num" + num).removeClass("selected");
			}
		}
	}
	updateBetNumBox();
}

var quickBetContent = "";
function quickBet(){
	if(lotteryData.status != OPEN_STATUS)
		return;
	var betMoney = parseInt($(".quickBetPanel .betInfoBox .betMoneyValue").val());
	if(isNaN(betMoney) || betMoney < 0)
		return;
	var numArr = $(".quickBetPanel .numTable .selected");
	var betInfoArr = [];
	quickBetContent = "";
	var odds = 0;
	var numStr = "";
	var num = 0;
	var betInfo = "";
	var titleStr = $(".left .quickBetPanel .quickBetTitle").text();
	var betMap = {};
	var arr = [];
	for(var i = 0; i < numArr.length; i++){
		numStr = numArr.eq(i).text();
		num = parseInt(numStr);
		odds = rateData[quickAddId + num][quickRate];
		if(odds == 0){
			alert("赔率为0不可下注！")
			return;
		}
		betMap["info" + numStr] = {
			content: quickAddId + num + "-" + odds + "-" + betMoney,
			obj: {
				money: betMoney,
				info: titleStr + numArr.eq(i).text() + '@<span style="color: red">' + odds + '</span>',
				infoTitle: titleStr + numArr.eq(i).text() + odds
			}
		}
		arr.push(numStr);
	}
	arr.sort();
	for(var i = 0; i < arr.length; i++){
		if(quickBetContent != "")
			quickBetContent += ";";
		quickBetContent += betMap["info" + arr[i]].content;
		betInfoArr.push(betMap["info" + arr[i]].obj)
	}
	var data = {
		rateType: quickRate + 1,
		betContent: quickBetContent,
	};
	clearQuickSelected();
	$(".quickBetPanel .betInfoBox .betMoneyValue").val("")
	initConfirmPanel(data, betInfoArr, betMoney * numArr.length, "normal");
}

function clearQuickSelected(){
	$(".quickBetPanel .selected").removeClass("selected");
	updateBetNumBox();
}

function hideQuickBetPanel(){
	clearQuickSelected();
	$(".quickBetPanel .betInfoBox .betMoneyValue").val("");
	showUseInfoPanel();
}


function showBetResultPanel(){
	var html = '';
	for(var i = 0; i < curBetInfo.infoArr.length; i++){
		html += '<tr>'
				+ '<td class="moneyCell"><div title="' + curBetInfo.infoArr[i].money + '">' + curBetInfo.infoArr[i].money + '</div></td>'
				+ '<td class="contentCell"><div title="' + curBetInfo.infoArr[i].infoTitle + '">' + curBetInfo.infoArr[i].info + '</div></td>'
			+ '</tr>'
	}
	$("#betInfoCont").html(html);
	$("#betInfoSum").text("共" + curBetInfo.infoArr.length + "注，合计" + curBetInfo.moneySum);
	$(".left .leftPanel").hide();
	$(".left .betInfoTable").show();
	$(".left .userInfoPanel").show();
}

function getLastRecord(){
  $.ajax({
		url : serverMap[httpUrlData.newListBet.server] + httpUrlData.newListBet.url,
    type: 'get',
		dataType : "json",
		contentType: 'application/json;charset=UTF-8',
		async : true,
		timeout : 30000,
		headers: {
			Authorization: localStorage.getItem('token')
		},
    success(obj) {
        var html = '';
        for (var i = 0; i < 10; i++) {
          var data = obj[i]
					html += '<tr>'
							+ '<td class="moneyCell" title="' + data.transactionsBalance+ '"><div>' + data.transactionsBalance + '</div></td>'
							+ '<td class="contentCell" title="' + data.content + '"><div>' + data.content + '</div></td>'
						+ '</tr>';
					money += parseInt(data.transactionsBalance);
        }
				$("#lastRecordCont").html(html);
				$("#lastRecordSum").text("共" + obj.length + "注，合计" + money);
				showUseInfoPanel();
    }
  })
}
var betData = {};
var curBetInfo = {};
function initConfirmPanel(data, betInfoArr, moneySum, type){
	curBetInfo.infoArr = betInfoArr;
	curBetInfo.moneySum = moneySum;
	curBetInfo.type = type;
	$(".content .left .leftPanel").hide();
	var html = '';
	for(var i = 0; i < betInfoArr.length; i++){
		html += '<tr class="betInfo' + betInfoArr[i].betId + '">'
				+ '<td class="contentCell"><div info="' + i + '" title="' + betInfoArr[i].infoTitle + '">' + betInfoArr[i].info + '</div></td>'
				+ '<td class="moneyCell"><div title="' + betInfoArr[i].money + '">' + betInfoArr[i].money + '</div></td>'
			+ '</tr>'
	}
	betData = data;
	betData.token = token;
	betData.gameID = gameArr[curIndex].id;
	
	$(".content .left .confirmPanel .confirmContent").html(html);
	$(".content .left .confirmPanel .lastRecordSumCell").text("共" + betInfoArr.length + "注，合计" + moneySum);
	$(".content .left .userInfoPanel").hide();
	$(".content .left .confirmPanel").show();
}

function hideConfirmPanel(){
	var isHide = confirm("你要取消这些注单吗？")
	if(!isHide)
		return;
	$(".content .left .confirmPanel").hide();
	$(".content .left .userInfoPanel").show();
}

function bet(obj){
	obj = $(obj);
	if(obj.text() == "提交中")
		return;
	$(".confirmPanel .betBtn").text("提交中")
	switch(curBetInfo.type){
		case "normal" : sendBet(); break;
		case "link" : sendBetLink(); break;
	}
}

function sendBet(){
	Send(httpUrlData.generalBet, betData, function(obj){
		if(obj.status == 1){
			alert("赔率下降");
			$(".content .left .confirmPanel .confirmContent tr.red").removeClass("red");
			var info = [];
			var rowObj = {};
			var cellObj = {};
			var str = "";
			var index = 0;
			var dropRate = obj.dropRate.split(";");
			for(var i = 0; i < dropRate.length; i++){
				info = dropRate[i].split("-");
				rowObj = $(".content .left .confirmPanel .confirmContent .betInfo" + info[0]);
				rowObj.addClass("red");
				cellObj = rowObj.find(".contentCell div");
				str = cellObj.text()
				str = str.replace(info[1], info[2])
				cellObj.text(str);
				str = cellObj.attr("title");
				str = str.replace(info[1], info[2])
				cellObj.attr("title", str);
				index = cellObj.attr("info");
				curBetInfo.infoArr[index].info = curBetInfo.infoArr[index].info.replace(info[1], info[2]);
				curBetInfo.infoArr[index].infoTitle = curBetInfo.infoArr[index].infoTitle.replace(info[1], info[2]);
				betData.betContent = betData.betContent.replace(info[0]+ "-" + info[1], info[0]+ "-" + info[2])
			}
			$(".confirmPanel .betBtn").text("确定")
			getGameData(gameArr[curIndex].id, false, 0)
			return;
		}
		alert("下注成功");
		$(".confirmPanel .betBtn").text("确定")
		$(".content .left .confirmPanel").hide();
		$(".content .left .userInfoPanel").show();
		showBetResultPanel(obj.betResult);
		getGameData(gameArr[curIndex].id, false, lotteryData.rateVersion);
		getLastRecord();
	}, betTimeOut, betErr)
}

function sendBetLink(){
	Send(httpUrlData.multiNumBet, betData, function(obj){
		if(obj.status == 1){
			alert("赔率下降");
			$(".content .left .confirmPanel .confirmContent tr.red").removeClass("red");
			var info = [];
			var rowObj = {};
			var cellObj = {};
			var str = "";
			var index = 0;
			var dropRate = obj.dropRate.split(";");
			for(var i = 0; i < dropRate.length; i++){
				info = dropRate[i].split("-");
				rowObj = $(".content .left .confirmPanel .confirmContent .betInfo" + info[0].replace(/,/g, ""));
				rowObj.addClass("red");
				cellObj = rowObj.find(".contentCell div");
				str = cellObj.text()
				str = str.replace(info[1], info[2])
				cellObj.text(str);
				str = cellObj.attr("title");
				str = str.replace(info[1], info[2])
				cellObj.attr("title", str);
				index = cellObj.attr("info");
				curBetInfo.infoArr[index].info = curBetInfo.infoArr[index].info.replace(info[1], info[2]);
				curBetInfo.infoArr[index].infoTitle = curBetInfo.infoArr[index].infoTitle.replace(info[1], info[2]);
				betData.numGroup = betData.numGroup.replace(info[0]+ "-" + info[1], info[0]+ "-" + info[2])
			}
			$(".confirmPanel .betBtn").text("确定")
			getGameData(gameArr[curIndex].id, false, 0)
			return;
		}
		alert("下注成功");
		$(".confirmPanel .betBtn").text("确定")
		$(".content .left .confirmPanel").hide();
		$(".content .left .userInfoPanel").show();
		showBetResultPanel(obj.betResult);
		getGameData(gameArr[curIndex].id, false, lotteryData.rateVersion)
		getLastRecord();
	}, betTimeOut, betErr)
}

function betErr(){
	$(".confirmPanel .betBtn").text("确定")
	$(".content .left .confirmPanel").hide();
	$(".content .left .userInfoPanel").show();
	showBetResultPanel(obj.betResult);
	getGameData(gameArr[curIndex].id, false, lotteryData.rateVersion)
	getLastRecord();
}

function betTimeOut(){
	alert("网络延迟，请在下注明细中查看是否成功！");
	$(".confirmPanel .betBtn").text("确定")
	$(".content .left .confirmPanel").hide();
	$(".content .left .userInfoPanel").show();
	showBetResultPanel(obj.betResult);
	getGameData(gameArr[curIndex].id, false, lotteryData.rateVersion)
	getLastRecord();
}

function closeBetInfoTable(){
	$(".betInfoTable").hide();
}

function changeSkin(obj){
	obj = $(obj);
	var skin = obj.val();
	localStorage.setItem("skinName", skin);
	var url = skin + "_index.html?v=" + version;
	window.open(url, "_self");
}

function exit(){
	localStorage.setItem("token", null);
	GotoLogin();
}