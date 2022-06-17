var gameArr = [];
var token = localStorage.getItem("token");
var account = localStorage.getItem("account");
var lotteryData = {};
var rateData = {};
var READY_STATUS = 0;
var OPEN_STATUS = 1;
var CLOSE_STATUS = 2;
var animalNumArr = [
    {animal: '鼠', numArr: []},
    {animal: '牛', numArr: []},
    {animal: '虎', numArr: []},
    {animal: '兔', numArr: []},
    {animal: '龙', numArr: []},
    {animal: '蛇', numArr: []},
    {animal: '马', numArr: []},
    {animal: '羊', numArr: []},
    {animal: '猴', numArr: []},
    {animal: '鸡', numArr: []},
    {animal: '狗', numArr: []},
    {animal: '猪', numArr: []},
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
    initLotteryMenu();
    var animalIndex = parseInt(localStorage.getItem("animalIndex"));
    for(var i = 0; i < 49; i++){
        var index = animalIndex - (i % 12);
        index = index < 0 ? index + 12 : index;
        animalNumArr[index].numArr.push(i + 1);
    }
    InitNotice();
    setInterval(update, TIME_FREQUENCY);
    window.open("hr_six.html?v=" + version, 'lotteryFrame');
});

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
        UpdateRateData(lotteryData.rate);
        if(lotteryData.quota.length > 0)
            quotaArr = lotteryData.quota;
        if(isInit){
            getCurrentResultNum(gameID, function(){
                showUseInfoPanel();
                getLastRecord();
                toLottery(curIndex);
            });
        }
        else{
            updateInfoPanel();
            lotteryFrame.updateOdds();
            if(resultIssue != lotteryData.issue && resultNum.length > 0)
                getCurrentResultNum(gameID, function(){
                    showUseInfoPanel();
                    getLastRecord();
                    lotteryFrame.setResult();
                })
        }
    })
}

function UpdateRateData(data){
    for(var key in data){
        rateData[key] = data[key];
    }
}

var resultNum = [];
var resultIssue = 0;
function getCurrentResultNum(gameID, call){
    var data = {
        token: token,
        gameID: gameID
    };
    Send(httpUrlData.getCurrentResultNum, data, function(obj){
        resultNum = [];
        if(obj.resultNum != ""){
            resultNum = obj.resultNum.split(",");
            resultIssue = lotteryData.issue;
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
function update(){
    var dt = new Date();
    SetNotice();
    heartTime -= TIME_FREQUENCY;
    if(heartTime <= 0){
        heartTime += HEART_TIME;
        getGameData(gameArr[curIndex].id, false, lotteryData.rateVersion);
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
}

function resize(){
    var width = $(window).width();
    var height = $(window).height();
    if(width < 1280)
        width = 1280;
    $(".right").css("width", width - 300);
    $(".contentPage").css("height", height - 156)
    $(".contentPage").css("width", width - 300)
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
    $("#lotteryName").attr("src", "/static/img/lottery" + gameArr[curIndex].id + ".png");
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
        if(lotteryData.status != READY_STATUS){
            lotteryFrame.resetData();
            lotteryFrame.setLotteryTab();
        }
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
    $(".noticePanel .noticeContent").click(function(){
        if(noticeArr.length == 0)
            return;
        var html = "";
        for(var i = 0; i < noticeArr.length; i++){
            html += '<div class="row">'
                + '<div class="cell indexCell">' + (i + 1) + '</div>'
                + '<div class="cell timeCell">' + noticeArr[i].n_create_time + '</div>'
                + '<div class="cell infoCell">' + noticeArr[i].n_content + '</div>'
                + '</div>';
        }
        $(".noticePopupPanel .noticePopupPanelCont .systemTable .systemCont").html(html);
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
    $(".left .betInfoPanel").show();
}

function updateInfoPanel(){
    $("#userName").text(account);
    $("#creditAmount").text(lotteryData.creditMoney);
    $("#usedAmount").text(lotteryData.usedMoney);
    $("#balance").text(lotteryData.usableMoney);
}

var quickRate = 0;
var quickAddId = 0;
var quotaArr = [];
var quota = {};
function showQuickBetPanel(rate, index){
    quickRate = rate;
    var titleStr = "";
    var betType = 1011;
    switch(curTab){
        case 0 : titleStr = "特码"; betType = 1011; quickAddId = 1011000; break;
        case 1 : titleStr = "正码"; betType = 1081; quickAddId = 1081000; break;
        case 2 : titleStr = "正" + index; betType = 1011 + 10 * index; quickAddId = 1011000 + 10000 * index; break;
    }
    titleStr += rate == 0 ? "A盘" : "B盘";
    quickBetClear();
    for(var i = 0; i < quotaArr.length; i++){
        if(quotaArr[i].betType == betType){
            quota = quotaArr[i];
            break;
        }
    }
    $(".quickBetPanel .quickBetInfo").html("");
    $(".left .quickBetPanel .quickBetTitle").text(titleStr);
    $(".left .quickBetPanel .creditAmount").text(lotteryData.creditMoney);
    $(".left .quickBetPanel .orderMinQuota").text(quota.orderMinQuota);
    $(".left .quickBetPanel .orderMaxQuota").text(quota.orderMaxQuota);
    $(".left .quickBetPanel .issueMaxQuota").text(quota.issueMaxQuota);
    $(".left .leftPanel").hide();
    $(".left .quickBetPanel").show();
}

function clickQuickBetNum(obj){
    obj = $(obj);
    obj.toggleClass("selected");
}

function clickQuickBetTwo(type){
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
    }
    var isToggle = true;
    for(var key in ballInfoObj){
        isToggle = true;
        for(var i = 0; i < keyArr.length; i++){
            if(ballInfoObj[key][keyArr[i]] != valArr[i]){
                isToggle = false;
                break;
            }
        }
        if(isToggle)
            $(".quickBetPanel .quickBetCtrlTable .row .num" + key).toggleClass("selected");
    }
}

function clickQuickBetAnimal(index){
    for(var i = 0; i < animalNumArr[index].numArr.length; i++){
        var num = animalNumArr[index].numArr[i] < 10 ? "0" + animalNumArr[index].numArr[i] : animalNumArr[index].numArr[i];
        $(".quickBetPanel .quickBetCtrlTable .row .num" + num).toggleClass("selected");
    }
}

var quickBetContent = "";
function createQuickBetInfo(){
    if(lotteryData.status != OPEN_STATUS)
        return;
    var betMoney = parseInt($(".quickBetPanel .quickBetMoneyRow .betMoneyInput").val());
    if(isNaN(betMoney) || betMoney < 0)
        return;
    if(betMoney > quota.orderMaxQuota){
        alert("每注金额不得高于单注限额");
        return;
    }
    if(betMoney < quota.orderMinQuota){
        alert("每注金额不得低于最低限额");
        return;
    }
    var numArr = $(".quickBetPanel .quickBetCtrlTable .row .selected");
    quickBetContent = "";
    var odds = 0;
    var num = 0;
    var numStr = 0;
    var betInfo = "";
    var titleStr = $(".left .quickBetPanel .quickBetTitle").text();
    var betMap = {};
    var tmpNumArr = [];
    for(var i = 0; i < numArr.length; i++){
        numStr = numArr.eq(i).text()
        num = parseInt(numStr);
        odds = rateData[quickAddId + num][quickRate];
        if(odds == 0){
            alert("赔率为0不可下注！")
            return;
        }
        betMap["info" + numStr] = {
            content: quickAddId + num + "-" + odds + "-" + betMoney,
            info: '<div>' + titleStr + numArr.eq(i).text() + '@' + odds + '=' + betMoney + '</div>'
        }
        tmpNumArr.push(numStr);
    }
    tmpNumArr.sort();
    for(var i = 0; i < tmpNumArr.length; i++){
        if(quickBetContent != "")
            quickBetContent += ";";
        quickBetContent += betMap["info" + tmpNumArr[i]].content;
        betInfo += betMap["info" + tmpNumArr[i]].info;
    }
    $(".quickBetPanel .quickBetInfo").html(betInfo);
}

function clearQuickSelected(){
    $(".quickBetPanel .quickBetCtrlTable .row .selected").removeClass("selected");
}

function quickBet(){
    if($(".quickBetInfo").html() == "")
        return;
    lotteryFrame.sendBet(quickRate + 1, quickBetContent)
}

function quickBetClear(){
    $(".quickBetInfo").html("");
    clearQuickSelected();
    $(".quickBetPanel .quickBetMoneyRow .betMoneyInput").val("");
}

function showBetResultPanel(betResult){
    $(".left .leftPanel").hide();
    var html = '';
    for(var i = 0; i < betResult.length; i++){
        html += '<div class="resultItem">' + betResult[i] + '</div>'
    }
    $(".left .betResultPanel .betResultContent").html(html)
    $(".left .betResultPanel").show();
}

function getLastRecord(type){
    console.log(type)
    var data={
        token: token,
        gameID: gameArr[curIndex].id,
        page: 0,
        pageSize: 10
    }
    Send(httpUrlData.listBetDetail, data, function(obj){
        var html = '';
        for(var i = 0; i < obj.orderList.length; i++){
            var dtArr = obj.orderList[i].betTime.split(" ");
            var className = obj.orderList[i].status == 3 || obj.orderList[i].status == -1 ? " cancelInfo" : "";
            html += '<div class="row">'
                + '<div class="cell betTime' + className + '">' + dtArr[1] + '</div>'
                + '<div class="cell betType' + className + '">' + obj.orderList[i].betContent + '</div>'
                + '<div class="cell betMoney' + className + '">' + obj.orderList[i].betMoney + '</div>'
                + '</div>'
        }
        $(".left .betInfoPanel .betInfoContent").html(html);
        if (type === 'back') {
            showUseInfoPanel();
        }
    })
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