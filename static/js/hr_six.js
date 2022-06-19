var READY_STATUS = 0;
var OPEN_STATUS = 1;
var CLOSE_STATUS = 2;
var curRate = 0;
var sClose = false;
var nClose = false;
$(function(){
	window.top.getGameData();
	initLinkAnimalPanel("linkAnimalPanel");
	initLinkMixtureAnimalPanel();
	initAnimalLinkPanel();
	initAnimalPanel("sAnimalPanel");
	initAnimalPanel("animal6Panel");
	initAnimalPanel("animal1Panel");
})

function resetData(){
	linkCombType = -1;
	curNsIndex = 1;
	groupCount = 2;
	groupMiss = false;
	missIndex = 0;
	animal6RadioIndex = 0;
	maxSelectedCount = 10;
	linkCount = 3;
	canSelect = false;
	linkBetType = 0;
	linkMode = 1;
	linkBetMoney = 0;
	linkBetContent = "";
	linkNumGroup = "";
	missCheckMaxCount = 7;
	groupLinkType = 0;
}

function setLotteryInfo(){
	$("#cueIssue").text(window.top.lotteryData.issue);
	$(".lotteryBg").removeClass("lotteryBg1").removeClass("lotteryBg2").addClass("lotteryBg" + window.top.gameArr[window.top.curIndex].id);
	setResult();
	if(window.top.lotteryData.status == READY_STATUS){
		$(".systemTable, #linkBetPanel, .ctrlCont").hide();
		$(".ready").show();
	}
	else{
		$(".systemTable, #linkBetPanel, .ctrlCont").show();
		setLotteryTab(window.top.curTab);
		$(".ready").hide();
	}
}

var ODDS_UPDATE_TIME = 1000;
var oddUpdateTime = 1000;
var especialNumCloseTime = 999999000;
var otherNumCloseTime = 999999000;
var RESULT_TIME = 1000;
var resultTime = 1000;
function update(timeFrquency, dt){
	if(oddUpdateTime > 0){
		oddUpdateTime -= timeFrquency;
		if(oddUpdateTime <= 0){
			oddUpdateTime = ODDS_UPDATE_TIME;
			if(window.top.lotteryData.status == OPEN_STATUS && especialNumCloseTime <= 0 && otherNumCloseTime <= 0){
				especialNumCloseTime = 999999000;
				otherNumCloseTime = 999999000;
			}
			if(especialNumCloseTime > 0){
				especialNumCloseTime = window.top.lotteryData.especialNumCloseTime - dt.getTime();
				if(window.top.curTab == 0 && especialNumCloseTime <= 0)
					updateOdds();
			}
			if(otherNumCloseTime > 0){
				otherNumCloseTime = window.top.lotteryData.otherNumCloseTime - dt.getTime();
				if(window.top.curTab > 0 && otherNumCloseTime <= 0)
					updateOdds();
			}
			setLotteryTime(dt);
			$(".update").removeClass("update")
		}
	}
	if(dt.getTime() >= window.top.lotteryData.openResultTime && window.top.resultNum.length < 7){
		resultTime -= timeFrquency;
		if(resultTime < 0){
			resultTime = RESULT_TIME;
			window.top.getCurrentResultNum(window.top.gameArr[window.top.curIndex].id, setResult);
		}
	}
}

// 右上角即时赛果
function setResult(){
	// var ballHtml = '';
	// if(window.top.resultNum.length > 0){
	// 	for(var i = 0; i < window.top.resultNum.length; i++){
	// 		if(i == 6)
	// 			ballHtml += '<div class="add">+</div>';
	// 		ballHtml += '<div class="' + ballInfoObj[window.top.resultNum[i]].color + 'Ball">' + window.top.resultNum[i] + '</div>';
	// 	}
	// }
	// $("#curResult").html(ballHtml);
}

function setLotteryTime(dt){
	if(dt.getTime() >= window.top.lotteryData.showCloseUpcomingTime
	&& ((window.top.curTab == 0 && especialNumCloseTime > 0) || (window.top.curTab != 0 && otherNumCloseTime > 0))){
		if(window.top.curTab == 0)
			$("#closeTime").text(formatSeconds(especialNumCloseTime / 1000));
		else
			$("#closeTime").text(formatSeconds(otherNumCloseTime / 1000));
		$(".ctrlPanel .ctrlTitle .closeTime").show();
	}
	else{
		$(".ctrlPanel .ctrlTitle .closeTime").hide();
	}
	$("#curTime").text(DateFormat(dt, "hh:mm:ss"));
}

function setLotteryTab(){
	$("#linkBetPanel").hide();
	clearBet();
	var dt = new Date();
	especialNumCloseTime = window.top.lotteryData.especialNumCloseTime - dt.getTime();
	otherNumCloseTime = window.top.lotteryData.otherNumCloseTime - dt.getTime();
	setLotteryTime(dt);
	switch(window.top.curTab){
		case 0 : setSpecialNumTab();
				window.top.getDataBetType = "1011,1012,1013,1014,1015,1016,1017";
				break
		case 1 : setNormalNumTab(); 
				window.top.getDataBetType = "1081,1082,1083";
				break;
		case 2 : 
			$(".opNumBtnBox .btn").removeClass("curBtn").eq(curNsIndex - 1).addClass("curBtn"); 
			setNormalSpecialNumTab(curNsIndex); break;
		case 3 : setLinkTab(linkMode - 1); break;
		case 4 : setSAnimalPanel(); 
				window.top.getDataBetType = "1091";
				break;
		case 5 : setColorTwoPanel();
				window.top.getDataBetType = "1111";
				break;
		case 6 : setAnimal6Panel();
				window.top.getDataBetType = "1141";
				break;
		case 7 : setAnimal1Panel(112);
				window.top.getDataBetType = "1121";
				break;
		case 8 : setAnimal1Panel(113);
				window.top.getDataBetType = "1131";
				break;
		case 9 : setUnitNumPanel();
				window.top.getDataBetType = "1101";
				break;
		case 10 : setMissPanel(missIndex, true); break;
		case 11 : setAnimalLinkPanel();
				window.top.getDataBetType = "1221,1231,1241,1251,1261,1271,1281,1291";
				break;
		case 12 : setUnitLinkPanel();
				window.top.getDataBetType = "1301,1311,1321,1331,1341,1351,1361,1371";
				break;
	}
}

// 设置赔率
function SetRateData(type) {
	switch(Number(window.top.curTab)) {
		case 0:
			if (item.creditPlayId == 1) {
				const playArr = item.creditPlayTypeDtoList[0].creditPlayTypeInfoDtoList
				const playMap = {}
				playArr.forEach(function(item) {
					var key = item.creditPlayTypeName.length === 1 ? '0' + item.creditPlayTypeName : item.creditPlayTypeName
					playMap[key] = item
				})
				$('#numPanel .systemCont').find('.cell').each(function() {
					var key = $(this).find('.numCell div').text() || $(this).find('.twoCell').text()
					var data = playMap[key]
					var value = 0
					if (data) {
						// 玩法ID： creditPlayId 玩法子类：creditPlayInfoId  号码：creditPlayTypeId
					} else {}
				})
			}
		break
		case 1:
			if (item.creditPlayId == 2) {
				const playArr = item.creditPlayTypeDtoList[0].creditPlayTypeInfoDtoList
				const playMap = {}
				playArr.forEach(function(item) {
					var key = item.creditPlayTypeName.length === 1 ? '0' + item.creditPlayTypeName : item.creditPlayTypeName
					playMap[key] = item
				})
				console.log($(''))
				$('#numPanel .systemCont').find('.cell').each(function() {
					var key = $(this).find('.numCell div').text() || $(this).find('.twoCell').text()
					var data = playMap[key]
					var value = 0
					if (data) {
						value = data.odds
						$(this).find('.oddsCell').text(value)
						$(this).find('.betMoneyValue').removeAttr("disabled");
						$(this).find('.betMoneyValue').attr('max', 100)
						$(this).find('.betMoneyValue').attr('min',  1)
					} else {}
				})
			}
		break
		case 2:
			if (item.creditPlayId == 3) {
				var playArr = []
				for (var child of item.creditPlayTypeDtoList) {
					if (child.creditPlayInfoId === (type + 2)) {
						console.log(child)
						playArr = child.creditPlayTypeInfoDtoList
					}
				}
				var playMap = {}
				playArr.forEach(function(play) {
					var key = play.creditPlayTypeName.length === 1 ? '0' + play.creditPlayTypeName : play.creditPlayTypeName
					playMap[key] = play
				})
				$('#numPanel .systemCont').find('.cell').each(function() {
					var key = $(this).find('.numCell div').text() || $(this).find('.twoCell').text()
					var data = playMap[key]
					var value = 0
					if (data) {
						value = data.odds
						$(this).find('.oddsCell').text(value)
						$(this).find('.betMoneyValue').removeAttr("disabled");
						$(this).find('.betMoneyValue').attr('max', 100)
						$(this).find('.betMoneyValue').attr('min',  1)
					} else {}
				})
			}

	}
}
function updateOdds(){
	$("#cueIssue").text(window.top.lotteryData.issue);
	if(window.top.lotteryData.status != READY_STATUS && $(".ready").is(':visible')){
		setLotteryTab(window.top.curTab);
		$(".ctrlCont").show();
		$(".ready").hide();
	}
	else if(window.top.lotteryData.status == READY_STATUS && !$(".ready").is(':visible')){
		$(".systemTable, #linkBetPanel, .ctrlCont").hide();
		$(".ready").show();
	}
	if(window.top.lotteryData.status != OPEN_STATUS)
		clearBet();
	switch(window.top.curTab){
		case 0 : initNumPanelOdds(101); break
		case 1 : initNumPanelOdds(108); break;
		case 2 : initNumPanelOdds(101 + curNsIndex); break;
		case 3 :
			if(linkCombType >= 0){
				var panelId = "";
				switch(linkMode - 1){
					case 0 : panelId = "linkNormalPanel"; break;
					case 1 : panelId = "linkHeadPanel"; break;
					case 2 : panelId = "linkAnimalPanel"; break;
					case 3 : panelId = "linkUnitNumPanel"; break;
					case 4 : panelId = "linkMixturePanel"; break;
					case 5 : panelId = "linkHeadPanel"; break;
				}
				setLinkPanelOdds(panelId);
			}
			break;
		case 4 : updateSAnimalOdds(); break;
		case 5 : updateColorTwoOdds(); break;
		case 6 : updateAnimal6Odds(); break;
		case 7 : updateAnimal1Odds(112); break;
		case 8 : updateAnimal1Odds(113); break;
		case 9 : updateUnitNumOdds(); break;
		case 10 : updateMissOdds(); break;
		case 11 : setAnimalLinkOdds(); break;
		case 12 : setUnitLinkOdds(); break;
	}
}
// 更新赔率
function updateItemOdds(obj, odds){
	odds = parseFloat(odds)
	var oddsStr = odds < 0 || window.top.lotteryData.status != OPEN_STATUS ? "封单" : odds.toString();
	if(obj.text() != oddsStr){
		obj.text(oddsStr).addClass("update");
		oddUpdateTime = ODDS_UPDATE_TIME;
		if(odds < 0 || window.top.lotteryData.status != OPEN_STATUS){
			obj.siblings(".betMoneyCell").children(".betMoneyValue").attr("disabled", "disabled");
		}
		else{
			obj.siblings(".betMoneyCell").children(".betMoneyValue").removeAttr("disabled");
		}
	}	
}

function setNumPanelRate(rate){
	var curBtn = $(".ctrlPanel .ctrlCont .quickBet .OddsBtn.curBtn");
	if(curBtn.attr("info") == rate || window.top.lotteryData.status != OPEN_STATUS)	
		return;
	curBtn.removeClass("curBtn");
	$(".ctrlPanel .ctrlCont .quickBet .OddsBtn" + rate).addClass("curBtn");
	curRate = rate;
	switch(window.top.curTab){
		case 0 : initNumPanelOdds(101); break;
		case 1 : initNumPanelOdds(108); break;
		case 2 : initNumPanelOdds(101 + curNsIndex); break;
	}
	clearBet();
}

function setSpecialNumTab(){
	$("#numPanel .systemCont:eq(0) .numRow .cell .oddsCell").text("");
	var curBtn = $(".ctrlPanel .ctrlCont .quickBet .OddsBtn.curBtn");
	if(curBtn.attr("info") != 0){
		curBtn.removeClass("curBtn");
		$(".ctrlPanel .ctrlCont .quickBet .OddsBtn" + curRate).addClass("curBtn");
	}
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".ctrlPanel .ctrlCont .quickBet").show();
	$(".systemTable").hide();
	var html = '<div class="row twoRow">'
					+ '<div class="cell w250 two2001"><div class="twoCell">特单</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="2001" /></div></div>'
					+ '<div class="cell w250 two2002"><div class="twoCell">特双</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="2002" /></div></div>'
					+ '<div class="cell w250 two3001"><div class="twoCell">特大</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="3001" /></div></div>'
					+ '<div class="cell w250 two3002"><div class="twoCell">特小</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="3002" /></div></div>'
				+ '</div>'
				+ '<div class="row twoRow">'
					+ '<div class="cell w250 two7002"><div class="twoCell">家禽</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="7002" /></div></div>'
					+ '<div class="cell w250 two7001"><div class="twoCell">野兽</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="7001" /></div></div>'
					+ '<div class="cell w250 two6001"><div class="twoCell">特尾大</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="6001" /></div></div>'
					+ '<div class="cell w250 two6002"><div class="twoCell">特尾小</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="6002" /></div></div>'
				+ '</div>'
				+ '<div class="row twoRow">'
					+ '<div class="cell w250 two5001"><div class="twoCell">红波</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="5001" /></div></div>'
					+ '<div class="cell w250 two5002"><div class="twoCell">蓝波</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="5002" /></div></div>'
					+ '<div class="cell w250 two5003"><div class="twoCell">绿波</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="5003" /></div></div>'
					+ '<div class="cell w250"><div class="twoCell"></div><div class="oddsCell"></div><div class="betMoneyCell"></div></div>'
				+ '</div>'
				+ '<div class="row twoRow">'
					+ '<div class="cell w250 two4001"><div class="twoCell">合单</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="4001" /></div></div>'
					+ '<div class="cell w250 two4002"><div class="twoCell">合双</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="4002" /></div></div>'
					+ '<div class="cell w250"><div class="twoCell"></div><div class="oddsCell"></div><div class="betMoneyCell"></div></div>'
					+ '<div class="cell w250"><div class="twoCell"></div><div class="oddsCell"></div><div class="betMoneyCell"></div></div>'
				+ '</div>';
	$("#numPanel .towBox").empty().append(html);
	initNumPanelOdds(101);
	$("#numPanel").show();
}

function clickOpNumBtn(index, obj){
	if($(obj).hasClass("curBtn"))
		return;
	$(".opNumBtnBox .curBtn").removeClass("curBtn");
	$(obj).addClass("curBtn")
	clearBet();
	setNormalSpecialNumTab(index)
	localStorage.setItem('creditPlayName', '正' + index)
	window.top.heartTime = 0;
}

var curNsIndex = 1;
function setNormalSpecialNumTab(index){
	$("#numPanel .systemCont:eq(0) .numRow .cell .oddsCell").text("");
	var curBtn = $(".ctrlPanel .ctrlCont .quickBet .OddsBtn.curBtn");
	if(curBtn.attr("info") != 0){
		curBtn.removeClass("curBtn");
		$(".ctrlPanel .ctrlCont .quickBet .OddsBtn" + curRate).addClass("curBtn");
	}
	curNsIndex = index;
	window.top.getDataBetType = "";
	for(var i = 0; i < 5; i++){
		if(i > 0)
			window.top.getDataBetType += ",";
		window.top.getDataBetType += 1001 + (curNsIndex + 1) * 10 + i;
	}			
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".ctrlPanel .ctrlCont .quickBet").show();
	$(".ctrlPanel .ctrlCont .opNumBtnBox").show();
	$(".systemTable").hide();
	var html = '<div class="row twoRow">'
					+ '<div class="cell w250 two4001"><div class="twoCell">正' + index + '单</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="4001" /></div></div>'
					+ '<div class="cell w250 two4002"><div class="twoCell">正' + index + '双</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="4002" /></div></div>'
					+ '<div class="cell w250 two3001"><div class="twoCell">正' + index + '大</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="3001" /></div></div>'
					+ '<div class="cell w250 two3002"><div class="twoCell">正' + index + '小</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="3002" /></div></div>'
				+ '</div>'
				+ '<div class="row twoRow">'
					+ '<div class="cell w250 two5001"><div class="twoCell">红波</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="5001" /></div></div>'
					+ '<div class="cell w250 two5002"><div class="twoCell">蓝波</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="5002" /></div></div>'
					+ '<div class="cell w250 two5003"><div class="twoCell">绿波</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="5003" /></div></div>'
					+ '<div class="cell w250"><div class="twoCell"></div><div class="oddsCell"></div><div class="betMoneyCell"></div></div>'
				+ '</div>'
				+ '<div class="row twoRow">'
					+ '<div class="cell w250 two2001"><div class="twoCell">合单</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="2001" /></div></div>'
					+ '<div class="cell w250 two2002"><div class="twoCell">合双</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="2002" /></div></div>'
					+ '<div class="cell w250"><div class="twoCell"></div><div class="oddsCell"></div><div class="betMoneyCell"></div></div>'
					+ '<div class="cell w250"><div class="twoCell"></div><div class="oddsCell"></div><div class="betMoneyCell"></div></div>'
				+ '</div>';
	$("#numPanel .towBox").empty().append(html);
	var betType = 101 + index;
	initNumPanelOdds(betType);
	$("#numPanel").show();
}

function setNormalNumTab(){
	$("#numPanel .systemCont:eq(0) .numRow .cell .oddsCell").text("");
	var curBtn = $(".ctrlPanel .ctrlCont .quickBet .OddsBtn.curBtn");
	if(curBtn.attr("info") != 0){
		curBtn.removeClass("curBtn");
		$(".ctrlPanel .ctrlCont .quickBet .OddsBtn" + curRate).addClass("curBtn");
	}
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".ctrlPanel .ctrlCont .quickBet").show();
	$(".systemTable").hide();
	var html = '<div class="row twoRow">'
					+ '<div class="cell w250 two2001"><div class="twoCell">总单</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="2001" /></div></div>'
					+ '<div class="cell w250 two2002"><div class="twoCell">总双</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="2002" /></div></div>'
					+ '<div class="cell w250 two3001"><div class="twoCell">总大</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="3001" /></div></div>'
					+ '<div class="cell w250 two3002"><div class="twoCell">总小</div><div class="oddsCell"></div><div class="betMoneyCell"><input class="betMoneyValue" info="3002" /></div></div>'
				+ '</div>';
	$("#numPanel .towBox").empty().append(html);
	initNumPanelOdds(108);
	$("#numPanel").show();
}

function initNumPanelOdds(betType){
	var numStartIndex = betType * 10000 + 1
	console.log(window.top.lotteryData.status)
	window.top.lotteryData.status = 1
	otherNumCloseTime = 100
	especialNumCloseTime = 100
	for(var i = 0; i < 49; i++){
		var itemId = numStartIndex + 1000 + i;
		if(window.top.lotteryData.status == OPEN_STATUS && ((betType == 101 && especialNumCloseTime > 0) || (betType > 101 && otherNumCloseTime > 0))) {
			$("#numPanel .numRow .item" + (1001 + i)).attr('data-creditplaytypeid', window.top.rateData[itemId][2]);
			updateItemOdds($("#numPanel .numRow .item" + (1001 + i) + " .oddsCell"), window.top.rateData[itemId][curRate]);
		}
		else
			updateItemOdds($("#numPanel .numRow .item" + (1001 + i) + " .oddsCell"), -1);
	}	
	switch(betType){
		case 101 : 
			$("#cueRate").text("特码" + (curRate == 0 ? "A" : "B") + "盘");
			if(window.top.lotteryData.status == OPEN_STATUS && especialNumCloseTime > 0){
				// 特单特双
				updateItemOdds($("#numPanel .towBox .twoRow .two2001 .oddsCell"), window.top.rateData[1012001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two2002 .oddsCell"), window.top.rateData[1012002][curRate]);
				// 特大特小
				updateItemOdds($("#numPanel .towBox .twoRow .two3001 .oddsCell"), window.top.rateData[1013001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two3002 .oddsCell"), window.top.rateData[1013002][curRate]);
				// 合单合双
				updateItemOdds($("#numPanel .towBox .twoRow .two4001 .oddsCell"), window.top.rateData[1014001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two4002 .oddsCell"), window.top.rateData[1014002][curRate]);
				// 红蓝绿波
				updateItemOdds($("#numPanel .towBox .twoRow .two5001 .oddsCell"), window.top.rateData[1015001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two5002 .oddsCell"), window.top.rateData[1015002][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two5003 .oddsCell"), window.top.rateData[1015003][curRate]);
				// 特尾大小
				updateItemOdds($("#numPanel .towBox .twoRow .two6001 .oddsCell"), window.top.rateData[1016001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two6002 .oddsCell"), window.top.rateData[1016002][curRate]);
				// 野兽家禽
				updateItemOdds($("#numPanel .towBox .twoRow .two7001 .oddsCell"), window.top.rateData[1017001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two7002 .oddsCell"), window.top.rateData[1017002][curRate]);
				$("#numPanel .towBox .twoRow .two2001 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1012001][2]);
				$("#numPanel .towBox .twoRow .two2002 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1012002][2]);
				$("#numPanel .towBox .twoRow .two3001 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1013001][2]);
				$("#numPanel .towBox .twoRow .two3002 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1013002][2]);
				$("#numPanel .towBox .twoRow .two4001 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1014001][2]);
				$("#numPanel .towBox .twoRow .two4002 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1014002][2]);
				$("#numPanel .towBox .twoRow .two5001 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1015001][2]);
				$("#numPanel .towBox .twoRow .two5002 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1015002][2]);
				$("#numPanel .towBox .twoRow .two5003 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1015003][2]);
				$("#numPanel .towBox .twoRow .two6001 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1016001][2]);
				$("#numPanel .towBox .twoRow .two6002 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1016002][2]);
				$("#numPanel .towBox .twoRow .two7001 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1017001][2]);
				$("#numPanel .towBox .twoRow .two7002 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1017002][2]);
			}
			else{
				updateItemOdds($("#numPanel .towBox .twoRow .two2001 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two2002 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two3001 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two3002 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two4001 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two4002 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two5001 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two5002 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two5003 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two6001 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two6002 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two7001 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two7002 .oddsCell"), -1);
			}
		break;
		case 102 : 
		case 103 : 
		case 104 : 
		case 105 : 
		case 106 : 
		case 107 : 
			var titleIndex = (betType % 100) - 1
			$("#cueRate").text("正" + titleIndex + (curRate == 0 ? "A" : "B") + "盘");
			var addIndex = betType * 10000;
			if(window.top.lotteryData.status == OPEN_STATUS && otherNumCloseTime > 0){
				updateItemOdds($("#numPanel .towBox .twoRow .two2001 .oddsCell"), window.top.rateData[addIndex + 2001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two2002 .oddsCell"), window.top.rateData[addIndex + 2002][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two3001 .oddsCell"), window.top.rateData[addIndex + 3001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two3002 .oddsCell"), window.top.rateData[addIndex + 3002][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two4001 .oddsCell"), window.top.rateData[addIndex + 4001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two4002 .oddsCell"), window.top.rateData[addIndex + 4002][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two5001 .oddsCell"), window.top.rateData[addIndex + 5001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two5002 .oddsCell"), window.top.rateData[addIndex + 5002][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two5003 .oddsCell"), window.top.rateData[addIndex + 5003][curRate]);
				$("#numPanel .towBox .twoRow .two2001 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[addIndex + 2001][2]);
				$("#numPanel .towBox .twoRow .two2002 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[addIndex + 2001][2]);
				$("#numPanel .towBox .twoRow .two3001 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[addIndex + 2001][2]);
				$("#numPanel .towBox .twoRow .two3002 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[addIndex + 2001][2]);
				$("#numPanel .towBox .twoRow .two4001 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[addIndex + 2001][2]);
				$("#numPanel .towBox .twoRow .two4002 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[addIndex + 2001][2]);
				$("#numPanel .towBox .twoRow .two5001 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[addIndex + 2001][2]);
				$("#numPanel .towBox .twoRow .two5002 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[addIndex + 2001][2]);
				$("#numPanel .towBox .twoRow .two5003 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[addIndex + 2001][2]);			
			}else{
				updateItemOdds($("#numPanel .towBox .twoRow .two2001 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two2002 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two3001 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two3002 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two4001 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two4002 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two5001 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two5002 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two5003 .oddsCell"), -1);	
			}
		break;
		case 108 : 
			$("#cueRate").text("正码" + (curRate == 0 ? "A" : "B") + "盘");
			if(window.top.lotteryData.status == OPEN_STATUS && otherNumCloseTime > 0){
				updateItemOdds($("#numPanel .towBox .twoRow .two2001 .oddsCell"), window.top.rateData[1082001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two2002 .oddsCell"), window.top.rateData[1082002][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two3001 .oddsCell"), window.top.rateData[1083001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two3002 .oddsCell"), window.top.rateData[1083002][curRate]);
				$("#numPanel .towBox .twoRow .two2001 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1082001][2]);
				$("#numPanel .towBox .twoRow .two2002 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1082002][2]);
				$("#numPanel .towBox .twoRow .two3001 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1083001][2]);
				$("#numPanel .towBox .twoRow .two3002 .oddsCell").attr('data-creditplaytypeid', window.top.rateData[1083002][2]);	
			} else{
				updateItemOdds($("#numPanel .towBox .twoRow .two2001 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two2002 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two3001 .oddsCell"), -1);
				updateItemOdds($("#numPanel .towBox .twoRow .two3002 .oddsCell"), -1);
			}
		break;
	}
	$("#numPanel").attr("info", betType);
}

function setSAnimalPanel(){
	$("#cueRate").text("特码生肖");
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".systemTable").hide();
	updateSAnimalOdds();
	$("#sAnimalPanel").show();
}

function updateSAnimalOdds(){
	otherNumCloseTime = 100
	for(var i = 0; i < 12; i++){
		if(window.top.lotteryData.status == OPEN_STATUS && otherNumCloseTime > 0) {
			$("#sAnimalPanel .systemCont .numRow .oddsCell:eq(" + i + ")").attr('data-creditplaytypeid', window.top.rateData[1091001 + i][2]);
			updateItemOdds($("#sAnimalPanel .systemCont .numRow .oddsCell:eq(" + i + ")"), window.top.rateData[1091001 + i][0]);
		}
		else
			updateItemOdds($("#sAnimalPanel .systemCont .numRow .oddsCell:eq(" + i + ")"), -1);
	}
}

function setColorTwoPanel(){
	$("#cueRate").text("半波");
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".systemTable").hide();
	updateColorTwoOdds();
	$("#colorTwoPanel").show();
}

function updateColorTwoOdds(){
	otherNumCloseTime = 100
	for(var i = 0; i < 12; i++){
		if(window.top.lotteryData.status == OPEN_STATUS && otherNumCloseTime > 0) {
			$("#colorTwoPanel .systemCont .numRow .oddsCell:eq(" + i + ")").attr('data-creditplaytypeid', window.top.rateData[1111001 + i][2]);
			updateItemOdds($("#colorTwoPanel .systemCont .numRow .oddsCell:eq(" + i + ")"), window.top.rateData[1111001 + i][0]);
		}
		else
			updateItemOdds($("#colorTwoPanel .systemCont .numRow .oddsCell:eq(" + i + ")"), -1);
	}
}

function setAnimal6Panel(){
	$(".ctrlPanel .ctrlCont .animal6Ctrl .selected").removeClass("selected");
	$(".ctrlPanel .ctrlCont .animal6Ctrl .radio:eq(" + animal6RadioIndex + ")").addClass("selected");
	$("#cueRate").text("六肖");
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	updateAnimal6Odds();
	$(".ctrlPanel .ctrlCont .animal6Ctrl").show();
	$(".systemTable").hide();
	$("#animal6Panel").show();
}

function updateAnimal6Odds(){
	otherNumCloseTime = 100
	if(window.top.lotteryData.status == OPEN_STATUS && otherNumCloseTime > 0){
		updateItemOdds($(".ctrlPanel .ctrlCont .animal6Ctrl .odds:eq(0)"), window.top.rateData[1141001][0]);
		updateItemOdds($(".ctrlPanel .ctrlCont .animal6Ctrl .odds:eq(1)"), window.top.rateData[1141002][0]);
		$(".ctrlPanel .ctrlCont .animal6Ctrl .odds:eq(0)").attr('data-creditplaytypeid', window.top.rateData[1141001][2]);
		$(".ctrlPanel .ctrlCont .animal6Ctrl .odds:eq(0)").attr('data-creditplaytypeid', window.top.rateData[1141002][2]);
		var checkedArr = $("#animal6Panel .systemCont .cell .checkCell .check.selected");
		if(checkedArr.length == 5){
			var num = parseInt(checkedArr.eq(0).attr("info")) % 2;
			var isDisable = true;
			for(var i = 1; i < checkedArr.length; i++){
				if(parseInt(checkedArr.eq(i).attr("info")) % 2 != num){
					isDisable = false;
					break;
				}
			}
			if(isDisable){
				checkedArr = $("#animal6Panel .systemCont .cell .checkCell .check:not(.selected)");
				for(var i = 0; i < checkedArr.length; i++){
					if(parseInt(checkedArr.eq(i).attr("info")) % 2 != num)
						checkedArr.eq(i).removeClass("disable");
				}
			}
			else
				$("#animal6Panel .systemCont .cell .checkCell .check.disable").removeClass("disable");
		}
		else if(checkedArr.length != 6){
			$("#animal6Panel .systemCont .cell .checkCell .check.disable").removeClass("disable");
		}
		$("#animal6Panel .btnRow .betMoneyValue").removeAttr("disabled");
	}
	else{
		updateItemOdds($(".ctrlPanel .ctrlCont .animal6Ctrl .odds:eq(0)"), -1);
		updateItemOdds($(".ctrlPanel .ctrlCont .animal6Ctrl .odds:eq(1)"), -1);
		$("#animal6Panel .btnRow .betMoneyValue").attr("disabled", "disabled");
		$("#animal6Panel .numRow .checkCell .check").addClass("disable");
	}
}

function setAnimal1Panel(betType){
	if(betType == 112)
		$("#cueRate").text("一肖");
	else
		$("#cueRate").text("一肖不中");
		
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".systemTable").hide();
	updateAnimal1Odds(betType);
	$("#animal1Panel").attr("info", betType).show();
}

function updateAnimal1Odds(betType){
	otherNumCloseTime = 100
	var startId = betType * 10000 + 1001
	for(var i = 0; i < 12; i++){
		if(window.top.lotteryData.status == OPEN_STATUS && otherNumCloseTime > 0) {
			updateItemOdds($("#animal1Panel .systemCont .numRow .oddsCell:eq(" + i + ")"), window.top.rateData[startId + i][0]);
			$("#animal1Panel .systemCont .numRow .oddsCell:eq(" + i + ")").attr('data-creditplaytypeid', window.top.rateData[startId + i][2]);
		}
		else
			updateItemOdds($("#animal1Panel .systemCont .numRow .oddsCell:eq(" + i + ")"), -1);
	}
}

function setUnitNumPanel(){
	$("#cueRate").text("尾数");
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".systemTable").hide();
	updateUnitNumOdds();
	$("#unitNumPanel").show();
}

function updateUnitNumOdds(){
	otherNumCloseTime = 100
	for(var i = 0; i < 10; i++){
		if(window.top.lotteryData.status == OPEN_STATUS && otherNumCloseTime > 0) { 
			updateItemOdds($("#unitNumPanel .systemCont .numRow .oddsCell:eq(" + i + ")"), window.top.rateData[1101000 + i][0]);
			$("#unitNumPanel .systemCont .numRow .oddsCell:eq(" + i + ")").attr('data-creditplaytypeid', window.top.rateData[1101000 + i][2]);
		}
		else
			updateItemOdds($("#unitNumPanel .systemCont .numRow .oddsCell:eq(" + i + ")"), -1);
	}
}
var missIndex = 0;
function setMissPanel(index, isInit){
	missIndex = index;
	clearBet();
	switch(index){
		case 0 : missCheckMaxCount = 8; linkCount = 5; localStorage.setItem('creditPlayName', '五不中'); break;
		case 1 : missCheckMaxCount = 9; linkCount = 6; localStorage.setItem('creditPlayName', '六不中'); break;
		case 2 : missCheckMaxCount = 10; linkCount = 7; localStorage.setItem('creditPlayName', '七不中'); break;
		case 3 : missCheckMaxCount = 10; linkCount = 8; localStorage.setItem('creditPlayName', '八不中'); break;
		case 4 : missCheckMaxCount = 11; linkCount = 9; localStorage.setItem('creditPlayName', '九不中'); break;
		case 5 : missCheckMaxCount = 12; linkCount = 10; localStorage.setItem('creditPlayName', '十不中'); break;
	}
	linkBetType = 1381 + index * 10;
	window.top.getDataBetType = linkBetType.toString();
	if(isInit)
		window.top.heartTime = 0;
	$("#cueRate").text("五至十不中");
	$(".missBtnBox .curBtn").removeClass("curBtn");
	$(".missBtnBox .btn:eq(" + index + ")").addClass("curBtn");
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".ctrlPanel .ctrlCont .missBtnBox").show();
	$(".systemTable").hide();
	updateMissOdds();
	$("#missPanel").show();
}

function updateMissOdds(){
	otherNumCloseTime = 100
	var startId = linkBetType * 1000 + 1; 
	if(window.top.lotteryData.status == OPEN_STATUS && otherNumCloseTime > 0){
		$("#missPanel .betRow .betMoneyValue").removeAttr("disabled");
		$("#missPanel .numRow .checkCell .check").removeClass("disable");
		for(var i = 0; i < 49; i++){
			updateItemOdds($("#missPanel .systemCont .numRow .num" + (i + 1) + " .oddsCell"), window.top.rateData[startId + i][0]);
			$("#missPanel .systemCont .numRow .num" + (i + 1) + " .oddsCell").attr('data-creditplaytypeid', window.top.rateData[startId + i][2]);
		}
	}
	else{
		$("#missPanel .betRow .betMoneyValue").attr("disabled", "disabled");
		$("#missPanel .numRow .checkCell .check").addClass("disable");
		for(var i = 0; i < 49; i++){
			updateItemOdds($("#missPanel .systemCont .numRow .num" + (i + 1) + " .oddsCell"), -1);
		}
	}
}

var groupCount = 2;
var groupMiss = false;
function setAnimalLinkPanel(){
	maxSelectedCount = 8;
	$("#cueRate").text("生肖连");
	setAnimalLinkCount(groupCount, false);
	setAnimalLinkIsMiss(groupMiss, false);
	setGroupLinkType("animalLinkPanel", groupLinkType);
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".systemTable").hide();
	if(window.top.lotteryData.status != OPEN_STATUS || otherNumCloseTime <= 0){
		$("#animalLinkPanel .betRow .betMoneyValue").attr("disabled", "disabled");
		$("#animalLinkPanel .numRow .cell .check").addClass("disable");
	}
	else{
		$("#animalLinkPanel .animalLinkCell .radio.selected").removeClass("selected");
		$("#animalLinkPanel .animalLinkCell .animalRadio" + groupCount).addClass("selected");
	}
	setAnimalLinkOdds()
	$("#animalLinkPanel").show();
}

function setAnimalLinkCount(count, updateOdds){
	if(window.top.lotteryData.status != OPEN_STATUS || otherNumCloseTime <= 0)
		return;
	groupCount = count;
	$("#animalLinkPanel .animalLinkCell .radio.selected").removeClass("selected");
	$("#animalLinkPanel .animalLinkCell .animalRadio" + groupCount).addClass("selected");
	if(updateOdds != null || updateOdds != false){
		$("#animalLinkPanel .betRow .betMoneyValue").removeAttr("disabled");
		$("#animalLinkPanel .numRow .cell .check").removeClass("disable");
		setAnimalLinkOdds();
	}
	clearBet();
}

function setAnimalLinkIsMiss(isMiss, updateOdds){
	if(window.top.lotteryData.status != OPEN_STATUS || otherNumCloseTime <= 0)
		return;
	groupMiss = isMiss;
	$("#animalLinkPanel .animalMissTypeCell .radio.selected").removeClass("selected");
	$("#animalLinkPanel .animalMissTypeCell ." + isMiss + "MissRadio").addClass("selected");
	if(updateOdds != null || updateOdds != false){
		$("#animalLinkPanel .betRow .betMoneyValue").removeAttr("disabled");
		$("#animalLinkPanel .numRow .cell .check").removeClass("disable");
		setAnimalLinkOdds();
	}
	clearBet();
}

function setAnimalLinkOdds(){
	otherNumCloseTime = 100
	if(window.top.lotteryData.status == OPEN_STATUS && otherNumCloseTime > 0){
		linkCount = groupCount;
		linkBetType = 1221 + (groupCount - 2) * 20 + (groupMiss ? 10 : 0)
		var startId = linkBetType * 1000 + 1; 
		for(var i = 0; i < 12; i++){
			updateItemOdds($("#animalLinkPanel .systemCont .numRow .oddsCell:eq(" + i + ")"), window.top.rateData[startId + i][0]);
			$("#animalLinkPanel .systemCont .numRow .oddsCell:eq(" + i + ")").attr('data-creditplaytypeid', window.top.rateData[startId + i][2]);
		}
	}
	else{
		for(var i = 0; i < 12; i++){
			updateItemOdds($("#animalLinkPanel .systemCont .numRow .oddsCell:eq(" + i + ")"), -1);
		}
	}
}

function setUnitLinkPanel(){
	maxSelectedCount = 8;
	$("#cueRate").text("尾数连");
	setUnitLinkCount(groupCount, false);
	setUnitLinkIsMiss(groupMiss, false);
	setGroupLinkType("unitLinkPanel", groupLinkType);
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".systemTable").hide();
	if(window.top.lotteryData.status != OPEN_STATUS || otherNumCloseTime <= 0){
		$("#unitLinkPanel .betRow .betMoneyValue").attr("disabled", "disabled");
		$("#unitLinkPanel .numRow .cell .check").addClass("disable");
	}
	else{
		$("#unitLinkPanel .betRow .betMoneyValue").removeAttr("disabled");
		$("#unitLinkPanel .numRow .cell .check").removeClass("disable");
	}
	setUnitLinkOdds(groupCount, groupMiss)
	$("#unitLinkPanel").show();
}

function setUnitLinkCount(count, updateOdds){
	if(window.top.lotteryData.status != OPEN_STATUS || otherNumCloseTime <= 0)
		return;
	groupCount = count;
	$("#unitLinkPanel .unitLinkCell .radio.selected").removeClass("selected");
	$("#unitLinkPanel .unitLinkCell .unitRadio" + groupCount).addClass("selected");
	if(updateOdds != null || updateOdds != false){
		$("#unitLinkPanel .betRow .betMoneyValue").removeAttr("disabled");
		$("#unitLinkPanel .numRow .cell .check").removeClass("disable");
		setUnitLinkOdds();
	}
	clearBet();
}

function setUnitLinkIsMiss(isMiss, updateOdds){
	if(window.top.lotteryData.status != OPEN_STATUS || otherNumCloseTime <= 0)
		return;
	groupMiss = isMiss;
	$("#unitLinkPanel .unitMissTypeCell .radio.selected").removeClass("selected");
	$("#unitLinkPanel .unitMissTypeCell ." + isMiss + "MissRadio").addClass("selected");
	if(updateOdds != null || updateOdds != false){
		$("#unitLinkPanel .betRow .betMoneyValue").removeAttr("disabled");
		$("#unitLinkPanel .numRow .cell .check").removeClass("disable");
		setUnitLinkOdds();
	}
	clearBet();
}

function setUnitLinkOdds(){
	otherNumCloseTime = 100
	if(window.top.lotteryData.status == OPEN_STATUS && otherNumCloseTime > 0){
		linkCount = groupCount;
		linkBetType = 1301 + (groupCount - 2) * 20 + (groupMiss ? 10 : 0)
		var startId = linkBetType * 1000; 
		for(var i = 0; i < 10; i++){
			updateItemOdds($("#unitLinkPanel .systemCont .numRow .oddsCell:eq(" + i + ")"), window.top.rateData[startId + i][0]);
			$("#unitLinkPanel .systemCont .numRow .oddsCell:eq(" + i + ")").attr('data-creditplaytypeid', window.top.rateData[startId + i][2]);
		}
	}
	else{
		for(var i = 0; i < 10; i++){
			updateItemOdds($("#unitLinkPanel .systemCont .numRow .oddsCell:eq(" + i + ")"), -1);
		}
	}
}

function clickLinkNumBtn(index, obj){
	obj = $(obj);
	if(obj.hasClass("curBtn") || window.top.lotteryData.status != OPEN_STATUS)
		return;
	canSelect = false;
	$(".linkNumBtnBox .curBtn").removeClass("curBtn");
	obj.addClass("curBtn");
	linkCombType = -1;
	localStorage.setItem('lmType', index)
	setLinkTab(index);
	clearBet();
}
var linkCombType = -1;
function clickLinkCombTypeRadio(type, obj){
	obj = $(obj)
	if(obj.hasClass("selected") || window.top.lotteryData.status != OPEN_STATUS)
		return;
	canSelect = true;
	$(".linkCombType.ctrlBox .selected").removeClass("selected");
	obj.addClass("selected")
	var index = $(".linkNumBtnBox .curBtn").index();
	linkCombType = type;
	window.top.getDataBetType = "0";
	setLinkTab(index);
	window.top.heartTime = 0;
	clearBet();
}

function setLinkTab(linkType){
	$("#cueRate").text("连码");
	$(".linkNumBtnBox .btn").removeClass("curBtn").eq(linkType).addClass("curBtn");
	linkMode = linkType + 1;
	$(".ctrlPanel .ctrlCont .linkCombType .selected").removeClass("selected");
	if(linkCombType >= 0){
		var linkCombTypeObj = $(".ctrlPanel .ctrlCont .linkCombType .radio:eq(" + linkCombType + ")");
		linkCombTypeObj.addClass("selected");
		linkBetType = parseInt(linkCombTypeObj.attr("info"));
		if(linkBetType == 1151 || linkBetType == 1161 || linkBetType == 1171)
			linkCount = 3;
		else
			linkCount = 2;
		window.top.getDataBetType = linkCombTypeObj.attr("info");
	}
	else{
		window.top.getDataBetType = "0";
	}
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".ctrlPanel .ctrlCont .linkNumBtnBox").show();
	$(".systemTable").hide();
	var panelId = "";
	console.log(linkType)
	switch(linkType){
		case 0 : 
			maxSelectedCount = 10;
			$(".ctrlPanel .ctrlCont .linkCombType .ctrlItem:eq(1)").show();
			$(".ctrlPanel .ctrlCont .linkCombType .ctrlItem:eq(2)").show();
			panelId = "linkNormalPanel";
			$("#linkNormalPanel").show();
		break;
		case 1 : 
			maxSelectedCount = 49;
			$(".ctrlPanel .ctrlCont .linkCombType .ctrlItem:eq(1)").show();
			$(".ctrlPanel .ctrlCont .linkCombType .ctrlItem:eq(2)").show();
			panelId = "linkHeadPanel";
		break;
		case 2 : 
			$(".ctrlPanel .ctrlCont .linkCombType .ctrlItem:eq(1)").hide();
			$(".ctrlPanel .ctrlCont .linkCombType .ctrlItem:eq(2)").hide();
			panelId = "linkAnimalPanel";
		break;
		case 3 : 
			$(".ctrlPanel .ctrlCont .linkCombType .ctrlItem:eq(1)").hide();
			$(".ctrlPanel .ctrlCont .linkCombType .ctrlItem:eq(2)").hide();
			panelId = "linkUnitNumPanel";
		break;
		case 4 : 
			$(".ctrlPanel .ctrlCont .linkCombType .ctrlItem:eq(1)").hide();
			$(".ctrlPanel .ctrlCont .linkCombType .ctrlItem:eq(2)").hide();
			panelId = "linkMixturePanel";
		break;
		case 5 : 
			maxSelectedCount = 8;
			$(".ctrlPanel .ctrlCont .linkCombType .ctrlItem:eq(1)").hide();
			$(".ctrlPanel .ctrlCont .linkCombType .ctrlItem:eq(2)").hide();
			panelId = "linkHeadPanel";
		break;
	}
	setLinkPanelOdds(panelId);
	$("#" + panelId).show();
	$(".ctrlPanel .ctrlCont .linkCombType").show();
}

function setLinkPanelOdds(panel){
	$("#" + panel + " .systemCont .numRow .oddsCell .odds").hide();
	var startId1 = linkBetType * 1000 + 1;
	var startId2 = (linkBetType + 1) * 1000 + 1;
	otherNumCloseTime = 100
	if(linkCombType < 0)
		return;
	if(window.top.lotteryData.status != OPEN_STATUS || window.top.rateData[startId1][0] < 0){
		clearBet();
		$("#" + panel + " .systemCont .betRow .betMoneyValue").attr("disabled", "disabled");
	}
	else
		$("#" + panel + " .systemCont .betRow .betMoneyValue").removeAttr("disabled");
		console.log(linkBetType)
	switch(linkBetType){
		case 1151 : 
		case 1181 :
		case 1191 : 
			for(var i = 0; i < 49; i++){
				if(window.top.lotteryData.status == OPEN_STATUS && otherNumCloseTime > 0){
					$("#" + panel + " .systemCont:eq(0) .numRow .num" + (i + 1)).attr('data-creditplaytypeid', window.top.rateData[startId1 + i][2]);
					updateItemOdds($("#" + panel + " .systemCont:eq(0) .numRow .num" + (i + 1) + " .odds1").show(), window.top.rateData[startId1 + i][0]);
					if(linkMode == 2 || linkMode == 5 || linkMode == 6) {
						updateItemOdds($("#" + panel + " .systemCont:eq(1) .numRow .num" + (i + 1) + " .odds1").show(), window.top.rateData[startId1 + i][0]);
						$("#" + panel + " .systemCont:eq(1) .numRow .num" + (i + 1)).attr('data-creditplaytypeid', window.top.rateData[startId1 + i][2]);	
					}
				}
				else{
					updateItemOdds($("#" + panel + " .systemCont:eq(0) .numRow .num" + (i + 1) + " .odds1").show(), -1);
					if(linkMode == 2 || linkMode == 5 || linkMode == 6)
						updateItemOdds($("#" + panel + " .systemCont:eq(1) .numRow .num" + (i + 1) + " .odds1").show(), -1);
				}
			}
		break;
		case 1161 :
		case 1171 : 
		case 1201 :
			for(var i = 0; i < 49; i++){
				if(window.top.lotteryData.status == OPEN_STATUS && otherNumCloseTime > 0){	
					updateItemOdds($("#" + panel + " .systemCont:eq(0) .numRow .num" + (i + 1) + " .odds2").show(), window.top.rateData[startId1 + i][0]);
					updateItemOdds($("#" + panel + " .systemCont:eq(0) .numRow .num" + (i + 1) + " .odds3").show(), window.top.rateData[startId2 + i][1]);
					$("#" + panel + " .systemCont:eq(0) .numRow .num" + (i + 1)).attr('data-creditplaytypeid', window.top.rateData[startId1 + i][2]);
					$("#" + panel + " .systemCont:eq(0) .numRow .num" + (i + 1)).attr('data-creditplaytypeid', window.top.rateData[startId2 + i][2]);
					if(linkMode == 2 || linkMode == 5 || linkMode == 6){
						updateItemOdds($("#" + panel + " .systemCont:eq(1) .numRow .num" + (i + 1) + " .odds2").show(), window.top.rateData[startId1 + i][0]);
						updateItemOdds($("#" + panel + " .systemCont:eq(1) .numRow .num" + (i + 1) + " .odds3").show(), window.top.rateData[startId2 + i][1]);
						$("#" + panel + " .systemCont:eq(1) .numRow .num" + (i + 1)).attr('data-creditplaytypeid', window.top.rateData[startId1 + i][2]);
						$("#" + panel + " .systemCont:eq(1) .numRow .num" + (i + 1)).attr('data-creditplaytypeid', window.top.rateData[startId2 + i][2]);
					}
				}
				else{	
					updateItemOdds($("#" + panel + " .systemCont:eq(0) .numRow .num" + (i + 1) + " .odds2").show(), -1);
					updateItemOdds($("#" + panel + " .systemCont:eq(0) .numRow .num" + (i + 1) + " .odds3").show(), -1);
					if(linkMode == 2 || linkMode == 5 || linkMode == 6){
						updateItemOdds($("#" + panel + " .systemCont:eq(1) .numRow .num" + (i + 1) + " .odds2").show(), -1);
						updateItemOdds($("#" + panel + " .systemCont:eq(1) .numRow .num" + (i + 1) + " .odds3").show(), -1);
					}
				}
			}
		break;
	}
}

function initLinkAnimalPanel(id){
	var html = '';
	for(var i = 0; i < 6; i++){
		html += '<div class="row numRow">'
				+ getLinkAnimalPanelItem(i)
				+ '<div class="cell w50 animal' + (i + 1) + '"><div class="check" info="' + i + '" onclick="clickLinkPairCheck(\'' + id + '\', this)"></div></div>'
				+ getLinkAnimalPanelItem(i + 6)
				+ '<div class="cell w50 animal' + (i + 7) + '"><div class="check" info="' + (i + 6) + '" onclick="clickLinkPairCheck(\'' + id + '\', this)"></div></div>'
			+ '</div>'
	}			
	$("#" + id + " .systemCont:eq(0)").html(html);
}

function initLinkMixtureAnimalPanel(){
	var html = '';
	for(var i = 0; i < 6; i++){
		html += '<div class="row numRow">'
				+ getLinkAnimalPanelItem(i)
				+ '<div class="cell w50 animal' + (i + 1) + '"><div class="check" info="' + i + '" onclick="clickLinkMixtureCheck(\'animalMixSystemCont\', this)"></div></div>'
				+ getLinkAnimalPanelItem(i + 6)
				+ '<div class="cell w50 animal' + (i + 7) + '"><div class="check" info="' + (i + 6) + '" onclick="clickLinkMixtureCheck(\'animalMixSystemCont\', this)"></div></div>'
			+ '</div>'
	}			
	$("#animalMixSystemCont").html(html);
}

function getLinkAnimalPanelItem(index){
	var html = '<div class="cell w50"><div class="animalCell">' + window.top.animalNumArr[index].animal + '</div></div>';
	for(var i = 0; i < 5; i++){
		var className = 'cell w80'
		var contentHtml = '';
		var num = 0;
		if(i < window.top.animalNumArr[index].numArr.length){
			var num = window.top.animalNumArr[index].numArr[i];
			className += ' num' + num;
			numStr = num < 10 ? '0' + num : '' + num;	
			contentHtml = '<div class="numCell num' + num + '"><div class="' + ballInfoObj[numStr].color + 'Ball">' + numStr + '</div></div><div class="oddsCell"><div class="odds odds1"></div><div class="odds odds2"></div><div class="odds odds3"></div></div>'
		}
		html += '<div class="' + className + '">'
				+ contentHtml
			+ '</div>';
	}
	return html;
}

function initAnimalLinkPanel(){
	var html = '';
	for(var i = 0; i < 6; i++){
		html += '<div class="row numRow">'
				+ getAnimalLinkPanelItem(i * 2)
				+ getAnimalLinkPanelItem(i * 2 + 1)
			+ '</div>'
	}			
	$("#animalLinkPanel .systemCont:eq(0)").html(html);
}

function getAnimalLinkPanelItem(index){
	var html = '<div class="cell w340">'
				+ '<div class="animalCell">' + window.top.animalNumArr[index].animal + '</div>';
	for(var i = 0; i < 5; i++){
		html += '<div class="numCell">';
		if(i < window.top.animalNumArr[index].numArr.length){
			var num = window.top.animalNumArr[index].numArr[i];
			var numStr = num < 10 ? '0' + num : '' + num;	
			html += '<div class="' + ballInfoObj[numStr].color + 'Ball">' + numStr + '</div>'
		}
		html += '</div>';
	}
	index = index < 10 ? '0' + index : index
	html += '<div class="oddsCell">封单</div>'
		+ '<div class="checkCell"><div class="check" info="' + index + '" onclick="clickGroupLinkCheck(\'animalLinkPanel\', this)"></div></div>'
		+ '</div>'
	return html;
}

function initAnimalPanel(id){
	var num = 0;
	var numStr = "";
	for(var i = 0; i < 12; i++){
		for(var j = 0; j < 5; j++){
			if(j < window.top.animalNumArr[i].numArr.length){
				num = window.top.animalNumArr[i].numArr[j];
				numStr = num < 10 ? '0' + num : '' + num;	
				$("#" + id + " .systemCont .cell:eq(0" + i + ") .numCell:eq(" + j + ")").html('<div class="' + ballInfoObj[numStr].color + 'Ball">' + numStr + '</div>');
			}
		}
	}		
}

function clickQuickBetType(type){
	var money = $(".quickBet .betMoneyValue").val();
	if(money == "")
		return;
	var key = "";
	var targetType = "";
	switch(type){
		case 0 : key = "oe"; targetType = "odd"; break;
		case 1 : key = "oe"; targetType = "even"; break;
		case 2 : key = "bs"; targetType = "big"; break;
		case 3 : key = "bs"; targetType = "small"; break;
		case 4 : key = "nsoe"; targetType = "odd"; break;
		case 5 : key = "nsoe"; targetType = "even"; break;
		case 6 : key = "color"; targetType = "red"; break;
		case 7 : key = "color"; targetType = "blue"; break;
		case 8 : key = "color"; targetType = "green"; break;
	}
	for(var num in ballInfoObj){
		if(ballInfoObj[num][key] == targetType){
			var realNum = parseInt(num);
			$("#numPanel .systemCont .num" + realNum + " .betMoneyValue").val(money);
		}
	}
}

var animal6RadioIndex = 0;
function clickAnimal6Radio(index, obj){
	obj = $(obj);
	if(obj.hasClass("selected") || window.top.lotteryData.status != OPEN_STATUS)
		return;
	$(".ctrlPanel .ctrlCont .animal6Ctrl .radio.selected").removeClass("selected");
	obj.addClass("selected");
	animal6RadioIndex = index;
	clearBet();
}

function checkAnimal6(obj){
	obj = $(obj);
	if(obj.hasClass("selected")){
		var checkedArr = $("#animal6Panel .systemCont .cell .checkCell .check.selected");
		obj.removeClass("selected");
		checkedArr = $("#animal6Panel .systemCont .cell .checkCell .check.selected");
		if(checkedArr.length == 5){
			var num = parseInt(checkedArr.eq(0).attr("info")) % 2;
			var isDisable = true;
			for(var i = 1; i < checkedArr.length; i++){
				if(parseInt(checkedArr.eq(i).attr("info")) % 2 != num){
					isDisable = false;
					break;
				}
			}
			if(isDisable){
				checkedArr = $("#animal6Panel .systemCont .cell .checkCell .check:not(.selected)");
				for(var i = 0; i < checkedArr.length; i++){
					if(parseInt(checkedArr.eq(i).attr("info")) % 2 != num)
						checkedArr.eq(i).removeClass("disable");
				}
			}
			else
				$("#animal6Panel .systemCont .cell .checkCell .check.disable").removeClass("disable");
		}
		else if(checkedArr.length < 5){
			$("#animal6Panel .systemCont .cell .checkCell .check.disable").removeClass("disable");
		}
	}
	else{
		var checkedArr = $("#animal6Panel .systemCont .cell .checkCell .check.selected");
		if(obj.hasClass("disable") || checkedArr.length == 6)
			return;
		obj.addClass("selected");
		checkedArr = $("#animal6Panel .systemCont .cell .checkCell .check.selected");
		if(checkedArr.length == 6)
			$("#animal6Panel .systemCont .cell .checkCell .check:not(.selected)").addClass("disable");
		if(checkedArr.length == 5){
			var num = parseInt(checkedArr.eq(0).attr("info")) % 2;
			var isDisable = true;
			for(var i = 1; i < checkedArr.length; i++){
				if(parseInt(checkedArr.eq(i).attr("info")) % 2 != num){
					isDisable = false;
					break;
				}
			}
			if(isDisable){
				checkedArr = $("#animal6Panel .systemCont .cell .checkCell .check:not(.selected)");
				for(var i = 0; i < checkedArr.length; i++){
					if(parseInt(checkedArr.eq(i).attr("info")) % 2 == num){
						checkedArr.eq(i).addClass("disable");
					}
				}
			}
		}		
	}
}

function clearBetAnimal6(){
	$("#animal6Panel .systemCont .cell .checkCell .check.selected").removeClass("selected");
	$("#animal6Panel .systemCont .cell .checkCell .check.disable").removeClass("disable");
	clearBet();
}

function clearBet(){
	$(".systemTable .betMoneyValue").val("");
	$(".systemTable .numCell .selected").removeClass("selected")
										.removeClass("redBall")
										.removeClass("blueBall")
										.removeClass("greenBall")
										.addClass("ball");
	$(".systemTable .numRow .check").removeClass("selected")
										.removeClass("disable");
	$(".systemTable .groupCount").text(0);
	$(".systemTable .linkNum").text("");
	$(".systemTable .checkCell .check").removeClass("selected").removeClass("disable");
	$(".systemTable .infoRow .info").text("");
	$(".systemTable .groupCount").text("0");
	$(".systemTable .itemCount").text("0");
	$(".systemTable .ballCount").text("0");
	$(".systemTable .linkHeadCell").html("");
	window.top.quickBetClear();
}

function bet(panelId){
	console.log(panelId)
	if(window.top.lotteryData.status != OPEN_STATUS)
		return;
	var panel = $("#" + panelId)
	var betMoneyValueArr = panel.find(".cell .betMoneyCell .betMoneyValue");
	var betType = panel.attr("info");
	var betContent = "";
	var bmvObj = null;
	var odds = 0;
	var money = 0;
	var betMap = {};
	var infoArr = [];
	var data = []
	var gameType = localStorage.getItem('gameType')
	for(var i = 0; i < betMoneyValueArr.length; i++){
		bmvObj = $(betMoneyValueArr[i]);
		var curMoney = parseInt(bmvObj.val())
		if(isNaN(curMoney) || curMoney < 0)
			continue;
		odds = bmvObj.parent().siblings(".oddsCell").text();
		if(odds == 0){
			alert("赔率为0不可下注！")
			return;
		}
		betMap["info" + bmvObj.attr("info")] = betType + bmvObj.attr("info") + "-" + odds + "-" + curMoney;
		infoArr.push(bmvObj.attr("info"))
		money += parseInt(curMoney);
		console.log($(betMoneyValueArr[i]))
		if (panelId === 'sAnimalPanel') {
			data.push({
				"gameId": localStorage.getItem('gameId') || 1,
				"gamePeriodId": 20,
				"creditPlayId": localStorage.getItem('creditPlayId'),
				"creditPlayTypeId": $(betMoneyValueArr[i]).parent().prev().attr('data-creditplaytypeid'),
				"content": null,
				"panKou": null,
				"ballNum": $(betMoneyValueArr[i]).parents('.cell').find('.animalCell').text(),
				"rate": $(betMoneyValueArr[i]).parent().prev().text(),
				"commandLogAmount": parseInt(curMoney)
			})
		} else if (panelId === 'colorTwoPanel') {
			data.push({
				"gameId": localStorage.getItem('gameId') || 1,
				"gamePeriodId": 20,
				"creditPlayId": localStorage.getItem('creditPlayId'),
				"creditPlayTypeId": $(betMoneyValueArr[i]).parent().prev().attr('data-creditplaytypeid'),
				"content": null,
				"panKou": null,
				"ballNum": $(betMoneyValueArr[i]).parents('.cell').find('.colorTwoCell').text(),
				"rate": $(betMoneyValueArr[i]).parent().prev().text(),
				"commandLogAmount": parseInt(curMoney)
			})
		} else if (panelId === 'animal1Panel') {
			data.push({
				"gameId": localStorage.getItem('gameId') || 1,
				"gamePeriodId": 20,
				"creditPlayId": localStorage.getItem('creditPlayId'),
				"creditPlayTypeId": $(betMoneyValueArr[i]).parent().prev().attr('data-creditplaytypeid'),
				"content": null,
				"panKou": null,
				"ballNum": $(betMoneyValueArr[i]).parents('.cell').find('.animalCell').text(),
				"rate": $(betMoneyValueArr[i]).parent().prev().text(),
				"commandLogAmount": parseInt(curMoney)
			})
		} else if (panelId === 'unitNumPanel') {
			data.push({
				"gameId": localStorage.getItem('gameId') || 1,
				"gamePeriodId": 20,
				"creditPlayId": localStorage.getItem('creditPlayId'),
				"creditPlayTypeId": $(betMoneyValueArr[i]).parent().prev().attr('data-creditplaytypeid'),
				"content": null,
				"panKou": null,
				"ballNum": $(betMoneyValueArr[i]).parents('.cell').find('.unitNumCell').text(),
				"rate": $(betMoneyValueArr[i]).parent().prev().text(),
				"commandLogAmount": parseInt(curMoney)
			})
		} else {
			data.push({
				"gameId": localStorage.getItem('gameId') || 1,
				"gamePeriodId": 20,
				"creditPlayId": localStorage.getItem('creditPlayId'),
				"creditPlayTypeId": $(betMoneyValueArr[i]).parent().parent().attr('data-creditplaytypeid'),
				"content": null,
				"panKou": localStorage.getItem('pankou') || 'A',
				"ballNum": $(betMoneyValueArr[i]).parent().parent().find('.redBall').text(),
				"rate": $(betMoneyValueArr[i]).parent().parent().find('.oddsCell').text(),
				"commandLogAmount": parseInt(curMoney)
			})
		}
	}
	infoArr.sort();
	for(var i = 0; i < infoArr.length; i++){
		if(betContent != "")
			betContent += ";";
		betContent += betMap["info" + infoArr[i]];
	}
	if(money > window.top.lotteryData.usableMoney){
		alert("余额不足！")
		return;
	}
	if(money <= 0)
		return;
	sendBet(curRate + 1, betContent, data)
}

function betAnimal6(){
	if(window.top.lotteryData.status != OPEN_STATUS)
		return;
	var panel = $("#animal6Panel");
	var curRadio = $(".ctrlPanel .ctrlCont .animal6Ctrl .radio.selected");
	var info = curRadio.attr("info"); 
	var odds = curRadio.siblings(".odds").text();
	console.log(curRadio)
	if(odds == 0){
		alert("赔率为0不可下注！")
		return;
	}
	var checkedArr = $("#animal6Panel .systemCont .cell .checkCell .check.selected");
	var betMoney = parseInt(panel.find(".btnRow .betMoneyValue").val());
	if(checkedArr.length != 6 || isNaN(betMoney) || betMoney < 0){
		alert("请选择6个生肖且输入下注金额！")
		return;
	}
	if(parseInt(betMoney) > window.top.lotteryData.usableMoney){
		alert("余额不足！")
		return;
	}
	var betContent = ''
	var rateEle = curRadio.next().next()
	var data = []
	for(var i = 0; i < checkedArr.length; i++){
		if(i > 0)
			betContent += ",";
		betContent += window.top.animalNumArr[$(checkedArr[i]).attr("info")].animal;
	}
	for(var i = 0; i < checkedArr.length; i++){
		data.push({
			"gameId": localStorage.getItem('gameId') || 1,
			"gamePeriodId": 20,
			"creditPlayId": localStorage.getItem('creditPlayId'),
			"creditPlayTypeId": rateEle.attr('data-creditplaytypeid'),
			"content": betContent,
			"panKou": null,
			"ballNum": $(checkedArr[i]).parents('.cell').find('.animalCell').text(),
			"rate": odds,
			"commandLogAmount": parseInt(betMoney),
			"type":  curRadio.next().text()
		})
	}
	sendBet(1, betContent, data)
}

function sendBet(rateType, betContent, data){
	var gameType = localStorage.getItem('gameType')
	var isSend = confirm("是否下注？");
	if(!isSend)
		return;
	clearBet();
	Send(httpUrlData.generalBet, JSON.stringify(data), function(obj){
		var result = []
		data.forEach(function(item) {
			if (['特肖', '半波'].includes(gameType)) {
				result.push(gameType + ' ' + item.ballNum + '@' + item.rate + '=' + item.commandLogAmount + ' OK')
			} else if (['六肖', '一肖', '一肖不中'].includes(gameType)) {
			} else if (['尾数'].includes(gameType)) {
				result.push(gameType + ' ' + item.ballNum + '@' + item.rate + '=' + item.commandLogAmount + ' OK')
			} else {
				result.push(localStorage.getItem('creditPlayName') + ' ' + item.panKou + '盘 ' + item.ballNum + '@' + item.rate + '=' + item.commandLogAmount + ' OK')
			}
		})
		if (['六肖', '一肖', '一肖不中'].includes(gameType)) {
			var type = gameType + (data[0].type || '')
			result = [type + (data.map(item => item.ballNum)).toString() + '@' + data[0].rate + '=' + data[0].commandLogAmount + ' OK']
		}
		if(obj.status == 1){
			alert("赔率下降");
			window.top.getGameData(window.top.gameArr[window.top.curIndex].id, false, 0);
			return;
		}
		alert("下注成功");
		window.top.showBetResultPanel(result);
		window.top.getGameData(window.top.gameArr[window.top.curIndex].id, false, window.top.lotteryData.rateVersion);
	}, betErr)
}

function betErr(){
	alert("网络延迟，请在下注明细中查看是否成功！");
	window.top.showUseInfoPanel();
	window.top.getGameData(window.top.gameArr[window.top.curIndex].id, false, window.top.localData.rateVersion);
}

var maxSelectedCount = 10;
var linkCount = 3;
var canSelect = false;
function clickLinkBall(obj, index){
	if(!canSelect)
		return;
	var maxCount = linkMode == 2 && index == 1 ? linkCount - 1 : maxSelectedCount;
	obj = $(obj)
	var color = ballInfoObj[obj.text()].color;
	var systemCont = obj.parents(".systemCont");
	if(obj.hasClass("ball")){
		if(systemCont.find(".numCell .selected").length >= maxCount){
			alert("超过" + maxCount + "球，不能选择")
			return;
		}
		if(linkMode == 2 || linkMode == 6){
			var sscBallArr = systemCont.siblings(".systemCont").find(".numCell .selected");
			for(var i = 0; i < sscBallArr.length; i++){
				if(obj.text() == sscBallArr.eq(i).text()){
					return;
				}
			}
		}
		obj.removeClass("ball").addClass(color + "Ball").addClass("selected");
	}
	else{
		obj.addClass("ball").removeClass(color + "Ball").removeClass("selected");
	}
	switch(linkMode){
		case 1 : setSelectedBallInfoNormal(systemCont); break;
		case 2 : setSelectedBallInfoHead(); break;
		case 6 : setSelectedBallInfoPair(); break;
	}	
}

function setSelectedBallInfoNormal(systemCont){
	var linkNumStr = "";
	var linkNumArr = [];
	var ballArr = systemCont.find(".numCell .selected");
	for(var i = 0; i < ballArr.length; i++){
		linkNumArr.push(ballArr.eq(i).text());
	}
	linkNumArr.sort();
	for(var i = 0; i < linkNumArr.length; i++){
		if(i > 0)
			linkNumStr += ",";
		linkNumStr += linkNumArr[i];
	}
	var betCount = getBetCombCount(ballArr.length);
	systemCont.find(".betRow .linkNum").text(linkNumStr);
	systemCont.find(".betRow .groupCount").text(betCount);
}

function setSelectedBallInfoHead(systemCont){
	var headSystemCont = $("#linkHeadPanel .systemCont:eq(0)");
	var badySystemCont = $("#linkHeadPanel .systemCont:eq(1)");
	var linkNumStr = "";
	var linkNumArr = [];
	var headBallArr = headSystemCont.find(".numCell .selected");
	for(var i = 0; i < headBallArr.length; i++){
		linkNumArr.push(headBallArr.eq(i).text());
	}
	linkNumArr.sort();
	for(var i = 0; i < linkNumArr.length; i++){
		if(i > 0)
			linkNumStr += ",";
		linkNumStr += linkNumArr[i];
	}
	linkNumStr += "拖";
	var badyBallArr = badySystemCont.find(".numCell .selected");
	linkNumArr = [];
	for(var i = 0; i < badyBallArr.length; i++){
		linkNumArr.push(badyBallArr.eq(i).text());
	}
	for(var i = 0; i < linkNumArr.length; i++){
		if(i > 0)
			linkNumStr += ",";
		linkNumStr += linkNumArr[i];
	}
	var betCount = headBallArr.length == linkCount - 1 ? badyBallArr.length : 0;
	$("#linkHeadPanel .betRow .linkNum").text(linkNumStr);
	$("#linkHeadPanel .betRow .groupCount").text(betCount);
}

function setSelectedBallInfoPair(systemCont){
	var headSystemCont = $("#linkHeadPanel .systemCont:eq(0)");
	var bodySystemCont = $("#linkHeadPanel .systemCont:eq(1)");
	var linkNumStr = "";
	var headNumArr = [];
	var headBallArr = headSystemCont.find(".numCell .selected");
	for(var i = 0; i < headBallArr.length; i++){
		headNumArr.push(headBallArr.eq(i).text());
	}
	headNumArr.sort();
	var bodyBallArr = bodySystemCont.find(".numCell .selected");
	var bodyNumArr = [];
	for(var i = 0; i < bodyBallArr.length; i++){
		bodyNumArr.push(bodyBallArr.eq(i).text());
	}
	bodyNumArr.sort();
	linkNumStr = headNumArr.join(",") + "碰" + bodyNumArr.join(",");
	
	var combArr = twoArrPairing(headNumArr, bodyNumArr);
	$("#linkHeadPanel .betRow .linkNum").text(linkNumStr);
	$("#linkHeadPanel .betRow .groupCount").text(combArr.length);
}

function getBetCombCount(ballCount){
	var combCount = 0;
	if(ballCount >= linkCount){
		var maxNum = 1;
		var minNum = 1;
		for(var i = 0; i < linkCount; i++){
			maxNum *= ballCount - i;
			minNum *= linkCount - i;
		}
		combCount = maxNum / minNum;
	}
	return combCount;
}

function selectAnimalBall(animalIndex, boxId, index){
	if(!canSelect)
		return;
	var numArr = window.top.animalNumArr[animalIndex].numArr;
	var box = $("#" + boxId);
	var selectedBallArr = box.find(".numCell .selected");
	var count = numArr.length;
	for(var i = 0; i < selectedBallArr.length; i++){
		if(numArr.indexOf(parseInt(selectedBallArr.eq(i).text())) < 0)
			count++;
	}
	if(count > maxSelectedCount){
		alert("超过" + maxSelectedCount + "球，不能选择")
		return;
	}
	var ball = null;
	var color = "";
	var numStr = "";
	for(var i = 0; i < numArr.length; i++){
		ball = box.find(".num" + numArr[i] + " .numCell div");
		if(!ball.hasClass("selected")){
			if(index = 2){
				var isContinue = false;
				var sscBallArr = box.siblings(".systemCont").find(".numCell .selected");
				for(var j = 0; j < sscBallArr.length; j++){
					if(ball.text() == sscBallArr.eq(j).text()){
						isContinue = true;
						break;
					}
				}
				if(isContinue)
					continue;
			}
			numStr = numArr[i] < 10 ? "0" + numArr[i] : "" + numArr[i]
			color = ballInfoObj[numStr].color;
			ball.removeClass("ball").addClass(color + "Ball").addClass("selected");
		}
	}
	switch(linkMode){
		case 1 : setSelectedBallInfoNormal(box); break;
		case 2 : setSelectedBallInfoHead(); break;
		case 6 : setSelectedBallInfoPair(); break;
	}	
}

function clearBall(boxId){
	$("#" + boxId + " .numCell .selected").removeClass("selected")
											.removeClass("redBall")
											.removeClass("blueBall")
											.removeClass("greenBall")
											.addClass("ball");
}
var combArr = [];
function betLinkNormalPanel(){
	var data = []
	var selectedBallArr = $("#linkNormalPanel .numCell .selected");
	linkBetMoney = parseInt($("#linkNormalPanel .betRow .betMoneyValue").val());
	if(selectedBallArr.length < linkCount || isNaN(linkBetMoney))
		return;
	var numArr = [];
	linkBetContent = "";
	var type = localStorage.getItem('lmType')
	for(var i = 0; i < selectedBallArr.length; i++){
		numArr.push(selectedBallArr.eq(i).text());
		var content = type == 1 ? $('#linkNormalPanel').find('.w330 .linkNum').text() : null
		data.push({
			"gameId": localStorage.getItem('gameId') || 1,
			"gamePeriodId": 20,
			"creditPlayId": localStorage.getItem('creditPlayId'),
			"creditPlayTypeId": $(selectedBallArr[i]).parent().parent().attr('data-creditplaytypeid'),
			"content": content,
			"panKou": localStorage.getItem('pankou') || 'A',
			"ballNum": selectedBallArr.eq(i).text(),
			"rate": $(selectedBallArr[i]).parent().parent().find('.odds1').text(),
			"commandLogAmount": parseInt(linkBetMoney)
		})
	}
	betData = data
	numArr.sort();
	linkBetContent = numArr.join(",");
	var combArr = getCombinationResult(numArr, linkCount);
	showLinkBetPanel(combArr);
}

function betLinkHeadPanel(){
	var headSelectedBallArr = $("#linkHeadPanel .systemCont:eq(0) .numCell .selected");
	var badySelectedBallArr = $("#linkHeadPanel .systemCont:eq(1) .numCell .selected");
	var data = []
	linkBetMoney = parseInt($("#linkHeadPanel .betRow .betMoneyValue").val());
	if(headSelectedBallArr.length == 0 || badySelectedBallArr.length == 0 || isNaN(linkBetMoney))
		return;
	if(linkMode == 2 && headSelectedBallArr.length < linkCount - 1)
		return;
		var content = $('#linkHeadPanel').find('.w880 .linkNum').text()
		headSelectedBallArr.each(function() {
			data.push({
				"gameId": localStorage.getItem('gameId') || 1,
				"gamePeriodId": 20,
				"creditPlayId": localStorage.getItem('creditPlayId'),
				"creditPlayTypeId": $(this).parent().parent().attr('data-creditplaytypeid'),
				"content": content,
				"panKou": localStorage.getItem('pankou') || 'A',
				"ballNum": $(this).text(),
				"rate": $(this).parent().parent().find('.odds1').text(),
				"commandLogAmount": parseInt(linkBetMoney)
			})
		})
		badySelectedBallArr.each(function() {
			data.push({
				"gameId": localStorage.getItem('gameId') || 1,
				"gamePeriodId": 20,
				"creditPlayId": localStorage.getItem('creditPlayId'),
				"creditPlayTypeId": $(this).parent().parent().attr('data-creditplaytypeid'),
				"content": content,
				"panKou": localStorage.getItem('pankou') || 'A',
				"ballNum": $(this).text(),
				"rate": $(this).parent().parent().find('.odds1').text(),
				"commandLogAmount": parseInt(linkBetMoney)
			})
		})
		betData = data
	switch(linkMode){
		case 2 : showLinkBetPanelHead(headSelectedBallArr, badySelectedBallArr); break;
		case 6 : showLinkBetPanelPair(headSelectedBallArr, badySelectedBallArr); break;
	}
}

function showLinkBetPanelHead(headSelectedBallArr, badySelectedBallArr){
	linkBetContent = "";
	var combArr = [];
	var num = "";
	var numArr = [];
	for(var i = 0; i < badySelectedBallArr.length; i++){
		numArr.push(badySelectedBallArr.eq(i).text());
	}
	numArr.sort();
	for(var i = 0; i < numArr.length; i++){
		if(linkBetContent != "")
			linkBetContent += ",";
		linkBetContent += numArr[i];
		var newNumArr = [];
		newNumArr.push(numArr[i]);
		combArr.push(newNumArr);
	}
	var headLinkBetContent = "";
	numArr = [];
	for(var i = headSelectedBallArr.length - 1; i >= 0; i--){
		numArr.push(headSelectedBallArr.eq(i).text());
	}
	numArr.sort();
	for(var i = numArr.length - 1; i >= 0; i--){
		if(headLinkBetContent != "")
			headLinkBetContent = "," + headLinkBetContent;
		headLinkBetContent = numArr[i] + headLinkBetContent;
		for(var j = 0; j < combArr.length; j++){
			combArr[j].push(numArr[i]);
		}
	}
	for(var i = 0; i < combArr.length; i++){
		combArr[i].sort();
		combArr[i] = combArr[i].join(",");
	}
	linkBetContent = headLinkBetContent + ";" + linkBetContent;
	showLinkBetPanel(combArr);
}

function showLinkBetPanelPair(headSelectedBallArr, badySelectedBallArr){
	linkBetContent = "";
	var combArr = [];
	var num = "";
	var headNumArr = [];
	for(var i = 0; i < headSelectedBallArr.length; i++){
		headNumArr.push(headSelectedBallArr.eq(i).text());
	}
	headNumArr.sort();
	var bodyNumArr = [];
	for(var i = 0; i < badySelectedBallArr.length; i++){
		bodyNumArr.push(badySelectedBallArr.eq(i).text());
	}
	bodyNumArr.sort();
	linkBetContent = headNumArr.join(",") + ";" + bodyNumArr.join(",");
	for(var i = 0; i < headNumArr.length; i++){
		headNumArr[i] = parseInt(headNumArr[i]);
	}
	for(var i = 0; i < bodyNumArr.length; i++){
		bodyNumArr[i] = parseInt(bodyNumArr[i]);
	}
	var combArr = twoArrPairing(headNumArr, bodyNumArr);
	showLinkBetPanel(combArr);
}

var linkAnimalNumArr = [];
function betLinkAnimalPanel(){
	var data = []
	var selectedCheckArr = $("#linkAnimalPanel .numRow .selected");
	linkBetMoney = parseInt($("#linkAnimalPanel .betRow .betMoneyValue").val());
	if(selectedCheckArr.length < 2 || isNaN(linkBetMoney))
		return;
		linkAnimalNumArr = [];
		linkAnimalNumArr.push(selectedCheckArr.eq(0).attr("info"));
		linkAnimalNumArr.push(selectedCheckArr.eq(1).attr("info"));
		linkAnimalNumArr.sort();
		var content = $('#linkAnimalPanel .linkNum').text()
		console.log($('#linkAnimalPanel .linkNum'))
		selectedCheckArr.eq(0).parents('.row').find('.cell').each(function() {
			if ($(this).attr('data-creditplaytypeid')) {
				var num = $(this).find('.numCell').text() < 10 ? $(this).find('.numCell').text()[1] : $(this).find('.numCell').text()
				if (window.top.animalNumArr[linkAnimalNumArr[0]].numArr.includes(Number(num))) {
					data.push({
						"gameId": localStorage.getItem('gameId') || 1,
						"gamePeriodId": 20,
						"creditPlayId": localStorage.getItem('creditPlayId'),
						"creditPlayTypeId": $(this).attr('data-creditplaytypeid'),
						"content": content,
						"panKou": localStorage.getItem('pankou') || 'A',
						"ballNum": $(this).find('.numCell').text(),
						"rate": $(this).find('.odds1').text(),
						"commandLogAmount": parseInt(linkBetMoney)
					})
				}
			}
		})
		selectedCheckArr.eq(1).parents('.row').find('.cell').each(function() {
			if ($(this).attr('data-creditplaytypeid')) {
				var num = $(this).find('.numCell').text() < 10 ? $(this).find('.numCell').text()[1] : $(this).find('.numCell').text()
				if (window.top.animalNumArr[linkAnimalNumArr[1]].numArr.includes(Number(num))) {
					data.push({
						"gameId": localStorage.getItem('gameId') || 1,
						"gamePeriodId": 20,
						"creditPlayId": localStorage.getItem('creditPlayId'),
						"creditPlayTypeId": $(this).attr('data-creditplaytypeid'),
						"content": content,
						"panKou": localStorage.getItem('pankou') || 'A',
						"ballNum": $(this).find('.numCell').text(),
						"rate": $(this).find('.odds1').text(),
						"commandLogAmount": parseInt(linkBetMoney)
					})
				}
			}
		})
		betData = data
	linkBetContent = window.top.animalNumArr[linkAnimalNumArr[0]].animal  + ";" + window.top.animalNumArr[linkAnimalNumArr[1]].animal;
	var combArr = twoArrPairing(window.top.animalNumArr[linkAnimalNumArr[0]].numArr, window.top.animalNumArr[linkAnimalNumArr[1]].numArr);
	showLinkBetPanel(combArr);
}
var linkUnitNumArr = [];
function betLinkUnitNumPanel(){
	var selectedCheckArr = $("#linkUnitNumPanel .numRow .selected");
	linkBetMoney = parseInt($("#linkUnitNumPanel .betRow .betMoneyValue").val());
	if(selectedCheckArr.length < 2 || isNaN(linkBetMoney))
		return;
	linkUnitNumArr = [];
	linkUnitNumArr.push(parseInt(selectedCheckArr.eq(0).attr("info")));
	linkUnitNumArr.push(parseInt(selectedCheckArr.eq(1).attr("info")));
	linkUnitNumArr.sort();
	linkBetContent = linkUnitNumArr.join(";");
	var numArr1 = [];
	var numArr2 = [];
	var data = []
	for(var i = 0; i < 5; i++){
		if(i > 0 || linkUnitNumArr[0] != 0)
			numArr1.push(i * 10 + linkUnitNumArr[0]);
		numArr2.push(i * 10 + linkUnitNumArr[1]);
	}
	var content = $('#linkUnitNumPanel .linkNum').text()
	selectedCheckArr.eq(0).parents('.row').find('.cell').each(function() {
		if ($(this).attr('data-creditplaytypeid')) {
			var num = $(this).find('.numCell').text() < 10 ? $(this).find('.numCell').text()[1] : $(this).find('.numCell').text()
			if (numArr1.includes(Number(num))) {
				data.push({
					"gameId": localStorage.getItem('gameId') || 1,
					"gamePeriodId": 20,
					"creditPlayId": localStorage.getItem('creditPlayId'),
					"creditPlayTypeId": $(this).attr('data-creditplaytypeid'),
					"content": content,
					"panKou": localStorage.getItem('pankou') || 'A',
					"ballNum": $(this).find('.numCell').text(),
					"rate": $(this).find('.odds1').text(),
					"commandLogAmount": parseInt(linkBetMoney)
				})
			}
		}
	})
	selectedCheckArr.eq(1).parents('.row').find('.cell').each(function() {
		if ($(this).attr('data-creditplaytypeid')) {
			var num = $(this).find('.numCell').text() < 10 ? $(this).find('.numCell').text()[1] : $(this).find('.numCell').text()
			if (numArr2.includes(Number(num))) {
				data.push({
					"gameId": localStorage.getItem('gameId') || 1,
					"gamePeriodId": 20,
					"creditPlayId": localStorage.getItem('creditPlayId'),
					"creditPlayTypeId": $(this).attr('data-creditplaytypeid'),
					"content": content,
					"panKou": localStorage.getItem('pankou') || 'A',
					"ballNum": $(this).find('.numCell').text(),
					"rate": $(this).find('.odds1').text(),
					"commandLogAmount": parseInt(linkBetMoney)
				})
			}
		}
	})
	betData = data
	var combArr = twoArrPairing(numArr1, numArr2);
	showLinkBetPanel(combArr);
}
var linkMixNumArr = [];
var linkMixCombArr = [];
function betLinkMixturePanel(){
	var animalSelectedCheck = $("#animalMixSystemCont .numRow .check.selected");
	var unitNumSelectedCheck = $("#unitNumMixSystemCont .numRow .check.selected");
	linkBetMoney = parseInt($("#linkMixturePanel .betRow .betMoneyValue").val());
	if(animalSelectedCheck.length == 0 || unitNumSelectedCheck.length == 0 || isNaN(linkBetMoney))
		return;
		linkMixNumArr = [];
		linkMixNumArr.push(animalSelectedCheck.attr("info"));
		linkMixNumArr.push(unitNumSelectedCheck.attr("info"));
		console.log(unitNumSelectedCheck.attr("info"))
		var data = []
	var numArr1 = [];
	for(var i = 0; i < 5; i++){
		numArr1.push(i * 10 + Number(linkMixNumArr[1]));
	}
	console.log(window.top.animalNumArr[linkMixNumArr[0]].numArr, numArr1)
	var content = $('#linkAnimalPanel .linkNum').text()
	animalSelectedCheck.parents('.row').find('.cell').each(function() {
		if ($(this).attr('data-creditplaytypeid')) {
			var num = $(this).find('.numCell').text() < 10 ? $(this).find('.numCell').text()[1] : $(this).find('.numCell').text()
			if (window.top.animalNumArr[linkMixNumArr[0]].numArr.includes(Number(num))) {
				data.push({
					"gameId": localStorage.getItem('gameId') || 1,
					"gamePeriodId": 20,
					"creditPlayId": localStorage.getItem('creditPlayId'),
					"creditPlayTypeId": $(this).attr('data-creditplaytypeid'),
					"content": content,
					"panKou": localStorage.getItem('pankou') || 'A',
					"ballNum": $(this).find('.numCell').text(),
					"rate": $(this).find('.odds1').text(),
					"commandLogAmount": parseInt(linkBetMoney)
				})
			}
		}
	})
	unitNumSelectedCheck.parents('.row').find('.cell').each(function() {
		if ($(this).attr('data-creditplaytypeid')) {
			var num = $(this).find('.numCell').text() < 10 ? $(this).find('.numCell').text()[1] : $(this).find('.numCell').text()
			if (numArr1.includes(Number(num))) {
				data.push({
					"gameId": localStorage.getItem('gameId') || 1,
					"gamePeriodId": 20,
					"creditPlayId": localStorage.getItem('creditPlayId'),
					"creditPlayTypeId": $(this).attr('data-creditplaytypeid'),
					"content": content,
					"panKou": localStorage.getItem('pankou') || 'A',
					"ballNum": $(this).find('.numCell').text(),
					"rate": $(this).find('.odds1').text(),
					"commandLogAmount": parseInt(linkBetMoney)
				})
			}
		}
	})
	betData = data
	console.log(data)
	showLinkBetPanel(linkMixCombArr);
}

function betMissPanel(){
	var selectedArr = $("#missPanel .systemCont .cell .checkCell .selected");
	linkBetMoney = parseInt($("#missPanel .betRow .betMoneyValue").val());
	if(selectedArr.length < linkCount || isNaN(linkBetMoney))
		return;
	var numArr = [];
	var data = []
	linkBetContent = "";
	for(var i = 0; i < selectedArr.length; i++){
		numArr.push(selectedArr.eq(i).attr("info"));
	}
	numArr.sort();
	
	for(var i = 0; i < selectedArr.length; i++){
		var selectedParent = selectedArr.eq(i).parents('.cell')
		data.push({
			"gameId": localStorage.getItem('gameId') || 1,
			"gamePeriodId": 20,
			"creditPlayId": localStorage.getItem('creditPlayId'),
			"creditPlayTypeId": selectedParent.find('.oddsCell').attr('data-creditplaytypeid'),
			"content": numArr.toString(),
			"panKou": null,
			"ballNum": selectedParent.find('.numCell').text(),
			"rate": selectedParent.find('.oddsCell').text(),
			"commandLogAmount": parseInt(linkBetMoney)
		})
	}
	betData = data
	linkBetContent = numArr.join(",");
	var combArr = getCombinationResult(numArr, linkCount);
	linkMode = 1;
	var str = "五不中";
	switch(linkCount){
		case 5 : str = "五不中"; break;
		case 6 : str = "六不中"; break;
		case 7 : str = "七不中"; break;
		case 8 : str = "八不中"; break;
		case 9 : str = "九不中"; break;
		case 10 : str = "十不中"; break;
	}
	showLinkBetPanel(combArr, str);
}

function betAnimalLinkPanel(){
	var animalLinkType = $("#animalLinkPanel .ctrlSystemCont .radioRow .linkTypeCell .selected").attr("info");
	var isMiss = $("#animalLinkPanel .ctrlSystemCont .betRow .selected").attr("info");
	var headSelectedArr = $("#animalLinkPanel .systemCont .cell .checkCell .selected.disable");
	var bodySelectedArr = $("#animalLinkPanel .systemCont .cell .checkCell .selected:not(.disable)");
	linkBetMoney = parseInt($("#animalLinkPanel .betRow .betMoneyValue").val());
	var data = []
	if(isNaN(linkBetMoney))
		return;
	var type = "";
	switch(linkCount){
		case 2 : type = "二肖连"; break;
		case 3 : type = "三肖连"; break;
		case 4 : type = "四肖连"; break;
		case 5 : type = "五肖连"; break;
	}
	if(isMiss == "true")
		type += "不中";
	if(animalLinkType == "0"){
		if(bodySelectedArr.length < linkCount)
			return;
		var numArr = [];
		linkBetContent = "";
		for(var i = 0; i < bodySelectedArr.length; i++){
			var num = parseInt(bodySelectedArr.eq(i).attr("info"));
			numArr.push(num);
			if(i > 0)
				linkBetContent += ",";
			linkBetContent += window.top.animalNumArr[num].animal;
		}
		for(var i = 0; i < bodySelectedArr.length; i++){
			var selectedParent = bodySelectedArr.eq(i).parents('.cell')
			data.push({
				"gameId": localStorage.getItem('gameId') || 1,
				"gamePeriodId": 20,
				"creditPlayId": localStorage.getItem('creditPlayId'),
				"creditPlayTypeId": selectedParent.find('.oddsCell').attr('data-creditplaytypeid'),
				"content": linkBetContent,
				"panKou": null,
				"ballNum": selectedParent.find('.animalCell').text(),
				"rate": selectedParent.find('.oddsCell').text(),
				"commandLogAmount": parseInt(linkBetMoney),
				"type": type
			})
		}
		var combArr = getCombinationResult(numArr, linkCount);
		linkMode = 1;
	}
	else{
		if(headSelectedArr.length < linkCount - 1 || bodySelectedArr.length == 0)
			return;
		var combArr = [];
		var linkBetContentBody = "";
		for(var i = 0; i < bodySelectedArr.length; i++){
			var num = parseInt(bodySelectedArr.eq(i).attr("info"));
			combArr.push([bodySelectedArr.eq(i).attr("info")]);
			if(i > 0)
				linkBetContentBody += ",";
			linkBetContentBody += window.top.animalNumArr[num].animal; 
		}
		var linkBetContentHead = "";
		for(var i = 0; i < headSelectedArr.length; i++){
			var num = parseInt(headSelectedArr.eq(i).attr("info"));
			for(var j = 0; j < combArr.length; j++){
				combArr[j].push(headSelectedArr.eq(i).attr("info"));
			}
			if(i > 0)
				linkBetContentHead += ",";
			linkBetContentHead += window.top.animalNumArr[num].animal; 
		}
		for(var i = 0; i < combArr.length; i++){
			combArr[i].sort();
			combArr[i] = combArr[i].join(",");
		}
		for(var i = 0; i < bodySelectedArr.length; i++){
			var selectedParent = bodySelectedArr.eq(i).parents('.cell')
			data.push({
				"gameId": localStorage.getItem('gameId') || 1,
				"gamePeriodId": 20,
				"creditPlayId": localStorage.getItem('creditPlayId'),
				"creditPlayTypeId": selectedParent.find('.oddsCell').attr('data-creditplaytypeid'),
				"content": linkBetContentHead + "拖" + linkBetContentBody,
				"panKou": null,
				"ballNum": selectedParent.find('.animalCell').text(),
				"rate": selectedParent.find('.oddsCell').text(),
				"commandLogAmount": parseInt(linkBetMoney),
				"type": type
			})
		}
		for(var i = 0; i < headSelectedArr.length; i++){
			var selectedParent = headSelectedArr.eq(i).parents('.cell')
			data.push({
				"gameId": localStorage.getItem('gameId') || 1,
				"gamePeriodId": 20,
				"creditPlayId": localStorage.getItem('creditPlayId'),
				"creditPlayTypeId": selectedParent.find('.oddsCell').attr('data-creditplaytypeid'),
				"content": linkBetContentHead + "拖" + linkBetContentBody,
				"panKou": null,
				"ballNum": selectedParent.find('.animalCell').text(),
				"rate": selectedParent.find('.oddsCell').text(),
				"commandLogAmount": parseInt(linkBetMoney),
				"type": type
			})
		}
		linkBetContent = linkBetContentHead + ";" + linkBetContentBody;
		linkMode = 2;
	}
	betData = data
	showLinkBetPanel(combArr, type);
}
function betUnitLinkPanel(){
	var unitLinkType = $("#unitLinkPanel .ctrlSystemCont .radioRow .linkTypeCell .selected").attr("info");
	var isMiss = $("#unitLinkPanel .ctrlSystemCont .betRow .selected").attr("info");
	var headSelectedArr = $("#unitLinkPanel .systemCont:eq(0) .cell .checkCell .selected.disable");
	var bodySelectedArr = $("#unitLinkPanel .systemCont:eq(0) .cell .checkCell .selected:not(.disable)");
	var data = []
	linkBetMoney = parseInt($("#unitLinkPanel .betRow .betMoneyValue").val());
	if(isNaN(linkBetMoney))
		return;
	var type = "";
	switch(linkCount){
		case 2 : type = "二尾连"; break;
		case 3 : type = "三尾连"; break;
		case 4 : type = "四尾连"; break;
		case 5 : type = "五尾连"; break;
	}
	if(isMiss == "true")
		type += "不中";
	if(unitLinkType == "0"){
		if(bodySelectedArr.length < linkCount)
			return;
		var numArr = [];
		linkBetContent = "";
		for(var i = 0; i < bodySelectedArr.length; i++){
			var num = parseInt(bodySelectedArr.eq(i).attr("info"));
			numArr.push(num);
			if(i > 0)
				linkBetContent += ",";
			linkBetContent += num + "尾";
		}
		for(var i = 0; i < bodySelectedArr.length; i++){
			var selectedParent = bodySelectedArr.eq(i).parents('.cell')
			data.push({
				"gameId": localStorage.getItem('gameId') || 1,
				"gamePeriodId": 20,
				"creditPlayId": localStorage.getItem('creditPlayId'),
				"creditPlayTypeId": selectedParent.find('.oddsCell').attr('data-creditplaytypeid'),
				"content": linkBetContent,
				"panKou": null,
				"ballNum": selectedParent.find('.animalCell').text(),
				"rate": selectedParent.find('.oddsCell').text(),
				"commandLogAmount": parseInt(linkBetMoney),
				"type": type
			})
		}
		var combArr = getCombinationResult(numArr, linkCount);
		linkMode = 1;
	}
	else{
		if(headSelectedArr.length < linkCount - 1 || bodySelectedArr.length == 0)
			return;
		var combArr = [];
		var linkBetContentBody = "";
		for(var i = 0; i < bodySelectedArr.length; i++){
			var num = parseInt(bodySelectedArr.eq(i).attr("info"));
			combArr.push([bodySelectedArr.eq(i).attr("info")]);
			if(i > 0)
				linkBetContentBody += ",";
			linkBetContentBody += num + "尾";
		}
		var linkBetContentHead = "";
		for(var i = 0; i < headSelectedArr.length; i++){
			var num = parseInt(headSelectedArr.eq(i).attr("info"));
			for(var j = 0; j < combArr.length; j++){
				combArr[j].push(headSelectedArr.eq(i).attr("info"));
			}
			if(i > 0)
				linkBetContentHead += ",";
			linkBetContentHead += num + "尾";
		}
		for(var i = 0; i < combArr.length; i++){
			combArr[i].sort();
			combArr[i] = combArr[i].join(",");
		}
		for(var i = 0; i < bodySelectedArr.length; i++){
			var selectedParent = bodySelectedArr.eq(i).parents('.cell')
			data.push({
				"gameId": localStorage.getItem('gameId') || 1,
				"gamePeriodId": 20,
				"creditPlayId": localStorage.getItem('creditPlayId'),
				"creditPlayTypeId": selectedParent.find('.oddsCell').attr('data-creditplaytypeid'),
				"content": linkBetContentHead + "拖" + linkBetContentBody,
				"panKou": null,
				"ballNum": selectedParent.find('.animalCell').text(),
				"rate": selectedParent.find('.oddsCell').text(),
				"commandLogAmount": parseInt(linkBetMoney),
				"type": type
			})
		}
		for(var i = 0; i < headSelectedArr.length; i++){
			var selectedParent = headSelectedArr.eq(i).parents('.cell')
			data.push({
				"gameId": localStorage.getItem('gameId') || 1,
				"gamePeriodId": 20,
				"creditPlayId": localStorage.getItem('creditPlayId'),
				"creditPlayTypeId": selectedParent.find('.oddsCell').attr('data-creditplaytypeid'),
				"content": linkBetContentHead + "拖" + linkBetContentBody,
				"panKou": null,
				"ballNum": selectedParent.find('.animalCell').text(),
				"rate": selectedParent.find('.oddsCell').text(),
				"commandLogAmount": parseInt(linkBetMoney),
				"type": type
			})
		}
		linkBetContent = linkBetContentHead + ";" + linkBetContentBody;
		linkMode = 2;
	}
	betData = data
	showLinkBetPanel(combArr, type);
}

function showLinkBetPanel(combArr, type){
	var allBetMoney = linkBetMoney * combArr.length
	if(allBetMoney > window.top.lotteryData.usableMoney){
		alert("余额不足！")
		return;
	}
	if(type == null)
		type = $(".linkCombType.ctrlBox .selected").siblings().text();
	var linkBetContentStr = ""; 
	switch(linkMode){
		case 1 : 
			linkBetContentStr = linkBetContent;
			linkBetContent = linkBetContent.replace(/尾/g, "");
			break;
		case 2 : 
			linkBetContentStr = linkBetContent.replace(";", "拖"); 
			linkBetContent = linkBetContent.replace(/尾/g, "");
			break;
		case 3 : 
			var animalNumArr1 = [];
			var tmpNum = ""
			for(var i = 0; i < window.top.animalNumArr[linkAnimalNumArr[0]].numArr.length; i++){
				tmpNum = window.top.animalNumArr[linkAnimalNumArr[0]].numArr[i];
				tmpNum = tmpNum < 10 ? "0" + tmpNum : "" + tmpNum;
				animalNumArr1.push(tmpNum);
			}
			var animalNumArr2 = [];
			for(var i = 0; i < window.top.animalNumArr[linkAnimalNumArr[1]].numArr.length; i++){
				tmpNum = window.top.animalNumArr[linkAnimalNumArr[1]].numArr[i];
				tmpNum = tmpNum < 10 ? "0" + tmpNum : "" + tmpNum;
				animalNumArr2.push(tmpNum);
			}
			linkBetContentStr = animalNumArr1.join(",") + "碰" + animalNumArr2.join(",");
			break;
		case 4 : 
			var numArr1 = [];
			var numArr2 = [];
			var addStr = "";
			for(var i = 0; i < 5; i++){
				addStr = i == 0 ? "0" : "";
				if(i > 0 || linkUnitNumArr[0] != 0)
					numArr1.push(addStr + (i * 10 + linkUnitNumArr[0]));
				numArr2.push(addStr + (i * 10 + linkUnitNumArr[1]));
			}
			linkBetContentStr = numArr1.join(",") + "碰" + numArr2.join(",");
			break;
		case 5 : 
			var animalNumArr = [];
			var tmpNum = ""
			for(var i = 0; i < window.top.animalNumArr[linkMixNumArr[0]].numArr.length; i++){
				tmpNum = window.top.animalNumArr[linkMixNumArr[0]].numArr[i];
				tmpNum = tmpNum < 10 ? "0" + tmpNum : "" + tmpNum;
				animalNumArr.push(tmpNum);
			}
			var beginIndex = 0;
			var addStr = "0";
			if(linkMixNumArr[1] == 0){
				beginIndex = 1;
			}
			var unitNumArr = []
			for(; beginIndex < 5; beginIndex++){
				if(beginIndex == 0)
					unitNumArr.push(addStr + (beginIndex * 10 + linkMixNumArr[1]));
				else
					unitNumArr.push((beginIndex * 10 + linkMixNumArr[1]));
			}
			linkBetContentStr = animalNumArr.join(",") + "碰" + unitNumArr.join(",");
			break;
		case 6 : 
			linkBetContentStr = linkBetContent.replace(";", "碰"); 
			break;
	}
	var html = '<div>' + type + linkBetContentStr + '</div>'
			+ '<div>组合注数：<span style="color:red;">' + combArr.length + '</span>注</div>';
	var oddsArr = [];
	var animalArr = [];
	var tmpOdds = 999999;
	var id = '';
	linkNumGroup = "";
	for(var i = 0; i < combArr.length; i++){
		var newComb = "";
		if(i > 0)
			linkNumGroup += ";"
		if(type.indexOf("肖连") >= 0){
			numArr = combArr[i].split(",");
			tmpOdds = 999999;
			for(var j = 0; j < numArr.length; j++){
				if(j > 0)
					newComb += ",";
				var num = parseInt(numArr[j]);
				newComb += window.top.animalNumArr[num].animal;
				id = linkBetType * 1000 + num + 1;
				tmpOdds = tmpOdds > window.top.rateData[id][0] ? window.top.rateData[id][0] : tmpOdds;
				if(tmpOdds == 0){
					alert("赔率为0不可下注！")
					return;
				}
			}
			linkNumGroup += newComb + "-";
			combArr[i] = newComb;
			oddsArr = [tmpOdds];
		}
		else if(type.indexOf("尾连") >= 0){
			numArr = combArr[i].split(",");
			tmpOdds = 999999;
			for(var j = 0; j < numArr.length; j++){
				var num = parseInt(numArr[j]);
				id = linkBetType * 1000 + num;
				tmpOdds = tmpOdds > window.top.rateData[id][0] ? window.top.rateData[id][0] : tmpOdds;
				if(tmpOdds == 0){
					alert("赔率为0不可下注！")
					return;
				}
			}
			linkNumGroup += combArr[i] + "-";
			oddsArr = [tmpOdds];
		}
		else{
			linkNumGroup += combArr[i] + "-";
			numArr = combArr[i].split(",");
			oddsArr = [];
			for(var j = 0; j < numArr.length; j++){
				id = linkBetType + "0" + numArr[j];
				if(window.top.rateData[id][0] == 0){
					alert("赔率为0不可下注！")
					return;
				}
				if(oddsArr.length == 0)
					oddsArr.push(window.top.rateData[id][0]);
				else
					oddsArr[0] = oddsArr[0] > window.top.rateData[id][0] ? window.top.rateData[id][0] : oddsArr[0];
				if(linkBetType == 1161 || linkBetType == 1171 || linkBetType == 1201){
					id = (linkBetType + 1) + "0" + numArr[j];
					if(oddsArr.length == 1)
						oddsArr.push(window.top.rateData[id][0]);
					else
						oddsArr[1] = oddsArr[1] > window.top.rateData[id][0] ? window.top.rateData[id][0] : oddsArr[1];
				}
			}
		}
		html += '<div class="betInfo' + combArr[i].replace(/,/g, "") + '">' + combArr[i] + ' 此组赔率：'
		switch(linkBetType){
			case 1151 : 
			case 1181 : 
			case 1191 : 
			case 1221 : 
			case 1231 : 
			case 1241 : 
			case 1251 : 
			case 1261 : 
			case 1271 : 
			case 1281 : 
			case 1291 : 
			case 1301 : 
			case 1311 : 
			case 1321 : 
			case 1331 : 
			case 1341 : 
			case 1351 : 
			case 1361 : 
			case 1371 : 
			case 1381 : 
			case 1391 : 
			case 1401 : 
			case 1411 : 
			case 1421 : 
			case 1431 : 
				html += oddsArr[0] + '</div>';
				linkNumGroup += oddsArr[0];
				break;
			case 1161 : 
			case 1171 : 
				html += '中三' + oddsArr[0] + '中二' + oddsArr[1] + '</div>';
				linkNumGroup += oddsArr[0] + "/" + oddsArr[1];
				break;
			case 1201 : 
				html += '中二' + oddsArr[0] + '中特' + oddsArr[1] + '</div>';
				linkNumGroup += oddsArr[0] + "/" + oddsArr[1];
				break;
		}
	}
	html += '<div>单组金额：' + linkBetMoney + ' 总金额：' + allBetMoney + '</div>';
	$("#linkBetPanel .linkBetContent").html(html);
	$("#linkBetPanel").css("height", parseInt($("body").css("height")) + 10 + "px");
	$("#linkBetPanel").show();
}

//根据号码和组合球数返回组合结果
function getCombinationResult(numArr, ballCount){
    var combinationArr = [];
    combinationArr = GetCombinationBall(numArr, combinationArr, ballCount, 0, "");
    //console.log(combinationArr);
    return combinationArr;
}


/**获取多球组合 */
function GetCombinationBall(numArr, combinationArr, ballCount, startIndex, combination){
    ballCount--;
    for(var i = startIndex; i < numArr.length; i++){
        var newCombination = "";
		if(combination === "")
			newCombination = numArr[i]
		else
			newCombination = combination + "," + numArr[i];
        if(ballCount > 0 && i < numArr.length - ballCount){
            combinationArr = GetCombinationBall(numArr, combinationArr, ballCount, i + 1, newCombination);
        }
        else if(ballCount == 0){
            combinationArr.push(newCombination);
        }
    }
    return combinationArr;
}

function twoArrPairing(arr1, arr2){
	var newArr = [];
	var str1 = "";
	var str2 = "";
	var strNew = "";
	var combArr = [];
	for(var i = 0; i < arr1.length; i++){
		str1 = arr1[i] < 10 ? "0" + arr1[i] : arr1[i] + "";
		for(var j = 0; j < arr2.length; j++){
			str2 = arr2[j] < 10 ? "0" + arr2[j] : arr2[j] + "";
			if(str1 == str2)
				continue;
			newArr = [str1, str2];
			newArr.sort();
			strNew = newArr.join(",");
			if(combArr.indexOf(strNew) >= 0)
				continue;
			combArr.push(strNew);
		}
	}
	return combArr;
}

var linkBetType = 0;
var linkMode = 1;
var linkBetMoney = 0;
var linkBetContent = "";
var linkNumGroup = "";
var betData = []
function sendBetLink(){
	var gameType = localStorage.getItem('gameType')
	var isSend = confirm("是否下注？");
	if(!isSend)
		return;
	clearBet();
	$("#linkBetPanel").hide();
	var data = betData
	Send(httpUrlData.generalBet, JSON.stringify(data), function(obj){
		if(obj.status == 1){
			alert("赔率下降");
			var info = [];
			var betInfoObj = {};
			var str = "";
			var dropRate = obj.dropRate.split(";");
			for(var i = 0; i < dropRate.length; i++){
				info = dropRate[i].split("-");
				var odds = info[2].split("/")
				betInfoObj = $("#linkBetPanel .linkBetContent .betInfo" + info[0].replace(/,/g, ""));
				str = betInfoObj.text()
				if(str.indexOf("中三") >= 0){
					betInfoObj.text(info[0] + " 此组赔率：中三" + odds[0] + "中二" + odds[1]);
				}
				else if(str.indexOf("中特") >= 0){
					betInfoObj.text(info[0] + " 此组赔率：中二" + odds[0] + "中特" + odds[1]);
				}
				else{
					betInfoObj.text(info[0] + " 此组赔率：" + odds[0]);
				}
				betInfoObj.addClass("red");
				linkNumGroup = linkNumGroup.replace(info[0]+ "-" + info[1], info[0]+ "-" + info[2])
			}
			window.top.getGameData(window.top.gameArr[window.top.curIndex].id, false, 0);
			return;
		}
		alert("下注成功");
		var result = []
		var balls = []
		var rates = []
		var money = ''
		var content = ''
		var lmType = localStorage.getItem('lmType')
		var resultStr = ''
		data.forEach(function(item) {
			balls.push(item.ballNum)
			rates.push(item.rate)
			money = item.commandLogAmount
			content = item.content || ''
		})
		switch(lmType) {
			case '1':	
				resultStr = localStorage.getItem('gameType') + $('.linkCombType .radio.selected').next().text() + content + '@' + rates.toString() + '=' + money + ' OK'
				break
			default:
				resultStr = localStorage.getItem('gameType') + $('.linkCombType .radio.selected').next().text() + content + balls.toString() + '@' + rates.toString() + '=' + money + ' OK'
				break
		}
		switch(gameType) {
			case '五不中':
				resultStr = localStorage.getItem('creditPlayName') + $('.linkCombType .radio.selected').next().text() + content + '@' + rates.toString() + '=' + money + ' OK'
				break
			case '生肖连':
			case '尾数连':
				resultStr = data[0].type + content + '@' + rates.toString() + '=' + money + ' OK'
				break

		}
		result = [resultStr]
		window.top.showBetResultPanel(result);
		window.top.getGameData(window.top.gameArr[window.top.curIndex].id, false, window.top.lotteryData.rateVersion);
	},betErr)
}

function betLinkCancel(){
	$("#linkBetPanel").hide();
	clearBet();
}

function clickLinkPairCheck(id, obj){
	if(!canSelect)
		return;
	obj = $(obj)
	var selectedCheckArr = $("#" + id + " .systemCont:eq(0) .numRow .check.selected");
	if(!obj.hasClass("selected")){
		if(selectedCheckArr.length == 2)
			return;
		obj.addClass("selected");
		if(selectedCheckArr.length == 1){
			$("#" + id + " .systemCont:eq(0) .numRow .check:not(.selected)").addClass("disable");
		}
	}
	else{
		if(selectedCheckArr.length == 2)
			$("#" + id + " .systemCont:eq(0) .numRow .check.disable").removeClass("disable");
		obj.removeClass("selected")
	}
	selectedCheckArr = $("#" + id + " .systemCont:eq(0) .numRow .check.selected");
	var selectedArr = [];
	for(var i = 0; i < selectedCheckArr.length; i++){
		selectedArr.push(selectedCheckArr.eq(i).attr("info"));
	}
	selectedArr.sort();
	switch(linkMode){
		case 3 : setLinkAnimalClickInfo(selectedArr); break;
		case 4 : setLinkUnitNumClickInfo(selectedArr); break;
	}
}

function setLinkAnimalClickInfo(selectedArr){
	var linkNumStr = "";
	for(var i = 0; i < selectedArr.length; i++){
		if(i > 0)
			linkNumStr += "碰";
		linkNumStr += window.top.animalNumArr[selectedArr[i]].animal;
	}
	$("#linkAnimalPanel .betRow .linkNum").text(linkNumStr);
	var groupCount = 0;
	if(selectedArr.length == 2)
		groupCount = window.top.animalNumArr[selectedArr[0]].numArr.length * window.top.animalNumArr[selectedArr[1]].numArr.length
	$("#linkAnimalPanel .betRow .groupCount").text(groupCount);
}

function setLinkUnitNumClickInfo(selectedArr){
	var linkNumStr = "";
	for(var i = 0; i < selectedArr.length; i++){
		if(i > 0)
			linkNumStr += "碰";
		linkNumStr += selectedArr[i] + "尾";
	}
	$("#linkUnitNumPanel .betRow .linkNum").text(linkNumStr);
	var groupCount = 0;
	if(selectedArr.length == 2){
		if(selectedArr.indexOf("0") >= 0)
			groupCount = 20;
		else
			groupCount = 25;
	}
	$("#linkUnitNumPanel .betRow .groupCount").text(groupCount);
}

function clickLinkMixtureCheck(id, obj){
	if(!canSelect)
		return;
	obj = $(obj)
	var selectedCheckArr = $("#" + id + " .numRow .check.selected");
	if(!obj.hasClass("selected")){
		if(selectedCheckArr.length == 1){
			selectedCheckArr.removeClass("selected");
		}
		obj.addClass("selected");
	}
	else{
		obj.removeClass("selected")
	}
	var animalSelectedCheck = $("#animalMixSystemCont .numRow .check.selected");
	var unitNumSelectedCheck = $("#unitNumMixSystemCont .numRow .check.selected");
	var linkNumStr = "";
	if(animalSelectedCheck.length > 0){
		linkNumStr = window.top.animalNumArr[animalSelectedCheck.attr("info")].animal;
	}
	if(unitNumSelectedCheck.length > 0){
		linkNumStr += "碰" + unitNumSelectedCheck.attr("info") + "尾";;
	}
	$("#linkMixturePanel .betRow .linkNum").text(linkNumStr);
	var groupCount = 0;
	if(animalSelectedCheck.length > 0 && unitNumSelectedCheck.length > 0){
		linkMixNumArr = [];
		linkMixNumArr.push(parseInt(animalSelectedCheck.attr("info")));
		linkMixNumArr.push(parseInt(unitNumSelectedCheck.attr("info")));
		linkBetContent = window.top.animalNumArr[linkMixNumArr[0]].animal + ";" + linkMixNumArr[1];
		var beginIndex = linkMixNumArr[1] == 0 ? 1 : 0;
		var numArr = []
		for(; beginIndex < 5; beginIndex++){
			numArr.push(beginIndex * 10 + linkMixNumArr[1]);
		}
		linkMixCombArr = twoArrPairing(window.top.animalNumArr[linkMixNumArr[0]].numArr, numArr);
		groupCount = linkMixCombArr.length;
	}
	$("#linkMixturePanel .betRow .groupCount").text(groupCount);
}

var missCheckMaxCount = 7;
function clickMissCheck(obj){
	obj = $(obj);
	if(obj.hasClass("disable"))
		return;
	var selectedArr = $("#missPanel .systemCont .cell .checkCell .selected");
	if(!obj.hasClass("selected")){
		if(selectedArr.length == missCheckMaxCount){
			alert("超过" + missCheckMaxCount + "球，不能选择")
			return;
		}
		obj.addClass("selected");
	}
	else
		obj.removeClass("selected");
	selectedArr = $("#missPanel .systemCont .cell .checkCell .selected");
	var numArr = [];
	for(var i = 0; i < selectedArr.length; i++){
		numArr.push(selectedArr.eq(i).attr("info"))
	}
	var combCount = 0;
	if(numArr.length >= linkCount)
		combCount = getBetCombCount(numArr.length);
	$("#missPanel .systemCont .betRow .ballCount").text(numArr.length);
	$("#missPanel .systemCont .betRow .groupCount").text(combCount);
	$("#missPanel .systemCont .infoRow .info").text(numArr.join(","));
}

function clickGroupLinkCheck(id, obj){
	if(window.top.lotteryData.status != OPEN_STATUS)
		return;
	obj = $(obj);
	var linkType = $("#" + id + " .ctrlSystemCont .radioRow:eq(1) .selected").attr("info");
	var headSelectArr = $("#" + id + " .systemCont:eq(0) .numRow .cell .checkCell .selected.disable");
	var bodySelectArr = $("#" + id + " .systemCont:eq(0) .numRow .cell .checkCell .selected:not(.disable)");
	if(!obj.hasClass("selected")){
		if(headSelectArr.length + bodySelectArr.length == maxSelectedCount){
			alert("超过" + maxSelectedCount + "项，不能选择")
			return;
		}
		if(linkType == "1" && headSelectArr.length < linkCount - 1){
			obj.addClass("disable");
		}
		obj.addClass("selected");
	}
	else{
		if(bodySelectArr.length > 0 && obj.hasClass("disable"))
			return;
		obj.removeClass("selected").removeClass("disable");
	}
	headSelectArr = $("#" + id + " .systemCont:eq(0) .numRow .cell .checkCell .selected.disable");
	bodySelectArr = $("#" + id + " .systemCont:eq(0) .numRow .cell .checkCell .selected:not(.disable)");
	var groupCount = 0;
	if(headSelectArr.length + bodySelectArr.length >= linkCount){
		if(linkType == "0")
			groupCount = getBetCombCount(bodySelectArr.length);
		else if(headSelectArr.length == linkCount - 1)
			groupCount = bodySelectArr.length;
	}
	var info = "";
	var count = 0;
	var headInfo = '';
	if(linkType == "0"){
		info += "[";
		for(var i = 0; i < bodySelectArr.length; i++){
			var num = parseInt(bodySelectArr.eq(i).attr("info"));
			if(i > 0)
				info += ","
			info += linkBetType >= 1301 ? num + "尾" : window.top.animalNumArr[num].animal;
		}
		info += "]";
		count = bodySelectArr.length;
	}
	else{
		info += "[";
		for(var i = 0; i < headSelectArr.length; i++){
			var num = parseInt(headSelectArr.eq(i).attr("info"));
			var itemInfo = linkBetType >= 1301 ? num + "尾" : window.top.animalNumArr[num].animal;
			if(i > 0)
				info += ","
			info += itemInfo
			var index = "";
			switch(i){
				case 0: index = "一"; break;
				case 1: index = "二"; break;
				case 2: index = "三"; break;
				case 3: index = "四"; break;
			}
			headInfo += '<div class="headCell"><div class="label">胆' + index + '：<span class="head1">' + itemInfo + '</span></div></div>'
		}
		info += "][";
		for(var i = 0; i < bodySelectArr.length; i++){
			var num = parseInt(bodySelectArr.eq(i).attr("info"));
			if(i > 0)
				info += ","
			info += linkBetType >= 1301 ? num + "尾" : window.top.animalNumArr[num].animal;
		}
		info += "]"
		count = headSelectArr.length + bodySelectArr.length;
	}
	$("#" + id + " .ctrlSystemCont .radioRow .linkHeadCell").html(headInfo);
	$("#" + id + " .ctrlSystemCont .infoRow .itemCount").text(count);
	$("#" + id + " .ctrlSystemCont .infoRow .groupCount").text(groupCount);
	$("#" + id + " .ctrlSystemCont .infoRow .info").text(info);
}
var groupLinkType = 0;
function setGroupLinkType(id, type){
	if(window.top.lotteryData.status != OPEN_STATUS)
		return;
	var obj = $("#" + id + " .ctrlSystemCont .radioRow:eq(1) .radio:eq(" + type + ")")
	if(obj.hasClass("selected"))
		return;
	groupLinkType = type;
	$("#" + id + " .ctrlSystemCont .radioRow:eq(1) .selected").removeClass("selected");
	obj.addClass("selected");
	clearBet();
}

function clickQuickBetBtn(){
	window.top.showQuickBetPanel(curRate, curNsIndex);
}