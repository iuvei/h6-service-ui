var token = localStorage.getItem("token");
var account = localStorage.getItem("account");
var lotteryData = {};
var rateData = {};
var OPEN_STATUS = 1;
var CLOSE_STATUS = 2;
var tmStatus = 2
var noTmStatus = 2
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
  localStorage.setItem('creditPlayId', '')
  localStorage.setItem('gameType', '特码')
  localStorage.setItem('creditPlayName', '')
  localStorage.setItem('pankou', 'A')
  localStorage.setItem('gameId', '1')
	$("#logo").attr("src", localStorage.getItem("logoUrl"));
  getCurrentPeriod()
	initLotteryMenu();
	var animalIndex = parseInt(localStorage.getItem("animalIndex"));
	for(var i = 0; i < 49; i++){
		var index = animalIndex - (i % 12);
		index = index < 0 ? index + 12 : index;
		animalNumArr[index].numArr.push(i + 1);
	}
	console.log(animalNumArr)
	InitNotice();
	setInterval(update, TIME_FREQUENCY);
  getGameData('init', 'pageInit')
  getUserInfo('init')
  getLastRecord()
	window.open("ss_six.html?v=" + version, 'lotteryFrame');
});
function getUserInfo(type) {
  Send(httpUrlData.getUserInfo, {}, function (obj) {
		delete obj.data.status
    lotteryData = mergeObj(obj.data, lotteryData)
    updateInfoPanel(obj.data)
    if (type) {
      showUseInfoPanel()
    }
    if (obj.data.updateFlag == 1) {
      if (!$('#system-pwd').parent().hasClass('current')) {
        alert('您的信息被修改，请重置密码')
        setTimeout(() => {
          toPage('hr_password.html', '#system-pwd')
        }, 300)
      }
      return
    }
  })
}
function mergeObj(obj1, obj2) {
	return {
		...obj2,
		...obj1
	}
}

var timeDif = 0;
var getDataBetType = "";
function getGameData(isInit, pageInit, changeGame){
	var data = {
    gameId: localStorage.getItem('gameId') || 1
	};
	$.ajax({
		type: 'post',
		url: serverMap[httpUrlData.getGameData.server] + httpUrlData.getGameData.url,
		data: JSON.stringify(data),
		dataType: "json",
		contentType: 'application/json;charset=UTF-8',
		async : true,
		timeout : 30000,
		headers: {
			Authorization: localStorage.getItem('token')
		},
		success(obj) {
			if (lotteryData.updateFlag == 1) {
				return
			}
			$('.secMenuCont').find('.secItem').each(function() {
				for (var item of obj) {
					if ($(this).text() === item.creditPlayName) {
						$(this).attr('data-creditplayid', item.creditPlayId)
					}
				}
			})
			if (isInit) {
				localStorage.setItem('creditPlayId', $(".secMenuCont .secItem:eq(0)").attr('data-creditplayid'))
			}
			lotteryData = mergeObj({rate: obj}, lotteryData)
			lotteryData.quota = []
      lotteryData.rate.forEach(game => {
        if (pageInit) {
          if (game.creditPlayName == localStorage.getItem('gameType')) {
            localStorage.setItem('creditPlayId', game.creditPlayId)
            sessionStorage.setItem('creditPlayInfoId', game.creditPlayTypeDtoList[0].creditPlayInfoId)
          }
        }
        game.creditPlayTypeDtoList.forEach(subGame => {
          subGame.creditPlayTypeInfoDtoList.forEach(item => {
            if (subGame.isClose == 1) {
              item.odds = -1 
              item.odds2 = -1
            }
          })
        })
      })
			if (changeGame) {
				toLottery(0);
			}
			UpdateRateData(lotteryData.rate);
			if (lotteryData.quota.length > 0)
				quotaArr = lotteryData.quota;
			if (isInit) {
				getCurrentResultNum(function () {
					showUseInfoPanel();
					toLottery(curTab);
					setResult();
				});
			}
			else {
				updateInfoPanel(lotteryData);
				lotteryFrame.updateOdds();
				lotteryFrame.updateOdds();
				if (resultIssue != lotteryData.issue && resultNum.length > 0)
					getCurrentResultNum(function () {
						// showUseInfoPanel();
					})
			}
		},
    error: function(error) {
      console.log(error)
      if (error.status == 401) {
        alert('请先登录')
        GotoLogin()
      } else {
        alert(error.responseJSON.error)
      }
    }
	})
}


function UpdateRateData(data) {
  for (var item of data) {
    if (item.creditPlayName == '特码') { // 特码
      for (var sub of item.creditPlayTypeDtoList[0].creditPlayTypeInfoDtoList) {
        if (sub.creditPlayTypeName == '特码大') {
          rateData['1013001'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId]; // 特码大
        } else if (sub.creditPlayTypeName == '特码小') {
          rateData['1013002'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId]; // 特码小
        } else if (sub.creditPlayTypeName == '特码单') {
          rateData['1012001'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId]; // 特码单
        } else if (sub.creditPlayTypeName == '特码双') {
          rateData['1012002'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId]; // 特码双
        } else if (sub.creditPlayTypeName == '特码合双') {
          rateData['1014002'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId]; // 合双
        } else if (sub.creditPlayTypeName == '特码合单') {
          rateData['1014001'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId]; // 合单
        } else if (sub.creditPlayTypeName == '特码红波') {
          rateData['1015001'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId]; // 红波
        } else if (sub.creditPlayTypeName == '特码蓝波') {
          rateData['1015002'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId]; // 蓝波
        } else if (sub.creditPlayTypeName == '特码绿波') {
          rateData['1015003'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId]; // 绿波
        } else if (sub.creditPlayTypeName == '特码尾大') {
          rateData['1016001'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId]; // 特尾大
        } else if (sub.creditPlayTypeName == '特码尾小') {
          rateData['1016002'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId]; // 特尾小
        } else if (sub.creditPlayTypeName == '特码野兽') {
          rateData['1017001'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId]; // 野兽
        } else if (sub.creditPlayTypeName == '特码家禽') {
          rateData['1017002'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId]; // 家禽
        } else if (sub.creditPlayTypeName < 10) {
          rateData['101100' + sub.creditPlayTypeName] = [sub.odds, sub.odds2, sub.creditPlayTypeId];
        } else if (sub.creditPlayTypeName < 50) {
          rateData['10110' + sub.creditPlayTypeName] = [sub.odds, sub.odds2, sub.creditPlayTypeId];
        }
      }
    } else if (item.creditPlayName == '正码') { // 正码
      for (var sub of item.creditPlayTypeDtoList[0].creditPlayTypeInfoDtoList) {
        if (sub.creditPlayTypeName == '总单') {
          rateData['1082001'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId];
        } else if (sub.creditPlayTypeName == '总双') {
          rateData['1082002'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId];
        } else if (sub.creditPlayTypeName == '总大') {
          rateData['1083001'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId];
        } else if (sub.creditPlayTypeName == '总小') {
          rateData['1083002'] = [sub.odds, sub.odds2 || sub.odds, sub.creditPlayTypeId];
        } else if (sub.creditPlayTypeName < 10) {
          rateData['108100' + sub.creditPlayTypeName] = [sub.odds, sub.odds2, sub.creditPlayTypeId];
        } else if (sub.creditPlayTypeName < 50) {
          rateData['10810' + sub.creditPlayTypeName] = [sub.odds, sub.odds2, sub.creditPlayTypeId];
        }
      }
    } else if (item.creditPlayName == '正码特') { // 正码特
      for (var sub of item.creditPlayTypeDtoList) {
        for (var child of sub.creditPlayTypeInfoDtoList) {
          if (sub.creditPlayInfoName == '正1特') { // 正1特
            if (child.creditPlayTypeName < 10) {
              rateData['102100' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName < 50) {
              rateData['10210' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '合单') {
              rateData['1022001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '合双') {
              rateData['1022002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正1大') {
              rateData['1023001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正1小') {
              rateData['1023002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正1单') {
              rateData['1024001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正1双') {
              rateData['1024002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '红波') {
              rateData['1025001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '蓝波') {
              rateData['1025002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '绿波') {
              rateData['1025003'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            }
          } else if (sub.creditPlayInfoName == '正2特') { // 正2特
            if (child.creditPlayTypeName < 10) {
              rateData['103100' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName < 50) {
              rateData['10310' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '合单') {
              rateData['1032001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '合双') {
              rateData['1032002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正2大') {
              rateData['1033001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正2小') {
              rateData['1033002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正2单') {
              rateData['1034001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正2双') {
              rateData['1034002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '红波') {
              rateData['1035001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '蓝波') {
              rateData['1035002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '绿波') {
              rateData['1035003'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            }
          } else if (sub.creditPlayInfoName == '正3特') { // 正3特
            if (child.creditPlayTypeName < 10) {
              rateData['104100' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName < 50) {
              rateData['10410' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '合单') {
              rateData['1042001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '合双') {
              rateData['1042002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正3大') {
              rateData['1043001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正3小') {
              rateData['1043002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正3单') {
              rateData['1044001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正3双') {
              rateData['1044002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '红波') {
              rateData['1045001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '蓝波') {
              rateData['1045002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '绿波') {
              rateData['1045003'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            }
          } else if (sub.creditPlayInfoName == '正4特') { // 正4特
            if (child.creditPlayTypeName < 10) {
              rateData['105100' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName < 50) {
              rateData['10510' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '合单') {
              rateData['1052001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '合双') {
              rateData['1052002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正4大') {
              rateData['1053001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正4小') {
              rateData['1053002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正4单') {
              rateData['1054001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正4双') {
              rateData['1054002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '红波') {
              rateData['1055001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '蓝波') {
              rateData['1055002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '绿波') {
              rateData['1055003'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            }
          } else if (sub.creditPlayInfoName == '正5特') { // 正5特
            if (child.creditPlayTypeName < 10) {
              rateData['106100' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName < 50) {
              rateData['10610' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '合单') {
              rateData['1062001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '合双') {
              rateData['1062002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正5大') {
              rateData['1063001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正5小') {
              rateData['1063002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正5单') {
              rateData['1064001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正5双') {
              rateData['1064002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '红波') {
              rateData['1065001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '蓝波') {
              rateData['1065002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '绿波') {
              rateData['1065003'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            }
          } else if (sub.creditPlayInfoName == '正6特') { // 正6特
            if (child.creditPlayTypeName < 10) {
              rateData['107100' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName < 50) {
              rateData['10710' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '合单') {
              rateData['1072001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '合双') {
              rateData['1072002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正6大') {
              rateData['1073001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正6小') {
              rateData['1073002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正6单') {
              rateData['1074001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '正6双') {
              rateData['1074002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '红波') {
              rateData['1075001'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '蓝波') {
              rateData['1075002'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName == '绿波') {
              rateData['1075003'] = [child.odds, child.odds2 || child.odds, child.creditPlayTypeId];
            }
          }
        }
      }
    } else if (item.creditPlayName == '连码') { // 连码
      for (var sub of item.creditPlayTypeDtoList) {
        for (var child of sub.creditPlayTypeInfoDtoList) {
          if (sub.creditPlayInfoName == '三全中') { // 三全中
            if (child.creditPlayTypeName < 10) {
              rateData['115100' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName < 50) {
              rateData['11510' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            }
          } else if (sub.creditPlayInfoName == '三中二') { // 三中二
            if (child.creditPlayTypeName < 10) {
              rateData['116100' + child.creditPlayTypeName] = [child.odds, child.odds, child.creditPlayTypeId];
              rateData['116200' + child.creditPlayTypeName] = [child.odds2, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName < 50) {
              rateData['11610' + child.creditPlayTypeName] = [child.odds, child.odds, child.creditPlayTypeId];
              rateData['11620' + child.creditPlayTypeName] = [child.odds2, child.odds2, child.creditPlayTypeId];
            }
          } else if (sub.creditPlayInfoName == '二全中') { // 二全中
            if (child.creditPlayTypeName < 10) {
              rateData['118100' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName < 50) {
              rateData['11810' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            }
          } else if (sub.creditPlayInfoName == '二中特') { // 二中特
            if (child.creditPlayTypeName < 10) {
              rateData['120100' + child.creditPlayTypeName] = [child.odds, child.odds, child.creditPlayTypeId];
              rateData['120200' + child.creditPlayTypeName] = [child.odds2, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName < 50) {
              rateData['12010' + child.creditPlayTypeName] = [child.odds, child.odds, child.creditPlayTypeId];
              rateData['12020' + child.creditPlayTypeName] = [child.odds2, child.odds2, child.creditPlayTypeId];
            }
          } else if (sub.creditPlayInfoName == '特串') { // 特串
            if (child.creditPlayTypeName < 10) {
              rateData['119100' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            } else if (child.creditPlayTypeName < 50) {
              rateData['11910' + child.creditPlayTypeName] = [child.odds, child.odds2, child.creditPlayTypeId];
            }
          }
        }
      }
    } else if (item.creditPlayName == '特肖') { // 特肖
      for (var i = 0; i < item.creditPlayTypeDtoList[0].creditPlayTypeInfoDtoList.length; i++) {
        var sub = item.creditPlayTypeDtoList[0].creditPlayTypeInfoDtoList[i]
        rateData[1091001 + i] = [sub.odds, sub.odds2, sub.creditPlayTypeId];
      }
    } else if (item.creditPlayName == '半波') { // 半波
      for (var i = 0; i < item.creditPlayTypeDtoList[0].creditPlayTypeInfoDtoList.length; i++) {
        var sub = item.creditPlayTypeDtoList[0].creditPlayTypeInfoDtoList[i]
        rateData[1111001 + i] = [sub.odds, sub.odds2, sub.creditPlayTypeId];
      }
    } else if (item.creditPlayName == '六肖') { // 六肖
      for (var i = 0; i < item.creditPlayTypeDtoList[0].creditPlayTypeInfoDtoList.length; i++) {
        var sub = item.creditPlayTypeDtoList[0].creditPlayTypeInfoDtoList[i]
        rateData[1141001 + i] = [sub.odds, sub.odds2, sub.creditPlayTypeId];
      }
    } else if (item.creditPlayName == '一肖') { // 一肖
      for (var i = 0; i < item.creditPlayTypeDtoList[0].creditPlayTypeInfoDtoList.length; i++) {
        var sub = item.creditPlayTypeDtoList[0].creditPlayTypeInfoDtoList[i]
        rateData[1121001 + i] = [sub.odds, sub.odds2, sub.creditPlayTypeId];
      }
    } else if (item.creditPlayName == '一肖不中') { // 一肖不中
      for (var i = 0; i < item.creditPlayTypeDtoList[0].creditPlayTypeInfoDtoList.length; i++) {
        var sub = item.creditPlayTypeDtoList[0].creditPlayTypeInfoDtoList[i]
        rateData[1131001 + i] = [sub.odds, sub.odds2, sub.creditPlayTypeId];
      }
    } else if (item.creditPlayName == '尾数') { // 尾数
      for (var i = 0; i < item.creditPlayTypeDtoList[0].creditPlayTypeInfoDtoList.length; i++) {
        var sub = item.creditPlayTypeDtoList[0].creditPlayTypeInfoDtoList[i]
        rateData[1101000 + i] = [sub.odds, sub.odds2, sub.creditPlayTypeId];
      }
    } else if (item.creditPlayName == '五不中') { // 五不中
      for (var sub of item.creditPlayTypeDtoList) {
        for (var i = 0; i < sub.creditPlayTypeInfoDtoList.length; i++) {
          var child = sub.creditPlayTypeInfoDtoList[i]
          if (sub.creditPlayInfoName == '五不中') { // 五不中
            rateData[1381001 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '六不中') { // 六不中
            rateData[1391001 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '七不中') { // 七不中
            rateData[1401001 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '八不中') { // 八不中
            rateData[1411001 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '九不中') { // 九不中
            rateData[1421001 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '十不中') { // 十不中
            rateData[1431001 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          }
        }
      }
    } else if (item.creditPlayName == '生肖连') { // 生肖连
      for (var sub of item.creditPlayTypeDtoList) {
        for (var i = 0; i < sub.creditPlayTypeInfoDtoList.length; i++) {
          var child = sub.creditPlayTypeInfoDtoList[i]
          if (sub.creditPlayInfoName == '二肖连') { // 二肖连中
            rateData[1221001 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '二肖连不中') { // 二肖连不中
            rateData[1231001 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '三肖连') { // 三肖连中
            rateData[1241001 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '三肖连不中') { // 三肖连不中
            rateData[1251001 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '四肖连') { // 四肖连中
            rateData[1261001 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '四肖连不中') { // 四肖连不中
            rateData[1271001 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '五肖连') { // 五肖连中
            rateData[1281001 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '五肖连不中') { // 五肖连不中
            rateData[1291001 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          }
        }
      }
    } else if (item.creditPlayName == '尾数连') { // 尾数连
      for (var sub of item.creditPlayTypeDtoList) {
        for (var i = 0; i < sub.creditPlayTypeInfoDtoList.length; i++) {
          var child = sub.creditPlayTypeInfoDtoList[i]
          if (sub.creditPlayInfoName == '二尾连') { // 二尾连中
            rateData[1301000 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '二尾连不中') { // 二尾连不中
            rateData[1311000 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '三尾连') { // 三尾连中
            rateData[1321000 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '三尾连不中') { // 三尾连不中
            rateData[1331000 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '四尾连') { // 四尾连中
            rateData[1341000 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '四尾连不中') { // 四尾连不中
            rateData[1351000 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '五尾连') { // 五尾连中
            rateData[1361000 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          } else if (sub.creditPlayInfoName == '五尾连不中') { // 五尾连不中
            rateData[1371000 + i] = [child.odds, child.odds2, child.creditPlayTypeId];
          }
        }
      }
    }
  }
}

var resultNum = [];
function getCurrentResultNum(call){
	updateInfoPanel(lotteryData);
	if (call != null)
		call();
}

function getCurrentPeriod() {
  $.ajax({
		url : serverMap[httpUrlData.currentPeriod.server] + httpUrlData.currentPeriod.url,
    type: 'get',
		dataType : "json",
		contentType: 'application/json;charset=UTF-8',
		timeout : 30000,
    async: false,
		headers: {
			Authorization: localStorage.getItem('token')
		},
    data: {
      gameId: localStorage.getItem('gameId') || 1
    },
    success(res) {
			resultNum = []
			console.log(res)
      var obj = res.data
			var dt = new Date();
			timeDif = dt.getTime();
			lotteryData.especialNumCloseTime = (obj.closeTime && new Date(obj.closeTime).getTime() || 0)
			lotteryData.otherNumCloseTime = (obj.closeTime && new Date(obj.closeTime).getTime() || 0)
			// lotteryData.showCloseUpcomingTime = obj.showCloseUpcomingTime + timeDif;
			lotteryData.openTime = (obj.startTime && new Date(obj.startTime).getTime() || 0) // 开盘时间
			lotteryData.openResultTime = (obj.openTime && new Date(obj.openTime).getTime() || 0) // 开奖结果时间
			openTime = lotteryData.openTime
			especialNumCloseTime = lotteryData.especialNumCloseTime
			otherNumCloseTime = lotteryData.otherNumCloseTime ;
			openResultTime = lotteryData.openResultTime ;
      lotteryData.issue = obj.gamePeriod
      resultIssue = obj.gamePeriod
      tmStatus = obj.tmStatus
      noTmStatus = obj.noTmStatus
      var gameType = localStorage.getItem('gameType')
      if (gameType === '特码') {
        lotteryData.pkStatus = obj.tmStatus
      } else {
        lotteryData.pkStatus = obj.noTmStatus
      }
      var openNumArr = [obj.openNum1, obj.openNum2, obj.openNum3, obj.openNum4, obj.openNum5, obj.openNum6, obj.openNum]
      openNumArr.forEach(function(item) {
        if (item) {
          resultNum.push(item)
        }
      })
      // $('#cueIssue').text(lotteryData.issue);
    },
    error(res) {
			if (res.responseJSON && res.responseJSON.error) {
        alert(res.responseJSON.error)
      }
    }
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
    getCurrentPeriod()
    getGameData(false);
    getUserInfo()
	}
	if(lotteryFrame.update != null)
		lotteryFrame.update(TIME_FREQUENCY, dt);
	if(resultNum.length == 0 && dt.getTime() >= lotteryData.openResultTime){
		getResultTime -= TIME_FREQUENCY;
		if(getResultTime <= 0){
			getResultTime = GET_RESULT_TIME;
			getCurrentResultNum();
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
			// if(openTime > 0){
			// 	$(".openStatus").text("距离开盘：" + getTimeStr(openTime))
 			// } else 
			if(lotteryData.pkStatus == OPEN_STATUS){
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
			else if(lotteryData.pkStatus == CLOSE_STATUS && openResultTime > 0){
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
			getCurrentResultNum(setResult);
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
	$(".lotteryMenuBox .lotteryResult").empty().html(ballHtml);
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
function initLotteryMenu() {
  Send(httpUrlData.getGameList, {}, function (obj) {
    var html = ''
    obj.data.forEach(function(item, i) {
      var status = i == curIndex ? 'current' : '';
      html += `<div class="lotteryItem ${status}" onclick="clickLottery(${i}, ${item.gameId})">${item.gameName}</div>`
    })
    $(".lotteryMenuCont").empty().append(html);
  })
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

function clickLottery(index, gameId) {
	curIndex = index;
	localStorage.setItem('gameId', gameId)
	$(".lotteryMenuCont .lotteryItem.current").removeClass("current");
	$(".lotteryMenuCont .lotteryItem:eq(" + index + ")").addClass("current");
  getCurrentPeriod()
  InitNotice();
  getGameData('init', 'pageInit', true)
  getUserInfo('init')
  getLastRecord()
}

function toLottery(index){
	$(".mainMenu .comMenu.current").removeClass("current");
	$("#systemFrame").hide();
	lotteryFrame.setLotteryInfo();
  toLotteryTab(index, true); 
	ResetNotice();
}

function toLotteryTab(tabIndex, isInit) {
	if(curTab != tabIndex){
		lotteryFrame.curRate = 0;
		$(".secMenuCont .secItem.current").removeClass("current");
		$(".secMenuCont .secItem:eq(" + tabIndex + ")").addClass("current");
		curTab = tabIndex;
		
    var creditPlayId = $(".secMenuCont .secItem:eq(" + tabIndex + ")").attr('data-creditplayid')
    localStorage.setItem('creditPlayId', creditPlayId)
    localStorage.setItem('gameType', $(".secMenuCont .secItem:eq(" + tabIndex + ")").text())
    localStorage.setItem('pankou', 'A')
    var gameType = localStorage.getItem('gameType')
    if (gameType === '特码') {
      lotteryData.pkStatus = tmStatus
    } else {
      lotteryData.pkStatus = noTmStatus
    }
    lotteryData.rate.forEach(item => {
      if (item.creditPlayId == creditPlayId) {
        sessionStorage.setItem('creditPlayInfoId', item.creditPlayTypeDtoList[0].creditPlayInfoId)
      }
    })
		switch($(".secMenuCont .secItem:eq(" + tabIndex + ")").text()) {
			case '正码特':
				localStorage.setItem('creditPlayName', '正1')
				break
			case '五不中':
				localStorage.setItem('creditPlayName', '五不中')
				break
		}
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
	// var data = {
	// 	token: token,
	// 	gameId: gameArr[curIndex].id
	// }
	// Send(httpUrlData.listNotice, data, function(obj){
	// 	noticeArr = [];
	// 	for(var i = 0; i < obj.noticeList.length; i++){
	// 		noticeArr.push(obj.noticeList[i]);
	// 	}
	// })
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
	// if (noticeStop) return;
	// if (noticeArr.length > 0) {
	// 	if (noticeContent.html() == "") {
	// 		noticeIndex = 0;
	// 		noticeContent.html(noticeArr[noticeIndex].n_content).css("margin-left", noticeContent.parent().width());
	// 	} else {
	// 		noticeContent.css("margin-left", parseInt(noticeContent.css("margin-left")) - 2 + "px");
	// 		if (parseInt(noticeContent.css("margin-left")) <= parseInt(noticeContent.width()) * -1) {
	// 			if(noticeIndex >= noticeArr.length)
	// 				noticeIndex = 0;
	// 			noticeContent.html(noticeArr[noticeIndex++].n_content).css("margin-left", noticeContent.parent().width());
	// 		}
	// 	}
	// }
}

function showUseInfoPanel(){
	$(".left .leftPanel").hide();
	$(".left .userInfoPanel").show();
  $(".left .betInfoPanel").show();
}

var quota = {};
var betType = 0;
function updateInfoPanel(data){
  $("#userName").text(data.username);
  $("#creditAmount").text(data.credit);
  $("#usedAmount").text(data.usedAmount);
  $("#balance").text(data.creditBalance);
	$("#issue").text(lotteryData.issue);
	$(".issueInfo .issue").text(lotteryData.issue);
}

var quickRate = 0;
var quickAddId = 0;
function showQuickBetPanel() {
	quickRate = lotteryFrame.curRate;
	var titleStr = "";
	var betType = 1011;
  var rateData = []
	switch(curTab){
		case 0 : 
			titleStr = "特码"; betType = 1011; 
			quickAddId = 1011000; 
			rateData = lotteryData.rate.find(item => item.creditPlayId == 1).creditPlayTypeDtoList[0]; 
			break;
		case 1 : 
			titleStr = "正码"; 
			betType = 1081; 
			quickAddId = 1081000; 
			rateData = lotteryData.rate.find(item => item.creditPlayId == 2).creditPlayTypeDtoList[0]; 
			break;
		case 2 : 
			titleStr = "正" + lotteryFrame.curNsIndex; 
			betType = 1011 + 10 * lotteryFrame.curNsIndex; 
			quickAddId = 1011000 + 10000 * lotteryFrame.curNsIndex; 
			rateData = lotteryData.rate.find(item => item.creditPlayId == 3).creditPlayTypeDtoList.find(item => item.creditPlayInfoName == '正' + lotteryFrame.curNsIndex + '特');
			break;
	}
  setQuickBet(rateData)
	titleStr += quickRate == 0 ? "A盘" : "B盘";
	$(".left .quickBetPanel .betInfoBox .betNumBox").text("");
	$(".left .quickBetPanel .quickBetTitle").text(titleStr);
  $(".left .quickBetPanel .creditAmount").text(lotteryData.creditBalance);
	$(".left .leftPanel").hide();
	$(".left .quickBetPanel").show();
}
function setQuickBet(obj) {
   $('.numTable td').each(function() {
    var key = $(this).text()[0] == '0' ? $(this).text()[1] : $(this).text()
    var rateMap = {}
    obj.creditPlayTypeInfoDtoList.forEach(function(item) {
      rateMap[item.creditPlayTypeName] = item
    })
    var d = rateMap[key] || {}
    $(this).attr('data-creditplaytypeid', d.creditPlayTypeId)
    $(this).attr('data-rate', localStorage.getItem('pankou') == 'B' ? d.odds2 : d.odds)
   })
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
	if(lotteryData.pkStatus != OPEN_STATUS)
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
	var data = []
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
		data.push({
			"gameId": localStorage.getItem('gameId') || 1,
			"gamePeriodId": lotteryData.issue,
			"creditPlayId": sessionStorage.getItem('creditPlayInfoId'),
			"creditPlayTypeId": numArr.eq(i).attr('data-creditplaytypeid'),
			"content": null,
			"panKou": localStorage.getItem('pankou') || 'A',
			"commandLogAmount": parseInt(betMoney)
		})
	}
	arr.sort();
	for(var i = 0; i < arr.length; i++){
		if(quickBetContent != "")
			quickBetContent += ";";
		quickBetContent += betMap["info" + arr[i]].content;
		betInfoArr.push(betMap["info" + arr[i]].obj)
	}
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
				var money = 0
				var count = 0
        for (var i = 0; i < 10; i++) {
          var data = obj[i]
					if (data) {
						count++
						html += '<tr>'
								+ '<td class="moneyCell" title="' + data.transactionsBalance+ '"><div>' + data.transactionsBalance + '</div></td>'
								+ '<td class="contentCell" title="' + data.content + '"><div>' + data.content + '</div></td>'
							+ '</tr>';
						money += parseInt(data.transactionsBalance);
					}
        }
				$("#lastRecordCont").html(html);
				$("#lastRecordSum").text("共" + count + "注，合计" + money);
    },
    error(res) {
			if (res.responseJSON && res.responseJSON.error) {
        alert(res.responseJSON.error)
      }
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
	Send(httpUrlData.generalBet, JSON.stringify(betData), function(obj){
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
			getGameData(false)
			return;
		}
		alert("下注成功");
		$(".confirmPanel .betBtn").text("确定")
		$(".content .left .confirmPanel").hide();
		$(".content .left .userInfoPanel").show();
		showBetResultPanel(obj.betResult);
		getCurrentPeriod()
		getGameData(false)
		getLastRecord();
		getUserInfo()
	}, betTimeOut, betErr)
}

function sendBetLink(){
	Send(httpUrlData.generalBet, JSON.stringify(betData), function(obj){
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
			getGameData(false)
			return;
		}
		alert("下注成功");
		$(".confirmPanel .betBtn").text("确定")
		$(".content .left .confirmPanel").hide();
		$(".content .left .userInfoPanel").show();
		showBetResultPanel(obj.betResult);
		getCurrentPeriod()
		getGameData(false)
		getLastRecord();
		getUserInfo()
	}, betTimeOut, betErr)
}

function betErr(){
	$(".confirmPanel .betBtn").text("确定")
	$(".content .left .confirmPanel").hide();
	$(".content .left .userInfoPanel").show();
	showBetResultPanel(obj.betResult);
	getGameData(false)
	getLastRecord();
}

function betTimeOut(){
	alert("网络延迟，请在下注明细中查看是否成功！");
	$(".confirmPanel .betBtn").text("确定")
	$(".content .left .confirmPanel").hide();
	$(".content .left .userInfoPanel").show();
	showBetResultPanel(obj.betResult);
	getGameData(false)
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
	$.ajax({
		type: 'post',
		url: serverMap[httpUrlData.getGameData.server] + httpUrlData.logOut.url,
		dataType: "json",
		contentType: 'application/json;charset=UTF-8',
		async : true,
		timeout : 30000,
		headers: {
			Authorization: localStorage.getItem('token')
		},
		success(obj) {
      GotoLogin()
    },
    error: function(error) {
      console.log(error)
      if (error.status == 401) {
        alert('请先登录')
        GotoLogin()
      } else {
        alert(error.responseJSON.error)
      }
    }
	})
}