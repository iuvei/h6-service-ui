var OPEN_STATUS = 1;
var CLOSE_STATUS = 2;
var curRate = 0;
var sClose = false;
var nClose = false;
var preinstallToggleObj;
var preinstallValObj;
$(function(){
	window.top.getGameData(true);
	setSpecialNumTab('init')
	initAnimalPanel();
	initAnimal6Panel();
	preinstallToggleObj = $("#preinstallToggle");
	preinstallValObj = $("#preinstallVal");
	$(".betMoneyValue").click(function (){
		var val = parseInt(preinstallValObj.val());
		if(preinstallToggleObj.is(":checked") && !isNaN(val) && val > 0){
			$(this).val(val);
		}
	})
})

function resetData(){
	linkCombType = 0;
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
	setLotteryTab();
}

var ODDS_UPDATE_TIME = 1000;
var oddUpdateTime = 1000;
var RESULT_TIME = 1000;
var resultTime = 1000;
var curStatusStr = "";
function update(timeFrquency, dt){
	if(oddUpdateTime > 0){
		oddUpdateTime -= timeFrquency;
		if(oddUpdateTime <= 0){
			oddUpdateTime = ODDS_UPDATE_TIME;
			$(".update").removeClass("update")
		}
	}
}

function setLotteryTab(){
	clearBet();
	var dt = new Date();
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
	setNumPanelRate(0);
}

function updateOdds(){
	if(window.top.lotteryData.pkStatus != OPEN_STATUS)
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

function updateItemOdds(obj, odds){
	odds = parseFloat(odds)
	var oddsStr = odds < 0 || window.top.lotteryData.pkStatus != OPEN_STATUS ? "封单" : odds.toString();
	if(obj.text() != oddsStr){
		obj.text(oddsStr).addClass("update");
		oddUpdateTime = ODDS_UPDATE_TIME;
		if(odds < 0 || window.top.lotteryData.pkStatus != OPEN_STATUS){
			obj.siblings(".betMoneyCell").children(".betMoneyValue").attr("disabled", "disabled");
		}
		else{
			obj.siblings(".betMoneyCell").children(".betMoneyValue").removeAttr("disabled");
		}
	}	
}

function setNumPanelRate(rate){
	var curBtn = $("#numPanel .OddsBtn.curBtn");
	if(curBtn.attr("info") == rate || window.top.lotteryData.pkStatus != OPEN_STATUS)	
		return;
	curBtn.removeClass("curBtn");
	$("#numPanel .OddsBtn" + rate).addClass("curBtn");
	curRate = rate;
	switch(window.top.curTab){
		case 0 : initNumPanelOdds(101); break;
		case 1 : initNumPanelOdds(108); break;
		case 2 : initNumPanelOdds(101 + curNsIndex); break;
	}
	clearBet();
}

function setSpecialNumTab(type){
	$("#numPanel .opNumBtnBox .btn").hide();
	$("#numPanel .systemCont:eq(0) .numRow .cell .oddsCell").text("");
	var curBtn = $(".ctrlPanel .ctrlCont .quickBet .OddsBtn.curBtn");
	if(curBtn.attr("info") != 0){
		curBtn.removeClass("curBtn");
		$(".ctrlPanel .ctrlCont .quickBet .OddsBtn" + curRate).addClass("curBtn");
	}
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".ctrlPanel .ctrlCont .quickBet").show();
	$(".systemTable").hide();
	var html = '<tr class="row twoRow">'
					+ '<td class="cell w250 two2001"><div class="twoCell">特单</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="2001" /></div></div>'
					+ '<td class="cell w250 two2002"><div class="twoCell">特双</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="2002" /></div></div>'
					+ '<td class="cell w250 two3001"><div class="twoCell">特大</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="3001" /></div></div>'
					+ '<td class="cell w250 two3002"><div class="twoCell">特小</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="3002" /></div></div>'
				+ '</tr>'
				+ '<tr class="row twoRow">'
					+ '<td class="cell w250 two7002"><div class="twoCell">家禽</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="7002" /></div></td>'
					+ '<td class="cell w250 two7001"><div class="twoCell">野兽</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="7001" /></div></td>'
					+ '<td class="cell w250 two6001"><div class="twoCell">特尾大</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="6001" /></div></td>'
					+ '<td class="cell w250 two6002"><div class="twoCell">特尾小</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="6002" /></div></td>'
				+ '</tr>'
				+ '<tr class="row twoRow">'
					+ '<td class="cell w250 two5001"><div class="twoCell" style="color: red">红波</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="5001" /></div></td>'
					+ '<td class="cell w250 two5002"><div class="twoCell" style="color: blue">蓝波</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="5002" /></div></td>'
					+ '<td class="cell w250 two5003"><div class="twoCell" style="color: green">绿波</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="5003" /></div></td>'
					+ '<td class="cell w250"><div class="twoCell"></div><div class="oddsCell"></div><div class="betMoneyCell"></div></div>'
				+ '</tr>'
				+ '<tr class="row twoRow">'
					+ '<td class="cell w250 two4001"><div class="twoCell">合单</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="4001" /></div></td>'
					+ '<td class="cell w250 two4002"><div class="twoCell">合双</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="4002" /></div></td>'
					+ '<td class="cell w250"><div class="twoCell"></div><div class="oddsCell"></div><div class="betMoneyCell"></div></td>'
					+ '<td class="cell w250"><div class="twoCell"></div><div class="oddsCell"></div><div class="betMoneyCell"></div></td>'
				+ '</tr>';
	$("#numPanel .towBox").empty().append(html);
	initNumPanelOdds(101, type);
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
	window.top.lotteryData.rate.forEach(item => {
		if (item.creditPlayId == localStorage.getItem('creditPlayId')) {
			item.creditPlayTypeDtoList.forEach(s => {
				if (s.creditPlayInfoName == ('正' + index + '特')) {
					sessionStorage.setItem('creditPlayInfoId', s.creditPlayInfoId)
				}
			})
		}
	})
	window.top.heartTime = 0;
}

var curNsIndex = 1;
function setNormalSpecialNumTab(index){
	window.top.getDataBetType = "";
	for(var i = 0; i < 5; i++){
		if(i > 0)
			window.top.getDataBetType += ",";
		window.top.getDataBetType += 1001 + (index + 1) * 10 + i;
	}	
	$("#numPanel .opNumBtnBox .btn").show();
	$("#numPanel .systemCont:eq(0) .numRow .cell .oddsCell").text("");
	var curBtn = $(".ctrlPanel .ctrlCont .quickBet .OddsBtn.curBtn");
	if(curBtn.attr("info") != 0){
		curBtn.removeClass("curBtn");
		$(".ctrlPanel .ctrlCont .quickBet .OddsBtn" + curRate).addClass("curBtn");
	}
	curNsIndex = index;
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".ctrlPanel .ctrlCont .quickBet").show();
	$(".ctrlPanel .ctrlCont .opNumBtnBox").show();
	$(".systemTable").hide();
	var html = '<tr class="row twoRow">'
					+ '<td class="cell w250 two4001"><div class="twoCell">正' + index + '单</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="4001" /></div></td>'
					+ '<td class="cell w250 two4002"><div class="twoCell">正' + index + '双</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="4002" /></div></td>'
					+ '<td class="cell w250 two3001"><div class="twoCell">正' + index + '大</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="3001" /></div></td>'
					+ '<td class="cell w250 two3002"><div class="twoCell">正' + index + '小</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="3002" /></div></td>'
				+ '</tr>'
				+ '<tr class="row twoRow">'
					+ '<td class="cell w250 two5001"><div class="twoCell" style="color: red">红波</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="5001" /></div></td>'
					+ '<td class="cell w250 two5002"><div class="twoCell" style="color: blue">蓝波</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="5002" /></div></td>'
					+ '<td class="cell w250 two5003"><div class="twoCell" style="color: green">绿波</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="5003" /></div></td>'
					+ '<td class="cell w250"><div class="twoCell"></div><div class="oddsCell"></div><div class="betMoneyCell"></div></td>'
				+ '</tr>'
				+ '<tr class="row twoRow">'
					+ '<td class="cell w250 two2001"><div class="twoCell">合单</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="2001" /></div></td>'
					+ '<td class="cell w250 two2002"><div class="twoCell">合双</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="2002" /></div></td>'
					+ '<td class="cell w250"><div class="twoCell"></div><div class="oddsCell"></div><div class="betMoneyCell"></div></td>'
					+ '<td class="cell w250"><div class="twoCell"></div><div class="oddsCell"></div><div class="betMoneyCell"></div></td>'
				+ '</tr>';
	$("#numPanel .towBox").empty().append(html);
	var betType = 101 + index;
	initNumPanelOdds(betType);
	$("#numPanel").show();
}

function setNormalNumTab(){
	$("#numPanel .opNumBtnBox .btn").hide();
	$("#numPanel .systemCont:eq(0) .numRow .cell .oddsCell").text("");
	var curBtn = $(".ctrlPanel .ctrlCont .quickBet .OddsBtn.curBtn");
	if(curBtn.attr("info") != 0){
		curBtn.removeClass("curBtn");
		$(".ctrlPanel .ctrlCont .quickBet .OddsBtn" + curRate).addClass("curBtn");
	}
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".ctrlPanel .ctrlCont .quickBet").show();
	$(".systemTable").hide();
	var html = '<tr class="row twoRow">'
					+ '<td class="cell w250 two2001"><div class="twoCell">总单</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="2001" /></div></td>'
					+ '<td class="cell w250 two2002"><div class="twoCell">总双</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="2002" /></div></td>'
					+ '<td class="cell w250 two3001"><div class="twoCell">总大</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="3001" /></div></td>'
					+ '<td class="cell w250 two3002"><div class="twoCell">总小</div><div class="oddsCell"></div><div class="betMoneyCell"><input type="number" class="betMoneyValue" info="3002" /></div></td>'
				+ '</tr>';
	$("#numPanel .towBox").empty().append(html);
	initNumPanelOdds(108);
	$("#numPanel").show();
}

function initNumPanelOdds(betType, type){
	var numStartIndex = betType * 10000 + 1
	for(var i = 0; i < 49; i++){
		if (type === 'init') {
			updateItemOdds($("#numPanel .numRow .item" + (1001 + i) + " .oddsCell"), -1);
			continue
		}
		var itemId = numStartIndex + 1000 + i;
		// if(window.top.lotteryData.pkStatus == OPEN_STATUS && ((betType == 101 && window.top.especialNumCloseTime > 0) || (betType > 101 && window.top.otherNumCloseTime > 0))) {
		if(window.top.lotteryData.pkStatus == OPEN_STATUS) {
			$("#numPanel .numRow .item" + (1001 + i)).attr('data-creditplaytypeid', window.top.rateData[itemId] && window.top.rateData[itemId][2]);
			updateItemOdds($("#numPanel .numRow .item" + (1001 + i) + " .oddsCell"), window.top.rateData[itemId] && window.top.rateData[itemId][curRate]);
		}
		else
			updateItemOdds($("#numPanel .numRow .item" + (1001 + i) + " .oddsCell"), -1);
	}			
	if (type === 'init') {
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
		return
	}
	switch(betType){
		case 101 : 
			$("#cueRate").text("特码" + (curRate == 0 ? "A" : "B") + "盘");
			// if(window.top.lotteryData.pkStatus == OPEN_STATUS && window.top.especialNumCloseTime > 0){
			if(window.top.lotteryData.pkStatus == OPEN_STATUS){
				updateItemOdds($("#numPanel .towBox .twoRow .two2001 .oddsCell"), window.top.rateData[1012001] &&  window.top.rateData[1012001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two2002 .oddsCell"), window.top.rateData[1012002] &&  window.top.rateData[1012002][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two3001 .oddsCell"), window.top.rateData[1013001] &&  window.top.rateData[1013001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two3002 .oddsCell"), window.top.rateData[1013002] &&  window.top.rateData[1013002][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two4001 .oddsCell"), window.top.rateData[1014001] &&  window.top.rateData[1014001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two4002 .oddsCell"), window.top.rateData[1014002] &&  window.top.rateData[1014002][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two5001 .oddsCell"), window.top.rateData[1015001] &&  window.top.rateData[1015001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two5002 .oddsCell"), window.top.rateData[1015002] &&  window.top.rateData[1015002][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two5003 .oddsCell"), window.top.rateData[1015003] &&  window.top.rateData[1015003][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two6001 .oddsCell"), window.top.rateData[1016001] &&  window.top.rateData[1016001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two6002 .oddsCell"), window.top.rateData[1016002] &&  window.top.rateData[1016002][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two7001 .oddsCell"), window.top.rateData[1017001] &&  window.top.rateData[1017001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two7002 .oddsCell"), window.top.rateData[1017002] &&  window.top.rateData[1017002][curRate]);
				$("#numPanel .towBox .twoRow .two2001").attr('data-creditplaytypeid', window.top.rateData[1012001] &&  window.top.rateData[1012001][2]);
				$("#numPanel .towBox .twoRow .two2002").attr('data-creditplaytypeid', window.top.rateData[1012002] &&  window.top.rateData[1012002][2]);
				$("#numPanel .towBox .twoRow .two3001").attr('data-creditplaytypeid', window.top.rateData[1013001] &&  window.top.rateData[1013001][2]);
				$("#numPanel .towBox .twoRow .two3002").attr('data-creditplaytypeid', window.top.rateData[1013002] &&  window.top.rateData[1013002][2]);
				$("#numPanel .towBox .twoRow .two4001").attr('data-creditplaytypeid', window.top.rateData[1014001] &&  window.top.rateData[1014001][2]);
				$("#numPanel .towBox .twoRow .two4002").attr('data-creditplaytypeid', window.top.rateData[1014002] &&  window.top.rateData[1014002][2]);
				$("#numPanel .towBox .twoRow .two5001").attr('data-creditplaytypeid', window.top.rateData[1015001] &&  window.top.rateData[1015001][2]);
				$("#numPanel .towBox .twoRow .two5002").attr('data-creditplaytypeid', window.top.rateData[1015002] &&  window.top.rateData[1015002][2]);
				$("#numPanel .towBox .twoRow .two5003").attr('data-creditplaytypeid', window.top.rateData[1015003] &&  window.top.rateData[1015003][2]);
				$("#numPanel .towBox .twoRow .two6001").attr('data-creditplaytypeid', window.top.rateData[1016001] &&  window.top.rateData[1016001][2]);
				$("#numPanel .towBox .twoRow .two6002").attr('data-creditplaytypeid', window.top.rateData[1016002] &&  window.top.rateData[1016002][2]);
				$("#numPanel .towBox .twoRow .two7001").attr('data-creditplaytypeid', window.top.rateData[1017001] &&  window.top.rateData[1017001][2]);
				$("#numPanel .towBox .twoRow .two7002").attr('data-creditplaytypeid', window.top.rateData[1017002] &&  window.top.rateData[1017002][2]);
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
			// if(window.top.lotteryData.pkStatus == OPEN_STATUS && window.top.otherNumCloseTime > 0){
			if(window.top.lotteryData.pkStatus == OPEN_STATUS){
				updateItemOdds($("#numPanel .towBox .twoRow .two2001 .oddsCell"), window.top.rateData[addIndex + 2001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two2002 .oddsCell"), window.top.rateData[addIndex + 2002][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two3001 .oddsCell"), window.top.rateData[addIndex + 3001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two3002 .oddsCell"), window.top.rateData[addIndex + 3002][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two4001 .oddsCell"), window.top.rateData[addIndex + 4001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two4002 .oddsCell"), window.top.rateData[addIndex + 4002][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two5001 .oddsCell"), window.top.rateData[addIndex + 5001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two5002 .oddsCell"), window.top.rateData[addIndex + 5002][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two5003 .oddsCell"), window.top.rateData[addIndex + 5003][curRate]);	
				$("#numPanel .towBox .twoRow .two2001").attr('data-creditplaytypeid', window.top.rateData[addIndex + 2001][2]);		
				$("#numPanel .towBox .twoRow .two2002").attr('data-creditplaytypeid', window.top.rateData[addIndex + 2002][2]);		
				$("#numPanel .towBox .twoRow .two3001").attr('data-creditplaytypeid', window.top.rateData[addIndex + 3001][2]);		
				$("#numPanel .towBox .twoRow .two3002").attr('data-creditplaytypeid', window.top.rateData[addIndex + 3002][2]);		
				$("#numPanel .towBox .twoRow .two4001").attr('data-creditplaytypeid', window.top.rateData[addIndex + 4001][2]);		
				$("#numPanel .towBox .twoRow .two4002").attr('data-creditplaytypeid', window.top.rateData[addIndex + 4002][2]);		
				$("#numPanel .towBox .twoRow .two5001").attr('data-creditplaytypeid', window.top.rateData[addIndex + 5001][2]);		
				$("#numPanel .towBox .twoRow .two5002").attr('data-creditplaytypeid', window.top.rateData[addIndex + 5002][2]);		
				$("#numPanel .towBox .twoRow .two5003").attr('data-creditplaytypeid', window.top.rateData[addIndex + 5003][2]);		
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
			// if(window.top.lotteryData.pkStatus == OPEN_STATUS && window.top.otherNumCloseTime > 0){
			if(window.top.lotteryData.pkStatus == OPEN_STATUS){
				updateItemOdds($("#numPanel .towBox .twoRow .two2001 .oddsCell"), window.top.rateData[1082001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two2002 .oddsCell"), window.top.rateData[1082002][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two3001 .oddsCell"), window.top.rateData[1083001][curRate]);
				updateItemOdds($("#numPanel .towBox .twoRow .two3002 .oddsCell"), window.top.rateData[1083002][curRate]);
				$("#numPanel .towBox .twoRow .two2001").attr('data-creditplaytypeid', window.top.rateData[1082001][2]);		
				$("#numPanel .towBox .twoRow .two2002").attr('data-creditplaytypeid', window.top.rateData[1082002][2]);		
				$("#numPanel .towBox .twoRow .two3001").attr('data-creditplaytypeid', window.top.rateData[1083001][2]);		
				$("#numPanel .towBox .twoRow .two3002").attr('data-creditplaytypeid', window.top.rateData[1083002][2]);		
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
	for(var i = 0; i < 12; i++){
		// if(window.top.lotteryData.pkStatus == OPEN_STATUS && window.top.otherNumCloseTime > 0) {
		if(window.top.lotteryData.pkStatus == OPEN_STATUS) {
			updateItemOdds($("#sAnimalPanel .animalRow:not(.title) .oddsCell:eq(" + i + ")"), window.top.rateData[1091001 + i][0]);
			$("#sAnimalPanel .animalRow:not(.title) .oddsCell:eq(" + i + ")").attr('data-creditplaytypeid', window.top.rateData[1091001 + i][2]);
		}
		else
			updateItemOdds($("#sAnimalPanel .animalRow:not(.title) .oddsCell:eq(" + i + ")"), -1);
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
	for(var i = 0; i < 12; i++){
		// if(window.top.lotteryData.pkStatus == OPEN_STATUS && window.top.otherNumCloseTime > 0) {
		if(window.top.lotteryData.pkStatus == OPEN_STATUS) {
			updateItemOdds($("#colorTwoPanel .systemCont .numRow .oddsCell:eq(" + (i + 1) + ")"), window.top.rateData[1111001 + i][0]);
			$("#colorTwoPanel .systemCont .numRow .oddsCell:eq(" + (i + 1) + ")").attr('data-creditplaytypeid', window.top.rateData[1111001 + i][2]);
		}
		else
			updateItemOdds($("#colorTwoPanel .systemCont .numRow .oddsCell:eq(" + (i + 1) + ")"), -1);
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
	var oddId = $("#animal6Panel .animalCtrl .curBtn:eq(0)").attr("info");
	$("#animal6Panel .animalCtrl .curBtn:eq(0)").attr('data-creditplaytypeid', window.top.rateData[oddId][2]);
	var oddsCellArr = $("#animal6Panel .animalRow:not(.title) .oddsCell");
	// if(window.top.lotteryData.pkStatus == OPEN_STATUS && window.top.otherNumCloseTime > 0){
	if(window.top.lotteryData.pkStatus == OPEN_STATUS){
		for(var i = 0; i < oddsCellArr.length; i++)
			updateItemOdds(oddsCellArr.eq(i), window.top.rateData[oddId][0]);
		var checkedArr = $("#animal6Panel .animalRow .animalCheckCell .input:checked");
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
				checkedArr = $("#animal6Panel .animalRow .animalCheckCell  .input:not(:checked)");
				for(var i = 0; i < checkedArr.length; i++){
					if(parseInt(checkedArr.eq(i).attr("info")) % 2 != num)
						checkedArr.eq(i).removeAttr("disabled");
				}
			}
			else
				$("#animal6Panel .animalRow .animalCheckCell .input:disabled").removeAttr("disabled");
		}
		else if(checkedArr.length != 6){
			$("#animal6Panel .animalRow .animalCheckCell .input:disabled").removeAttr("disabled");
		}
		$("#animal6Panel .btnRow .betMoneyValue").removeAttr("disabled");
	}
	else{
		for(var i = 0; i < oddsCellArr.length; i++)
			updateItemOdds(oddsCellArr.eq(i), -1);
		$("#animal6Panel .btnRow .betMoneyValue").attr("disabled", "disabled");
		$("#animal6Panel .animalRow .animalCheckCell .input").attr("disabled", "disabled");
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
	var startId = betType * 10000 + 1001
	for(var i = 0; i < 12; i++){
		// if(window.top.lotteryData.pkStatus == OPEN_STATUS && window.top.otherNumCloseTime > 0) {
		if(window.top.lotteryData.pkStatus == OPEN_STATUS) {
			updateItemOdds($("#animal1Panel .animalRow:not(.title) .oddsCell:eq(" + i + ")"), window.top.rateData[startId + i][0]);
			$("#animal1Panel .animalRow:not(.title) .oddsCell:eq(" + i + ")").parents('.cell').attr('data-creditplaytypeid', window.top.rateData[startId + i][2]);
		}
		else
			updateItemOdds($("#animal1Panel .animalRow:not(.title) .oddsCell:eq(" + i + ")"), -1);
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
	for(var i = 0; i < 10; i++){
		// if(window.top.lotteryData.pkStatus == OPEN_STATUS && window.top.otherNumCloseTime > 0) {
		if(window.top.lotteryData.pkStatus == OPEN_STATUS) {
			updateItemOdds($("#unitNumPanel .unitRow:not(.title) .oddsCell:eq(" + i + ")"), window.top.rateData[1101000 + i][0]);
			$("#unitNumPanel .unitRow:not(.title) .oddsCell:eq(" + i + ")").parents('.cell').attr('data-creditplaytypeid', window.top.rateData[1101000 + i][2]);
		}
		else
			updateItemOdds($("#unitNumPanel .unitRow:not(.title) .oddsCell:eq(" + i + ")"), -1);
	}
}
var missIndex = 0;
function setMissPanel(index, isInit){
	missIndex = index;
	clearBet();
	switch(index){
		case 0 : maxSelectedCount = 8; linkCount = 5; localStorage.setItem('creditPlayName', '五不中'); break;
		case 1 : maxSelectedCount = 9; linkCount = 6; localStorage.setItem('creditPlayName', '六不中'); break;
		case 2 : maxSelectedCount = 10; linkCount = 7; localStorage.setItem('creditPlayName', '七不中'); break;
		case 3 : maxSelectedCount = 10; linkCount = 8; localStorage.setItem('creditPlayName', '八不中'); break;
		case 4 : maxSelectedCount = 11; linkCount = 9; localStorage.setItem('creditPlayName', '九不中'); break;
		case 5 : maxSelectedCount = 12; linkCount = 10; localStorage.setItem('creditPlayName', '十不中'); break;
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
	window.top.lotteryData.rate.forEach(item => {
		if (item.creditPlayId == localStorage.getItem('creditPlayId')) {
			item.creditPlayTypeDtoList.forEach(s => {
				if (s.creditPlayInfoName == localStorage.getItem('creditPlayName')) {
					sessionStorage.setItem('creditPlayInfoId', s.creditPlayInfoId)
				}
			})
		}
	})
	updateMissOdds();
	$("#missPanel").show();
}

function updateMissOdds(){
	var startId = linkBetType * 1000 + 1; 
	// if(window.top.lotteryData.pkStatus == OPEN_STATUS && window.top.otherNumCloseTime > 0){
	if(window.top.lotteryData.pkStatus == OPEN_STATUS){
		$("#missPanel .betRow .betMoneyValue").removeAttr("disabled");
		$("#missPanel .numRow .checkCell .check").removeClass("disable");
		for(var i = 0; i < 49; i++){
			updateItemOdds($("#missPanel .systemCont .numRow .num" + (i + 1) + " .oddsCell"), window.top.rateData[startId + i][0]);
			$("#missPanel .systemCont .numRow .num" + (i + 1)).attr('data-creditplaytypeid', window.top.rateData[startId + i][2]);
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
	setGroupLinkType("animalLinkPanel", groupLinkType);
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".ctrlPanel .ctrlCont .animalLinkType .btn:eq(0)").click();
	$(".ctrlPanel .ctrlCont .animalLinkType").show();
	$(".systemTable").hide();
	// if(window.top.lotteryData.pkStatus != OPEN_STATUS || window.top.otherNumCloseTime <= 0){
	if(window.top.lotteryData.pkStatus != OPEN_STATUS){
		$("#animalLinkPanel .betBox").hide();
	}
	else{
		$("#animalLinkPanel .betBox").show();
	}
	setAnimalLinkOdds()
	$("#animalLinkPanel").show();
}

function clickAnimalLinkTypeBtn(count, obj){
	obj = $(obj);
	if(obj.hasClass("curBtn"))
		return;
	$(".ctrlPanel .ctrlCont .animalLinkType .curBtn").removeClass("curBtn");
	obj.addClass("curBtn");
	groupCount = count;
	window.top.lotteryData.rate.forEach(item => {
		if (item.creditPlayId == localStorage.getItem('creditPlayId')) {
			item.creditPlayTypeDtoList.forEach(s => {
				if (s.creditPlayInfoName == obj.attr('name')) {
					sessionStorage.setItem('creditPlayInfoId', s.creditPlayInfoId)
				}
			})
		}
	})
	setAnimalLinkOdds();
	clearBet();
}

function setAnimalLinkOdds(){
	var info = parseInt($(".ctrlPanel .ctrlCont .animalLinkType .curBtn").attr("info"));
	// if(window.top.lotteryData.pkStatus == OPEN_STATUS && window.top.otherNumCloseTime > 0){
	if(window.top.lotteryData.pkStatus == OPEN_STATUS){
		linkCount = groupCount;
		linkBetType = info
		var startId = linkBetType * 1000 + 1; 
		for(var i = 0; i < 12; i++){
			updateItemOdds($("#animalLinkPanel .animalRow:not(.title) .oddsCell:eq(" + i + ")"), window.top.rateData[startId + i][0]);
			$("#animalLinkPanel .animalRow:not(.title) .oddsCell:eq(" + i + ")").parents('.cell').attr('data-creditplaytypeid', window.top.rateData[startId + i][2]);
		}
	}
	else{
		for(var i = 0; i < 12; i++){
			updateItemOdds($("#animalLinkPanel .animalRow:not(.title) .oddsCell:eq(" + i + ")"), -1);
		}
	}
}

function setUnitLinkPanel(){
	maxSelectedCount = 8;
	$("#cueRate").text("尾数连");
	setGroupLinkType("unitLinkPanel", groupLinkType);
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".ctrlPanel .ctrlCont .unitLinkType .btn:eq(0)").click();
	$(".ctrlPanel .ctrlCont .unitLinkType").show();
	$(".systemTable").hide();
	// if(window.top.lotteryData.pkStatus != OPEN_STATUS || window.top.otherNumCloseTime <= 0){
	if(window.top.lotteryData.pkStatus != OPEN_STATUS){
		$("#unitLinkPanel .betBox").hide();
	}
	else{
		$("#unitLinkPanel .betBox").show();
	}
	setUnitLinkOdds()
	$("#unitLinkPanel").show();
}

function clickUnitLinkTypeBtn(count, obj){
	obj = $(obj);
	if(obj.hasClass("curBtn"))
		return;
	$(".ctrlPanel .ctrlCont .unitLinkType .curBtn").removeClass("curBtn");
	obj.addClass("curBtn");
	groupCount = count;
	window.top.lotteryData.rate.forEach(item => {
		if (item.creditPlayId == localStorage.getItem('creditPlayId')) {
			item.creditPlayTypeDtoList.forEach(s => {
				if (s.creditPlayInfoName == obj.attr('name')) {
					sessionStorage.setItem('creditPlayInfoId', s.creditPlayInfoId)
				}
			})
		}
	})
	setUnitLinkOdds();
	clearBet();
}

function setUnitLinkOdds(){
	var info = parseInt($(".ctrlPanel .ctrlCont .unitLinkType .curBtn").attr("info"));
	// if(window.top.lotteryData.pkStatus == OPEN_STATUS && window.top.otherNumCloseTime > 0){
	if(window.top.lotteryData.pkStatus == OPEN_STATUS){
		linkCount = groupCount;
		linkBetType = info
		var startId = linkBetType * 1000; 
		for(var i = 0; i < 10; i++){
			updateItemOdds($("#unitLinkPanel .unitRow:not(.title) .oddsCell:eq(" + i + ")"), window.top.rateData[startId + i][0]);
			$("#unitLinkPanel .unitRow:not(.title) .oddsCell:eq(" + i + ")").parents('.cell').attr('data-creditplaytypeid', window.top.rateData[startId + i][2]);
		}
	}
	else{
		for(var i = 0; i < 10; i++){
			updateItemOdds($("#unitLinkPanel .unitRow:not(.title) .oddsCell:eq(" + i + ")"), -1);
		}
	}
}

function clickLinkRadio(index, obj){
	obj = $(obj);
	if(obj.hasClass("selected") || window.top.lotteryData.pkStatus != OPEN_STATUS)
		return;
	canSelect = false;
	$(".linkMode .selected").removeClass("selected");
	obj.addClass("selected");
	setLinkTab(index);
	clearBet();
}

var linkCombType = 0;
function clickLinkCombTypeBtn(type, obj){
	obj = $(obj)
	if(obj.hasClass("curBtn") || window.top.lotteryData.pkStatus != OPEN_STATUS)
		return;
	canSelect = true;
	$(".linkCombType.ctrlBox .curBtn").removeClass("curBtn");
	obj.addClass("selected")
	$("#linkPanel .linkMode .selected").removeClass("selected");
	$("#linkPanel .linkMode .radio:eq(0)").addClass("selected");
	linkCombType = type;
	window.top.lotteryData.rate.forEach(item => {
		if (item.creditPlayId == localStorage.getItem('creditPlayId')) {
			item.creditPlayTypeDtoList.forEach(s => {
				if (s.creditPlayInfoName == obj.text()) {
					sessionStorage.setItem('creditPlayInfoId', s.creditPlayInfoId)
				}
			})
		}
	})
	setLinkTab(0);
	clearBet();
	window.top.heartTime = 0;
}

function setLinkTab(linkType){
	$("#cueRate").text("连码");
	$(".linkMode .radio").removeClass("selected").eq(linkType).addClass("selected");
	linkMode = linkType + 1;
	$(".ctrlPanel .ctrlCont .linkCombType .curBtn").removeClass("curBtn");
	var linkCombTypeObj = $(".ctrlPanel .ctrlCont .linkCombType .btn:eq(" + linkCombType + ")");
	linkCombTypeObj.addClass("curBtn");
	linkBetType = parseInt(linkCombTypeObj.attr("info"));
	if(linkBetType == 1151 || linkBetType == 1161 || linkBetType == 1171)
		linkCount = 3;
	else
		linkCount = 2;
	window.top.getDataBetType = linkCombTypeObj.attr("info");
	$(".ctrlPanel .ctrlCont .ctrlBox").hide();
	$(".ctrlPanel .ctrlCont .linkCombType").show();
	$(".systemTable").hide();
	var panelId = "";
	switch(linkType){
		case 0 : 
			maxSelectedCount = 10;
			panelId = "linkNormalPanel";
		break;
		case 1 : 
			maxSelectedCount = 49;
			panelId = "linkNormalPanel";
		break;
		case 2 : 
			panelId = "linkAnimalPanel";
		break;
		case 3 : 
			panelId = "linkUnitNumPanel";
		break;
		case 4 : 
			panelId = "linkMixturePanel";
		break;
		case 5 : 
			maxSelectedCount = 8;
			panelId = "linkNumPairPanel";
		break;
	}
	switch(linkCombType){
		case 0: $("#linkPanel .linkMode .ctrlItem:gt(1)").hide(); break;
		case 1: $("#linkPanel .linkMode .ctrlItem:gt(1)").hide(); break;
		case 2: $("#linkPanel .linkMode .ctrlItem:gt(1)").show(); break;
		case 3: $("#linkPanel .linkMode .ctrlItem:gt(1)").show(); break;
		case 4: $("#linkPanel .linkMode .ctrlItem:gt(1)").show(); break;
	}
	setLinkPanelOdds(panelId);
	$(".linkSystemTable").hide();
	$("#" + panelId).show();
	$("#linkPanel").show();
}

function setLinkPanelOdds(panel){
	$("#" + panel + " .systemCont .numRow .oddsCell .odds").hide();
	var startId1 = linkBetType * 1000 + 1;
	var startId2 = (linkBetType + 1) * 1000 + 1;
	if(linkCombType < 0)
		return;
	if(window.top.lotteryData.pkStatus != OPEN_STATUS || window.top.rateData[startId1][0] < 0){
		clearBet();
		$("#" + panel + " .systemCont .betRow .betMoneyValue").attr("disabled", "disabled");
	}
	else
		$("#" + panel + " .systemCont .betRow .betMoneyValue").removeAttr("disabled");
	switch(linkBetType){
		case 1151 : 
		case 1181 :
		case 1191 : 
			for(var i = 0; i < 49; i++){
				// if(window.top.lotteryData.pkStatus == OPEN_STATUS && window.top.otherNumCloseTime > 0){	
				if(window.top.lotteryData.pkStatus == OPEN_STATUS){	
					updateItemOdds($("#" + panel + " .systemCont:eq(0) .numRow .num" + (i + 1) + " .odds1").show(), window.top.rateData[startId1 + i][0]);
					$("#" + panel + " .systemCont:eq(0) .numRow .num" + (i + 1)).attr('data-creditplaytypeid', window.top.rateData[startId1 + i][2]);
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
				// if(window.top.lotteryData.pkStatus == OPEN_STATUS && window.top.otherNumCloseTime > 0){	
				if(window.top.lotteryData.pkStatus == OPEN_STATUS){	
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

function initAnimalPanel(){
	for(var i = 0; i < 12; i++){
		var str = "";
		for(var j = 0; j < window.top.animalNumArr[i].numArr.length; j++){
			if(str != "")
				str += ", "
			if(window.top.animalNumArr[i].numArr[j] < 10)
				str += "0" + window.top.animalNumArr[i].numArr[j];
			else
				str += window.top.animalNumArr[i].numArr[j];
		}
		$(".systemTable .animalRow .animal" + i + " .animalNumCell").text(str);
	}
}

function initAnimal6Panel(){
	for(var i = 0; i < 12; i++){
		var str = "";
		for(var j = 0; j < window.top.animalNumArr[i].numArr.length && j < 4; j++){
			if(str != "")
				str += ", "
			if(window.top.animalNumArr[i].numArr[j] < 10)
				str += "0" + window.top.animalNumArr[i].numArr[j];
			else
				str += window.top.animalNumArr[i].numArr[j];
		}
		$(".systemTable .animalRow .animal" + i + " .animal6NumCell").text(str);
	}
}

function clickNumType(type, obj){
	var money = $("#numPanel .betRow .betMoneyValue").val();
	if(money == "")
		return;
	obj = $(obj);
	money = obj.is(":checked") ? money : "";
	var key = "";
	var targetType = "";
	if(type < 9){
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
	else if(type == 9){
		$("#numPanel .systemCont .numRow .betMoneyValue").val(money);
	}
	else if(type == 10 || type == 11){
		for(var i = 0; i < window.top.animalNumArr.length; i++){
			if(window.top.animalNumArr[i].type == type - 10){
				for(var j = 0; j < window.top.animalNumArr[i].numArr.length; j++){
					$("#numPanel .systemCont .num" + window.top.animalNumArr[i].numArr[j] + " .betMoneyValue").val(money);
				}
			}
		}
	}
}

function clickAnimalType(type, obj){
	obj = $(obj);
	var panel = obj.parents(".systemTable")
	var money = panel.find(".betRow .betMoneyValue").val();
	if(money == "")
		return;
	money = obj.is(":checked") ? money : "";
	for(var i = 0; i < window.top.animalNumArr.length; i++){
		if(window.top.animalNumArr[i].type == type){
			panel.find(".animalRow .animal" + i + " .betMoneyValue").val(money);
		}
	}
}

function clickUnitType(type, obj){
	obj = $(obj);
	var panel = obj.parents(".systemTable")
	var money = panel.find(".betRow .betMoneyValue").val();
	if(money == "")
		return;
	money = obj.is(":checked") ? money : "";
	for(var i = 0; i < 10; i++){
		switch(type){
			case 0 : 
				if(i >= 5)
					panel.find(".unitRow .unit" + i + " .betMoneyValue").val(money);
				break;
			case 1 : 
				if(i < 5)
					panel.find(".unitRow .unit" + i + " .betMoneyValue").val(money);
				break;
			case 2 : 
				if(i % 2 == 1)
					panel.find(".unitRow .unit" + i + " .betMoneyValue").val(money);
				break;
			case 3 : 
				if(i % 2 == 0)
					panel.find(".unitRow .unit" + i + " .betMoneyValue").val(money);
				break;
		}
	}
}

var animal6RadioIndex = 0;
function clickAnimal6Radio(index, obj){
	obj = $(obj);
	if(obj.hasClass("curBtn") || window.top.lotteryData.pkStatus != OPEN_STATUS)
		return;
	$("#animal6Panel .animalCtrl .curBtn").removeClass("curBtn");
	obj.addClass("curBtn");
	animal6RadioIndex = index;
	updateAnimal6Odds();
	clearBet();
}

function checkAnimal6(obj){
	obj = $(obj);
	var checkedArr = $("#animal6Panel .animalRow .animalCheckCell input:checked");
	if(!obj.is(":checked")){
		if(checkedArr.length == 4){
			checkedArr =  $("#animal6Panel .animalRow .animalCheckCell input[type=checkBox]:not(:checked)");
			checkedArr.removeAttr("disabled");
		}
		else if(checkedArr.length == 5){
			var num = parseInt(checkedArr.eq(0).attr("info")) % 2;
			var isDisable = true;
			for(var i = 1; i < checkedArr.length; i++){
				if(parseInt(checkedArr.eq(i).attr("info")) % 2 != num){
					isDisable = false;
					break;
				}
			}
			checkedArr =  $("#animal6Panel .animalRow .animalCheckCell input[type=checkBox]:not(:checked)");
			if(isDisable){
				for(var i = 0; i < checkedArr.length; i++){
					if(parseInt(checkedArr.eq(i).attr("info")) % 2 != num)
						checkedArr.eq(i).removeAttr("disabled");
				}
			}
			else
				checkedArr.removeAttr("disabled");
		}
	}
	else{
		if(checkedArr.length == 6)
			$("#animal6Panel .animalRow .animalCheckCell input:not(:checked)").attr("disabled", "disabled");
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
				checkedArr = $("#animal6Panel .animalRow .animalCheckCell input:not(:checked)");
				for(var i = 0; i < checkedArr.length; i++){
					if(parseInt(checkedArr.eq(i).attr("info")) % 2 == num){
						checkedArr.eq(i).attr("disabled", "disabled");
					}
				}
			}
		}		
	}
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
	$(".systemTable input:checked").removeAttr("checked");
	$(".systemTable input[type=checkbox]:disabled").removeAttr("disabled");
}

function bet(panelId){
	if(window.top.lotteryData.pkStatus != OPEN_STATUS)
		return;
	var panel = $("#" + panelId)
	var betMoneyValueArr = panel.find(".betMoneyCell .betMoneyValue");
	var betType = panel.attr("info");
	var rate = curRate == 0 ? "A盘" : "B盘";
	var betInfoArr = [];
	var betContent = "";
	var bmvObj = null;
	var odds = 0;
	var money = 0;
	var cellClass = "";
	var betMap = {};
	var infoArr = [];
	var data = []
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
		var itemInfo = bmvObj.attr("info");
		money += parseInt(curMoney);
		var obj = {
			money: curMoney,
			info: "",
			infoTitle: "",
			betId: betType + itemInfo
		}
		switch(betType){
			case "101" : obj.info = '特码' + rate; obj.infoTitle = '特码' + rate; cellClass = parseInt(itemInfo) < 2000 ? ".numCell" : ".twoCell"; break;
			case "102" : obj.info = '正一' + rate; obj.infoTitle = '正一' + rate; cellClass = parseInt(itemInfo) < 2000 ? ".numCell" : ".twoCell"; break;
			case "103" : obj.info = '正二' + rate; obj.infoTitle = '正二' + rate; cellClass = parseInt(itemInfo) < 2000 ? ".numCell" : ".twoCell"; break;
			case "104" : obj.info = '正三' + rate; obj.infoTitle = '正三' + rate; cellClass = parseInt(itemInfo) < 2000 ? ".numCell" : ".twoCell"; break;
			case "105" : obj.info = '正四' + rate; obj.infoTitle = '正四' + rate; cellClass = parseInt(itemInfo) < 2000 ? ".numCell" : ".twoCell"; break;
			case "106" : obj.info = '正五' + rate; obj.infoTitle = '正五' + rate; cellClass = parseInt(itemInfo) < 2000 ? ".numCell" : ".twoCell"; break;
			case "107" : obj.info = '正六' + rate; obj.infoTitle = '正六' + rate; cellClass = parseInt(itemInfo) < 2000 ? ".numCell" : ".twoCell"; break;
			case "108" : obj.info = '正码' + rate; obj.infoTitle = '正码' + rate; cellClass = parseInt(itemInfo) < 2000 ? ".numCell" : ".twoCell"; break;
			case "109" : obj.info = '特肖'; obj.infoTitle = '特肖' + rate; cellClass = ".animalCell"; break;
			case "110" : obj.info = '尾数'; obj.infoTitle = '尾数' + rate; cellClass = ".unitCell"; break;
			case "111" : obj.info = '半波'; obj.infoTitle = '半波' + rate; cellClass = ".colorTwoCell"; break;
			case "112" : obj.info = '一肖'; obj.infoTitle = '一肖' + rate; cellClass = ".animalCell"; break;
			case "113" : obj.info = '一肖不中'; obj.infoTitle = '一肖不中' + rate; cellClass = ".animalCell"; break;
		}
		obj.info += bmvObj.parent().siblings(cellClass).text() + '@<span style="color: red">' + odds + '</span>';
		obj.infoTitle += bmvObj.parent().siblings(cellClass).text() + odds;
		betMap["info" + itemInfo] = {
			betContent : betType + itemInfo + "-" + odds + "-" + curMoney,
			betInfo : obj
		}
		infoArr.push(itemInfo);
		var pEle = bmvObj.parents('.cell')
		var creditPlayTypeId = ''
		if (betType == 109) {
			creditPlayTypeId = pEle.find('.oddsCell').attr('data-creditplaytypeid')
		} else if (betType == 111) {
			pEle = bmvObj.parents('.numRow')
			creditPlayTypeId = pEle.find('.oddsCell').attr('data-creditplaytypeid')
		} else {
			creditPlayTypeId = pEle.attr('data-creditplaytypeid')
		}
		data.push({
			"gameId": localStorage.getItem('gameId') || 1,
			"gamePeriodId": window.top.lotteryData.issue,
			"creditPlayId": sessionStorage.getItem('creditPlayInfoId'),
			"creditPlayTypeId": creditPlayTypeId,
			"content": null,
			"panKou": localStorage.getItem('pankou') || 'A',
			"commandLogAmount": parseInt(curMoney)
		})
	}
	infoArr.sort();
	for(var i = 0; i < infoArr.length; i++){
		if(betContent != "")
			betContent += ";";
		betContent += betMap["info" + infoArr[i]].betContent;
		betInfoArr.push(betMap["info" + infoArr[i]].betInfo)
	}
	if(money > window.top.lotteryData.creditBalance){
		alert("余额不足！")
		return;
	}
	if(money <= 0)
		return;
	clearBet();
	window.top.initConfirmPanel(data, betInfoArr, money, "normal");
}

function betAnimal6(){
	if(window.top.lotteryData.pkStatus != OPEN_STATUS)
		return;
	var panel = $("#animal6Panel");
	var curType = panel.find(".animalCtrl .curBtn");
	var info = curType.attr("info"); 
	var checkedArr = panel.find(".animalRow .animalCheckCell input:checked");
	var betMoney = parseInt(panel.find(".betRow .betMoneyValue").val());
	var odds = panel.find(".animalRow:not(.title) .oddsCell:eq(0)").text();
	if(odds == 0){
		alert("赔率为0不可下注！")
		return;
	}
	if(checkedArr.length != 6 || isNaN(betMoney) || betMoney < 0){
		alert("请选择6个生肖且输入下注金额！")
		return;
	}
	if(parseInt(betMoney) > window.top.lotteryData.creditBalance){
		alert("余额不足！")
		return;
	}
	var betContent = info + "-" + odds + "-" + betMoney + "-";
	var obj = {
		money: betMoney,
		info: "六肖",
		infoTitle: "六肖",
		betId: info
	};
	var animalArr = []
	var data = []
	for(var i = 0; i < checkedArr.length; i++){
		if(i > 0){
			betContent += ",";
			obj.info += ",";
			obj.infoTitle += ",";
		}
		var info = $(checkedArr[i]).attr("info");
		betContent += window.top.animalNumArr[info].animal;
		obj.info += window.top.animalNumArr[info].animal;
		obj.infoTitle += window.top.animalNumArr[info].animal;
		animalArr.push(window.top.animalNumArr[info].animal)
	}
	data.push({
		"gameId": localStorage.getItem('gameId') || 1,
		"gamePeriodId": window.top.lotteryData.issue,
		"creditPlayId": sessionStorage.getItem('creditPlayInfoId'),
		"creditPlayTypeId": curType.attr('data-creditplaytypeid'),
		"content": betContent,
		"panKou": null,
		"rate": odds,
		"commandLogAmount": parseInt(betMoney),
		"type":  curType.next().text()
	})
	data[0].content = animalArr.toString()
	obj.info += '@<span style="color: red">' + odds + '</span>';
	obj.infoTitle += '@' + odds + '';
	var betInfoArr = [obj];
	clearBet();
	window.top.initConfirmPanel(data, betInfoArr, betMoney, "normal");
}

var maxSelectedCount = 10;
var linkCount = 3;
var canSelect = false;
function clickLinkBall(obj){
	var maxCount = linkMode == 2 ? linkCount - 1 : maxSelectedCount;
	obj = $(obj)
	var systemCont = obj.parents(".systemCont");
	var checkedArr = systemCont.find("input:checked")
	if(obj.is(":checked")){
		if(linkMode == 1 && checkedArr.length == maxSelectedCount){
			systemCont.find("input:not(:checked)").attr("disabled", "disabled");
		}
		else if(linkMode == 2 && checkedArr.length == linkCount){
			checkedArr.attr("disabled", "disabled");
			obj.removeAttr("disabled");
		}
	}
	else{
		if(linkMode == 1 && checkedArr.length == maxSelectedCount - 1)
			systemCont.find("input").removeAttr("disabled");
		if(linkMode == 2 && checkedArr.length == linkCount - 1)
			systemCont.find("input").removeAttr("disabled");
	}
	var typeStr = "";
	var panelId = "";
	switch(linkBetType){
		case 1151 :
		case 1161 :
		case 1171 : 
		case 1181 : 
		case 1191 : 
		case 1201 :
			typeStr = $(".ctrlPanel .linkCombType .curBtn").text();
			panelId = "linkPanel";
			break;
		case 1381 : 
		case 1391 : 
		case 1401 : 
		case 1411 : 
		case 1421 : 
		case 1431 : 
			typeStr = $("#missPanel .missBtnBox .curBtn").text();
			panelId = "missPanel";
			break;
	}
	switch(linkMode){
		case 1 : setSelectedBallInfoNormal(panelId, systemCont, typeStr); break;
		case 2 : setSelectedBallInfoHead(panelId, systemCont, typeStr); break;
	}	
}

function setSelectedBallInfoNormal(panelId, systemCont, typeStr){
	var linkNumStr = typeStr + " 普通 【";
	var linkNumArr = [];
	var checkedArr = systemCont.find("input:checked");
	for(var i = 0; i < checkedArr.length; i++){
		linkNumArr.push(checkedArr.eq(i).attr("info"));
	}
	linkNumArr.sort();
	for(var i = 0; i < linkNumArr.length; i++){
		if(i > 0)
			linkNumStr += ",";
		linkNumStr += linkNumArr[i];
	}
	linkNumStr += "】"
	var betCount = getBetCombCount(checkedArr.length);
	linkNumStr += "总计：" + betCount;
	$("#" + panelId + " .betRow .linkNum").text(linkNumStr);
}

function setSelectedBallInfoHead(panelId, systemCont, typeStr){
	var linkNumStr = typeStr + " 拖头 【";
	var linkNumArr = [];
	var headBallArr = systemCont.find("input:checked");
	var bodyBallArr = [];
	if(headBallArr.length >= linkCount){
		headBallArr = systemCont.find("input:checked:disabled");
		bodyBallArr = systemCont.find("input:checked:not(:disabled)");
	}
	for(var i = 0; i < headBallArr.length; i++){
		linkNumArr.push(headBallArr.eq(i).attr("info"));
	}
	linkNumArr.sort();
	for(var i = 0; i < linkNumArr.length; i++){
		if(i > 0)
			linkNumStr += ",";
		linkNumStr += linkNumArr[i];
	}
	linkNumStr += "】FOLLOW【";
	linkNumArr = [];
	for(var i = 0; i < bodyBallArr.length; i++){
		linkNumArr.push(bodyBallArr.eq(i).attr("info"));
	}
	for(var i = 0; i < linkNumArr.length; i++){
		if(i > 0)
			linkNumStr += ",";
		linkNumStr += linkNumArr[i];
	}
	linkNumStr += "】"
	var betCount = headBallArr.length == linkCount - 1 ? bodyBallArr.length : 0;
	linkNumStr += "总计：" + betCount;
	$("#" + panelId + " .betRow .linkNum").text(linkNumStr);
}

function clickLinkPair(obj){
	obj = $(obj)
	var systemCont = obj.parents(".systemCont");
	var checkedArr = systemCont.find("input:checked")
	if(obj.is(":checked")){
		if(checkedArr.length == 2){
			systemCont.find("input:not(:checked)").attr("disabled", "disabled");
		}
	}
	else{
		if(checkedArr.length == 1)
			systemCont.find("input:disabled").removeAttr("disabled");
	}
	var typeBtn = $(".ctrlPanel .linkCombType .curBtn");
	var linkNumStr = typeBtn.text();
	var cellClassName = "";
	switch(linkMode){
		case 3 : linkNumStr += " 生肖对碰 【"; cellClassName = ".animalNumCell"; break;
		case 4 : linkNumStr += " 尾数对碰 【"; cellClassName = ".unitNumCell"; break;
	} 
	if(checkedArr.length > 0)
		linkNumStr += checkedArr.eq(0).parent().siblings(cellClassName).text() 
	linkNumStr += "】MATCH【" 
	var pairingArr = [];
	if(checkedArr.length == 2){
		linkNumStr += checkedArr.eq(1).parent().siblings(cellClassName).text()
		var numArr1 = checkedArr.eq(0).parent().siblings(cellClassName).text().split(", ");
		var numArr2 = checkedArr.eq(1).parent().siblings(cellClassName).text().split(", ");
		for(var i = 0; i < numArr1.length; i++){
			numArr1[i] = parseInt(numArr1[i]);
		}
		for(var i = 0; i < numArr2.length; i++){
			numArr2[i] = parseInt(numArr2[i]);
		}
		pairingArr = twoArrPairing(numArr1, numArr2);
	}
	linkNumStr += "】总计：" + pairingArr.length;
	$("#linkPanel .betRow .linkNum").text(linkNumStr);	
}

function clickLinkMix(){
	var animalRadio = $("#linkMixturePanel .animalRow input:checked");
	var unitRadio = $("#linkMixturePanel .unitRow input:checked");
	var typeBtn = $(".ctrlPanel .linkCombType .curBtn");
	var linkNumStr = typeBtn.text() + " 混合对碰 【";
	if(animalRadio.length > 0)
		linkNumStr += animalRadio.eq(0).parent().siblings(".animalNumCell").text();
	linkNumStr += "】MATCH【" 
	linkMixCombArr = [];
	if(animalRadio.length > 0){
		linkNumStr += unitRadio.eq(0).parent().siblings(".unitNumCell").text();
	}
	if(animalRadio.length > 0 && unitRadio.length > 0){
		var numArr1 = animalRadio.eq(0).parent().siblings(".animalNumCell").text().split(", ");
		var numArr2 = unitRadio.eq(0).parent().siblings(".unitNumCell").text().split(", ");
		linkBetContent = window.top.animalNumArr[animalRadio.eq(0).attr("info")].animal + ";" + unitRadio.eq(0).attr("info");
		for(var i = 0; i < numArr1.length; i++){
			numArr1[i] = parseInt(numArr1[i]);
		}
		for(var i = 0; i < numArr2.length; i++){
			numArr2[i] = parseInt(numArr2[i]);
		}
		linkMixCombArr = twoArrPairing(numArr1, numArr2)
	};
	linkNumStr += "】总计：" + linkMixCombArr.length;
	$("#linkPanel .betRow .linkNum").text(linkNumStr);	
}

function clickLinkNumPair(obj){
	obj = $(obj);
	var curTable = obj.attr("info");
	var otherTable = curTable == "tableA" ? "tableB" : "tableA";
	var curClassName = obj.attr("class");
	var otherClassName = curClassName.replace(curTable, otherTable)
	var checkA = $("#linkNumPairPanel input[info=tableA]:checked");
	var checkB = $("#linkNumPairPanel input[info=tableB]:checked");
	if(obj.is(":checked")){
		if((curTable == "tableA" && checkA.length >= maxSelectedCount) || (curTable == "tableB" && checkB.length >= maxSelectedCount)){
			var arr = $("#linkNumPairPanel input[info=" + curTable + "]");
			arr = arr.not(":checked").not(":disabled")
			arr.attr("disabled", "disabled").addClass("maxSelect");
		}
		$("#linkNumPairPanel ." + otherClassName).attr("disabled", "disabled").removeClass("maxSelect");
	}
	else{
		$("#linkNumPairPanel input.maxSelect[info=" + curTable + "]").removeAttr("disabled").removeClass("maxSelect");
		$("#linkNumPairPanel ." + otherClassName).removeAttr("disabled");
	}
	
	var typeBtn = $(".ctrlPanel .linkCombType .curBtn");
	var linkNumStr = typeBtn.text() + " 号码对碰 【";
	var numArrA = [];
	var numArrB = [];
	if(checkA.length > 0){
		for(var i = 0; i < checkA.length; i++){
			if(i > 0)
				linkNumStr += ", ";
			linkNumStr += checkA.eq(i).parent().text();
			numArrA.push(parseInt(checkA.eq(i).parent().text()))
		}
	}
	linkNumStr += "】MATCH【";
	if(checkB.length > 0){
		for(var i = 0; i < checkB.length; i++){
			if(i > 0)
				linkNumStr += ", ";
			linkNumStr += checkB.eq(i).parent().text();
			numArrB.push(parseInt(checkB.eq(i).parent().text()))
		}
	}
	var pairingArr = [];
	if(checkA.length > 0 && checkB.length > 0){
		pairingArr = twoArrPairing(numArrA, numArrB)
	};
	linkNumStr += "】总计：" + pairingArr.length;
	$("#linkPanel .betRow .linkNum").text(linkNumStr);	
}

function clickGroupLinkCheck(obj){
	obj = $(obj)
	var maxCount = linkMode == 2 ? linkCount - 1 : maxSelectedCount;
	var panel = obj.parents(".systemTable");
	var checkedArr = panel.find("input:checked")
	if(obj.is(":checked")){
		if(linkMode == 1 && checkedArr.length == maxSelectedCount){
			panel.find("input[type=checkBox]:not(:checked)").attr("disabled", "disabled");
		}
		else if(linkMode == 2 && checkedArr.length == linkCount){
			checkedArr.attr("disabled", "disabled");
			obj.removeAttr("disabled");
		}
	}
	else{
		if(linkMode == 1 && checkedArr.length == maxSelectedCount - 1){
			panel.find("input[type=checkBox]").removeAttr("disabled");
		}
		else if(linkMode == 2 && checkedArr.length == linkCount - 1)
			panel.find("input[type=checkBox]").removeAttr("disabled");
	}
	var typeStr = "";
	var type = "";
	switch(linkBetType){
		case 1221 :
		case 1231 :
		case 1241 : 
		case 1251 : 
		case 1261 : 
		case 1271 :
		case 1281 :
		case 1291 :
			typeStr = $(".ctrlPanel .animalLinkType .curBtn").text();
			type = "animal";
			break;
		case 1301 : 
		case 1311 : 
		case 1321 : 
		case 1331 :
		case 1341 : 
		case 1351 :
		case 1361 : 
		case 1371 :
			typeStr = $(".ctrlPanel .unitLinkType .curBtn").text();
			type = "unit";
			break;
	}
	switch(linkMode){
		case 1 : clickGroupLinkNormal(type, panel, typeStr); break;
		case 2 : clickGroupLinkHead(type, panel, typeStr); break;
	}	
}

function clickGroupLinkNormal(type, panel, typeStr){
	var linkNumStr = typeStr + " 普通 【";
	var linkNumArr = [];
	var checkedArr = panel.find("input:checked");
	for(var i = 0; i < checkedArr.length; i++){
		linkNumArr.push(checkedArr.eq(i).attr("info"));
	}
	linkNumArr.sort();
	for(var i = 0; i < linkNumArr.length; i++){
		if(i > 0)
			linkNumStr += ",";
		if(type == "animal")
			linkNumStr += window.top.animalNumArr[parseInt(linkNumArr[i])].animal;
		else
			linkNumStr += linkNumArr[i] + "尾";
	}
	linkNumStr += "】"
	var betCount = getBetCombCount(checkedArr.length);
	linkNumStr += "总计：" + betCount;
	$("#" + type + "LinkPanel .betRow .linkNum").text(linkNumStr);
}

function clickGroupLinkHead(type, panel, typeStr){
	var linkNumStr = typeStr + " 拖头 【";
	var linkNumArr = [];
	var headBallArr = panel.find("input:checked");
	var bodyBallArr = [];
	if(headBallArr.length >= linkCount){
		headBallArr = panel.find("input:checked:disabled");
		bodyBallArr = panel.find("input:checked:not(:disabled)");
	}
	for(var i = 0; i < headBallArr.length; i++){
		linkNumArr.push(headBallArr.eq(i).attr("info"));
	}
	linkNumArr.sort();
	for(var i = 0; i < linkNumArr.length; i++){
		if(i > 0)
			linkNumStr += ",";
		if(type == "animal")
			linkNumStr += window.top.animalNumArr[parseInt(linkNumArr[i])].animal;
		else
			linkNumStr += linkNumArr[i] + "尾";
	}
	linkNumStr += "】FOLLOW【";
	linkNumArr = [];
	for(var i = 0; i < bodyBallArr.length; i++){
		linkNumArr.push(bodyBallArr.eq(i).attr("info"));
	}
	for(var i = 0; i < linkNumArr.length; i++){
		if(i > 0)
			linkNumStr += ",";
		if(type == "animal")
			linkNumStr += window.top.animalNumArr[parseInt(linkNumArr[i])].animal;
		else
			linkNumStr += linkNumArr[i] + "尾";
	}
	linkNumStr += "】"
	var betCount = headBallArr.length == linkCount - 1 ? bodyBallArr.length : 0;
	linkNumStr += "总计：" + betCount;
	$("#" + type + "LinkPanel .betRow .linkNum").text(linkNumStr);
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

var combArr = [];
function betLinkPanel(){
	switch(linkMode){
		case 1: betLinkNormal(); break;
		case 2: betLinkHead(); break;
		case 3: betLinkAnimalPanel(); break;
		case 4: betLinkUnitNumPanel(); break;
		case 5: betLinkMixturePanel(); break;
		case 6: betLinkNumPair(); break;
	}
}

function betLinkNormal(){
	var checkedArr = $("#linkNormalPanel input:checked");
	linkBetMoney = parseInt($("#linkPanel .betRow .betMoneyValue").val());
	if(checkedArr.length < linkCount || isNaN(linkBetMoney))
		return;
	var numArr = [];
	var data = []
	var contentArr = []
	linkBetContent = ""
	for(var i = 0; i < checkedArr.length; i++){
		numArr.push(checkedArr.eq(i).attr("info"));
		var numCell = checkedArr.eq(i).parents('.cell').find('.numCell')
		contentArr.push(parseInt(numCell.text()))
	}
	numArr.sort((a, b) => a - b);
	contentArr.sort()
	data.push({
		"gameId": localStorage.getItem('gameId') || 1,
		"gamePeriodId": window.top.lotteryData.issue,
		"creditPlayId": sessionStorage.getItem('creditPlayInfoId'),
		"creditPlayTypeId": null,
		"content": contentArr.toString(),
		"panKou": null,
		"commandLogAmount": parseInt(linkBetMoney)
	})
	linkBetContent = numArr.join(",");
	var combArr = getCombinationResult(numArr, linkCount);
	initConfirmPanel(combArr, data);
}

function betLinkHead(){
	var headCheckArr = $("#linkNormalPanel input:checked:disabled");
	var bodyCheckArr = $("#linkNormalPanel input:checked:not(:disabled)");
	linkBetMoney = parseInt($("#linkPanel .betRow .betMoneyValue").val());
	if(headCheckArr.length < linkCount - 1 || bodyCheckArr.length < 1 || isNaN(linkBetMoney))
		return;
	linkBetContent = "";
	var combArr = [];
	var numArr = [];
	var data = []
	var a = []
	var b = []
	for(var i = 0; i < bodyCheckArr.length; i++){
		numArr.push(bodyCheckArr.eq(i).attr("info"));
		var numCell = bodyCheckArr.eq(i).parents('.cell').find('.numCell')
		b.push(parseInt(numCell.text()))
	}
	numArr.sort((a, b) => a - b);
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
	for(var i = headCheckArr.length - 1; i >= 0; i--){
		numArr.push(headCheckArr.eq(i).attr("info"));
		var numCell = headCheckArr.eq(i).parents('.cell').find('.numCell')
		a.push(parseInt(numCell.text()))
	}
	numArr.sort((a, b) => a - b);
	a.sort()
	b.sort()
	data.push({
		"gameId": localStorage.getItem('gameId') || 1,
		"gamePeriodId": window.top.lotteryData.issue,
		"creditPlayId": sessionStorage.getItem('creditPlayInfoId'),
		"creditPlayTypeId": null,
		"content": a.toString() + '拖' + b.toString(),
		"panKou": null,
		"commandLogAmount": parseInt(linkBetMoney)
	})
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
	data.forEach(function(item) {
		item.content = headLinkBetContent + '拖' + linkBetContent
	})
	linkBetContent = headLinkBetContent + ";" + linkBetContent;
	initConfirmPanel(combArr, data);
}

function betLinkAnimalPanel(){
	var animalCheckArr = $("#linkAnimalPanel input:checked");
	linkBetMoney = parseInt($("#linkPanel .betRow .betMoneyValue").val());
	if(animalCheckArr.length < 2 || isNaN(linkBetMoney))
		return;
	var linkAnimalNumArr = [];
	var data = []
	linkAnimalNumArr.push(animalCheckArr.eq(0).attr("info"));
	linkAnimalNumArr.push(animalCheckArr.eq(1).attr("info"));
	linkAnimalNumArr.sort();
	data.push({
		"gameId": localStorage.getItem('gameId') || 1,
		"gamePeriodId": window.top.lotteryData.issue,
		"creditPlayId": sessionStorage.getItem('creditPlayInfoId'),
		"creditPlayTypeId": null,
		"content": window.top.animalNumArr[linkAnimalNumArr[0]].animal + '碰' + window.top.animalNumArr[linkAnimalNumArr[1]].animal,
		"panKou": null,
		"commandLogAmount": parseInt(linkBetMoney)
	})
	linkBetContent = window.top.animalNumArr[linkAnimalNumArr[0]].animal  + ";" + window.top.animalNumArr[linkAnimalNumArr[1]].animal;
	var combArr = twoArrPairing(window.top.animalNumArr[linkAnimalNumArr[0]].numArr, window.top.animalNumArr[linkAnimalNumArr[1]].numArr);
	initConfirmPanel(combArr, data);
}

function betLinkUnitNumPanel(){
	var unitCheckArr = $("#linkUnitNumPanel input:checked");
	linkBetMoney = parseInt($("#linkPanel .betRow .betMoneyValue").val());
	if(unitCheckArr.length < 2 || isNaN(linkBetMoney))
		return;
	var linkUnitNumArr = [];
	linkUnitNumArr.push(parseInt(unitCheckArr.eq(0).attr("info")));
	linkUnitNumArr.push(parseInt(unitCheckArr.eq(1).attr("info")));
	linkUnitNumArr.sort();
	linkBetContent = linkUnitNumArr.join(";");
	var numArr1 = [];
	var numArr2 = [];
	for(var i = 0; i < 5; i++){
		if(i > 0 || linkUnitNumArr[0] != 0)
			numArr1.push(i * 10 + linkUnitNumArr[0]);
		numArr2.push(i * 10 + linkUnitNumArr[1]);
	}
	var combArr = twoArrPairing(numArr1, numArr2);
	var data = []
	data.push({
		"gameId": localStorage.getItem('gameId') || 1,
		"gamePeriodId": window.top.lotteryData.issue,
		"creditPlayId": sessionStorage.getItem('creditPlayInfoId'),
		"creditPlayTypeId": null,
		"content": linkUnitNumArr[0] + '尾碰' + linkUnitNumArr[1] + '尾',
		"panKou": null,
		"commandLogAmount": parseInt(linkBetMoney)
	})
	initConfirmPanel(combArr, data);
}

var linkMixCombArr = [];
function betLinkMixturePanel(){
	var animalRadio = $("#linkMixturePanel .animalRow input:checked");
	var unitRadio = $("#linkMixturePanel .unitRow input:checked");
	linkBetMoney = parseInt($("#linkPanel .betRow .betMoneyValue").val());
	if(animalRadio.length == 0 || unitRadio.length == 0 || isNaN(linkBetMoney))
		return;
	var data = []
	var animalCheckEle = animalRadio.parents('td')
	var unitCheckEle = unitRadio.parents('td')
	data.push({
		"gameId": localStorage.getItem('gameId') || 1,
		"gamePeriodId": window.top.lotteryData.issue,
		"creditPlayId": sessionStorage.getItem('creditPlayInfoId'),
		"creditPlayTypeId": null,
		"content": animalCheckEle.find('.animalCell').text() + '碰' + unitCheckEle.find('.unitCell').text(),
		"panKou": null,
		"commandLogAmount": parseInt(linkBetMoney)
	})
	initConfirmPanel(linkMixCombArr, data);
}

function betLinkNumPair(){
	var checkArrA = $("#linkNumPairPanel table:eq(0) input:checked");
	var checkArrB = $("#linkNumPairPanel table:eq(1) input:checked");
	linkBetMoney = parseInt($("#linkPanel .betRow .betMoneyValue").val());
	if(checkArrA.length < 1 || checkArrB.length < 1 || isNaN(linkBetMoney))
		return;
	linkBetContent = "";
	var combArr = [];
	var headNumArr = [];
	var data = []
	for(var i = 0; i < checkArrA.length; i++){
		headNumArr.push(checkArrA.eq(i).parent().text());
	}
	headNumArr.sort();
	var bodyNumArr = [];
	for(var i = 0; i < checkArrB.length; i++){
		bodyNumArr.push(checkArrB.eq(i).parent().text());
	}
	bodyNumArr.sort();
	linkBetContent = headNumArr.join(",") + ";" + bodyNumArr.join(",");
	for(var i = 0; i < headNumArr.length; i++){
		headNumArr[i] = parseInt(headNumArr[i]);
	}
	for(var i = 0; i < bodyNumArr.length; i++){
		bodyNumArr[i] = parseInt(bodyNumArr[i]);
	}
	data.push({
		"gameId": localStorage.getItem('gameId') || 1,
		"gamePeriodId": window.top.lotteryData.issue,
		"creditPlayId": sessionStorage.getItem('creditPlayInfoId'),
		"creditPlayTypeId": null,
		"content": headNumArr.toString() + '碰' + bodyNumArr.toString(),
		"panKou": null,
		"commandLogAmount": parseInt(linkBetMoney)
	})
	var combArr = twoArrPairing(headNumArr, bodyNumArr);
	initConfirmPanel(combArr, data);
}

function betMiss(){
	switch(linkMode){
		case 1 : betMissNormal(); break;
		case 2 : betMissHead(); break;
	}
}

function betMissNormal(){
	var checkArr = $("#missPanel .numRow input:checked");
	linkBetMoney = parseInt($("#missPanel .betRow .betMoneyValue").val());
	if(checkArr.length < linkCount || isNaN(linkBetMoney))
		return;
	var numArr = [];
	var data = []
	linkBetContent = "";
	for(var i = 0; i < checkArr.length; i++){
		numArr.push(parseInt(checkArr.eq(i).attr("info")));
	}
	numArr.sort((a, b) => a - b);
	data.push({
		"gameId": localStorage.getItem('gameId') || 1,
		"gamePeriodId": window.top.lotteryData.issue,
		"creditPlayId": sessionStorage.getItem('creditPlayInfoId'),
		"creditPlayTypeId": null,
		"content": numArr.toString(),
		"panKou": null,
		"commandLogAmount": parseInt(linkBetMoney)
	})
	linkBetContent = numArr.join(",");
	var combArr = getCombinationResult(numArr, linkCount);
	initConfirmPanel(combArr, data);
}

function betMissHead(){
	var checkHeadArr = $("#missPanel .numRow input:checked:disabled");
	var checkBodyArr = $("#missPanel .numRow input:checked:not(:disabled)");
	linkBetMoney = parseInt($("#missPanel .betRow .betMoneyValue").val());
	if(checkHeadArr.length < linkCount - 1 || checkBodyArr.length < 1 || isNaN(linkBetMoney))
		return;
		
	linkBetContent = "";
	var combArr = [];
	var num = "";
	var numArr = [];
	for(var i = 0; i < bodyCheckArr.length; i++){
		numArr.push(bodyCheckArr.eq(i).attr("info"));
	}
	numArr.sort((a, b) => a - b);
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
	for(var i = checkHeadArr.length - 1; i >= 0; i--){
		numArr.push(headCheckArr.eq(i).attr("info"));
	}
	numArr.sort((a, b) => a - b);
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
	initConfirmPanel(combArr);
}

function betGroupLinkPanel(type){
	switch(linkMode){
		case 1 : betGroupLinkNormal(type); break;
		case 2 : betGroupLinkHead(type); break;
	}
}

function betGroupLinkNormal(type){
	var checkArr = $("#" + type + "LinkPanel input:checked");
	linkBetMoney = parseInt($("#" + type + "LinkPanel .betRow .betMoneyValue").val());
	if(checkArr.length < linkCount || isNaN(linkBetMoney))
		return;
	var numArr = [];
	var data = []
	var animalArr = []
	var a = []
	linkBetContent = "";
	for(var i = 0; i < checkArr.length; i++){
		animalArr.push(checkArr.eq(i).parents('.cell').find('div').eq(0).text())
		numArr.push(checkArr.eq(i).attr("info"));
		a.push(checkArr.eq(i).parents('.cell').find('.unitCell').text());
	}
	numArr.sort((a, b) => a - b);
	if(type == "animal"){
		for(var i = 0; i < numArr.length; i++){
			if(i > 0)
				linkBetContent += ",";
			linkBetContent += window.top.animalNumArr[parseInt(numArr[i])].animal
		}
	}
	else
		linkBetContent = a.join(",");
	data.push({
		"gameId": localStorage.getItem('gameId') || 1,
		"gamePeriodId": window.top.lotteryData.issue,
		"creditPlayId": sessionStorage.getItem('creditPlayInfoId'),
		"creditPlayTypeId": null,
		"content": linkBetContent,
		"panKou": null,
		"commandLogAmount": parseInt(linkBetMoney),
	})
	var combArr = getCombinationResult(numArr, linkCount);
	initConfirmPanel(combArr, data);
}

function betGroupLinkHead(type){
	var checkHeadArr = $("#" + type + "LinkPanel input:checked:disabled");
	var checkBodyArr = $("#" + type + "LinkPanel input:checked:not(:disabled)");
	linkBetMoney = parseInt($("#" + type + "LinkPanel .betRow .betMoneyValue").val());
	if(checkHeadArr.length < linkCount - 1 || checkBodyArr.length < 1 || isNaN(linkBetMoney))
		return;
		
	linkBetContent = "";
	var combArr = [];
	var num = "";
	var numArr = [];
	var data = []
	var unitArr1 = []
	var unitArr2 = []
	for(var i = 0; i < checkBodyArr.length; i++){
		numArr.push(checkBodyArr.eq(i).attr("info"));
		if (type === 'unit') {
			unitArr2.push(checkBodyArr.eq(i).parents('.cell').find('.unitCell').text())
		}
	}
	numArr.sort((a, b) => a - b);
	for(var i = 0; i < numArr.length; i++){
		if(linkBetContent != "")
			linkBetContent += ",";
		if(type == "animal")
			linkBetContent += window.top.animalNumArr[parseInt(numArr[i])].animal
		else
			linkBetContent += parseInt(numArr[i]);
		var newNumArr = [];
		newNumArr.push(numArr[i]);
		combArr.push(newNumArr);
	}
	var headLinkBetContent = "";
	numArr = [];
	for(var i = checkHeadArr.length - 1; i >= 0; i--){
		if (type === 'unit') {
			unitArr1.push(checkHeadArr.eq(i).parents('.cell').find('.unitCell').text())
		}
		numArr.push(checkHeadArr.eq(i).attr("info"));
	}
	numArr.sort((a, b) => a - b);
	for(var i = numArr.length - 1; i >= 0; i--){
		if(headLinkBetContent != "")
			headLinkBetContent = "," + headLinkBetContent;
		if(type == "animal")
			headLinkBetContent = window.top.animalNumArr[parseInt(numArr[i])].animal + headLinkBetContent;
		else
			headLinkBetContent = parseInt(numArr[i]) + headLinkBetContent;
		for(var j = 0; j < combArr.length; j++){
			combArr[j].push(numArr[i]);
		}
	}
	for(var i = 0; i < combArr.length; i++){
		combArr[i].sort();
		combArr[i] = combArr[i].join(",");
	}
	unitArr1.sort()
	unitArr2.sort()
	data.push({
		"gameId": localStorage.getItem('gameId') || 1,
		"gamePeriodId": window.top.lotteryData.issue,
		"creditPlayId": sessionStorage.getItem('creditPlayInfoId'),
		"creditPlayTypeId": null,
		"content": '',
		"panKou": null,
		"commandLogAmount": parseInt(linkBetMoney),
	})
	for(var i = 0; i < data.length; i++){
		if (type == 'unit') {
			data[i].content = unitArr1.toString() + "拖" + unitArr2.toString()
		} else {
			data[i].content = headLinkBetContent + "拖" + linkBetContent
		}
	}
	linkBetContent = headLinkBetContent + ";" + linkBetContent;
	initConfirmPanel(combArr, data);
}

var linkBetType = 0;
var linkMode = 1;
var linkBetMoney = 0;
var linkBetContent = "";
var linkNumGroup = "";
function initConfirmPanel(combArr, data){
	var oddsArr = [];
	var numArr = [];
	linkNumGroup = "";
	var betInfoArr = [];
	for(var i = 0; i < combArr.length; i++){
		var newComb = "";
		if(i > 0)
			linkNumGroup += ";"
			
		var obj = {
			money: linkBetMoney,
			info: "",
			infoTitle: "",
			betId: ""
		};
		numArr = combArr[i].split(",");
		oddsArr = [];
		if(linkBetType >= 1221 && linkBetType <= 1291){
			for(var j = 0; j < numArr.length; j++){
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
		}
		else if(linkBetType >= 1301 && linkBetType <= 1371){
			for(var j = 0; j < numArr.length; j++){
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
		}
		else{
			linkNumGroup += combArr[i] + "-";
			for(var j = 0; j < numArr.length; j++){
				id = Number(`${linkBetType}000`) + Number(numArr[j])
				if(window.top.rateData[id] &&  window.top.rateData[id][0] == 0){
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
		switch(linkBetType){
			case 1151 : 
				obj.info = "三全中" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "三全中" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1161 : 
				obj.info = "三中二" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + "/" + oddsArr[1]; + '</span>';
				obj.infoTitle = "三中二" + combArr[i] + '@' + oddsArr[0] + "/" + oddsArr[1];;
				linkNumGroup += oddsArr[0] + "/" + oddsArr[1];
				break;
			case 1181 : 
				obj.info = "二全中" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "二全中" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1191 : 
				obj.info = "特串" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "特串" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1201 : 
				obj.info = "二中特" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + "/" + oddsArr[1] + '</span>';
				obj.infoTitle = "二中特" + combArr[i] + '@' + oddsArr[0] + "/" + oddsArr[1];
				linkNumGroup += oddsArr[0] + "/" + oddsArr[1];
				break;
			case 1221 : 
				obj.info = "二肖连" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "二肖连" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1231 : 
				obj.info = "二肖连不中" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "二肖连不中" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1241 : 
				obj.info = "三肖连" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "三肖连" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1251 : 
				obj.info = "三肖连不中" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "三肖连不中" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1261 : 
				obj.info = "四肖连" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "四肖连" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1271 : 
				obj.info = "四肖连不中" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "四肖连不中" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1281 : 
				obj.info = "五肖连" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "五肖连" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1291 : 
				obj.info = "五肖连不中" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "五肖连不中" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1301 : 
				obj.info = "二尾连" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "二尾连" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1311 : 
				obj.info = "二尾连不中" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "二尾连不中" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1321 : 
				obj.info = "三尾连" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "三尾连" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1331 : 
				obj.info = "三尾连不中" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "三尾连不中" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1341 : 
				obj.info = "四尾连" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "四尾连" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1351 : 
				obj.info = "四尾连不中" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "四尾连不中" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1361 : 
				obj.info = "五尾连" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "五尾连" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1371 : 
				obj.info = "五尾连不中" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "五尾连不中" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1381 : 
				obj.info = "五不中" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "五不中" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1391 : 
				obj.info = "六不中" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "六不中" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1401 : 
				obj.info = "七不中" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "七不中" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1411 : 
				obj.info = "八不中" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "八不中" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1421 : 
				obj.info = "九不中" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "九不中" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
			case 1431 : 
				obj.info = "十不中" + combArr[i] + '@<span style="color: red">' + oddsArr[0] + '</span>';
				obj.infoTitle = "十不中" + combArr[i] + '@' + oddsArr[0];
				linkNumGroup += oddsArr[0];
				break;
		}
		obj.betId = combArr[i].replace(/,/g, "");
		betInfoArr.push(obj);
	}	
	// var data = {
	// 	betType: linkBetType,
	// 	mode: linkMode,
	// 	betMoney: linkBetMoney,
	// 	betContent: linkBetContent,
	// 	numGroup: linkNumGroup
	// };
	var moneySum = linkBetMoney * combArr.length;
	clearBet();
	window.top.initConfirmPanel(data, betInfoArr, moneySum , "link");
}

//根据号码和组合球数返回组合结果
function getCombinationResult(numArr, ballCount){
    var combinationArr = [];
    combinationArr = GetCombinationBall(numArr, combinationArr, ballCount, 0, "");
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

var groupLinkType = 0;
function setGroupLinkType(id, type){
	if(window.top.lotteryData.pkStatus != OPEN_STATUS)
		return;
	var obj = $("#" + id + " .linkMode .radio:eq(" + type + ")")
	if(obj.hasClass("selected"))
		return;
	groupLinkType = type;
	linkMode = type + 1;
	$("#" + id + " .linkMode .selected").removeClass("selected");
	obj.addClass("selected");
	clearBet();
}

function clickQuickBetBtn(){
	window.top.showQuickBetPanel();
}